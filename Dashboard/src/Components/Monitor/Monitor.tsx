import React, { FunctionComponent, ReactElement } from 'react';
import Monitor from 'Model/Models/Monitor';
import Link from 'CommonUI/src/Components/Link/Link';
import Route from 'Common/Types/API/Route';
import RouteMap, { RouteUtil } from '../../Utils/RouteMap';
import PageMap from '../../Utils/PageMap';
import ObjectID from 'Common/Types/ObjectID';
import Icon from 'CommonUI/src/Components/Icon/Icon';
import IconProp from 'Common/Types/Icon/IconProp';

export interface ComponentProps {
    monitor: Monitor;
    onNavigateComplete?: (() => void) | undefined;
    showIcon?: boolean;
}

const MonitorElement: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    if (props.monitor._id) {
        return (
            <Link
                onNavigateComplete={props.onNavigateComplete}
                className="hover:underline"
                to={RouteUtil.populateRouteParams(
                    RouteMap[PageMap.MONITOR_VIEW] as Route,
                    {
                        modelId: new ObjectID(props.monitor._id as string),
                    }
                )}
            >
                <span className="flex">
                    {props.showIcon ? (
                        <Icon
                            icon={IconProp.AltGlobe}
                            className="w-5 h-5 mr-1"
                        />
                    ) : (
                        <></>
                    )}{' '}
                    {props.monitor.name}
                </span>
            </Link>
        );
    }

    return <span>{props.monitor.name}</span>;
};

export default MonitorElement;
