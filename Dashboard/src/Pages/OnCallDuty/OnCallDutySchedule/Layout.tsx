import ModelPage from 'CommonUI/src/Components/Page/ModelPage';
import React, { FunctionComponent, ReactElement } from 'react';
import { RouteUtil } from '../../../Utils/RouteMap';
import PageComponentProps from '../../PageComponentProps';
import SideMenu from './SideMenu';
import Navigation from 'CommonUI/src/Utils/Navigation';
import ObjectID from 'Common/Types/ObjectID';
import OnCallDutySchedule from 'Model/Models/OnCallDutyPolicySchedule';
import { Outlet, useParams } from 'react-router';
import { getOnCallDutyBreadcrumbs } from '../../../Utils/Breadcrumbs';

const OnCallDutyScheduleViewLayout: FunctionComponent<PageComponentProps> = (
    _props: PageComponentProps
): ReactElement => {
    const { id } = useParams();
    const modelId: ObjectID = new ObjectID(id || '');
    const path: string = Navigation.getRoutePath(RouteUtil.getRoutes());

    return (
        <ModelPage
            title="On-Call Schedule"
            modelType={OnCallDutySchedule}
            modelId={modelId}
            modelNameField="name"
            breadcrumbLinks={getOnCallDutyBreadcrumbs(path)}
            sideMenu={<SideMenu modelId={modelId} />}
        >
            <Outlet />
        </ModelPage>
    );
};

export default OnCallDutyScheduleViewLayout;
