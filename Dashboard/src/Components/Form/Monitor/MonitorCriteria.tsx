import MonitorCriteria from 'Common/Types/Monitor/MonitorCriteria';
import React, { FunctionComponent, ReactElement, useEffect } from 'react';
import MonitorCriteriaInstanceElement from './MonitorCriteriaInstance';
import Button, {
    ButtonSize,
    ButtonStyleType,
} from 'CommonUI/src/Components/Button/Button';
import MonitorCriteriaInstance from 'Common/Types/Monitor/MonitorCriteriaInstance';
import { DropdownOption } from 'CommonUI/src/Components/Dropdown/Dropdown';
import IconProp from 'Common/Types/Icon/IconProp';
import ConfirmModal from 'CommonUI/src/Components/Modal/ConfirmModal';
import MonitorType from 'Common/Types/Monitor/MonitorType';

export interface ComponentProps {
    initialValue: MonitorCriteria | undefined;
    onChange?: undefined | ((value: MonitorCriteria) => void);
    monitorStatusDropdownOptions: Array<DropdownOption>;
    incidentSeverityDropdownOptions: Array<DropdownOption>;
    onCallPolicyDropdownOptions: Array<DropdownOption>;
    monitorType: MonitorType;
}

const MonitorCriteriaElement: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    const [showCantDeleteModal, setShowCantDeleteModal] =
        React.useState<boolean>(false);

    const [monitorCriteria, setMonitorCriteria] =
        React.useState<MonitorCriteria>(
            props.initialValue || new MonitorCriteria()
        );

    useEffect(() => {
        if (monitorCriteria && props.onChange) {
            props.onChange(monitorCriteria);
        }
    }, [monitorCriteria]);

    return (
        <div className="mt-4">
            {monitorCriteria.data?.monitorCriteriaInstanceArray.map(
                (i: MonitorCriteriaInstance) => {
                    return (
                        <div className="mt-10 mb-10" key={i.data?.id}>
                            <MonitorCriteriaInstanceElement
                                monitorType={props.monitorType}
                                monitorStatusDropdownOptions={
                                    props.monitorStatusDropdownOptions
                                }
                                incidentSeverityDropdownOptions={
                                    props.incidentSeverityDropdownOptions
                                }
                                onCallPolicyDropdownOptions={
                                    props.onCallPolicyDropdownOptions
                                }
                                initialValue={i}
                                onDelete={() => {
                                    if (
                                        monitorCriteria.data
                                            ?.monitorCriteriaInstanceArray
                                            .length === 1
                                    ) {
                                        setShowCantDeleteModal(true);
                                        return;
                                    }

                                    // remove the criteria filter
                                    const index: number | undefined =
                                        monitorCriteria.data?.monitorCriteriaInstanceArray.findIndex(
                                            (item: MonitorCriteriaInstance) => {
                                                return (
                                                    item.data?.id === i.data?.id
                                                );
                                            }
                                        );

                                    if (index === undefined) {
                                        return;
                                    }

                                    const newMonitorCriterias: Array<MonitorCriteriaInstance> =
                                        [
                                            ...(monitorCriteria.data
                                                ?.monitorCriteriaInstanceArray ||
                                                []),
                                        ];
                                    newMonitorCriterias.splice(index, 1);
                                    setMonitorCriteria(
                                        MonitorCriteria.fromJSON({
                                            _type: 'MonitorCriteria',
                                            value: {
                                                monitorCriteriaInstanceArray: [
                                                    ...newMonitorCriterias,
                                                ],
                                            },
                                        })
                                    );
                                }}
                                onChange={(value: MonitorCriteriaInstance) => {
                                    const index: number | undefined =
                                        monitorCriteria.data?.monitorCriteriaInstanceArray.findIndex(
                                            (item: MonitorCriteriaInstance) => {
                                                return (
                                                    item.data?.id ===
                                                    value.data?.id
                                                );
                                            }
                                        );

                                    if (index === undefined) {
                                        return;
                                    }
                                    const newMonitorCriterias: Array<MonitorCriteriaInstance> =
                                        [
                                            ...(monitorCriteria.data
                                                ?.monitorCriteriaInstanceArray ||
                                                []),
                                        ];
                                    newMonitorCriterias[index] = value;
                                    setMonitorCriteria(
                                        MonitorCriteria.fromJSON({
                                            _type: 'MonitorCriteria',
                                            value: {
                                                monitorCriteriaInstanceArray:
                                                    newMonitorCriterias,
                                            },
                                        })
                                    );
                                }}
                            />
                        </div>
                    );
                }
            )}
            <div className="mt-4 -ml-3">
                <Button
                    title="Add Criteria"
                    buttonSize={ButtonSize.Small}
                    icon={IconProp.Add}
                    onClick={() => {
                        const newMonitorCriterias: Array<MonitorCriteriaInstance> =
                            [
                                ...(monitorCriteria.data
                                    ?.monitorCriteriaInstanceArray || []),
                            ];
                        newMonitorCriterias.push(new MonitorCriteriaInstance());
                        setMonitorCriteria(
                            MonitorCriteria.fromJSON({
                                _type: 'MonitorCriteria',
                                value: {
                                    monitorCriteriaInstanceArray:
                                        newMonitorCriterias,
                                },
                            })
                        );
                    }}
                />
            </div>
            {showCantDeleteModal ? (
                <ConfirmModal
                    description={`We need at least one criteria for this monitor. We cant delete one remaining criteria.`}
                    title={`Cannot delete last remaining criteria.`}
                    onSubmit={() => {
                        setShowCantDeleteModal(false);
                    }}
                    submitButtonType={ButtonStyleType.NORMAL}
                    submitButtonText="Close"
                />
            ) : (
                <></>
            )}
        </div>
    );
};

export default MonitorCriteriaElement;
