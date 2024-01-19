import '../../TestingUtils/Init';
import AnalyticsBaseModel from 'Common/AnalyticsModels/BaseModel';
import AnalyticsTableColumn from 'Common/Types/AnalyticsDatabase/TableColumn';
import TableColumnType from 'Common/Types/AnalyticsDatabase/TableColumnType';
import StatementGenerator from '../../../Utils/AnalyticsDatabase/StatementGenerator';
import { ClickhouseAppInstance } from '../../../Infrastructure/ClickhouseDatabase';
import Route from 'Common/Types/API/Route';
import { SQL, Statement } from '../../../Utils/AnalyticsDatabase/Statement';
import UpdateBy from '../../../Types/AnalyticsDatabase/UpdateBy';
import logger from '../../../Utils/Logger';
import NestedModel from 'Common/AnalyticsModels/NestedModel';
import AnalyticsTableEngine from 'Common/Types/AnalyticsDatabase/AnalyticsTableEngine';
import OneUptimeDate from 'Common/Types/Date';

function expectStatement(actual: Statement, expected: Statement): void {
    expect(actual.query).toBe(expected.query);
    expect(actual.query_params).toStrictEqual(expected.query_params);
}

describe('StatementGenerator', () => {
    class TestModel extends AnalyticsBaseModel {
        public constructor() {
            super({
                tableName: '<table-name>',
                singularName: '<singular-name>',
                pluralName: '<plural-name>',
                tableColumns: [
                    new AnalyticsTableColumn({
                        key: `column_ObjectID`,
                        title: '<title>',
                        description: '<description>',
                        required: true,
                        type: TableColumnType.ObjectID,
                    }),
                    new AnalyticsTableColumn({
                        key: `column_1`,
                        title: '<title>',
                        description: '<description>',
                        required: false,
                        type: TableColumnType.Text,
                    }),
                    new AnalyticsTableColumn({
                        key: `column_2`,
                        title: '<title>',
                        description: '<description>',
                        required: false,
                        type: TableColumnType.Number,
                    }),
                ],
                crudApiPath: new Route('route'),
                primaryKeys: ['column_ObjectID'],
                tableEngine: AnalyticsTableEngine.MergeTree,
            });
        }
    }

    let generator: StatementGenerator<TestModel>;
    beforeEach(async () => {
        generator = new StatementGenerator<TestModel>({
            modelType: TestModel,
            database: ClickhouseAppInstance,
        });
    });

    describe('toUpdateStatement', () => {
        let updateBy: UpdateBy<TestModel>;
        beforeEach(() => {
            updateBy = {
                data: new TestModel(),
                query: '<query>' as {},
                props: '<props>' as {},
            };
            generator.toSetStatement = jest.fn(() => {
                return SQL`<set-statement>`;
            });
            generator.toWhereStatement = jest.fn(() => {
                return SQL`<where-statement>`;
            });
            jest.spyOn(logger, 'info').mockImplementation(() => {
                return undefined!;
            });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('should return ALTER TABLE UPDATE statement', () => {
            const statement: Statement = generator.toUpdateStatement(updateBy);

            expect(generator.toSetStatement).toBeCalledWith(updateBy.data);
            expect(generator.toWhereStatement).toBeCalledWith('<query>');

            expect(jest.mocked(logger.info)).toHaveBeenCalledTimes(2);
            expect(jest.mocked(logger.info)).toHaveBeenNthCalledWith(
                1,
                '<table-name> Update Statement'
            );
            expect(jest.mocked(logger.info)).toHaveBeenNthCalledWith(
                2,
                statement
            );

            /* eslint-disable prettier/prettier */
            expectStatement(statement, SQL`
                ALTER TABLE ${'oneuptime'}.${'<table-name>'}
                UPDATE <set-statement>
                WHERE TRUE <where-statement>
            `);
            /* eslint-enable prettier/prettier */
        });
    });

    describe('toSetStatement', () => {
        let model: TestModel;
        beforeEach(() => {
            model = new TestModel();
        });

        test('should return the contents of a SET statement', () => {
            model.setColumnValue('column_1', '<value>');
            const statement: Statement = generator.toSetStatement(model);
            expect(statement.query).toBe('column_1 = {p0:String}');
            expect(statement.query_params).toStrictEqual({
                p0: '<value>',
            });
        });

        test('should set multiple columns', () => {
            model.setColumnValue('column_1', '<value>');
            model.setColumnValue('column_2', 123);
            const statement: Statement = generator.toSetStatement(model);
            expect(statement.query).toBe(
                'column_1 = {p0:String}, column_2 = {p1:Int32}'
            );
            expect(statement.query_params).toStrictEqual({
                p0: '<value>',
                p1: 123,
            });
        });

        test('should set column to NULL', () => {
            model.setColumnValue('column_1', null);
            const statement: Statement = generator.toSetStatement(model);
            expect(statement.query).toBe('column_1 = {p0:String}');
            expect(statement.query_params).toStrictEqual({
                p0: null,
            });
        });
    });

    describe('toWhereStatement', () => {
        test('should return the contents of a WHERE statement', () => {
            const statement: Statement = generator.toWhereStatement({
                _id: '<value>',
            });
            expect(statement.query).toBe('AND {p0:Identifier} = {p1:String}');
            expect(statement.query_params).toStrictEqual({
                p0: '_id',
                p1: '<value>',
            });
        });

        test('should check multiple columns', () => {
            const date: Date = new Date(9876543210);

            const statement: Statement = generator.toWhereStatement({
                _id: '<value>',
                updatedAt: date,
            });
            expect(statement.query).toBe(
                'AND {p0:Identifier} = {p1:String} AND {p2:Identifier} = {p3:DateTime}'
            );
            expect(statement.query_params).toStrictEqual({
                p0: '_id',
                p1: '<value>',
                p2: 'updatedAt',
                p3: OneUptimeDate.toDatabaseDate(date),
            });
        });
    });

    describe('toSelectStatement', () => {
        test('should return the contents of a SELECT statement', () => {
            const { statement, columns } = generator.toSelectStatement({
                _id: true,
            });
            expect(statement.query).toBe('{p0:Identifier}');
            expect(statement.query_params).toStrictEqual({
                p0: '_id',
            });
            expect(columns).toStrictEqual(['_id']);
        });

        test('should SELECT multiple columns', () => {
            const { statement, columns } = generator.toSelectStatement({
                _id: true,
                createdAt: false,
                updatedAt: true,
            });
            expect(statement.query).toBe('{p0:Identifier}, {p1:Identifier}');
            expect(statement.query_params).toStrictEqual({
                p0: '_id',
                p1: 'updatedAt',
            });
            expect(columns).toStrictEqual(['_id', 'updatedAt']);
        });
    });

    describe('toColumnsCreateStatement', () => {
        test('should return the columns of a CREATE TABLE statement', () => {
            const statement: Statement = generator.toColumnsCreateStatement([
                new AnalyticsTableColumn({
                    key: 'column_1',
                    title: '<title>',
                    description: '<description>',
                    required: true,
                    type: TableColumnType.Text,
                }),
                new AnalyticsTableColumn({
                    key: 'column_2',
                    title: '<title>',
                    description: '<description>',
                    required: false,
                    type: TableColumnType.Number,
                }),
            ]);

            /* eslint-disable prettier/prettier */
            expectStatement(statement, SQL`
                column_1 String NOT NULL,
                column_2 Int32 NULL
            `);
            /* eslint-enable prettier/prettier */
        });

        test('should support nested models', () => {
            class TestNestedModel extends NestedModel {
                public constructor() {
                    super({
                        tableColumns: [
                            new AnalyticsTableColumn({
                                key: 'nested_column_1',
                                title: '<title>',
                                description: '<description>',
                                required: true,
                                type: TableColumnType.Text,
                            }),
                            new AnalyticsTableColumn({
                                key: 'nested_column_2',
                                title: '<title>',
                                description: '<description>',
                                required: false,
                                type: TableColumnType.Number,
                            }),
                        ],
                    });
                }
            }

            const statement: Statement = generator.toColumnsCreateStatement([
                new AnalyticsTableColumn({
                    key: 'column_1',
                    title: '<title>',
                    description: '<description>',
                    required: true,
                    type: TableColumnType.Text,
                }),
                new AnalyticsTableColumn({
                    key: 'column_2',
                    title: '<title>',
                    description: '<description>',
                    required: false,
                    type: TableColumnType.NestedModel,
                    nestedModelType: TestNestedModel,
                }),
            ]);

            /* eslint-disable prettier/prettier */
            expectStatement(statement, SQL`
                column_1 String NOT NULL,
                column_2 Nested (
                    nested_column_1 String,
                    nested_column_2 Int32
                )
            `);
            /* eslint-enable prettier/prettier */
        });

        test('should not add NULL|NOT NULL to Array types', () => {
            const statement: Statement = generator.toColumnsCreateStatement([
                new AnalyticsTableColumn({
                    key: 'column_1',
                    title: '<title>',
                    description: '<description>',
                    required: true,
                    type: TableColumnType.ArrayText,
                }),
                new AnalyticsTableColumn({
                    key: 'column_2',
                    title: '<title>',
                    description: '<description>',
                    required: false,
                    type: TableColumnType.ArrayNumber,
                }),
            ]);

            /* eslint-disable prettier/prettier */
            expectStatement(statement, SQL`
                column_1 Array(String),
                column_2 Array(Int32)
            `);
            /* eslint-enable prettier/prettier */
        });
    });

    describe('toTableCreateStatement', () => {
        beforeEach(() => {
            generator.toColumnsCreateStatement = jest.fn(() => {
                return SQL`                <columns-create-statement>`;
            });
            jest.spyOn(logger, 'info').mockImplementation(() => {
                return undefined!;
            });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('should return CREATE TABLE statement', () => {
            const statement: Statement = generator.toTableCreateStatement();

            expect(generator.toColumnsCreateStatement).toBeCalledWith(
                generator.model.tableColumns
            );

            expect(jest.mocked(logger.info)).toHaveBeenCalledTimes(2);
            expect(jest.mocked(logger.info)).toHaveBeenNthCalledWith(
                1,
                '<table-name> Table Create Statement'
            );
            expect(jest.mocked(logger.info)).toHaveBeenNthCalledWith(
                2,
                statement
            );

            /* eslint-disable prettier/prettier */
            const expectedStatement: Statement = SQL`
                CREATE TABLE IF NOT EXISTS ${'oneuptime'}.${'<table-name>'}
                (
                    <columns-create-statement>
                )
                ENGINE = MergeTree
                PRIMARY KEY (${'column_ObjectID'})
            `;
            /* eslint-enable prettier/prettier */

            expect(statement.query).toBe(expectedStatement.query);
            expect(statement.query_params).toStrictEqual(
                expectedStatement.query_params
            );
        });
    });
});
