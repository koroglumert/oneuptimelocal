import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import UserModel from 'Common/Models/UserModel';
import ColumnType from 'Common/Types/Database/ColumnType';
import ColumnLength from 'Common/Types/Database/ColumnLength';
import SlugifyColumn from 'Common/Types/Database/SlugifyColumn';
import Phone from 'Common/Types/Phone';
import Email from 'Common/Types/Email';
import Name from 'Common/Types/Name';
import URL from 'Common/Types/API/URL';
import Timezone from 'Common/Types/Timezone';
import CompanySize from 'Common/Types/Company/CompanySize';
import JobRole from 'Common/Types/Company/JobRole';
import HashedString from 'Common/Types/HashedString';
import TableColumn from 'Common/Types/Database/TableColumn';
import File from './File';
import CrudApiEndpoint from 'Common/Types/Database/CrudApiEndpoint';
import Route from 'Common/Types/API/Route';
import TableColumnType from 'Common/Types/Database/TableColumnType';
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
import Permission from 'Common/Types/Permission';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import CurrentUserCanAccessRecordBy from 'Common/Types/Database/CurrentUserCanAccessRecordBy';
import TableMetadata from 'Common/Types/Database/TableMetadata';
import IconProp from 'Common/Types/Icon/IconProp';
import AllowAccessIfSubscriptionIsUnpaid from 'Common/Types/Database/AccessControl/AllowAccessIfSubscriptionIsUnpaid';
import ObjectID from 'Common/Types/ObjectID';
import EnableDocumentation from 'Common/Types/Database/EnableDocumentation';

@EnableDocumentation({
    isMasterAdminApiDocs: true,
})
@AllowAccessIfSubscriptionIsUnpaid()
@TableAccessControl({
    create: [Permission.Public],
    read: [
        Permission.CurrentUser,
        Permission.ProjectAdmin,
        Permission.ProjectOwner,
    ],
    delete: [Permission.CurrentUser],
    update: [Permission.CurrentUser],
})
@CrudApiEndpoint(new Route('/user'))
@SlugifyColumn('name', 'slug')
@Entity({
    name: 'User',
})
@TableMetadata({
    tableName: 'User',
    singularName: 'User',
    pluralName: 'Users',
    icon: IconProp.User,
    tableDescription: 'A signed up or invited OneUptime user.',
})
@CurrentUserCanAccessRecordBy('_id')
class User extends UserModel {
    @ColumnAccessControl({
        create: [Permission.Public],
        read: [
            Permission.CurrentUser,
            Permission.ProjectAdmin,
            Permission.ProjectOwner,
        ],
        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.Name, canReadOnRelationQuery: true })
    @Column({
        type: ColumnType.Name,
        length: ColumnLength.Name,
        nullable: true,
        unique: false,
        transformer: Name.getDatabaseTransformer(),
    })
    public name?: Name = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [
            Permission.CurrentUser,
            Permission.ProjectAdmin,
            Permission.ProjectOwner,
        ],

        update: [Permission.CurrentUser],
    })
    @TableColumn({
        title: 'Email',
        required: true,
        unique: true,
        type: TableColumnType.Email,
        canReadOnRelationQuery: true,
    })
    @Column({
        type: ColumnType.Email,
        length: ColumnLength.Email,
        unique: true,
        nullable: false,
        transformer: Email.getDatabaseTransformer(),
    })
    public email?: Email = undefined;

    @ColumnAccessControl({
        create: [],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.Email })
    @Column({
        type: ColumnType.Email,
        length: ColumnLength.Email,
        unique: false,
        nullable: true,
        transformer: Email.getDatabaseTransformer(),
    })
    public newUnverifiedTemporaryEmail?: string = undefined;

    @Index()
    @ColumnAccessControl({
        create: [Permission.User],
        read: [],
        update: [],
    })
    @TableColumn({
        required: true,
        unique: true,
        type: TableColumnType.Slug,
        title: 'Slug',
        description: 'Friendly globally unique name for your object',
    })
    @Column({
        nullable: false,
        type: ColumnType.Slug,
        length: ColumnLength.Slug,
        unique: true,
    })
    public slug?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({
        title: 'Password',
        hashed: true,
        type: TableColumnType.HashedString,
    })
    @Column({
        type: ColumnType.HashedString,
        length: ColumnLength.HashedString,
        unique: false,
        nullable: true,
        transformer: HashedString.getDatabaseTransformer(),
    })
    public password?: HashedString = undefined;

    @ColumnAccessControl({
        create: [],
        read: [Permission.CurrentUser],

        update: [],
    })
    @TableColumn({ isDefaultValueColumn: true, type: TableColumnType.Boolean })
    @Column({
        type: ColumnType.Boolean,
        default: false,
    })
    public isEmailVerified?: boolean = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public companyName?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public jobRole?: JobRole = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public companySize?: CompanySize = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public referral?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.Phone })
    @Column({
        type: ColumnType.Phone,
        length: ColumnLength.Phone,
        nullable: true,
        unique: false,
        transformer: Phone.getDatabaseTransformer(),
    })
    public companyPhoneNumber?: Phone = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.CurrentUser,
            Permission.ProjectAdmin,
            Permission.ProjectOwner,
        ],

        update: [Permission.CurrentUser],
    })
    @TableColumn({
        manyToOneRelationColumn: 'profilePictureId',
        type: TableColumnType.Entity,
        modelType: File,
    })
    @ManyToOne(
        (_type: string) => {
            return File;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'delete',
        }
    )
    @JoinColumn({ name: 'profilePictureId' })
    public profilePictureFile?: File = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.CurrentUser,
            Permission.ProjectAdmin,
            Permission.ProjectOwner,
        ],

        update: [Permission.CurrentUser],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        canReadOnRelationQuery: true,
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public profilePictureId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.CurrentUser,
            Permission.ProjectAdmin,
            Permission.ProjectOwner,
        ],

        update: [Permission.CurrentUser],
    })
    @TableColumn({
        isDefaultValueColumn: true,
        required: true,
        type: TableColumnType.Boolean,
    })
    @Column({
        type: ColumnType.Boolean,
        default: false,
        nullable: false,
        unique: false,
    })
    public twoFactorAuthEnabled?: boolean = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public twoFactorSecretCode?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.ShortURL })
    @Column({
        type: ColumnType.ShortURL,
        length: ColumnLength.ShortURL,
        nullable: true,
        unique: false,
        transformer: URL.getDatabaseTransformer(),
    })
    public twoFactorAuthUrl?: URL = undefined;

    @ColumnAccessControl({
        create: [],
        read: [Permission.CurrentUser],

        update: [],
    })
    @TableColumn({ type: TableColumnType.Array })
    @Column({
        type: ColumnType.Array,
        nullable: true,
        unique: false,
    })
    public backupCodes?: Array<string> = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public jwtRefreshToken?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public paymentProviderCustomerId?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public resetPasswordToken?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.Date })
    @Column({
        type: ColumnType.Date,
        nullable: true,
        unique: false,
    })
    public resetPasswordExpires?: Date = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.CurrentUser,
            Permission.ProjectAdmin,
            Permission.ProjectOwner,
        ],

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public timezone?: Timezone = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.Date })
    @Column({
        type: ColumnType.Date,
        nullable: true,
        unique: false,
    })
    public lastActive?: Date = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public promotionName?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [Permission.CustomerSupport],

        update: [Permission.CustomerSupport],
    })
    @TableColumn({
        isDefaultValueColumn: true,
        required: true,
        type: TableColumnType.Boolean,
    })
    @Column({
        type: ColumnType.Boolean,
        nullable: false,
        unique: false,
        default: false,
    })
    public isDisabled?: boolean = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.Date })
    @Column({
        type: ColumnType.Date,
        nullable: true,
        unique: false,
    })
    public paymentFailedDate?: Date = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({
        isDefaultValueColumn: true,
        required: true,
        type: TableColumnType.Boolean,
    })
    @Column({
        type: ColumnType.Boolean,
        nullable: false,
        unique: false,
        default: false,
    })
    public isMasterAdmin?: boolean = undefined;

    @ColumnAccessControl({
        create: [],
        read: [Permission.CustomerSupport],

        update: [Permission.CustomerSupport],
    })
    @TableColumn({
        isDefaultValueColumn: true,
        required: true,
        type: TableColumnType.Boolean,
    })
    @Column({
        type: ColumnType.Boolean,
        nullable: false,
        unique: false,
        default: false,
    })
    public isBlocked?: boolean = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.CurrentUser,
            Permission.ProjectAdmin,
            Permission.ProjectOwner,
        ],

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.Phone })
    @Column({
        type: ColumnType.Phone,
        length: ColumnLength.Phone,
        nullable: true,
        unique: false,
    })
    public alertPhoneNumber?: Phone = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.OTP })
    @Column({
        type: ColumnType.OTP,
        length: ColumnLength.OTP,
        nullable: true,
        unique: false,
    })
    public alertPhoneVerificationCode?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [],
        update: [],
    })
    @TableColumn({ type: TableColumnType.LongText })
    @Column({
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
        nullable: true,
        unique: false,
    })
    public utmSource?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [],
        update: [],
    })
    @TableColumn({ type: TableColumnType.LongText })
    @Column({
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
        nullable: true,
        unique: false,
    })
    public utmMedium?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [],
        update: [],
    })
    @TableColumn({ type: TableColumnType.LongText })
    @Column({
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
        nullable: true,
        unique: false,
    })
    public utmCampaign?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [],
        update: [],
    })
    @TableColumn({ type: TableColumnType.LongText })
    @Column({
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
        nullable: true,
        unique: false,
    })
    public utmTerm?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [],
        update: [],
    })
    @TableColumn({ type: TableColumnType.LongText })
    @Column({
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
        nullable: true,
        unique: false,
    })
    public utmContent?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [],
        update: [],
    })
    @TableColumn({ type: TableColumnType.LongText })
    @Column({
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
        nullable: true,
        unique: false,
    })
    public utmUrl?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.Date })
    @Column({
        type: ColumnType.Date,
        nullable: true,
        unique: false,
    })
    public alertPhoneVerificationCodeRequestTime?: Date = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.Phone })
    @Column({
        type: ColumnType.Phone,
        length: ColumnLength.Phone,
        nullable: true,
        unique: false,
    })
    public tempAlertPhoneNumber?: Phone = undefined;
}

export default User;
