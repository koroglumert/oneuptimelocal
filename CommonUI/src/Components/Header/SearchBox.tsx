// Tailwind

import React, { FunctionComponent, ReactElement } from 'react';
import Input from '../Input/Input';

export interface ComponentProps {
    onChange: (search: string) => void;
}

const SearchBox: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    return (
        <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
            <div className="w-full sm:max-w-xs">
                <label className="sr-only">Search</label>
                <div className="relative">
                    <Input
                        onChange={(value: string) => {
                            props.onChange(value);
                        }}
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-5 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Search"
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchBox;
