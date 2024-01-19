import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import BaseModel from 'Common/Models/BaseModel';
import User from './User';
import Project from './Project';
import CrudApiEndpoint from 'Common/Types/Database/CrudApiEndpoint';
import SlugifyColumn from 'Common/Types/Database/SlugifyColumn';
import Route from 'Common/Types/API/Route';
import TableColumnType from 'Common/Types/Database/TableColumnType';
import TableColumn from 'Common/Types/Database/TableColumn';
import ColumnType from 'Common/Types/Database/ColumnType';
import ObjectID from 'Common/Types/ObjectID';
import ColumnLength from 'Common/Types/Database/ColumnLength';
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
import Permission from 'Common/Types/Permission';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import TenantColumn from 'Common/Types/Database/TenantColumn';
import TableMetadata from 'Common/Types/Database/TableMetadata';
import EnableWorkflow from 'Common/Types/Database/EnableWorkflow';
import IconProp from 'Common/Types/Icon/IconProp';
import StatusPage from './StatusPage';
import Monitor from './Monitor';
import StatusPageGroup from './StatusPageGroup';
import CanAccessIfCanReadOn from 'Common/Types/Database/CanAccessIfCanReadOn';
import EnableDocumentation from 'Common/Types/Database/EnableDocumentation';
import MonitorGroup from './MonitorGroup';

export enum UptimePrecision {
    NO_DECIMAL = '99% (No Decimal)',
    ONE_DECIMAL = '99.9% (One Decimal)',
    TWO_DECIMAL = '99.99% (Two Decimal)',
    THREE_DECIMAL = '99.999% (Three Decimal)',
}

@EnableDocumentation()
@CanAccessIfCanReadOn('statusPage')
@TenantColumn('projectId')
@TableAccessControl({
    create: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanCreateStatusPageResource,
    ],
    read: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanReadStatusPageResource,
    ],
    delete: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanDeleteStatusPageResource,
    ],
    update: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanEditStatusPageResource,
    ],
})
@EnableWorkflow({
    create: true,
    delete: true,
    update: true,
    read: true,
})
@CrudApiEndpoint(new Route('/status-page-resource'))
@SlugifyColumn('name', 'slug')
@TableMetadata({
    tableName: 'StatusPageResource',
    singularName: 'Status Page Resource',
    pluralName: 'Status Page Resources',
    icon: IconProp.AltGlobe,
    tableDescription: 'Add resources like monitors to your status page',
})
@Entity({
    name: 'StatusPageResource',
})
export default class StatusPageResource extends BaseModel {
    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'projectId',
        type: TableColumnType.Entity,
        modelType: Project,
        title: 'Project',
        description:
            'Relation to Project Resource in which this object belongs',
    })
    @ManyToOne(
        (_type: string) => {
            return Project;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'projectId' })
    public project?: Project = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'Project ID',
        description:
            'ID of your OneUptime Project in which this object belongs',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public projectId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'statusPageId',
        type: TableColumnType.Entity,
        modelType: StatusPage,
        title: 'Status Page',
        description:
            'Relation to Status Page Resource in which this object belongs',
    })
    @ManyToOne(
        (_type: string) => {
            return StatusPage;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'statusPageId' })
    public statusPage?: StatusPage = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        title: 'Status Page ID',
        description:
            'ID of your Status Page resource where this object belongs',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public statusPageId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditStatusPageResource,
        ],
    })
    @TableColumn({
        manyToOneRelationColumn: 'monitorId',
        type: TableColumnType.Entity,
        modelType: Monitor,
        title: 'Monitor',
        description:
            'Relation to Monitor Resource in which this object belongs',
    })
    @ManyToOne(
        (_type: string) => {
            return Monitor;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'monitorId' })
    public monitor?: Monitor = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditStatusPageResource,
        ],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: false,
        title: 'Monitor ID',
        description:
            'Relation to Monitor ID Resource in which this object belongs',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public monitorId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditStatusPageResource,
        ],
    })
    @TableColumn({
        manyToOneRelationColumn: 'monitorGroupId',
        type: TableColumnType.Entity,
        modelType: MonitorGroup,
        title: 'Monitor Group',
        description:
            'Relation to Monitor Group Resource in which this object belongs',
    })
    @ManyToOne(
        (_type: string) => {
            return MonitorGroup;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'monitorGroupId' })
    public monitorGroup?: MonitorGroup = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditStatusPageResource,
        ],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: false,
        title: 'Monitor Group ID',
        description:
            'Relation to Monitor Group ID Resource in which this object belongs',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public monitorGroupId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditStatusPageResource,
        ],
    })
    @TableColumn({
        manyToOneRelationColumn: 'statusPageGroupId',
        type: TableColumnType.Entity,
        modelType: StatusPageGroup,
        title: 'Status Page Group',
        description:
            'Does this monitor belong to a status page group? If so - which one is it?',
    })
    @ManyToOne(
        (_type: string) => {
            return StatusPageGroup;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'statusPageGroupId' })
    public statusPageGroup?: StatusPageGroup = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditStatusPageResource,
        ],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: false,
        title: 'Group ID',
        description: 'Does this monitor belong to a status page group?',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public statusPageGroupId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditStatusPageResource,
        ],
    })
    @TableColumn({
        required: true,
        type: TableColumnType.ShortText,
        title: 'Display Name',
        description: 'Display name of the monitor on the Status Page',
    })
    @Column({
        nullable: false,
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
    })
    public displayName?: string = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditStatusPageResource,
        ],
    })
    @TableColumn({
        required: false,
        type: TableColumnType.Markdown,
        title: 'Display Description',
        description:
            'Display description of the monitor on the Status Page. This is in markdown format.',
    })
    @Column({
        nullable: true,
        type: ColumnType.Markdown,
    })
    public displayDescription?: string = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditStatusPageResource,
        ],
    })
    @TableColumn({
        required: false,
        type: TableColumnType.LongText,
        title: 'Display Tooltip',
        description: 'Tooltip of the monitor on the Status Page',
    })
    @Column({
        nullable: true,
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
    })
    public displayTooltip?: string = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditStatusPageResource,
        ],
    })
    @TableColumn({
        isDefaultValueColumn: true,
        type: TableColumnType.Boolean,
        title: 'Show current status',
        description:
            'Show current status like offline, operational or degraded.',
    })
    @Column({
        type: ColumnType.Boolean,
        default: true,
    })
    public showCurrentStatus?: boolean = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditStatusPageResource,
        ],
    })
    @TableColumn({
        isDefaultValueColumn: true,
        type: TableColumnType.Boolean,
        title: 'Show Uptime Percent',
        description: 'Show uptime percent of this monitor for the last 90 days',
    })
    @Column({
        type: ColumnType.Boolean,
        default: false,
    })
    public showUptimePercent?: boolean = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditStatusPageResource,
        ],
    })
    @TableColumn({
        type: TableColumnType.ShortText,
        title: 'Uptime Percent Precision',
        required: false,
        description:
            'Precision of uptime percent of this monitor for the last 90 days',
    })
    @Column({
        type: ColumnType.ShortText,
        nullable: true,
    })
    public uptimePercentPrecision?: UptimePrecision = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditStatusPageResource,
        ],
    })
    @TableColumn({
        isDefaultValueColumn: true,
        type: TableColumnType.Boolean,
        title: 'Show History Chart',
        description: 'Show a 90 day uptime history of this monitor',
    })
    @Column({
        type: ColumnType.Boolean,
        default: true,
    })
    public showStatusHistoryChart?: boolean = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'createdByUserId',
        type: TableColumnType.Entity,
        modelType: User,
        title: 'Created by User',
        description:
            'Relation to User who created this object (if this object was created by a User)',
    })
    @ManyToOne(
        (_type: string) => {
            return User;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'createdByUserId' })
    public createdByUser?: User = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Created by User ID',
        description:
            'User ID who created this object (if this object was created by a User)',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public createdByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateStatusPageResource,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadStatusPageResource,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditStatusPageResource,
        ],
    })
    @TableColumn({
        isDefaultValueColumn: false,
        type: TableColumnType.Number,
        title: 'Order',
        description: 'Order / Priority of this resource',
    })
    @Column({
        type: ColumnType.Number,
    })
    public order?: number = undefined;
}
