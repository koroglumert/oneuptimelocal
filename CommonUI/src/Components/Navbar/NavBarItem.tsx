// Tailwind

import Route from 'Common/Types/API/Route';
import React, { FunctionComponent, ReactElement } from 'react';
import Navigation from '../../Utils/Navigation';
import Icon, { ThickProp } from '../Icon/Icon';
import IconProp from 'Common/Types/Icon/IconProp';
import Link from '../Link/Link';

export interface ComponentProps {
    title: string;
    icon?: undefined | IconProp;
    route?: undefined | Route;
    activeRoute?: undefined | Route;
    exact?: boolean;
    children?: undefined | ReactElement | Array<ReactElement>;
    isRenderedOnMobile?: boolean;
    onMouseOver?: (() => void) | undefined;
    onClick?: (() => void) | undefined;
    onMouseLeave?: (() => void) | undefined;
    id?: string | undefined;
}

const NavBarItem: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    const activeRoute: Route | undefined = props.activeRoute || props.route;
    const isActive: boolean = Boolean(
        activeRoute &&
            (props.exact
                ? Navigation.isOnThisPage(activeRoute)
                : Navigation.isStartWith(activeRoute))
    );

    let classNames: string =
        'text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-md py-2 px-3 inline-flex items-center text-sm font-medium';

    if (isActive) {
        classNames =
            'bg-gray-100 text-gray-900 rounded-md py-2 px-3 inline-flex items-center text-sm font-medium';
    }

    if (props.isRenderedOnMobile) {
        classNames =
            'text-gray-900 hover:bg-gray-50 hover:text-gray-900 block rounded-md py-2 px-3 text-base font-medium';
        if (isActive) {
            classNames =
                'bg-gray-100 text-gray-900 block rounded-md py-2 px-3 text-base font-medium';
        }
    }

    return (
        <>
            <Link
                id={props.id}
                className={classNames}
                to={props.route ? props.route : null}
                onMouseOver={props.onMouseOver}
                onClick={props.onClick}
                onMouseLeave={props.onMouseLeave}
            >
                {props.icon ? (
                    <Icon
                        icon={props.icon}
                        className="mr-1 h-4 w-4"
                        thick={ThickProp.Thick}
                    />
                ) : (
                    <></>
                )}
                <span>{props.title}</span>
                {props.children ? <div className="arrow-down"></div> : <></>}
            </Link>
            {props.children}
        </>
    );
};

export default NavBarItem;
