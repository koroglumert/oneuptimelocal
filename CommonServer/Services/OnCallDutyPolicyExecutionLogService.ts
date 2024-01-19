import PostgresDatabase from '../Infrastructure/PostgresDatabase';
import Model from 'Model/Models/OnCallDutyPolicyExecutionLog';
import DatabaseService from './DatabaseService';
import { OnCreate } from '../Types/Database/Hooks';
import CreateBy from '../Types/Database/CreateBy';
import OnCallDutyPolicyStatus from 'Common/Types/OnCallDutyPolicy/OnCallDutyPolicyStatus';
import OnCallDutyPolicyEscalationRule from 'Model/Models/OnCallDutyPolicyEscalationRule';
import OnCallDutyPolicyEscalationRuleService from './OnCallDutyPolicyEscalationRuleService';
import UserNotificationEventType from 'Common/Types/UserNotification/UserNotificationEventType';

export class Service extends DatabaseService<Model> {
    public constructor(postgresDatabase?: PostgresDatabase) {
        super(Model, postgresDatabase);
        this.hardDeleteItemsOlderThanInDays('createdAt', 30);
    }

    protected override async onBeforeCreate(
        createBy: CreateBy<Model>
    ): Promise<OnCreate<Model>> {
        if (!createBy.data.status) {
            createBy.data.status = OnCallDutyPolicyStatus.Scheduled;
        }

        createBy.data.onCallPolicyExecutionRepeatCount = 1;

        return { createBy, carryForward: null };
    }

    protected override async onCreateSuccess(
        _onCreate: OnCreate<Model>,
        createdItem: Model
    ): Promise<Model> {
        // get execution rules in this policy adn execute the first rule.
        const executionRule: OnCallDutyPolicyEscalationRule | null =
            await OnCallDutyPolicyEscalationRuleService.findOneBy({
                query: {
                    projectId: createdItem.projectId!,
                    onCallDutyPolicyId: createdItem.onCallDutyPolicyId!,
                    order: 1,
                },
                props: {
                    isRoot: true,
                },
                select: {
                    _id: true,
                },
            });

        if (executionRule) {
            await this.updateOneById({
                id: createdItem.id!,
                data: {
                    status: OnCallDutyPolicyStatus.Started,
                    statusMessage: 'Execution started...',
                },
                props: {
                    isRoot: true,
                },
            });

            await OnCallDutyPolicyEscalationRuleService.startRuleExecution(
                executionRule.id!,
                {
                    projectId: createdItem.projectId!,
                    triggeredByIncidentId: createdItem.triggeredByIncidentId,
                    userNotificationEventType:
                        UserNotificationEventType.IncidentCreated,
                    onCallPolicyExecutionLogId: createdItem.id!,
                    onCallPolicyId: createdItem.onCallDutyPolicyId!,
                }
            );

            await this.updateOneById({
                id: createdItem.id!,
                data: {
                    status: OnCallDutyPolicyStatus.Executing,
                    statusMessage: 'First escalation rule executed....',
                },
                props: {
                    isRoot: true,
                },
            });
        } else {
            await this.updateOneById({
                id: createdItem.id!,
                data: {
                    status: OnCallDutyPolicyStatus.Error,
                    statusMessage:
                        'No Escalation Rules in Policy. Please add escalation rules to this policy.',
                },
                props: {
                    isRoot: true,
                },
            });
        }

        return createdItem;
    }
}
export default new Service();
