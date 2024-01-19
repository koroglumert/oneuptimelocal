import React, { FunctionComponent, ReactElement } from 'react';
import PageComponentProps from '../PageComponentProps';
import RouteMap, { RouteUtil } from '../../Utils/RouteMap';
import PageMap from '../../Utils/PageMap';
import Route from 'Common/Types/API/Route';
import IncidentsTable from '../../Components/Incident/IncidentsTable';
import DashboardNavigation from '../../Utils/Navigation';

const IncidentsPage: FunctionComponent<
    PageComponentProps
> = (): ReactElement => {
    return (
        <IncidentsTable
            viewPageRoute={RouteUtil.populateRouteParams(
                RouteMap[PageMap.INCIDENTS] as Route
            )}
            query={{
                projectId: DashboardNavigation.getProjectId()?.toString(),
                currentIncidentState: {
                    isResolvedState: false,
                },
            }}
            noItemsMessage="Nice work! No Active Incidents so far."
            title="Active Incidents"
            description="Here is a list of all the Active Incidents for this project."
        />
    );
};

export default IncidentsPage;
