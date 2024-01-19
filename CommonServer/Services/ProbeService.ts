import PostgresDatabase from '../Infrastructure/PostgresDatabase';
import Model from 'Model/Models/Probe';
import DatabaseService from './DatabaseService';
import { OnCreate } from '../Types/Database/Hooks';
import ObjectID from 'Common/Types/ObjectID';
import Version from 'Common/Types/Version';
import CreateBy from '../Types/Database/CreateBy';

export class Service extends DatabaseService<Model> {
    public constructor(postgresDatabase?: PostgresDatabase) {
        super(Model, postgresDatabase);
    }

    protected override async onBeforeCreate(
        createBy: CreateBy<Model>
    ): Promise<OnCreate<Model>> {
        if (!createBy.data.key) {
            createBy.data.key = ObjectID.generate().toString();
        }

        if (!createBy.data.probeVersion) {
            createBy.data.probeVersion = new Version('1.0.0');
        }

        return { createBy: createBy, carryForward: [] };
    }
}

export default new Service();
