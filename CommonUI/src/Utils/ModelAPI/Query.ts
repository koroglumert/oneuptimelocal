import BaseModel from 'Common/Models/BaseModel';
import CompareBase from 'Common/Types/Database/CompareBase';
import InBetween from 'Common/Types/BaseDatabase/InBetween';
import NotNull from 'Common/Types/BaseDatabase/NotNull';
import Search from 'Common/Types/BaseDatabase/Search';
import { JSONObject, JSONValue } from 'Common/Types/JSON';

type Query<TBaseModel extends BaseModel | JSONObject> = {
    [P in keyof TBaseModel]?:
        | JSONValue
        | Search
        | InBetween
        | NotNull
        | CompareBase;
};

export default Query;
