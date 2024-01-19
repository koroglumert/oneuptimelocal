import { DataSource, DataSourceOptions } from 'typeorm';
import {
    DatabaseHost,
    DatabaseName,
    DatabasePassword,
    DatabasePort,
    DatabaseUsername,
    DatabaseSslCa,
    DatabaseSslKey,
    DatabaseSslCert,
    DatabaseRejectUnauthorized,
    ShouldDatabaseSslEnable,
    Env,
} from '../EnvironmentConfig';
import Entities from 'Model/Models/Index';
import Migrations from 'Model/Migrations/Index';
import DatabaseType from 'Common/Types/DatabaseType';
import AppEnvironment from 'Common/Types/AppEnvironment';
import Faker from 'Common/Utils/Faker';

export const dataSourceOptions: DataSourceOptions = {
    type: DatabaseType.Postgres,
    host: DatabaseHost.toString(),
    port: DatabasePort.toNumber(),
    username: DatabaseUsername,
    password: DatabasePassword,
    database: DatabaseName,
    migrationsTableName: 'migrations',
    migrations: Migrations,
    entities: Entities,
    ssl: ShouldDatabaseSslEnable
        ? {
              rejectUnauthorized: DatabaseRejectUnauthorized,
              ca: DatabaseSslCa,
              key: DatabaseSslKey,
              cert: DatabaseSslCert,
          }
        : false,
    // logging: 'all',
    // synchronize: Env === AppEnvironment.Development,
    synchronize: true,
};

export const datasource: DataSource = new DataSource(dataSourceOptions);

export const testDataSourceOptions: DataSourceOptions = {
    type: DatabaseType.Postgres,
    host: DatabaseHost.toString(),
    port: DatabasePort.toNumber(),
    username: DatabaseUsername,
    password: DatabasePassword,
    database: DatabaseName + Faker.randomNumbers(16),
    entities: Entities,
    synchronize:
        Env === AppEnvironment.Test || Env === AppEnvironment.Development,
};
