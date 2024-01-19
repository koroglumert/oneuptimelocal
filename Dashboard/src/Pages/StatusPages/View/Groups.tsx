import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import PageComponentProps from '../../PageComponentProps';
import DashboardNavigation from '../../../Utils/Navigation';
import ObjectID from 'Common/Types/ObjectID';
import StatusPageGroup from 'Model/Models/StatusPageGroup';
import ModelTable from 'CommonUI/src/Components/ModelTable/ModelTable';
import BadDataException from 'Common/Types/Exception/BadDataException';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import SortOrder from 'Common/Types/BaseDatabase/SortOrder';
import Navigation from 'CommonUI/src/Utils/Navigation';

const StatusPageDelete: FunctionComponent<PageComponentProps> = (
    props: PageComponentProps
): ReactElement => {
    const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

    return (
        <Fragment>
            <ModelTable<StatusPageGroup>
                modelType={StatusPageGroup}
                id="status-page-group"
                name="Status Page > Groups"
                isDeleteable={true}
                sortBy="order"
                showViewIdButton={true}
                sortOrder={SortOrder.Ascending}
                isCreateable={true}
                isViewable={false}
                isEditable={true}
                query={{
                    statusPageId: modelId,
                    projectId: DashboardNavigation.getProjectId()?.toString(),
                }}
                enableDragAndDrop={true}
                dragDropIndexField="order"
                onBeforeCreate={(
                    item: StatusPageGroup
                ): Promise<StatusPageGroup> => {
                    if (!props.currentProject || !props.currentProject._id) {
                        throw new BadDataException('Project ID cannot be null');
                    }
                    item.statusPageId = modelId;
                    item.projectId = new ObjectID(props.currentProject._id);
                    return Promise.resolve(item);
                }}
                cardProps={{
                    title: 'Resource Groups',
                    description:
                        'Here are different groups for your status page resources.',
                }}
                noItemsMessage={
                    'No status page group created for this status page.'
                }
                formFields={[
                    {
                        field: {
                            name: true,
                        },
                        title: 'Group Name',
                        fieldType: FormFieldSchemaType.Text,
                        required: true,
                        placeholder: 'Resource Group Name',
                    },
                    {
                        field: {
                            description: true,
                        },
                        title: 'Group Description',
                        fieldType: FormFieldSchemaType.Markdown,
                        required: false,
                    },
                    {
                        field: {
                            isExpandedByDefault: true,
                        },
                        title: 'Expand on Status Page by Default',
                        fieldType: FormFieldSchemaType.Toggle,
                        required: false,
                    },
                ]}
                showRefreshButton={true}
                showFilterButton={true}
                viewPageRoute={Navigation.getCurrentRoute()}
                columns={[
                    {
                        field: {
                            name: true,
                        },
                        title: 'Resource Group Name',
                        type: FieldType.Text,
                        isFilterable: true,
                    },
                    {
                        field: {
                            isExpandedByDefault: true,
                        },
                        title: 'Expanded on Status Page by Default',
                        type: FieldType.Boolean,
                        isFilterable: true,
                    },
                ]}
            />
        </Fragment>
    );
};

export default StatusPageDelete;
