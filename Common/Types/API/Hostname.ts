import { FindOperator } from 'typeorm';
import DatabaseProperty from '../Database/DatabaseProperty';
import BadDataException from '../Exception/BadDataException';
import Port from '../Port';
import Typeof from '../Typeof';
import { JSONObject, ObjectType } from '../JSON';

export default class Hostname extends DatabaseProperty {
    private _route: string = '';
    public get hostname(): string {
        return this._route;
    }

    private _port!: Port;
    public get port(): Port {
        return this._port;
    }
    public set port(v: Port) {
        this._port = v;
    }

    public set hostname(value: string) {
        value = value.trim();

        if (Hostname.isValid(value)) {
            this._route = value;
        } else {
            throw new BadDataException(
                'Hostname ' + value + ' is not in valid format.'
            );
        }
    }

    public static isValid(value: string): boolean {
        const re: RegExp = /^[a-zA-Z-\d!#$&'*+,/:;=?@[\].]*$/;
        const isValid: boolean = re.test(value);
        if (!isValid) {
            return false;
        }
        return true;
    }

    public constructor(hostname: string, port?: Port | string | number) {
        super();
        if (hostname) {
            this.hostname = hostname;
        }

        if (port instanceof Port) {
            this.port = port;
        } else if (typeof port === Typeof.String) {
            this.port = new Port(port as string);
        } else if (typeof port === Typeof.Number) {
            this.port = new Port(port as number);
        }
    }

    public override toJSON(): JSONObject {
        return {
            _type: ObjectType.Hostname,
            value: (this as Hostname).toString(),
        };
    }

    public static override fromJSON(json: JSONObject): Hostname {
        if (json['_type'] === ObjectType.Hostname) {
            return new Hostname((json['value'] as string) || '');
        }

        throw new BadDataException('Invalid JSON: ' + JSON.stringify(json));
    }

    public override toString(): string {
        let hostname: string = this.hostname;

        if (this.port) {
            hostname += ':' + this.port.toString();
        }

        return hostname;
    }

    public static fromString(hostname: string | Hostname): Hostname {
        if (hostname instanceof Hostname) {
            hostname = hostname.toString();
        }

        if (hostname.includes(':')) {
            return new Hostname(
                hostname.split(':')[0] as string,
                hostname.split(':')[1]
            );
        }
        return new Hostname(hostname);
    }

    public static override toDatabase(
        value: Hostname | FindOperator<Hostname>
    ): string | null {
        if (value) {
            return value.toString();
        }

        return value;
    }

    public static override fromDatabase(_value: string): Hostname | null {
        if (_value) {
            return new Hostname(_value);
        }

        return null;
    }
}
