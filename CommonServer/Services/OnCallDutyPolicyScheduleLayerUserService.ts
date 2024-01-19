import PostgresDatabase from '../Infrastructure/PostgresDatabase';
import Model from 'Model/Models/OnCallDutyPolicyScheduleLayerUser';
import DatabaseService from './DatabaseService';
import CreateBy from '../Types/Database/CreateBy';
import { OnCreate, OnDelete, OnUpdate } from '../Types/Database/Hooks';
import ObjectID from 'Common/Types/ObjectID';
import QueryHelper from '../Types/Database/QueryHelper';
import LIMIT_MAX from 'Common/Types/Database/LimitMax';
import SortOrder from 'Common/Types/BaseDatabase/SortOrder';
import BadDataException from 'Common/Types/Exception/BadDataException';
import DeleteBy from '../Types/Database/DeleteBy';
import UpdateBy from '../Types/Database/UpdateBy';
import PositiveNumber from 'Common/Types/PositiveNumber';

export class Service extends DatabaseService<Model> {
    public constructor(postgresDatabase?: PostgresDatabase) {
        super(Model, postgresDatabase);
    }

    protected override async onBeforeCreate(
        createBy: CreateBy<Model>
    ): Promise<OnCreate<Model>> {
        if (!createBy.data.onCallDutyPolicyScheduleLayerId) {
            throw new BadDataException(
                'onCallDutyPolicyScheduleLayerId is required'
            );
        }

        const userId: ObjectID | undefined | null =
            createBy.data.userId || createBy.data.user?.id;

        if (!userId) {
            throw new BadDataException('userId is required');
        }

        if (!createBy.data.order) {
            // count number of users in this layer.

            const count: PositiveNumber = await this.countBy({
                query: {
                    onCallDutyPolicyScheduleLayerId:
                        createBy.data.onCallDutyPolicyScheduleLayerId!,
                },
                props: {
                    isRoot: true,
                },
            });

            createBy.data.order = count.toNumber() + 1;
        }

        await this.rearrangeOrder(
            createBy.data.order,
            createBy.data.onCallDutyPolicyScheduleLayerId!,
            true
        );

        return {
            createBy,
            carryForward: null,
        };
    }

    protected override async onDeleteSuccess(
        onDelete: OnDelete<Model>,
        _itemIdsBeforeDelete: ObjectID[]
    ): Promise<OnDelete<Model>> {
        const deleteBy: DeleteBy<Model> = onDelete.deleteBy;
        const resource: Model | null = onDelete.carryForward;

        if (!deleteBy.props.isRoot && resource) {
            if (
                resource &&
                resource.order &&
                resource.onCallDutyPolicyScheduleLayerId
            ) {
                await this.rearrangeOrder(
                    resource.order,
                    resource.onCallDutyPolicyScheduleLayerId,
                    false
                );
            }
        }

        return {
            deleteBy: deleteBy,
            carryForward: null,
        };
    }

    protected override async onBeforeDelete(
        deleteBy: DeleteBy<Model>
    ): Promise<OnDelete<Model>> {
        if (!deleteBy.query._id && !deleteBy.props.isRoot) {
            throw new BadDataException(
                '_id should be present when deleting status page resource. Please try the delete with objectId'
            );
        }

        let resource: Model | null = null;

        if (!deleteBy.props.isRoot) {
            resource = await this.findOneBy({
                query: deleteBy.query,
                props: {
                    isRoot: true,
                },
                select: {
                    order: true,
                    onCallDutyPolicyScheduleLayerId: true,
                },
            });
        }

        return {
            deleteBy,
            carryForward: resource,
        };
    }

    protected override async onBeforeUpdate(
        updateBy: UpdateBy<Model>
    ): Promise<OnUpdate<Model>> {
        if (
            updateBy.data.order &&
            !updateBy.props.isRoot &&
            updateBy.query._id
        ) {
            const resource: Model | null = await this.findOneBy({
                query: {
                    _id: updateBy.query._id!,
                },
                props: {
                    isRoot: true,
                },
                select: {
                    order: true,
                    onCallDutyPolicyScheduleLayerId: true,
                    _id: true,
                },
            });

            const currentOrder: number = resource?.order as number;
            const newOrder: number = updateBy.data.order as number;

            const resources: Array<Model> = await this.findBy({
                query: {
                    onCallDutyPolicyScheduleLayerId:
                        resource?.onCallDutyPolicyScheduleLayerId as ObjectID,
                },

                limit: LIMIT_MAX,
                skip: 0,
                props: {
                    isRoot: true,
                },
                select: {
                    order: true,
                    onCallDutyPolicyScheduleLayerId: true,
                    _id: true,
                },
            });

            if (currentOrder > newOrder) {
                // moving up.

                for (const resource of resources) {
                    if (
                        resource.order! >= newOrder &&
                        resource.order! < currentOrder
                    ) {
                        // increment order.
                        await this.updateOneBy({
                            query: {
                                _id: resource._id!,
                            },
                            data: {
                                order: resource.order! + 1,
                            },
                            props: {
                                isRoot: true,
                            },
                        });
                    }
                }
            }

            if (newOrder > currentOrder) {
                // moving down.

                for (const resource of resources) {
                    if (resource.order! <= newOrder) {
                        // increment order.
                        await this.updateOneBy({
                            query: {
                                _id: resource._id!,
                            },
                            data: {
                                order: resource.order! - 1,
                            },
                            props: {
                                isRoot: true,
                            },
                        });
                    }
                }
            }
        }

        return { updateBy, carryForward: null };
    }

    private async rearrangeOrder(
        currentOrder: number,
        onCallDutyPolicyScheduleLayerId: ObjectID,
        increaseOrder: boolean = true
    ): Promise<void> {
        // get status page resource with this order.
        const resources: Array<Model> = await this.findBy({
            query: {
                order: QueryHelper.greaterThanEqualTo(currentOrder),
                onCallDutyPolicyScheduleLayerId:
                    onCallDutyPolicyScheduleLayerId,
            },
            limit: LIMIT_MAX,
            skip: 0,
            props: {
                isRoot: true,
            },
            select: {
                _id: true,
                order: true,
            },
            sort: {
                order: SortOrder.Ascending,
            },
        });

        let newOrder: number = currentOrder;

        for (const resource of resources) {
            if (increaseOrder) {
                newOrder = resource.order! + 1;
            } else {
                newOrder = resource.order! - 1;
            }

            await this.updateOneBy({
                query: {
                    _id: resource._id!,
                },
                data: {
                    order: newOrder,
                },
                props: {
                    isRoot: true,
                },
            });
        }
    }
}

export default new Service();
