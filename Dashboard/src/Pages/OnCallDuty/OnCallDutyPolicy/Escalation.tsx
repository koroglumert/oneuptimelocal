import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import PageComponentProps from '../../PageComponentProps';
import Navigation from 'CommonUI/src/Utils/Navigation';
import OnCallDutyEscalationRule from 'Model/Models/OnCallDutyPolicyEscalationRule';
import ObjectID from 'Common/Types/ObjectID';
import OnCallDutyPolicy from 'Model/Models/OnCallDutyPolicy';
import ModelTable, {
    ShowTableAs,
} from 'CommonUI/src/Components/ModelTable/ModelTable';
import DashboardNavigation from '../../../Utils/Navigation';
import BadDataException from 'Common/Types/Exception/BadDataException';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import Team from 'Model/Models/Team';
import ProjectUser from '../../../Utils/ProjectUser';
import CardModelDetail from 'CommonUI/src/Components/ModelDetail/CardModelDetail';
import SortOrder from 'Common/Types/BaseDatabase/SortOrder';
import { JSONObject } from 'Common/Types/JSON';
import TeamView from '../../../Components/OnCallPolicy/EscalationRule/TeamView';
import UserView from '../../../Components/OnCallPolicy/EscalationRule/UserView';
import OnCallDutyPolicySchedule from 'Model/Models/OnCallDutyPolicySchedule';
import OnCallDutyScheduleView from '../../../Components/OnCallPolicy/EscalationRule/OnCallScheduleView';

const OnCallPolicyDelete: FunctionComponent<PageComponentProps> = (
    props: PageComponentProps
): ReactElement => {
    const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

    return (
        <Fragment>
            <ModelTable<OnCallDutyEscalationRule>
                modelType={OnCallDutyEscalationRule}
                id="table-scheduled-maintenance-internal-note"
                name="Scheduled Maintenance Events > Public Notes"
                isDeleteable={true}
                isCreateable={true}
                isEditable={false}
                sortBy="order"
                sortOrder={SortOrder.Ascending}
                showViewIdButton={true}
                isViewable={false}
                enableDragAndDrop={true}
                dragDropIndexField="order"
                listDetailOptions={{
                    showDetailsInNumberOfColumns: 2,
                }}
                query={{
                    onCallDutyPolicyId: modelId,
                    projectId: DashboardNavigation.getProjectId()?.toString(),
                }}
                onBeforeCreate={(
                    item: OnCallDutyEscalationRule
                ): Promise<OnCallDutyEscalationRule> => {
                    if (!props.currentProject || !props.currentProject._id) {
                        throw new BadDataException('Project ID cannot be null');
                    }
                    item.onCallDutyPolicyId = modelId;
                    item.projectId = new ObjectID(props.currentProject._id);
                    return Promise.resolve(item);
                }}
                cardProps={{
                    title: 'Escalation Rules',
                    description:
                        'Escalation rules are used to determine who to contact and when to contact them when an incident is triggered.',
                }}
                noItemsMessage={
                    'There are no escalation rules for this on-call policy.'
                }
                formSteps={[
                    {
                        title: 'Overview',
                        id: 'overview',
                    },
                    {
                        title: 'Notification',
                        id: 'notification',
                    },
                    {
                        title: 'Escalation',
                        id: 'escalation',
                    },
                ]}
                formFields={[
                    {
                        field: {
                            name: true,
                        },
                        stepId: 'overview',
                        title: 'Name',
                        fieldType: FormFieldSchemaType.Text,
                        required: true,
                        description:
                            'The name of the escalation rule. This is used to identify the rule.',
                    },
                    {
                        field: {
                            description: true,
                        },
                        title: 'Description',
                        stepId: 'overview',
                        fieldType: FormFieldSchemaType.LongText,
                        required: true,
                        description:
                            'The description of the escalation rule. This is used to describe the rule.',
                    },
                    {
                        overrideField: {
                            teams: true,
                        },
                        showEvenIfPermissionDoesNotExist: true,
                        title: 'Teams',
                        stepId: 'notification',
                        description:
                            'Select which teams will be notified when incident is triggered.',
                        fieldType: FormFieldSchemaType.MultiSelectDropdown,
                        dropdownModal: {
                            type: Team,
                            labelField: 'name',
                            valueField: '_id',
                        },
                        required: false,
                        placeholder: 'Select Teams',
                        overrideFieldKey: 'teams',
                    },
                    {
                        overrideField: {
                            onCallSchedules: true,
                        },
                        showEvenIfPermissionDoesNotExist: true,
                        title: 'On Call Duty Schedules',
                        stepId: 'notification',
                        description:
                            'Select which on-call duty schedules will be notified when incident is triggered.',
                        fieldType: FormFieldSchemaType.MultiSelectDropdown,
                        dropdownModal: {
                            type: OnCallDutyPolicySchedule,
                            labelField: 'name',
                            valueField: '_id',
                        },
                        required: false,
                        placeholder: 'Select On Call Duty Schedules',
                        overrideFieldKey: 'onCallSchedules',
                    },
                    {
                        overrideField: {
                            users: true,
                        },
                        showEvenIfPermissionDoesNotExist: true,
                        title: 'Users',
                        stepId: 'notification',
                        description:
                            'Select which users will be notified when incident is triggered.',
                        fieldType: FormFieldSchemaType.MultiSelectDropdown,
                        fetchDropdownOptions: async () => {
                            return await ProjectUser.fetchProjectUsersAsDropdownOptions(
                                DashboardNavigation.getProjectId()!
                            );
                        },
                        required: false,
                        placeholder: 'Select Users',
                        overrideFieldKey: 'users',
                    },
                    {
                        field: {
                            escalateAfterInMinutes: true,
                        },
                        stepId: 'escalation',
                        title: 'Escalate after (in minutes)',
                        fieldType: FormFieldSchemaType.Number,
                        placeholder: '30',
                        required: true,
                        description:
                            'The amount of time to wait before escalating to the next escalation rule.',
                    },
                ]}
                showRefreshButton={true}
                showTableAs={ShowTableAs.List}
                columns={[
                    {
                        field: {
                            order: true,
                        },
                        isFilterable: false,
                        title: 'Escalation Rule Order',
                        description: 'The order of the escalation rule.',
                        type: FieldType.Number,
                    },
                    {
                        field: {
                            name: true,
                        },
                        isFilterable: true,
                        title: 'Name',
                        description: 'The name of the escalation rule.',
                        type: FieldType.Text,
                    },
                    {
                        field: {
                            description: true,
                        },
                        isFilterable: true,
                        title: 'Description',
                        description: 'The description of the escalation rule.',
                        type: FieldType.Text,
                    },

                    {
                        field: {
                            name: true,
                        },
                        title: 'Teams',
                        description:
                            'Teams who will be notified when incident is triggered.',
                        type: FieldType.Element,
                        getElement: (item: JSONObject): ReactElement => {
                            return (
                                <TeamView
                                    escalationRuleId={
                                        new ObjectID(item['_id'] as string)
                                    }
                                />
                            );
                        },
                    },
                    {
                        field: {
                            name: true,
                        },
                        title: 'On Call Schedules',
                        description:
                            'On call schedules which will be executed when incident is triggered.',
                        type: FieldType.Element,
                        getElement: (item: JSONObject): ReactElement => {
                            return (
                                <OnCallDutyScheduleView
                                    escalationRuleId={
                                        new ObjectID(item['_id'] as string)
                                    }
                                />
                            );
                        },
                    },
                    {
                        field: {
                            escalateAfterInMinutes: true,
                        },
                        isFilterable: true,
                        title: 'Escalate after (in minutes)',
                        description:
                            'The amount of minutes to wait before escalating to the next escalation rule.',
                        type: FieldType.Minutes,
                    },
                    {
                        field: {
                            name: true,
                        },
                        title: 'Users',
                        description:
                            'Users who will be notified when incident is triggered.',
                        type: FieldType.Element,
                        getElement: (item: JSONObject): ReactElement => {
                            return (
                                <UserView
                                    escalationRuleId={
                                        new ObjectID(item['_id'] as string)
                                    }
                                />
                            );
                        },
                    },
                ]}
            />

            <CardModelDetail
                name="On-Call Policy > On-Call Policy Details"
                cardProps={{
                    title: 'Repeat Policy',
                    description:
                        'Repeat policies are used to determine how often an on-call policy should be repeated.',
                }}
                isEditable={true}
                formFields={[
                    {
                        field: {
                            repeatPolicyIfNoOneAcknowledges: true,
                        },
                        title: 'Repeat Policy If No One Acknowledges',
                        fieldType: FormFieldSchemaType.Toggle,
                        required: false,
                        description:
                            'If enabled, the on-call policy will repeat if no one acknowledges the incident.',
                        validation: {
                            minLength: 2,
                        },
                    },
                    {
                        field: {
                            repeatPolicyIfNoOneAcknowledgesNoOfTimes: true,
                        },
                        title: 'Number of Times to Repeat',
                        fieldType: FormFieldSchemaType.Number,
                        required: false,
                        description:
                            'The number of times to repeat the on-call policy if no one acknowledges the incident.',
                        placeholder: '3',
                    },
                ]}
                modelDetailProps={{
                    showDetailsInNumberOfColumns: 2,
                    modelType: OnCallDutyPolicy,
                    id: 'model-detail-monitors',
                    fields: [
                        {
                            field: {
                                repeatPolicyIfNoOneAcknowledges: true,
                            },
                            title: 'Repeat Policy If No One Acknowledges',
                            fieldType: FieldType.Boolean,
                            description:
                                'If enabled, the on-call policy will repeat if no one acknowledges the incident.',
                            placeholder: 'No',
                        },
                        {
                            field: {
                                repeatPolicyIfNoOneAcknowledgesNoOfTimes: true,
                            },
                            title: 'Number of Times to Repeat',
                            fieldType: FieldType.Number,
                            placeholder: '0',
                            description:
                                'The number of times to repeat the on-call policy if no one acknowledges the incident.',
                        },
                    ],
                    modelId: modelId,
                }}
            />
        </Fragment>
    );
};

export default OnCallPolicyDelete;
