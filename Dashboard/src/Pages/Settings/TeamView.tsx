import Route from 'Common/Types/API/Route';
import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import PageMap from '../../Utils/PageMap';
import RouteMap, { RouteUtil } from '../../Utils/RouteMap';
import PageComponentProps from '../PageComponentProps';
import ModelTable from 'CommonUI/src/Components/ModelTable/ModelTable';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import CardModelDetail from 'CommonUI/src/Components/ModelDetail/CardModelDetail';
import Team from 'Model/Models/Team';
import TeamMember from 'Model/Models/TeamMember';
import Navigation from 'CommonUI/src/Utils/Navigation';
import PermissionUtil from 'CommonUI/src/Utils/Permission';
import Label from 'Model/Models/Label';
import { JSONArray, JSONObject } from 'Common/Types/JSON';
import Permission, { PermissionHelper } from 'Common/Types/Permission';
import ModelDelete from 'CommonUI/src/Components/ModelDelete/ModelDelete';
import ObjectID from 'Common/Types/ObjectID';
import TeamPermission from 'Model/Models/TeamPermission';
import UserElement from '../../Components/User/User';
import User from 'Model/Models/User';
import LabelsElement from '../../Components/Label/Labels';
import BadDataException from 'Common/Types/Exception/BadDataException';
import FormValues from 'CommonUI/src/Components/Forms/Types/FormValues';
import Pill from 'CommonUI/src/Components/Pill/Pill';
import { Green, Yellow } from 'Common/Types/BrandColors';
import DashboardNavigation from '../../Utils/Navigation';
import BaseModel from 'Common/Models/BaseModel';

const TeamView: FunctionComponent<PageComponentProps> = (
    props: PageComponentProps
): ReactElement => {
    const modelId: ObjectID = Navigation.getLastParamAsObjectID();

    return (
        <Fragment>
            {/* API Key View  */}
            <CardModelDetail
                name="Team Details"
                cardProps={{
                    title: 'Team Details',
                    description: 'Here are more details for this team.',
                }}
                isEditable={true}
                formFields={[
                    {
                        field: {
                            name: true,
                        },
                        title: 'Name',
                        fieldType: FormFieldSchemaType.Text,
                        required: true,
                        placeholder: 'Team Name',
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
                        placeholder: 'Team Description',
                    },
                ]}
                modelDetailProps={{
                    modelType: Team,
                    id: 'model-detail-team',
                    fields: [
                        {
                            field: {
                                _id: true,
                            },
                            title: 'Team ID',
                        },
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
                    ],
                    modelId: Navigation.getLastParamAsObjectID(),
                }}
            />

            {/* Team Members Table */}

            <ModelTable<TeamMember>
                modelType={TeamMember}
                id="table-team-member"
                isDeleteable={true}
                name="Settings > Team > Member"
                createVerb={'Invite'}
                isCreateable={true}
                isViewable={false}
                query={{
                    teamId: modelId,
                    projectId: DashboardNavigation.getProjectId()?.toString(),
                }}
                onBeforeCreate={(item: TeamMember): Promise<TeamPermission> => {
                    if (!props.currentProject || !props.currentProject._id) {
                        throw new BadDataException('Project ID cannot be null');
                    }
                    item.teamId = modelId;
                    item.projectId = new ObjectID(props.currentProject._id);
                    return Promise.resolve(item);
                }}
                cardProps={{
                    title: 'Team Members',
                    description:
                        'See a list of members or invite them to this team. ',
                }}
                noItemsMessage={'No members found for this team.'}
                formFields={[
                    {
                        field: {
                            user: true,
                        },
                        title: 'User Email',
                        description:
                            'Please enter the email of the user you would like to invite. We will send them an email to let them know they have been invited to this team.',
                        fieldType: FormFieldSchemaType.Email,
                        required: true,
                        placeholder: 'member@company.com',
                        overrideFieldKey: 'email',
                    },
                ]}
                showRefreshButton={true}
                deleteButtonText="Remove Member"
                showFilterButton={true}
                viewPageRoute={RouteUtil.populateRouteParams(props.pageRoute)}
                columns={[
                    {
                        field: {
                            user: {
                                name: true,
                                email: true,
                            },
                        },
                        title: 'User',
                        type: FieldType.Text,
                        getElement: (item: JSONObject): ReactElement => {
                            if (item['user']) {
                                return (
                                    <UserElement
                                        user={
                                            BaseModel.fromJSON(
                                                item['user'] as JSONObject,
                                                User
                                            ) as User
                                        }
                                    />
                                );
                            }

                            return <></>;
                        },
                    },
                    {
                        field: {
                            hasAcceptedInvitation: true,
                        },
                        title: 'Status',
                        type: FieldType.Boolean,
                        isFilterable: true,
                        getElement: (item: JSONObject): ReactElement => {
                            if (item['hasAcceptedInvitation']) {
                                return <Pill text="Member" color={Green} />;
                            }
                            return (
                                <Pill text="Invitation Sent" color={Yellow} />
                            );
                        },
                    },
                ]}
            />

            {/* Team Permisison Table */}

            <ModelTable<TeamPermission>
                modelType={TeamPermission}
                id="table-team-permission"
                isDeleteable={true}
                isEditable={true}
                isCreateable={true}
                name="Settings > Team > Permissions"
                isViewable={false}
                query={{
                    teamId: modelId,
                    projectId: DashboardNavigation.getProjectId()?.toString(),
                }}
                onBeforeCreate={(
                    item: TeamPermission
                ): Promise<TeamPermission> => {
                    if (!props.currentProject || !props.currentProject._id) {
                        throw new BadDataException('Project ID cannot be null');
                    }
                    item.teamId = modelId;
                    item.projectId = new ObjectID(props.currentProject._id);
                    return Promise.resolve(item);
                }}
                cardProps={{
                    title: 'Team Permissions',
                    description:
                        'Add different permisisons to this team to make it more granular.',
                }}
                noItemsMessage={'No permisisons created for this team so far.'}
                formFields={[
                    {
                        field: {
                            permission: true,
                        },
                        onChange: async (
                            _value: any,
                            form: any
                        ): Promise<void> => {
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
                        showIf: (
                            values: FormValues<TeamPermission>
                        ): boolean => {
                            if (!values['permission']) {
                                return false;
                            }

                            if (
                                values['permission'] &&
                                !PermissionHelper.isAccessControlPermission(
                                    values['permission'] as Permission
                                )
                            ) {
                                return false;
                            }

                            return true;
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

            <ModelDelete
                modelType={Team}
                modelId={Navigation.getLastParamAsObjectID()}
                onDeleteSuccess={() => {
                    Navigation.navigate(
                        RouteMap[PageMap.SETTINGS_TEAMS] as Route
                    );
                }}
            />
        </Fragment>
    );
};

export default TeamView;
