import Slug from 'Common/Utils/Slug';
import FindOneBy from '../Types/Database/FindOneBy';
import UpdateOneBy from '../Types/Database/UpdateOneBy';
import CountBy from '../Types/Database/CountBy';
import DeleteOneBy from '../Types/Database/DeleteOneBy';
import SearchBy from '../Types/Database/SearchBy';
import DeleteBy from '../Types/Database/DeleteBy';
import PositiveNumber from 'Common/Types/PositiveNumber';
import FindBy from '../Types/Database/FindBy';
import UpdateBy from '../Types/Database/UpdateBy';
import Query, { FindWhere } from '../Types/Database/Query';
import CreateBy from '../Types/Database/CreateBy';
import BadDataException from 'Common/Types/Exception/BadDataException';
import DatabaseNotConnectedException from 'Common/Types/Exception/DatabaseNotConnectedException';
import Exception from 'Common/Types/Exception/Exception';
import SearchResult from '../Types/Database/SearchResult';
import Encryption from '../Utils/Encryption';
import { JSONObject, JSONValue } from 'Common/Types/JSON';
import BaseModel from 'Common/Models/BaseModel';
import PostgresDatabase, {
    PostgresAppInstance,
} from '../Infrastructure/PostgresDatabase';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import ObjectID from 'Common/Types/ObjectID';
import SortOrder from 'Common/Types/BaseDatabase/SortOrder';
import { EncryptionSecret, WorkflowHostname } from '../EnvironmentConfig';
import { WorkflowRoute } from 'Common/ServiceRoute';
import HashedString from 'Common/Types/HashedString';
import UpdateByID from '../Types/Database/UpdateByID';
import Columns from 'Common/Types/Database/Columns';
import FindOneByID from '../Types/Database/FindOneByID';
import Dictionary from 'Common/Types/Dictionary';
import DatabaseCommonInteractionProps from 'Common/Types/BaseDatabase/DatabaseCommonInteractionProps';
import QueryHelper from '../Types/Database/QueryHelper';
import { getUniqueColumnsBy } from 'Common/Types/Database/UniqueColumnBy';
import Typeof from 'Common/Types/Typeof';
import TableColumnType from 'Common/Types/Database/TableColumnType';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import LIMIT_MAX from 'Common/Types/Database/LimitMax';
import { TableColumnMetadata } from 'Common/Types/Database/TableColumn';
import ModelPermission, {
    CheckReadPermissionType,
} from '../Types/Database/ModelPermission';
import Select from '../Types/Database/Select';
import RelationSelect from '../Types/Database/RelationSelect';
import UpdateByIDAndFetch from '../Types/Database/UpdateByIDAndFetch';
import API from 'Common/Utils/API';
import Protocol from 'Common/Types/API/Protocol';
import Route from 'Common/Types/API/Route';
import URL from 'Common/Types/API/URL';
import ClusterKeyAuthorization from '../Middleware/ClusterKeyAuthorization';
import Text from 'Common/Types/Text';
import logger from '../Utils/Logger';
import BaseService from './BaseService';
import { getMaxLengthFromTableColumnType } from 'Common/Types/Database/ColumnLength';
import {
    DatabaseTriggerType,
    OnCreate,
    OnDelete,
    OnFind,
    OnUpdate,
} from '../Types/Database/Hooks';
import JSONFunctions from 'Common/Types/JSONFunctions';

class DatabaseService<TBaseModel extends BaseModel> extends BaseService {
    private postgresDatabase!: PostgresDatabase;
    public modelType!: { new (): TBaseModel };
    private model!: TBaseModel;
    private modelName!: string;

    private _hardDeleteItemByColumnName: string = '';
    public get hardDeleteItemByColumnName(): string {
        return this._hardDeleteItemByColumnName;
    }
    public set hardDeleteItemByColumnName(v: string) {
        this._hardDeleteItemByColumnName = v;
    }

    private _hardDeleteItemsOlderThanDays: number = 0;
    public get hardDeleteItemsOlderThanDays(): number {
        return this._hardDeleteItemsOlderThanDays;
    }
    public set hardDeleteItemsOlderThanDays(v: number) {
        this._hardDeleteItemsOlderThanDays = v;
    }

    public doNotAllowDelete: boolean = false;

    public constructor(
        modelType: { new (): TBaseModel },
        postgresDatabase?: PostgresDatabase
    ) {
        super();
        this.modelType = modelType;
        this.model = new modelType();
        this.modelName = modelType.name;

        if (postgresDatabase) {
            this.postgresDatabase = postgresDatabase;
        }
    }

    public setDoNotAllowDelete(doNotAllowDelete: boolean): void {
        this.doNotAllowDelete = doNotAllowDelete;
    }

    public hardDeleteItemsOlderThanInDays(
        columnName: string,
        olderThan: number
    ): void {
        this.hardDeleteItemByColumnName = columnName;
        this.hardDeleteItemsOlderThanDays = olderThan;
    }

    public getModel(): TBaseModel {
        return this.model;
    }

    public getQueryBuilder(modelName: string): SelectQueryBuilder<TBaseModel> {
        return this.getRepository().createQueryBuilder(modelName);
    }

    public getRepository(): Repository<TBaseModel> {
        if (this.postgresDatabase && !this.postgresDatabase.isConnected()) {
            throw new DatabaseNotConnectedException();
        }

        if (!this.postgresDatabase && !PostgresAppInstance.isConnected()) {
            throw new DatabaseNotConnectedException();
        }

        const dataSource: DataSource | null = this.postgresDatabase
            ? this.postgresDatabase.getDataSource()
            : PostgresAppInstance.getDataSource();

        if (dataSource) {
            return dataSource.getRepository<TBaseModel>(this.modelType.name);
        }

        throw new DatabaseNotConnectedException();
    }

    protected isValid(data: TBaseModel): boolean {
        if (!data) {
            throw new BadDataException('Data cannot be null');
        }

        return true;
    }

    protected generateDefaultValues(data: TBaseModel): TBaseModel {
        const tableColumns: Array<string> = data.getTableColumns().columns;

        for (const column of tableColumns) {
            const metadata: TableColumnMetadata =
                data.getTableColumnMetadata(column);
            if (metadata.forceGetDefaultValueOnCreate) {
                (data as any)[column] = metadata.forceGetDefaultValueOnCreate();
            }
        }

        return data;
    }

    protected async checkForUniqueValues(
        data: TBaseModel
    ): Promise<TBaseModel> {
        const tableColumns: Array<string> = data.getTableColumns().columns;

        for (const columnName of tableColumns) {
            const metadata: TableColumnMetadata =
                data.getTableColumnMetadata(columnName);
            if (metadata.unique && data.getColumnValue(columnName)) {
                // check for unique values.
                const count: PositiveNumber = await this.countBy({
                    query: {
                        [columnName]: data.getColumnValue(columnName),
                    } as any,
                    props: {
                        isRoot: true,
                    },
                });

                if (count.toNumber() > 0) {
                    throw new BadDataException(
                        `${metadata.title} ${data
                            .getColumnValue(columnName)
                            ?.toString()} already exists. Please choose a different ${
                            metadata.title
                        }`
                    );
                }
            }
        }

        return data;
    }

    protected checkRequiredFields(data: TBaseModel): TBaseModel {
        // Check required fields.

        const relationalColumns: Dictionary<string> = {};

        const tableColumns: Array<string> = data.getTableColumns().columns;

        for (const column of tableColumns) {
            const metadata: TableColumnMetadata =
                data.getTableColumnMetadata(column);
            if (metadata.manyToOneRelationColumn) {
                relationalColumns[metadata.manyToOneRelationColumn] = column;
            }
        }

        for (const requiredField of data.getRequiredColumns().columns) {
            if (typeof (data as any)[requiredField] === Typeof.Boolean) {
                if (
                    !(data as any)[requiredField] &&
                    (data as any)[requiredField] !== false &&
                    !data.isDefaultValueColumn(requiredField)
                ) {
                    throw new BadDataException(`${requiredField} is required`);
                }
            } else if (
                !(data as any)[requiredField] &&
                !data.isDefaultValueColumn(requiredField)
            ) {
                const metadata: TableColumnMetadata =
                    data.getTableColumnMetadata(requiredField);

                if (
                    metadata &&
                    metadata.manyToOneRelationColumn &&
                    metadata.type === TableColumnType.Entity &&
                    data.getColumnValue(metadata.manyToOneRelationColumn)
                ) {
                    continue;
                }

                if (
                    relationalColumns[requiredField] &&
                    data.getColumnValue(
                        relationalColumns[requiredField] as string
                    )
                ) {
                    continue;
                }

                throw new BadDataException(`${requiredField} is required`);
            }
        }

        return data;
    }

    protected async onBeforeCreate(
        createBy: CreateBy<TBaseModel>
    ): Promise<OnCreate<TBaseModel>> {
        // A place holder method used for overriding.
        return Promise.resolve({
            createBy: createBy as CreateBy<TBaseModel>,
            carryForward: undefined,
        });
    }

    private async _onBeforeCreate(
        createBy: CreateBy<TBaseModel>
    ): Promise<OnCreate<TBaseModel>> {
        // Private method that runs before create.
        const projectIdColumn: string | null = this.model.getTenantColumn();

        if (projectIdColumn && createBy.props.tenantId) {
            (createBy.data as any)[projectIdColumn] = createBy.props.tenantId;
        }

        return await this.onBeforeCreate(createBy);
    }

    protected encrypt(data: TBaseModel): TBaseModel {
        const iv: Buffer = Encryption.getIV();
        (data as any)['iv'] = iv;

        for (const key of data.getEncryptedColumns().columns) {
            // If data is an object.
            if (typeof (data as any)[key] === Typeof.Object) {
                const dataObj: JSONObject = (data as any)[key] as JSONObject;

                for (const key in dataObj) {
                    dataObj[key] = Encryption.encrypt(
                        dataObj[key] as string,
                        iv
                    );
                }

                (data as any)[key] = dataObj;
            } else {
                //If its string or other type.
                (data as any)[key] = Encryption.encrypt(
                    (data as any)[key] as string,
                    iv
                );
            }
        }

        return data;
    }

    protected async hash(data: TBaseModel): Promise<TBaseModel> {
        const columns: Columns = data.getHashedColumns();

        for (const key of columns.columns) {
            if (
                data.hasValue(key) &&
                !(data.getValue(key) as HashedString).isValueHashed()
            ) {
                await ((data as any)[key] as HashedString).hashValue(
                    EncryptionSecret
                );
            }
        }

        return data;
    }

    protected decrypt(data: TBaseModel): TBaseModel {
        const iv: Buffer = (data as any)['iv'];

        for (const key of data.getEncryptedColumns().columns) {
            // If data is an object.
            if (typeof data.getValue(key) === Typeof.Object) {
                const dataObj: JSONObject = data.getValue(key) as JSONObject;

                for (const key in dataObj) {
                    dataObj[key] = Encryption.decrypt(
                        dataObj[key] as string,
                        iv
                    );
                }

                data.setValue(key, dataObj);
            } else {
                //If its string or other type.
                data.setValue(key, Encryption.decrypt((data as any)[key], iv));
            }
        }

        return data;
    }

    protected async onBeforeDelete(
        deleteBy: DeleteBy<TBaseModel>
    ): Promise<OnDelete<TBaseModel>> {
        // A place holder method used for overriding.
        return Promise.resolve({ deleteBy, carryForward: null });
    }

    protected async onBeforeUpdate(
        updateBy: UpdateBy<TBaseModel>
    ): Promise<OnUpdate<TBaseModel>> {
        // A place holder method used for overriding.
        return Promise.resolve({ updateBy, carryForward: null });
    }

    protected async onBeforeFind(
        findBy: FindBy<TBaseModel>
    ): Promise<OnFind<TBaseModel>> {
        // A place holder method used for overriding.
        return Promise.resolve({ findBy, carryForward: null });
    }

    protected async onCreateSuccess(
        _onCreate: OnCreate<TBaseModel>,
        createdItem: TBaseModel
    ): Promise<TBaseModel> {
        // A place holder method used for overriding.
        return Promise.resolve(createdItem);
    }

    protected async onCreateError(error: Exception): Promise<Exception> {
        // A place holder method used for overriding.
        return Promise.resolve(error);
    }

    protected async onUpdateSuccess(
        onUpdate: OnUpdate<TBaseModel>,
        _updatedItemIds: Array<ObjectID>
    ): Promise<OnUpdate<TBaseModel>> {
        // A place holder method used for overriding.
        return Promise.resolve(onUpdate);
    }

    protected async onUpdateError(error: Exception): Promise<Exception> {
        // A place holder method used for overriding.
        return Promise.resolve(error);
    }

    protected async onDeleteSuccess(
        onDelete: OnDelete<TBaseModel>,
        _itemIdsBeforeDelete: Array<ObjectID>
    ): Promise<OnDelete<TBaseModel>> {
        // A place holder method used for overriding.
        return Promise.resolve(onDelete);
    }

    protected async onDeleteError(error: Exception): Promise<Exception> {
        // A place holder method used for overriding.
        return Promise.resolve(error);
    }

    protected async onFindSuccess(
        onFind: OnFind<TBaseModel>,
        items: Array<TBaseModel>
    ): Promise<OnFind<TBaseModel>> {
        // A place holder method used for overriding.
        return Promise.resolve({ ...onFind, carryForward: items });
    }

    protected async onFindError(error: Exception): Promise<Exception> {
        // A place holder method used for overriding.
        return Promise.resolve(error);
    }

    protected async onCountSuccess(
        count: PositiveNumber
    ): Promise<PositiveNumber> {
        // A place holder method used for overriding.
        return Promise.resolve(count);
    }

    protected async onCountError(error: Exception): Promise<Exception> {
        // A place holder method used for overriding.
        return Promise.resolve(error);
    }

    protected async getException(error: Exception): Promise<void> {
        throw error;
    }

    private generateSlug(createBy: CreateBy<TBaseModel>): CreateBy<TBaseModel> {
        if (createBy.data.getSlugifyColumn()) {
            (createBy.data as any)[
                createBy.data.getSaveSlugToColumn() as string
            ] = Slug.getSlug(
                (createBy.data as any)[
                    createBy.data.getSlugifyColumn() as string
                ]
                    ? ((createBy.data as any)[
                          createBy.data.getSlugifyColumn() as string
                      ] as string)
                    : null
            );
        }

        return createBy;
    }

    private async sanitizeCreateOrUpdate(
        data: TBaseModel | QueryDeepPartialEntity<TBaseModel>,
        props: DatabaseCommonInteractionProps,
        isUpdate: boolean = false
    ): Promise<TBaseModel | QueryDeepPartialEntity<TBaseModel>> {
        data = this.checkMaxLengthOfFields(data as TBaseModel);

        const columns: Columns = this.model.getTableColumns();

        for (const columnName of columns.columns) {
            if (this.model.isEntityColumn(columnName)) {
                const tableColumnMetadata: TableColumnMetadata =
                    this.model.getTableColumnMetadata(columnName);

                const columnValue: JSONValue = (data as any)[columnName];

                if (
                    data &&
                    columnName &&
                    tableColumnMetadata.modelType &&
                    columnValue &&
                    tableColumnMetadata.type === TableColumnType.Entity &&
                    (typeof columnValue === 'string' ||
                        columnValue instanceof ObjectID)
                ) {
                    const relatedType: BaseModel =
                        new tableColumnMetadata.modelType();
                    relatedType._id = columnValue.toString();
                    (data as any)[columnName] = relatedType;
                }

                if (
                    data &&
                    Array.isArray(columnValue) &&
                    columnValue.length > 0 &&
                    tableColumnMetadata.modelType &&
                    columnValue &&
                    tableColumnMetadata.type === TableColumnType.EntityArray
                ) {
                    const itemsArray: Array<BaseModel> = [];
                    for (const item of columnValue) {
                        if (
                            typeof item === 'string' ||
                            item instanceof ObjectID
                        ) {
                            const basemodelItem: BaseModel =
                                new tableColumnMetadata.modelType();
                            basemodelItem._id = item.toString();
                            itemsArray.push(basemodelItem);
                        } else if (
                            item &&
                            typeof item === Typeof.Object &&
                            (item as JSONObject)['_id'] &&
                            typeof (item as JSONObject)['_id'] === Typeof.String
                        ) {
                            const basemodelItem: BaseModel =
                                new tableColumnMetadata.modelType();
                            basemodelItem._id = (
                                (item as JSONObject)['_id'] as string
                            ).toString();
                            itemsArray.push(basemodelItem);
                        } else if (item instanceof BaseModel) {
                            itemsArray.push(item);
                        }
                    }
                    (data as any)[columnName] = itemsArray;
                }
            }

            if (this.model.isHashedStringColumn(columnName)) {
                const columnValue: JSONValue = (data as any)[columnName];

                if (
                    data &&
                    columnName &&
                    columnValue &&
                    columnValue instanceof HashedString
                ) {
                    if (!columnValue.isValueHashed()) {
                        await columnValue.hashValue(EncryptionSecret);
                    }

                    (data as any)[columnName] = columnValue.toString();
                }
            }
        }

        // check createByUserId.

        if (!isUpdate && props.userId) {
            (data as any)['createdByUserId'] = props.userId;
        }

        return data;
    }

    public async onTrigger(
        id: ObjectID,
        projectId: ObjectID,
        triggerType: DatabaseTriggerType,
        miscData?: JSONObject | undefined // miscData is used for passing data to workflow.
    ): Promise<void> {
        if (this.getModel().enableWorkflowOn) {
            API.post(
                new URL(
                    Protocol.HTTP,
                    WorkflowHostname,
                    new Route(
                        `${WorkflowRoute.toString()}/model/${projectId.toString()}/${Text.pascalCaseToDashes(
                            this.getModel().tableName!
                        )}/${triggerType}`
                    )
                ),
                {
                    data: {
                        _id: id.toString(),
                        miscData: miscData,
                    },
                },
                {
                    ...ClusterKeyAuthorization.getClusterKeyHeaders(),
                }
            ).catch((error: Error) => {
                logger.error(error);
            });
        }
    }

    public async create(createBy: CreateBy<TBaseModel>): Promise<TBaseModel> {
        const onCreate: OnCreate<TBaseModel> = createBy.props.ignoreHooks
            ? { createBy, carryForward: [] }
            : await this._onBeforeCreate(createBy);

        let _createdBy: CreateBy<TBaseModel> = onCreate.createBy;

        const carryForward: any = onCreate.carryForward;

        _createdBy = this.generateSlug(_createdBy);

        let data: TBaseModel = _createdBy.data;

        // add tenantId if present.
        const tenantColumnName: string | null = data.getTenantColumn();

        if (tenantColumnName && _createdBy.props.tenantId) {
            data.setColumnValue(tenantColumnName, _createdBy.props.tenantId);
        }

        data = this.generateDefaultValues(data);

        data = this.checkRequiredFields(data);

        await this.checkForUniqueValues(data);

        if (!this.isValid(data)) {
            throw new BadDataException('Data is not valid');
        }

        // check total items by.

        await this.checkTotalItemsBy(_createdBy);

        // Encrypt data
        data = this.encrypt(data);

        // hash data
        data = await this.hash(data);

        ModelPermission.checkCreatePermissions(
            this.modelType,
            data,
            _createdBy.props
        );

        createBy.data = data;

        // check uniqueColumns by:
        createBy = await this.checkUniqueColumnBy(createBy);

        // serialize.
        createBy.data = (await this.sanitizeCreateOrUpdate(
            createBy.data,
            createBy.props
        )) as TBaseModel;

        try {
            createBy.data = await this.getRepository().save(createBy.data);

            if (!createBy.props.ignoreHooks) {
                createBy.data = await this.onCreateSuccess(
                    {
                        createBy,
                        carryForward,
                    },
                    createBy.data
                );
            }

            // hit workflow.;
            if (this.getModel().enableWorkflowOn?.create) {
                let tenantId: ObjectID | undefined = createBy.props.tenantId;

                if (!tenantId && this.getModel().getTenantColumn()) {
                    tenantId = createBy.data.getValue<ObjectID>(
                        this.getModel().getTenantColumn()!
                    );
                }

                if (tenantId) {
                    await this.onTrigger(
                        createBy.data.id!,
                        tenantId,
                        'on-create'
                    );
                }
            }

            return createBy.data;
        } catch (error) {
            await this.onCreateError(error as Exception);
            throw this.getException(error as Exception);
        }
    }

    private checkMaxLengthOfFields<TBaseModel extends BaseModel>(
        data: TBaseModel
    ): TBaseModel {
        // Check required fields.

        const tableColumns: Array<string> =
            this.model.getTableColumns().columns;

        for (const column of tableColumns) {
            const metadata: TableColumnMetadata =
                this.model.getTableColumnMetadata(column);
            if (
                (data as any)[column] &&
                metadata.type &&
                getMaxLengthFromTableColumnType(metadata.type)
            ) {
                if (
                    (data as any)[column].toString().length >
                    getMaxLengthFromTableColumnType(metadata.type)!
                ) {
                    throw new BadDataException(
                        `${column} length cannot be more than ${getMaxLengthFromTableColumnType(
                            metadata.type
                        )} characters`
                    );
                }
            }
        }

        return data;
    }

    private async checkTotalItemsBy(
        createdBy: CreateBy<TBaseModel>
    ): Promise<void> {
        const totalItemsColumnName: string | null =
            this.model.getTotalItemsByColumnName();
        const totalItemsNumber: number | null =
            this.model.getTotalItemsNumber();
        const errorMessage: string | null =
            this.model.getTotalItemsByErrorMessage();

        if (
            totalItemsColumnName &&
            totalItemsNumber &&
            errorMessage &&
            createdBy.data.getColumnValue(totalItemsColumnName)
        ) {
            const count: PositiveNumber = await this.countBy({
                query: {
                    [totalItemsColumnName]:
                        createdBy.data.getColumnValue(totalItemsColumnName),
                } as FindWhere<TBaseModel>,

                skip: 0,
                limit: LIMIT_MAX,
                props: {
                    isRoot: true,
                },
            });

            if (count.positiveNumber > totalItemsNumber - 1) {
                throw new BadDataException(errorMessage);
            }
        }
    }

    private async checkUniqueColumnBy(
        createBy: CreateBy<TBaseModel>
    ): Promise<CreateBy<TBaseModel>> {
        let existingItemsWithSameNameCount: number = 0;

        const uniqueColumnsBy: Dictionary<string | Array<string>> =
            getUniqueColumnsBy(createBy.data);

        for (const key in uniqueColumnsBy) {
            if (!uniqueColumnsBy[key]) {
                continue;
            }

            if (typeof uniqueColumnsBy[key] === Typeof.String) {
                uniqueColumnsBy[key] = [uniqueColumnsBy[key] as string];
            }

            const query: Query<TBaseModel> = {};

            for (const uniqueByColumnName of uniqueColumnsBy[
                key
            ] as Array<string>) {
                const columnValue: JSONValue = (createBy.data as any)[
                    uniqueByColumnName as string
                ];
                if (columnValue === null || columnValue === undefined) {
                    (query as any)[uniqueByColumnName] = QueryHelper.isNull();
                } else {
                    (query as any)[uniqueByColumnName] = columnValue;
                }
            }

            existingItemsWithSameNameCount = (
                await this.countBy({
                    query: {
                        [key]: QueryHelper.findWithSameText(
                            (createBy.data as any)[key]
                                ? ((createBy.data as any)[key]! as string)
                                : ''
                        ),
                        ...query,
                    },
                    props: {
                        isRoot: true,
                    },
                })
            ).toNumber();

            if (existingItemsWithSameNameCount > 0) {
                throw new BadDataException(
                    `${this.model.singularName} with the same ${key} already exists.`
                );
            }

            existingItemsWithSameNameCount = 0;
        }

        return Promise.resolve(createBy);
    }

    public async countBy({
        query,
        skip,
        limit,
        props,
        distinctOn,
    }: CountBy<TBaseModel>): Promise<PositiveNumber> {
        try {
            if (!skip) {
                skip = new PositiveNumber(0);
            }

            if (!limit) {
                limit = new PositiveNumber(Infinity);
            }

            if (!(skip instanceof PositiveNumber)) {
                skip = new PositiveNumber(skip);
            }

            if (!(limit instanceof PositiveNumber)) {
                limit = new PositiveNumber(limit);
            }

            const findBy: FindBy<TBaseModel> = {
                query,
                skip,
                limit,
                props,
            };

            const checkReadPermissionType: CheckReadPermissionType<TBaseModel> =
                await ModelPermission.checkReadPermission(
                    this.modelType,
                    query,
                    null,
                    props
                );

            findBy.query = checkReadPermissionType.query;
            let count: number = 0;

            if (distinctOn) {
                const queryBuilder: SelectQueryBuilder<TBaseModel> =
                    this.getQueryBuilder(this.modelName)
                        .where(findBy.query)
                        .skip(skip.toNumber())
                        .take(limit.toNumber());

                if (distinctOn) {
                    queryBuilder.groupBy(`${this.modelName}.${distinctOn}`);
                }

                count = await queryBuilder.getCount();
            } else {
                count = await this.getRepository().count({
                    where: findBy.query as any,
                    skip: (findBy.skip as PositiveNumber).toNumber(),
                    take: (findBy.limit as PositiveNumber).toNumber(),
                });
            }

            let countPositive: PositiveNumber = new PositiveNumber(count);
            countPositive = await this.onCountSuccess(countPositive);
            return countPositive;
        } catch (error) {
            await this.onCountError(error as Exception);
            throw this.getException(error as Exception);
        }
    }

    public async deleteOneBy(
        deleteOneBy: DeleteOneBy<TBaseModel>
    ): Promise<number> {
        return await this._deleteBy({ ...deleteOneBy, limit: 1, skip: 0 });
    }

    public async deleteBy(deleteBy: DeleteBy<TBaseModel>): Promise<number> {
        return await this._deleteBy(deleteBy);
    }

    public async hardDeleteBy(deleteBy: DeleteBy<TBaseModel>): Promise<number> {
        try {
            const onDelete: OnDelete<TBaseModel> = deleteBy.props.ignoreHooks
                ? { deleteBy, carryForward: [] }
                : await this.onBeforeDelete(deleteBy);
            const beforeDeleteBy: DeleteBy<TBaseModel> = onDelete.deleteBy;

            beforeDeleteBy.query = await ModelPermission.checkDeletePermission(
                this.modelType,
                beforeDeleteBy.query,
                deleteBy.props
            );

            if (!(beforeDeleteBy.skip instanceof PositiveNumber)) {
                beforeDeleteBy.skip = new PositiveNumber(beforeDeleteBy.skip);
            }

            if (!(beforeDeleteBy.limit instanceof PositiveNumber)) {
                beforeDeleteBy.limit = new PositiveNumber(beforeDeleteBy.limit);
            }

            const items: Array<TBaseModel> = await this._findBy(
                {
                    query: beforeDeleteBy.query,
                    skip: beforeDeleteBy.skip.toNumber(),
                    limit: beforeDeleteBy.limit.toNumber(),
                    select: {},
                    props: { ...beforeDeleteBy.props, ignoreHooks: true },
                },
                true
            );

            let numberOfDocsAffected: number = 0;

            if (items.length > 0) {
                beforeDeleteBy.query = {
                    ...beforeDeleteBy.query,
                    _id: QueryHelper.in(
                        items.map((i: TBaseModel) => {
                            return i.id!;
                        })
                    ),
                };

                numberOfDocsAffected =
                    (
                        await this.getRepository().delete(
                            beforeDeleteBy.query as any
                        )
                    ).affected || 0;
            }

            return numberOfDocsAffected;
        } catch (error) {
            await this.onDeleteError(error as Exception);
            throw this.getException(error as Exception);
        }
    }

    private async _deleteBy(deleteBy: DeleteBy<TBaseModel>): Promise<number> {
        try {
            if (this.doNotAllowDelete && !deleteBy.props.isRoot) {
                throw new BadDataException('Delete not allowed');
            }

            const onDelete: OnDelete<TBaseModel> = deleteBy.props.ignoreHooks
                ? { deleteBy, carryForward: [] }
                : await this.onBeforeDelete(deleteBy);

            const beforeDeleteBy: DeleteBy<TBaseModel> = onDelete.deleteBy;

            const carryForward: any = onDelete.carryForward;

            beforeDeleteBy.query = await ModelPermission.checkDeletePermission(
                this.modelType,
                beforeDeleteBy.query,
                deleteBy.props
            );

            if (!(beforeDeleteBy.skip instanceof PositiveNumber)) {
                beforeDeleteBy.skip = new PositiveNumber(beforeDeleteBy.skip);
            }

            if (!(beforeDeleteBy.limit instanceof PositiveNumber)) {
                beforeDeleteBy.limit = new PositiveNumber(beforeDeleteBy.limit);
            }

            const select: Select<TBaseModel> = {};

            if (this.getModel().getTenantColumn()) {
                (select as any)[this.getModel().getTenantColumn() as string] =
                    true;
            }

            const items: Array<TBaseModel> = await this._findBy({
                query: beforeDeleteBy.query,
                skip: beforeDeleteBy.skip.toNumber(),
                limit: beforeDeleteBy.limit.toNumber(),
                select: select,
                props: { ...beforeDeleteBy.props, ignoreHooks: true },
            });

            await this._updateBy({
                query: deleteBy.query,
                data: {
                    deletedByUserId: deleteBy.props.userId,
                } as any,
                limit: deleteBy.limit,
                skip: deleteBy.skip,
                props: {
                    isRoot: true,
                    ignoreHooks: true,
                },
            });

            let numberOfDocsAffected: number = 0;

            if (items.length > 0) {
                beforeDeleteBy.query = {
                    ...beforeDeleteBy.query,
                    _id: QueryHelper.in(
                        items.map((i: TBaseModel) => {
                            return i.id!;
                        })
                    ),
                };

                numberOfDocsAffected =
                    (
                        await this.getRepository().delete(
                            beforeDeleteBy.query as any
                        )
                    ).affected || 0;
            }

            // hit workflow.
            if (
                this.getModel().enableWorkflowOn?.delete &&
                (deleteBy.props.tenantId || this.getModel().getTenantColumn())
            ) {
                for (const item of items) {
                    if (this.getModel().enableWorkflowOn?.create) {
                        let tenantId: ObjectID | undefined =
                            deleteBy.props.tenantId;

                        if (!tenantId && this.getModel().getTenantColumn()) {
                            tenantId = item.getValue<ObjectID>(
                                this.getModel().getTenantColumn()!
                            );
                        }

                        if (tenantId) {
                            await this.onTrigger(
                                item.id!,
                                tenantId,
                                'on-delete'
                            );
                        }
                    }
                }
            }

            if (!deleteBy.props.ignoreHooks) {
                await this.onDeleteSuccess(
                    { deleteBy, carryForward },
                    items.map((i: TBaseModel) => {
                        return new ObjectID(i._id!);
                    })
                );
            }

            return numberOfDocsAffected;
        } catch (error) {
            await this.onDeleteError(error as Exception);
            throw this.getException(error as Exception);
        }
    }

    public async findBy(
        findBy: FindBy<TBaseModel>
    ): Promise<Array<TBaseModel>> {
        return await this._findBy(findBy);
    }

    private async _findBy(
        findBy: FindBy<TBaseModel>,
        withDeleted?: boolean | undefined
    ): Promise<Array<TBaseModel>> {
        try {
            let automaticallyAddedCreatedAtInSelect: boolean = false;

            if (!findBy.sort || Object.keys(findBy.sort).length === 0) {
                findBy.sort = {
                    createdAt: SortOrder.Descending,
                };

                if (!findBy.select) {
                    findBy.select = {} as any;
                }

                if (!(findBy.select as any)['createdAt']) {
                    (findBy.select as any)['createdAt'] = true;
                    automaticallyAddedCreatedAtInSelect = true;
                }
            }

            const onFind: OnFind<TBaseModel> = findBy.props.ignoreHooks
                ? { findBy, carryForward: [] }
                : await this.onBeforeFind(findBy);
            const onBeforeFind: FindBy<TBaseModel> = { ...onFind.findBy };
            const carryForward: any = onFind.carryForward;

            if (
                !onBeforeFind.select ||
                Object.keys(onBeforeFind.select).length === 0
            ) {
                onBeforeFind.select = {} as any;
            }

            if (!(onBeforeFind.select as any)['_id']) {
                (onBeforeFind.select as any)['_id'] = true;
            }

            const result: {
                query: Query<TBaseModel>;
                select: Select<TBaseModel> | null;
                relationSelect: RelationSelect<TBaseModel> | null;
            } = await ModelPermission.checkReadPermission(
                this.modelType,
                onBeforeFind.query,
                onBeforeFind.select || null,
                onBeforeFind.props
            );

            onBeforeFind.query = result.query;
            onBeforeFind.select = result.select || undefined;

            if (!(onBeforeFind.skip instanceof PositiveNumber)) {
                onBeforeFind.skip = new PositiveNumber(onBeforeFind.skip);
            }

            if (!(onBeforeFind.limit instanceof PositiveNumber)) {
                onBeforeFind.limit = new PositiveNumber(onBeforeFind.limit);
            }

            const items: Array<TBaseModel> = await this.getRepository().find({
                skip: onBeforeFind.skip.toNumber(),
                take: onBeforeFind.limit.toNumber(),
                where: onBeforeFind.query as any,
                order: onBeforeFind.sort as any,
                relations: result.relationSelect as any,
                select: onBeforeFind.select as any,
                withDeleted: withDeleted || false,
            });

            let decryptedItems: Array<TBaseModel> = [];

            for (const item of items) {
                decryptedItems.push(this.decrypt(item));
            }

            decryptedItems = this.sanitizeFindByItems(
                decryptedItems,
                onBeforeFind
            );

            for (const item of decryptedItems) {
                if (automaticallyAddedCreatedAtInSelect) {
                    delete (item as any).createdAt;
                }
            }

            if (!findBy.props.ignoreHooks) {
                decryptedItems = await (
                    await this.onFindSuccess(
                        { findBy, carryForward },
                        decryptedItems
                    )
                ).carryForward;
            }

            return decryptedItems;
        } catch (error) {
            await this.onFindError(error as Exception);
            throw this.getException(error as Exception);
        }
    }

    private sanitizeFindByItems(
        items: Array<TBaseModel>,
        findBy: FindBy<TBaseModel>
    ): Array<TBaseModel> {
        // if there's no select then there's nothing to do.
        if (!findBy.select) {
            return items;
        }

        for (const key in findBy.select) {
            // for each key in select check if there's nested properties, this indicates there's a relation.
            if (typeof findBy.select[key] === Typeof.Object) {
                // get meta data to check if this column is an entity array.
                const tableColumnMetadata: TableColumnMetadata =
                    this.model.getTableColumnMetadata(key);

                if (!tableColumnMetadata.modelType) {
                    throw new BadDataException(
                        'Select not supported on ' +
                            key +
                            ' of ' +
                            this.model.singularName +
                            ' because this column modelType is not found.'
                    );
                }

                const relatedModel: BaseModel =
                    new tableColumnMetadata.modelType();
                if (tableColumnMetadata.type === TableColumnType.EntityArray) {
                    const tableColumns: Array<string> =
                        relatedModel.getTableColumns().columns;
                    const columnsToKeep: Array<string> = Object.keys(
                        (findBy.select as any)[key]
                    );

                    for (const item of items) {
                        if (item[key] && Array.isArray(item[key])) {
                            const relatedArray: Array<BaseModel> = item[
                                key
                            ] as any;
                            const newArray: Array<BaseModel> = [];
                            // now we need to sanitize data.

                            for (const relatedArrayItem of relatedArray) {
                                for (const column of tableColumns) {
                                    if (!columnsToKeep.includes(column)) {
                                        (relatedArrayItem as any)[column] =
                                            undefined;
                                    }
                                }
                                newArray.push(relatedArrayItem);
                            }

                            (item[key] as any) = newArray;
                        }
                    }
                }
            }
        }

        return items;
    }

    public async findOneBy(
        findOneBy: FindOneBy<TBaseModel>
    ): Promise<TBaseModel | null> {
        const findBy: FindBy<TBaseModel> = findOneBy as FindBy<TBaseModel>;
        findBy.limit = new PositiveNumber(1);
        findBy.skip = new PositiveNumber(0);

        const documents: Array<TBaseModel> = await this._findBy(findBy);

        if (documents && documents[0]) {
            return documents[0];
        }
        return null;
    }

    public async findOneById(
        findOneById: FindOneByID<TBaseModel>
    ): Promise<TBaseModel | null> {
        if (!findOneById.id) {
            throw new BadDataException('findOneById.id is required');
        }

        return await this.findOneBy({
            query: {
                _id: findOneById.id.toString() as any,
            },
            select: findOneById.select || {},
            props: findOneById.props,
        });
    }

    private async _updateBy(updateBy: UpdateBy<TBaseModel>): Promise<number> {
        try {
            const onUpdate: OnUpdate<TBaseModel> = updateBy.props.ignoreHooks
                ? { updateBy, carryForward: [] }
                : await this.onBeforeUpdate(updateBy);

            const beforeUpdateBy: UpdateBy<TBaseModel> = onUpdate.updateBy;
            const carryForward: any = onUpdate.carryForward;

            beforeUpdateBy.query = await ModelPermission.checkUpdatePermissions(
                this.modelType,
                beforeUpdateBy.query,
                beforeUpdateBy.data,
                beforeUpdateBy.props
            );

            const data: QueryDeepPartialEntity<TBaseModel> =
                (await this.sanitizeCreateOrUpdate(
                    beforeUpdateBy.data,
                    updateBy.props,
                    true
                )) as QueryDeepPartialEntity<TBaseModel>;

            if (!(updateBy.skip instanceof PositiveNumber)) {
                updateBy.skip = new PositiveNumber(updateBy.skip);
            }

            if (!(updateBy.limit instanceof PositiveNumber)) {
                updateBy.limit = new PositiveNumber(updateBy.limit);
            }

            const select: Select<TBaseModel> = {};

            if (this.getModel().getTenantColumn()) {
                (select as any)[this.getModel().getTenantColumn() as string] =
                    true;
            }

            const selectColumns: Select<TBaseModel> = {
                _id: true,
            };

            if (this.getModel().getTenantColumn()) {
                (selectColumns as any)[
                    this.getModel().getTenantColumn()!.toString()
                ] = true;
            }

            const items: Array<TBaseModel> = await this._findBy({
                query: beforeUpdateBy.query,
                skip: updateBy.skip.toNumber(),
                limit: updateBy.limit.toNumber(),
                select: selectColumns,
                props: { ...beforeUpdateBy.props, ignoreHooks: true },
            });

            for (const item of items) {
                const updatedItem: any = {
                    _id: item._id!,
                    ...data,
                } as any;

                await this.getRepository().save(updatedItem);

                // hit workflow.
                if (this.getModel().enableWorkflowOn?.update) {
                    let tenantId: ObjectID | undefined =
                        updateBy.props.tenantId;

                    if (!tenantId && this.getModel().getTenantColumn()) {
                        tenantId = item.getValue<ObjectID>(
                            this.getModel().getTenantColumn()!
                        );
                    }

                    if (tenantId) {
                        await this.onTrigger(item.id!, tenantId, 'on-update', {
                            updatedFields: JSONFunctions.serialize(
                                data as JSONObject
                            ),
                        });
                    }
                }
            }

            // Cant Update relations.
            // https://github.com/typeorm/typeorm/issues/2821

            // const numberOfDocsAffected: number =
            //     (
            //         await this.getRepository().update(
            //             query as any,
            //             data
            //         )
            //     ).affected || 0;

            if (!updateBy.props.ignoreHooks) {
                await this.onUpdateSuccess(
                    { updateBy, carryForward },
                    items.map((i: TBaseModel) => {
                        return new ObjectID(i._id!);
                    })
                );
            }

            return items.length;
        } catch (error) {
            await this.onUpdateError(error as Exception);
            throw this.getException(error as Exception);
        }
    }

    public async updateOneBy(
        updateOneBy: UpdateOneBy<TBaseModel>
    ): Promise<number> {
        return await this._updateBy({ ...updateOneBy, limit: 1, skip: 0 });
    }

    public async updateBy(updateBy: UpdateBy<TBaseModel>): Promise<number> {
        return await this._updateBy(updateBy);
    }

    public async updateOneById(
        updateById: UpdateByID<TBaseModel>
    ): Promise<void> {
        if (!updateById.id) {
            throw new BadDataException('updateById.id is required');
        }

        await this.updateOneBy({
            query: {
                _id: updateById.id.toString() as any,
            },
            data: updateById.data as any,
            props: updateById.props,
        });
    }

    public async updateOneByIdAndFetch(
        updateById: UpdateByIDAndFetch<TBaseModel>
    ): Promise<TBaseModel | null> {
        await this.updateOneById(updateById);
        return this.findOneById({
            id: updateById.id,
            select: updateById.select,
            props: updateById.props,
        });
    }

    public async searchBy({
        skip,
        limit,
        select,
        props,
    }: SearchBy<TBaseModel>): Promise<SearchResult<TBaseModel>> {
        const query: Query<TBaseModel> = {};

        // query[column] = RegExp(`^${text}`, 'i');

        const [items, count]: [Array<TBaseModel>, PositiveNumber] =
            await Promise.all([
                this.findBy({
                    query,
                    skip,
                    limit,
                    select,
                    props: props,
                }),
                this.countBy({
                    query,
                    skip: new PositiveNumber(0),
                    limit: new PositiveNumber(Infinity),
                    props: props,
                }),
            ]);

        return { items, count };
    }
}

export default DatabaseService;
