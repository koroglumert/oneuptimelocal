import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import PageComponentProps from '../../PageComponentProps';
import DashboardNavigation from '../../../Utils/Navigation';
import ObjectID from 'Common/Types/ObjectID';
import StatusPage from 'Model/Models/StatusPage';
import CardModelDetail from 'CommonUI/src/Components/ModelDetail/CardModelDetail';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import ModelTable from 'CommonUI/src/Components/ModelTable/ModelTable';
import StatusPageHeaderLink from 'Model/Models/StatusPageHeaderLink';
import SortOrder from 'Common/Types/BaseDatabase/SortOrder';
import BadDataException from 'Common/Types/Exception/BadDataException';
import Navigation from 'CommonUI/src/Utils/Navigation';

const StatusPageDelete: FunctionComponent<PageComponentProps> = (
    props: PageComponentProps
): ReactElement => {
    const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

    return (
        <Fragment>
            <CardModelDetail<StatusPage>
                name="Status Page > Branding > Header Style"
                cardProps={{
                    title: 'Logo, Cover and Favicon',
                    description: 'These will show up on your status page.',
                }}
                isEditable={true}
                editButtonText={'Edit Images'}
                formFields={[
                    {
                        field: {
                            logoFile: true,
                        },
                        title: 'Logo',
                        fieldType: FormFieldSchemaType.ImageFile,
                        required: false,
                        placeholder: 'Upload logo',
                    },
                    {
                        field: {
                            coverImageFile: true,
                        },
                        title: 'Cover',
                        fieldType: FormFieldSchemaType.ImageFile,
                        required: false,
                        placeholder: 'Upload cover image',
                    },
                ]}
                modelDetailProps={{
                    showDetailsInNumberOfColumns: 1,
                    modelType: StatusPage,
                    id: 'model-detail-status-page',
                    fields: [
                        {
                            field: {
                                logoFile: {
                                    file: true,
                                    type: true,
                                },
                            },
                            fieldType: FieldType.ImageFile,
                            title: 'Logo',
                            placeholder: 'No logo uploaded.',
                        },
                        {
                            field: {
                                coverImageFile: {
                                    file: true,
                                    type: true,
                                },
                            },
                            fieldType: FieldType.ImageFile,
                            title: 'Cover Image',
                            placeholder: 'No cover uploaded.',
                        },
                    ],
                    modelId: modelId,
                }}
            />

            <ModelTable<StatusPageHeaderLink>
                modelType={StatusPageHeaderLink}
                id="status-page-header-link"
                name="Status Page > Header Links"
                isDeleteable={true}
                sortBy="order"
                sortOrder={SortOrder.Ascending}
                isCreateable={true}
                isViewable={false}
                query={{
                    statusPageId: modelId,
                    projectId: DashboardNavigation.getProjectId()?.toString(),
                }}
                enableDragAndDrop={true}
                dragDropIndexField="order"
                onBeforeCreate={(
                    item: StatusPageHeaderLink
                ): Promise<StatusPageHeaderLink> => {
                    if (!props.currentProject || !props.currentProject._id) {
                        throw new BadDataException('Project ID cannot be null');
                    }
                    item.statusPageId = modelId;
                    item.projectId = new ObjectID(props.currentProject._id);
                    return Promise.resolve(item);
                }}
                cardProps={{
                    title: 'Header Links',
                    description: 'Header Links for your status page',
                }}
                noItemsMessage={'No status header link for this status page.'}
                formFields={[
                    {
                        field: {
                            title: true,
                        },
                        title: 'Title',
                        fieldType: FormFieldSchemaType.Text,
                        required: true,
                        placeholder: 'Title',
                    },
                    {
                        field: {
                            link: true,
                        },
                        title: 'Link',
                        fieldType: FormFieldSchemaType.URL,
                        required: true,
                        placeholder: 'https://link.com',
                    },
                ]}
                showRefreshButton={true}
                showFilterButton={true}
                viewPageRoute={Navigation.getCurrentRoute()}
                columns={[
                    {
                        field: {
                            title: true,
                        },
                        title: 'Title',
                        type: FieldType.Text,
                        isFilterable: true,
                    },
                    {
                        field: {
                            link: true,
                        },
                        title: 'Link',
                        type: FieldType.URL,
                        isFilterable: true,
                    },
                ]}
            />
        </Fragment>
    );
};

export default StatusPageDelete;
