import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState,
} from 'react';

export interface ComponentProps {
    count: number;
    totalCount: number;
    suffix: string;
}

const ProgressBar: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    const [percent, setPercent] = useState<number>(0);

    useEffect(() => {
        let percent: number = 0;

        try {
            percent = (props.count * 100) / props.totalCount;
        } catch (err) {
            // do nothing.
        }

        if (percent > 100) {
            percent = 100;
        }

        setPercent(Math.ceil(percent));
    }, [props.count, props.totalCount]);

    return (
        <div className="w-full h-4 mb-4 bg-gray-200 rounded-full dark:bg-gray-700">
            <div
                data-testid="progress-bar"
                className="h-4 bg-indigo-600 rounded-full dark:bg-indigo-500"
                style={{ width: percent + '%' }}
            ></div>
            <div className="text-sm text-gray-400 mt-1 flex justify-between">
                <div data-testid="progress-bar-count">
                    {props.count} {props.suffix}
                </div>
                <div data-testid="progress-bar-total-count">
                    {props.totalCount} {props.suffix}
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
