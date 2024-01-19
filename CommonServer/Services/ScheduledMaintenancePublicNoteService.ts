import PostgresDatabase from '../Infrastructure/PostgresDatabase';
import Model from 'Model/Models/ScheduledMaintenancePublicNote';
import DatabaseService from './DatabaseService';
import OneUptimeDate from 'Common/Types/Date';
import { OnCreate } from '../Types/Database/Hooks';
import CreateBy from '../Types/Database/CreateBy';

export class Service extends DatabaseService<Model> {
    public constructor(postgresDatabase?: PostgresDatabase) {
        super(Model, postgresDatabase);
    }

    protected override async onBeforeCreate(
        createBy: CreateBy<Model>
    ): Promise<OnCreate<Model>> {
        if (!createBy.data.postedAt) {
            createBy.data.postedAt = OneUptimeDate.getCurrentDate();
        }

        return {
            createBy: createBy,
            carryForward: null,
        };
    }
}

export default new Service();
