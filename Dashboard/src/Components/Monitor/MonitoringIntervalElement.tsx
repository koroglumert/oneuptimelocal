import React, { FunctionComponent, ReactElement } from 'react';
import MonitoringInterval from '../../Utils/MonitorIntervalDropdownOptions';
import { DropdownOption } from 'CommonUI/src/Components/Dropdown/Dropdown';

export interface ComponentProps {
    monitoringInterval: string;
}

const MonitoringIntervalElement: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    if (props.monitoringInterval) {
        return (
            <div>
                {
                    MonitoringInterval.find((item: DropdownOption) => {
                        return item.value === props.monitoringInterval;
                    })?.label
                }
            </div>
        );
    }

    return <div>No interval defined</div>;
};

export default MonitoringIntervalElement;
