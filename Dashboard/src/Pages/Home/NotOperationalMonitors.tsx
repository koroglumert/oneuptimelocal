import Route from 'Common/Types/API/Route';
import Page from 'CommonUI/src/Components/Page/Page';
import React, { FunctionComponent, ReactElement } from 'react';
import PageMap from '../../Utils/PageMap';
import RouteMap, { RouteUtil } from '../../Utils/RouteMap';
import PageComponentProps from '../PageComponentProps';
import MonitorTable from '../../Components/Monitor/MonitorTable';
import DashboardSideMenu from './SideMenu';
import DashboardNavigation from '../../Utils/Navigation';

const NotOperationalMonitors: FunctionComponent<PageComponentProps> = (
    props: PageComponentProps
): ReactElement => {
    return (
        <Page
            title={'Home'}
            breadcrumbLinks={[
                {
                    title: 'Project',
                    to: RouteUtil.populateRouteParams(
                        RouteMap[PageMap.HOME] as Route
                    ),
                },
                {
                    title: 'Home',
                    to: RouteUtil.populateRouteParams(
                        RouteMap[PageMap.HOME] as Route
                    ),
                },
                {
                    title: 'Inoperational Monitors ',
                    to: RouteMap[
                        PageMap.HOME_NOT_OPERATIONAL_MONITORS
                    ] as Route,
                },
            ]}
            sideMenu={
                <DashboardSideMenu
                    project={props.currentProject || undefined}
                />
            }
        >
            <MonitorTable
                viewPageRoute={RouteUtil.populateRouteParams(
                    RouteMap[PageMap.MONITORS] as Route
                )}
                query={{
                    projectId: DashboardNavigation.getProjectId()?.toString(),
                    currentMonitorStatus: {
                        isOperationalState: false,
                    },
                }}
                noItemsMessage="All monitors in operational state."
                title="Inoperational Monitors"
                description="Here is a list of all the monitors which are not in operational state."
            />
        </Page>
    );
};

export default NotOperationalMonitors;
