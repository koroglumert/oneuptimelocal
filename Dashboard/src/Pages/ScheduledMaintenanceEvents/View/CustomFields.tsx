import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import PageComponentProps from '../../PageComponentProps';
import Navigation from 'CommonUI/src/Utils/Navigation';
import ObjectID from 'Common/Types/ObjectID';
import CustomFieldsDetail from 'CommonUI/src/Components/CustomFields/CustomFieldsDetail';
import ScheduledMaintenance from 'Model/Models/ScheduledMaintenance';
import ScheduledMaintenanceCustomField from 'Model/Models/ScheduledMaintenanceCustomField';
import ProjectUtil from 'CommonUI/src/Utils/Project';

const ScheduledMaintenanceCustomFields: FunctionComponent<
    PageComponentProps
> = (_props: PageComponentProps): ReactElement => {
    const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

    return (
        <Fragment>
            <CustomFieldsDetail
                title="Scheduled Maintenance Custom Fields"
                description="Custom fields help you add new fields to your resources in OneUptime."
                modelType={ScheduledMaintenance}
                customFieldType={ScheduledMaintenanceCustomField}
                name="Scheduled Maintenance Custom Fields"
                projectId={ProjectUtil.getCurrentProject()!.id!}
                modelId={modelId}
            />
        </Fragment>
    );
};

export default ScheduledMaintenanceCustomFields;
