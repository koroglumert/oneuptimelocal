import BaseModel from 'Common/Models/BaseModel';
import DatabaseService from '../../../../Services/DatabaseService';
import OnTriggerBaseModel from './OnTriggerBaseModel';

export default class OnUpdateBaseModel<
    TBaseModel extends BaseModel
> extends OnTriggerBaseModel<TBaseModel> {
    public constructor(modelService: DatabaseService<TBaseModel>) {
        super(modelService, 'on-update');
    }
}
