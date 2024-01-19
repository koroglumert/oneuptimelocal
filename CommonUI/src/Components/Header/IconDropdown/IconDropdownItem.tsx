import Route from 'Common/Types/API/Route';
import URL from 'Common/Types/API/URL';
import React, { FunctionComponent, ReactElement } from 'react';
import Icon from '../../Icon/Icon';
import IconProp from 'Common/Types/Icon/IconProp';
import Link from '../../Link/Link';

export interface ComponentProps {
    url?: URL | Route;
    icon?: IconProp;
    title: string;
    openInNewTab?: boolean;
    onClick?: (() => void) | undefined;
}

const IconDropdown: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    return (
        <Link
            className="block py-2 px-4 text-sm text-gray-700 flex hover:bg-gray-100"
            to={props.url}
            openInNewTab={props.openInNewTab}
            onClick={props.onClick}
        >
            <div className="mr-1 h-5 w-5">
                {props.icon ? <Icon icon={props.icon} /> : <></>}
            </div>
            <span className="">{props.title}</span>
        </Link>
    );
};

export default IconDropdown;
