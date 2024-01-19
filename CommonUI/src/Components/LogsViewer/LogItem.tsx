import React, { FunctionComponent, ReactElement, useEffect } from 'react';
import Log from 'Model/AnalyticsModels/Log';
import OneUptimeDate from 'Common/Types/Date';

export interface ComponentProps {
    log: Log;
}

const LogItem: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    const [isCollapsed, setIsCollapsed] = React.useState<boolean>(true);

    useEffect(() => {
        setIsCollapsed(true);
    }, []);

    let bodyColor: string = 'text-slate-200';

    if (props.log.severityText === 'Warning') {
        bodyColor = 'text-amber-400';
    } else if (props.log.severityText === 'Error') {
        bodyColor = 'text-rose-400';
    }

    if (isCollapsed) {
        return (
            <div
                className="text-slate-200 flex cursor-pointer hover:border-slate-700 px-2 border-transparent border-2 rounded-md"
                onClick={() => {
                    setIsCollapsed(false);
                }}
            >
                {props.log.time && (
                    <div
                        className="text-slate-500 courier-prime flex-none"
                        style={{
                            width: '230px !important',
                        }}
                    >
                        {OneUptimeDate.getDateAsLocalFormattedString(
                            props.log.time
                        )}{' '}
                        &nbsp;{' '}
                    </div>
                )}
                {props.log.severityText === 'Information' && (
                    <div className="text-sky-400 courier-prime flex-none">
                        [INFO] &nbsp;
                    </div>
                )}
                {props.log.severityText === 'Warning' && (
                    <div className="text-amber-400 courier-prime flex-none">
                        [WARN] &nbsp;
                    </div>
                )}
                {props.log.severityText === 'Error' && (
                    <div className="text-rose-400 courier-prime flex-none">
                        [EROR] &nbsp;
                    </div>
                )}
                <div className={`${bodyColor} courier-prime`}>
                    {props.log.body?.toString()}
                </div>
            </div>
        );
    }

    return (
        <div
            className="text-slate-200 cursor-pointer hover:border-slate-700 px-2 border-transparent border-2 rounded-md"
            onClick={() => {
                setIsCollapsed(true);
            }}
        >
            {props.log.time && (
                <div className="text-slate-500 courier-prime">
                    {OneUptimeDate.getDateAsFormattedString(props.log.time)}{' '}
                    &nbsp;{' '}
                </div>
            )}
            {props.log.severityText === 'Information' && (
                <div className="flex">
                    <div className="font-medium text-slate-200 courier-prime mr-2">
                        SEVERITY:
                    </div>
                    <div className="text-sky-400 courier-prime">
                        [INFO] &nbsp;
                    </div>
                </div>
            )}
            {props.log.severityText === 'Warning' && (
                <div className="flex">
                    <div className="font-medium text-slate-200 courier-prime mr-2">
                        SEVERITY:
                    </div>
                    <div className="text-amber-400 courier-prime">
                        [WARN] &nbsp;
                    </div>
                </div>
            )}
            {props.log.severityText === 'Error' && (
                <div className="flex">
                    <div className="font-medium text-slate-200 courier-prime mr-2">
                        SEVERITY:
                    </div>
                    <div className="text-rose-400 courier-prime">
                        [EROR] &nbsp;
                    </div>
                </div>
            )}

            <div className="flex">
                <div className="font-medium text-slate-200 courier-prime mr-2">
                    MESSAGE:&nbsp;
                </div>
                <div className={`${bodyColor} courier-prime`}>
                    {props.log.body?.toString()}
                </div>
            </div>

            {props.log.traceId && (
                <div className="flex">
                    <div className="font-medium text-slate-200 courier-prime mr-2">
                        TRACE:&nbsp;&nbsp;&nbsp;
                    </div>
                    <div className={`${bodyColor} courier-prime`}>
                        {props.log.traceId?.toString()}
                    </div>
                </div>
            )}

            {props.log.spanId && (
                <div className="flex">
                    <div className="font-medium text-slate-200 courier-prime mr-2">
                        SPAN:&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <div className={`${bodyColor} courier-prime`}>
                        {props.log.spanId?.toString()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogItem;
