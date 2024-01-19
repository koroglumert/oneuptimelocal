import React, { FunctionComponent, ReactElement } from 'react';
import { Argument } from 'Common/Types/Workflow/Component';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Pill from '../Pill/Pill';
import { Black } from 'Common/Types/BrandColors';

export interface ComponentProps {
    arguments: Array<Argument>;
    name: string;
    description: string;
}

const ComponentArgumentViewer: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    return (
        <div className="mt-5 mb-5">
            <h2 className="text-base font-medium text-gray-500">
                {props.name}
            </h2>
            <p className="text-sm font-medium text-gray-400">
                {props.description}
            </p>
            {props.arguments && props.arguments.length === 0 && (
                <ErrorMessage
                    error={'This component does not take any arguments.'}
                />
            )}
            <div className="mt-3">
                {props.arguments &&
                    props.arguments.length > 0 &&
                    props.arguments.map((argument: Argument, i: number) => {
                        return (
                            <div
                                key={i}
                                className="mt-2 mb-2 relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2"
                            >
                                <div className="min-w-0 flex-1 flex justify-between">
                                    <div className="focus:outline-none">
                                        <span
                                            className="absolute inset-0"
                                            aria-hidden="true"
                                        ></span>
                                        <p className="text-sm font-medium text-gray-900">
                                            {argument.name}{' '}
                                            <span className="text-gray-500 font-normal">
                                                (ID: {argument.id})
                                            </span>
                                        </p>
                                        <p className="truncate text-sm text-gray-500">
                                            {argument.required
                                                ? 'Required. '
                                                : 'Optional. '}
                                            {argument.description}
                                        </p>
                                    </div>
                                    <div>
                                        <Pill
                                            color={Black}
                                            text={argument.type}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default ComponentArgumentViewer;
