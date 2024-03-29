import BaseModel from 'Common/Models/BaseModel';
import UpdateByID from './UpdateByID';
import Select from './Select';

export default interface UpdateByIDAndFetch<TBaseModel extends BaseModel>
    extends UpdateByID<TBaseModel> {
    select?: Select<TBaseModel> | undefined;
}
