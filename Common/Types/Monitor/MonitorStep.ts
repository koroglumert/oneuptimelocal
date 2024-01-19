import { FindOperator } from 'typeorm';
import DatabaseProperty from '../Database/DatabaseProperty';
import { JSONObject, ObjectType } from '../JSON';
import URL from '../API/URL';
import IP from '../IP/IP';
import MonitorCriteria from './MonitorCriteria';
import BadDataException from '../Exception/BadDataException';
import HTTPMethod from '../API/HTTPMethod';
import Dictionary from '../Dictionary';
import ObjectID from '../ObjectID';
import MonitorType from './MonitorType';
import JSONFunctions from '../JSONFunctions';
import Hostname from '../API/Hostname';
import Port from '../Port';

export interface MonitorStepType {
    id: string;
    monitorDestination?: URL | IP | Hostname | undefined;
    monitorDestinationPort?: Port | undefined;
    monitorCriteria: MonitorCriteria;
    requestType: HTTPMethod;
    requestHeaders?: Dictionary<string> | undefined;
    requestBody?: string | undefined;
}

export default class MonitorStep extends DatabaseProperty {
    public data: MonitorStepType | undefined = undefined;

    public constructor() {
        super();

        this.data = {
            id: ObjectID.generate().toString(),
            monitorDestination: undefined,
            monitorDestinationPort: undefined,
            monitorCriteria: new MonitorCriteria(),
            requestType: HTTPMethod.GET,
            requestHeaders: undefined,
            requestBody: undefined,
        };
    }

    public static getDefaultMonitorStep(arg: {
        monitorType: MonitorType;
        onlineMonitorStatusId: ObjectID;
        offlineMonitorStatusId: ObjectID;
        defaultIncidentSeverityId: ObjectID;
    }): MonitorStep {
        const monitorStep: MonitorStep = new MonitorStep();

        monitorStep.data = {
            id: ObjectID.generate().toString(),
            monitorDestination: undefined,
            monitorDestinationPort: undefined,
            monitorCriteria: MonitorCriteria.getDefaultMonitorCriteria(arg),
            requestType: HTTPMethod.GET,
            requestHeaders: undefined,
            requestBody: undefined,
        };

        return monitorStep;
    }

    public get id(): ObjectID {
        return new ObjectID(this.data?.id as string);
    }

    public set id(v: ObjectID) {
        this.data!.id = v.toString();
    }

    public setRequestType(requestType: HTTPMethod): MonitorStep {
        this.data!.requestType = requestType;
        return this;
    }

    public setRequestHeaders(requestHeaders: Dictionary<string>): MonitorStep {
        this.data!.requestHeaders = requestHeaders;
        return this;
    }

    public static clone(monitorStep: MonitorStep): MonitorStep {
        return MonitorStep.fromJSON(monitorStep.toJSON());
    }

    public setRequestBody(requestBody: string): MonitorStep {
        this.data!.requestBody = requestBody;
        return this;
    }

    public setMonitorDestination(
        monitorDestination: URL | IP | Hostname
    ): MonitorStep {
        this.data!.monitorDestination = monitorDestination;
        return this;
    }

    public setPort(monitorDestinationPort: Port): MonitorStep {
        this.data!.monitorDestinationPort = monitorDestinationPort;
        return this;
    }

    public setMonitorCriteria(monitorCriteria: MonitorCriteria): MonitorStep {
        this.data!.monitorCriteria = monitorCriteria;
        return this;
    }

    public static getNewMonitorStepAsJSON(): JSONObject {
        return {
            _type: ObjectType.MonitorStep,
            value: {
                id: ObjectID.generate().toString(),
                monitorDestination: undefined,
                monitorDestinationPort: undefined,
                monitorCriteria: MonitorCriteria.getNewMonitorCriteriaAsJSON(),
                requestType: HTTPMethod.GET,
                requestHeaders: undefined,
                requestBody: undefined,
            },
        };
    }

    public static getValidationError(
        value: MonitorStep,
        monitorType: MonitorType
    ): string | null {
        if (!value.data) {
            return 'Monitor Step is required';
        }

        // If the monitor type is incoming request, then the monitor destination is not required
        if (
            !value.data.monitorDestination &&
            monitorType !== MonitorType.IncomingRequest
        ) {
            return 'Monitor Destination is required';
        }

        if (!value.data.monitorCriteria) {
            return 'Monitor Criteria is required';
        }

        if (
            !MonitorCriteria.getValidationError(
                value.data.monitorCriteria,
                monitorType
            )
        ) {
            return MonitorCriteria.getValidationError(
                value.data.monitorCriteria,
                monitorType
            );
        }

        if (!value.data.requestType && monitorType === MonitorType.API) {
            return 'Request Type is required';
        }

        if (
            monitorType === MonitorType.Port &&
            !value.data.monitorDestinationPort
        ) {
            return 'Port is required';
        }

        return null;
    }

    public override toJSON(): JSONObject {
        if (this.data) {
            return JSONFunctions.serialize({
                _type: ObjectType.MonitorStep,
                value: {
                    id: this.data.id,
                    monitorDestination:
                        this.data?.monitorDestination?.toJSON() || undefined,
                    monitorDestinationPort:
                        this.data?.monitorDestinationPort?.toJSON() ||
                        undefined,
                    monitorCriteria: this.data.monitorCriteria.toJSON(),
                    requestType: this.data.requestType,
                    requestHeaders: this.data.requestHeaders || undefined,
                    requestBody: this.data.requestBody || undefined,
                },
            });
        }

        return MonitorStep.getNewMonitorStepAsJSON();
    }

    public static override fromJSON(json: JSONObject): MonitorStep {
        if (json instanceof MonitorStep) {
            return json;
        }

        if (!json || json['_type'] !== 'MonitorStep') {
            throw new BadDataException('Invalid monitor step');
        }

        if (!json['value']) {
            throw new BadDataException('Invalid monitor step');
        }

        json = json['value'] as JSONObject;

        let monitorDestination: URL | IP | Hostname | undefined = undefined;

        if (
            json &&
            json['monitorDestination'] &&
            (json['monitorDestination'] as JSONObject)['_type'] ===
                ObjectType.URL
        ) {
            monitorDestination = URL.fromJSON(
                json['monitorDestination'] as JSONObject
            );
        }

        if (
            json &&
            json['monitorDestination'] &&
            (json['monitorDestination'] as JSONObject)['_type'] ===
                ObjectType.Hostname
        ) {
            monitorDestination = Hostname.fromJSON(
                json['monitorDestination'] as JSONObject
            );
        }

        if (
            json &&
            json['monitorDestination'] &&
            (json['monitorDestination'] as JSONObject)['_type'] ===
                ObjectType.IP
        ) {
            monitorDestination = IP.fromJSON(
                json['monitorDestination'] as JSONObject
            );
        }

        const monitorDestinationPort: Port | undefined = json[
            'monitorDestinationPort'
        ]
            ? Port.fromJSON(json['monitorDestinationPort'] as JSONObject)
            : undefined;

        if (!json['monitorCriteria']) {
            throw new BadDataException('Invalid monitor criteria');
        }

        if (
            MonitorCriteria.isValid(json['monitorCriteria'] as JSONObject) ===
            false
        ) {
            throw new BadDataException('Invalid monitor criteria');
        }

        const monitorStep: MonitorStep = new MonitorStep();

        monitorStep.data = JSONFunctions.deserialize({
            id: json['id'] as string,
            monitorDestination: monitorDestination || undefined,
            monitorDestinationPort: monitorDestinationPort || undefined,
            monitorCriteria: MonitorCriteria.fromJSON(
                json['monitorCriteria'] as JSONObject
            ),
            requestType: (json['requestType'] as HTTPMethod) || HTTPMethod.GET,
            requestHeaders:
                (json['requestHeaders'] as Dictionary<string>) || undefined,
            requestBody: (json['requestBody'] as string) || undefined,
        }) as any;

        return monitorStep;
    }

    public isValid(): boolean {
        return true;
    }

    protected static override toDatabase(
        value: MonitorStep | FindOperator<MonitorStep>
    ): JSONObject | null {
        if (value && value instanceof MonitorStep) {
            return (value as MonitorStep).toJSON();
        } else if (value) {
            return JSONFunctions.serialize(value as any);
        }

        return null;
    }

    protected static override fromDatabase(
        value: JSONObject
    ): MonitorStep | null {
        if (value) {
            return MonitorStep.fromJSON(value);
        }

        return null;
    }

    public override toString(): string {
        return JSON.stringify(this.toJSON());
    }
}
