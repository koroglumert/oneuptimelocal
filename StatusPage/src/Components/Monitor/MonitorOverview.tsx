import { Green } from 'Common/Types/BrandColors';
import MonitorUptimeGraph from 'CommonUI/src/Components/MonitorGraphs/Uptime';
import React, { FunctionComponent, ReactElement } from 'react';
import MonitorStatus from 'Model/Models/MonitorStatus';
import MonitorStatusTimelne from 'Model/Models/MonitorStatusTimeline';
import Icon from 'CommonUI/src/Components/Icon/Icon';
import Tooltip from 'CommonUI/src/Components/Tooltip/Tooltip';
import IconProp from 'Common/Types/Icon/IconProp';
import MarkdownViewer from 'CommonUI/src/Components/Markdown.tsx/LazyMarkdownViewer';
import { UptimePrecision } from 'Model/Models/StatusPageResource';
import UptimeUtil from 'CommonUI/src/Components/MonitorGraphs/UptimeUtil';

export interface ComponentProps {
    monitorName: string;
    description?: string | undefined;
    tooltip?: string | undefined;
    currentStatus: MonitorStatus;
    monitorStatusTimeline: Array<MonitorStatusTimelne>;
    startDate: Date;
    endDate: Date;
    showHistoryChart?: boolean | undefined;
    showCurrentStatus?: boolean | undefined;
    uptimeGraphHeight?: number | undefined;
    className?: string | undefined;
    showUptimePercent: boolean;
    uptimePrecision?: UptimePrecision | undefined;
    monitorStatuses: Array<MonitorStatus>;
}

const MonitorOverview: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    const getCurrentStatus: Function = (): ReactElement => {
        // if the current status is operational then show uptime Percent.

        let precision: UptimePrecision = UptimePrecision.ONE_DECIMAL;

        if (props.uptimePrecision) {
            precision = props.uptimePrecision;
        }

        if (
            props.currentStatus?.isOperationalState &&
            props.showUptimePercent
        ) {
            const uptimePercent: number = UptimeUtil.calculateUptimePercentage(
                props.monitorStatusTimeline,
                props.monitorStatuses,
                precision
            );

            return (
                <div
                    className="font-medium"
                    style={{
                        color:
                            props.currentStatus?.color?.toString() ||
                            Green.toString(),
                    }}
                >
                    {uptimePercent}% uptime
                </div>
            );
        }

        if (props.showCurrentStatus) {
            return (
                <div
                    className=""
                    style={{
                        color:
                            props.currentStatus?.color?.toString() ||
                            Green.toString(),
                    }}
                >
                    {props.currentStatus?.name || 'Operational'}
                </div>
            );
        }

        return <></>;
    };

    return (
        <div className={props.className}>
            <div>
                <div
                    className="flex justify-between"
                    style={{ marginBottom: '3px' }}
                >
                    <div className="flex">
                        <div className="">{props.monitorName}</div>
                        {props.tooltip && (
                            <Tooltip
                                key={1}
                                text={props.tooltip || 'Not available'}
                            >
                                <div className="ml-1">
                                    <Icon
                                        className="cursor-pointer w-4 h-4 mt-1 text-gray-400"
                                        icon={IconProp.Help}
                                    />
                                </div>
                            </Tooltip>
                        )}
                    </div>
                    {getCurrentStatus()}
                </div>
                <div className="mb-2 text-sm">
                    {props.description && (
                        <MarkdownViewer text={props.description || ''} />
                    )}
                </div>
            </div>
            {props.showHistoryChart && (
                <div>
                    <MonitorUptimeGraph
                        error={undefined}
                        items={props.monitorStatusTimeline || []}
                        startDate={props.startDate}
                        endDate={props.endDate}
                        isLoading={false}
                        height={props.uptimeGraphHeight}
                    />
                </div>
            )}
            {props.showHistoryChart && (
                <div className="text-sm text-gray-400 mt-1 flex justify-between">
                    <div>90 days ago</div>
                    <div>Today</div>
                </div>
            )}
        </div>
    );
};

export default MonitorOverview;
