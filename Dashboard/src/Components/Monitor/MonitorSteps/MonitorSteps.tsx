import MonitorSteps from 'Common/Types/Monitor/MonitorSteps';
import React, { FunctionComponent, ReactElement, useState } from 'react';
import MonitorStepElement from './MonitorStep';
import MonitorStep from 'Common/Types/Monitor/MonitorStep';
import ModelAPI, { ListResult } from 'CommonUI/src/Utils/ModelAPI/ModelAPI';
import MonitorStatus from 'Model/Models/MonitorStatus';
import { LIMIT_PER_PROJECT } from 'Common/Types/Database/LimitMax';
import API from 'CommonUI/src/Utils/API/API';
import ComponentLoader from 'CommonUI/src/Components/ComponentLoader/ComponentLoader';
import { CustomElementProps } from 'CommonUI/src/Components/Forms/Types/Field';
import MonitorType from 'Common/Types/Monitor/MonitorType';
import IncidentSeverity from 'Model/Models/IncidentSeverity';
import ErrorMessage from 'CommonUI/src/Components/ErrorMessage/ErrorMessage';
import Icon from 'CommonUI/src/Components/Icon/Icon';
import IconProp from 'Common/Types/Icon/IconProp';
import Statusbubble from 'CommonUI/src/Components/StatusBubble/StatusBubble';
import Color from 'Common/Types/Color';
import { Black } from 'Common/Types/BrandColors';
import OnCallDutyPolicy from 'Model/Models/OnCallDutyPolicy';
import useAsyncEffect from 'use-async-effect';

export interface ComponentProps extends CustomElementProps {
    monitorSteps: MonitorSteps;
    monitorType: MonitorType;
}

const MonitorStepsElement: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    const [monitorStatusOptions, setMonitorStatusOptions] = React.useState<
        Array<MonitorStatus>
    >([]);

    const [incidentSeverityOptions, setIncidentSeverityOptions] =
        React.useState<Array<IncidentSeverity>>([]);

    const [onCallPolicyOptions, setOnCallPolicyOptions] = React.useState<
        Array<OnCallDutyPolicy>
    >([]);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');

    const [defaultMonitorStatus, setDefaultMonitorStatus] = useState<
        MonitorStatus | undefined
    >(undefined);

    const fetchDropdownOptions: () => Promise<void> =
        async (): Promise<void> => {
            setIsLoading(true);

            try {
                const monitorStatusList: ListResult<MonitorStatus> =
                    await ModelAPI.getList({
                        modelType: MonitorStatus,
                        query: {},
                        limit: LIMIT_PER_PROJECT,
                        skip: 0,
                        select: {
                            name: true,
                            color: true,
                            isOperationalState: true,
                        },
                        sort: {},
                    });

                if (monitorStatusList.data) {
                    setMonitorStatusOptions(monitorStatusList.data);
                    setDefaultMonitorStatus(
                        monitorStatusList.data.find((status: MonitorStatus) => {
                            return status?.isOperationalState;
                        })
                    );
                }

                const incidentSeverityList: ListResult<IncidentSeverity> =
                    await ModelAPI.getList({
                        modelType: IncidentSeverity,
                        query: {},
                        limit: LIMIT_PER_PROJECT,
                        skip: 0,
                        select: {
                            name: true,
                            color: true,
                        },
                        sort: {},
                    });

                const onCallPolicyList: ListResult<OnCallDutyPolicy> =
                    await ModelAPI.getList({
                        modelType: OnCallDutyPolicy,
                        query: {},
                        limit: LIMIT_PER_PROJECT,
                        skip: 0,
                        select: {
                            name: true,
                        },
                        sort: {},
                    });

                if (incidentSeverityList.data) {
                    setIncidentSeverityOptions(
                        incidentSeverityList.data as Array<IncidentSeverity>
                    );
                }

                if (onCallPolicyList.data) {
                    setOnCallPolicyOptions(
                        onCallPolicyList.data as Array<OnCallDutyPolicy>
                    );
                }
            } catch (err) {
                setError(API.getFriendlyMessage(err));
            }

            setIsLoading(false);
        };
    useAsyncEffect(async () => {
        await fetchDropdownOptions();
    }, []);

    if (isLoading) {
        return <ComponentLoader></ComponentLoader>;
    }

    if (!props.monitorSteps) {
        return <div>Monitor Criteria not defined for this resource.</div>;
    }

    if (error) {
        return <ErrorMessage error={error} />;
    }

    return (
        <div>
            {props.monitorSteps.data?.monitorStepsInstanceArray.map(
                (i: MonitorStep, index: number) => {
                    return (
                        <MonitorStepElement
                            monitorType={props.monitorType}
                            key={index}
                            monitorStatusOptions={monitorStatusOptions}
                            incidentSeverityOptions={incidentSeverityOptions}
                            monitorStep={i}
                            onCallPolicyOptions={onCallPolicyOptions}
                        />
                    );
                }
            )}

            <div className="mt-4 ml-0.5">
                <div className="flex">
                    <Icon
                        icon={IconProp.AltGlobe}
                        className="h-5 w-5 text-gray-900"
                    />
                    <div className="ml-1 -mt-0.5 flex-auto py-0.5 text-sm leading-5 text-gray-500">
                        <span className="font-medium text-gray-900">
                            Default Monitor Status
                        </span>{' '}
                        When no criteria is met, monitor status should be:
                        <div className="mt-3">
                            {props.monitorSteps.data
                                ?.defaultMonitorStatusId && (
                                <Statusbubble
                                    color={
                                        (monitorStatusOptions.find(
                                            (option: IncidentSeverity) => {
                                                return (
                                                    option.id?.toString() ===
                                                    props.monitorSteps.data?.defaultMonitorStatusId?.toString()
                                                );
                                            }
                                        )?.color as Color) || Black
                                    }
                                    shouldAnimate={false}
                                    text={
                                        (monitorStatusOptions.find(
                                            (option: IncidentSeverity) => {
                                                return (
                                                    option.id?.toString() ===
                                                    props.monitorSteps.data?.defaultMonitorStatusId?.toString()
                                                );
                                            }
                                        )?.name as string) || ''
                                    }
                                />
                            )}

                            {!props.monitorSteps.data?.defaultMonitorStatusId &&
                                defaultMonitorStatus && (
                                    <Statusbubble
                                        color={defaultMonitorStatus.color!}
                                        text={defaultMonitorStatus.name!}
                                        shouldAnimate={false}
                                    />
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonitorStepsElement;
