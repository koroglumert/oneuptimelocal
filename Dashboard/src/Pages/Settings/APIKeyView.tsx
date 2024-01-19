import Route from 'Common/Types/API/Route';
import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import PageMap from '../../Utils/PageMap';
import RouteMap from '../../Utils/RouteMap';
import PageComponentProps from '../PageComponentProps';
import ModelTable from 'CommonUI/src/Components/ModelTable/ModelTable';
import ApiKeyPermission from 'Model/Models/ApiKeyPermission';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import CardModelDetail from 'CommonUI/src/Components/ModelDetail/CardModelDetail';
import ApiKey from 'Model/Models/ApiKey';
import Navigation from 'CommonUI/src/Utils/Navigation';
import PermissionUtil from 'CommonUI/src/Utils/Permission';
import Label from 'Model/Models/Label';
import { JSONArray, JSONObject } from 'Common/Types/JSON';
import Permission, { PermissionHelper } from 'Common/Types/Permission';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import ModelDelete from 'CommonUI/src/Components/ModelDelete/ModelDelete';
import ObjectID from 'Common/Types/ObjectID';
import LabelsElement from '../../Components/Label/Labels';
import BadDataException from 'Common/Types/Exception/BadDataException';
import DashboardNavigation from '../../Utils/Navigation';
import BaseModel from 'Common/Models/BaseModel';
import ResetObjectID from 'CommonUI/src/Components/ResetObjectID/ResetObjectID';

const APIKeyView: FunctionComponent<PageComponentProps> = (
    props: PageComponentProps
): ReactElement => {
    const modelId: ObjectID = Navigation.getLastParamAsObjectID();
    const [refresher, setRefresher] = React.useState<boolean>(false);

    return (
        <Fragment>
            {/* API Key View  */}
            <CardModelDetail
                name="API Key Details"
                cardProps={{
                    title: 'API Key Details',
                    description: 'Here are more details for this API Key.',
                }}
                refresher={refresher}
                isEditable={true}
                formFields={[
                    {
                        field: {
                            name: true,
                        },
                        title: 'Name',
                        fieldType: FormFieldSchemaType.Text,
                        required: true,
                        placeholder: 'API Key Name',
                        validation: {
                            minLength: 2,
                        },
                    },
                    {
                        field: {
                            description: true,
                        },
                        title: 'Description',
                        fieldType: FormFieldSchemaType.LongText,
                        required: true,
                        placeholder: 'API Key Description',
                    },
                    {
                        field: {
                            expiresAt: true,
                        },
                        title: 'Expires',
                        fieldType: FormFieldSchemaType.Date,
                        required: true,
                        placeholder: 'Expires at',
                        validation: {
                            dateShouldBeInTheFuture: true,
                        },
                    },
                ]}
                modelDetailProps={{
                    modelType: ApiKey,
                    id: 'model-detail-api-key',
                    fields: [
                        {
                            field: {
                                name: true,
                            },
                            title: 'Name',
                        },
                        {
                            field: {
                                description: true,
                            },
                            title: 'Description',
                        },
                        {
                            field: {
                                expiresAt: true,
                            },
                            title: 'Expires',
                            fieldType: FieldType.Date,
                        },
                        {
                            field: {
                                apiKey: true,
                            },
                            title: 'API Key',
                            fieldType: FieldType.HiddenText,
                            opts: {
                                isCopyable: true,
                            },
                        },
                    ],
                    modelId: modelId,
                }}
            />

            {/* API Key Permisison Table */}

            <ModelTable<ApiKeyPermission>
                modelType={ApiKeyPermission}
                id="api-key-permission-table"
                isDeleteable={true}
                name="Settings > API Key > Permissions"
                query={{
                    apiKeyId: modelId,
                    projectId: DashboardNavigation.getProjectId()?.toString(),
                }}
                onBeforeCreate={(
                    item: ApiKeyPermission
                ): Promise<ApiKeyPermission> => {
                    if (!props.currentProject || !props.currentProject._id) {
                        throw new BadDataException('Project ID cannot be null');
                    }

                    item.apiKeyId = modelId;
                    item.projectId = new ObjectID(props.currentProject._id);
                    return Promise.resolve(item);
                }}
                isEditable={true}
                isCreateable={true}
                isViewable={false}
                cardProps={{
                    title: 'API Key Permissions',
                    description:
                        'Add different permisisons to API keys to make it more granular.',
                }}
                noItemsMessage={
                    'No permisisons created for this API Key so far.'
                }
                formFields={[
                    {
                        field: {
                            permission: true,
                        },
                        onChange: async (_value: any, form: any) => {
                            await form.setFieldValue('labels', [], true);
                        },
                        title: 'Permission',
                        fieldType: FormFieldSchemaType.Dropdown,
                        required: true,
                        placeholder: 'Permission',
                        dropdownOptions:
                            PermissionUtil.projectPermissionsAsDropdownOptions(),
                    },
                    {
                        field: {
                            labels: true,
                        },
                        title: 'Labels ',
                        description:
                            'Labels on which this permissions will apply on. This is optional and an advanced feature.',
                        fieldType: FormFieldSchemaType.MultiSelectDropdown,
                        dropdownModal: {
                            type: Label,
                            labelField: 'name',
                            valueField: '_id',
                        },
                        required: false,
                        placeholder: 'Labels',
                    },
                ]}
                showRefreshButton={true}
                showFilterButton={true}
                viewPageRoute={Navigation.getCurrentRoute()}
                columns={[
                    {
                        field: {
                            permission: true,
                        },
                        title: 'Permission',
                        type: FieldType.Text,
                        isFilterable: true,
                        getElement: (item: JSONObject): ReactElement => {
                            return (
                                <p>
                                    {PermissionHelper.getTitle(
                                        item['permission'] as Permission
                                    )}
                                </p>
                            );
                        },
                    },
                    {
                        field: {
                            labels: {
                                name: true,
                                color: true,
                            },
                        },
                        title: 'Labels',
                        type: FieldType.EntityArray,
                        isFilterable: true,
                        filterEntityType: Label,
                        filterQuery: {
                            projectId:
                                DashboardNavigation.getProjectId()?.toString(),
                        },
                        filterDropdownField: {
                            label: 'name',
                            value: '_id',
                        },
                        getElement: (item: JSONObject): ReactElement => {
                            if (
                                item &&
                                item['permission'] &&
                                !PermissionHelper.isAccessControlPermission(
                                    item['permission'] as Permission
                                )
                            ) {
                                return (
                                    <p>
                                        Labels can not be attached to this
                                        permission.
                                    </p>
                                );
                            }

                            return (
                                <LabelsElement
                                    labels={
                                        BaseModel.fromJSON(
                                            (item['labels'] as JSONArray) || [],
                                            Label
                                        ) as Array<Label>
                                    }
                                />
                            );
                        },
                    },
                ]}
            />

            <ResetObjectID<ApiKey>
                modelType={ApiKey}
                fieldName={'apiKey'}
                title={'Reset API Key'}
                description={'Reset the API Key to a new value.'}
                modelId={modelId}
                onUpdateComplete={() => {
                    setRefresher(!refresher);
                }}
            />

            <ModelDelete
                modelType={ApiKey}
                modelId={modelId}
                onDeleteSuccess={() => {
                    Navigation.navigate(
                        RouteMap[PageMap.SETTINGS_APIKEYS] as Route
                    );
                }}
            />
        </Fragment>
    );
};

export default APIKeyView;
