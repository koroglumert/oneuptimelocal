import ObjectID from './ObjectID';
import Version from './Version';
import Email from './Email';
import Phone from './Phone';
import Color from './Color';
import Route from './API/Route';
import URL from './API/URL';
import Name from './Name';
import Permission from './Permission';
import Search from './BaseDatabase/Search';
import Port from './Port';
import Hostname from './API/Hostname';
import HashedString from './HashedString';
import GreaterThan from './BaseDatabase/GreaterThan';
import GreaterThanOrEqual from './BaseDatabase/GreaterThanOrEqual';
import LessThan from './BaseDatabase/LessThan';
import LessThanOrEqual from './BaseDatabase/LessThanOrEqual';
import InBetween from './BaseDatabase/InBetween';
import Domain from './Domain';
import NotNull from './BaseDatabase/NotNull';
import { BaseEntity } from 'typeorm';
import EqualToOrNull from './BaseDatabase/EqualToOrNull';
import NotEqual from './BaseDatabase/NotEqual';
import { CheckOn, FilterType } from './Monitor/CriteriaFilter';
import CallRequest from './Call/CallRequest';
import PositiveNumber from './PositiveNumber';
import StartAndEndTime from './Time/StartAndEndTime';

export enum ObjectType {
    ObjectID = 'ObjectID',
    Decimal = 'Decimal',
    Name = 'Name',
    EqualToOrNull = 'EqualToOrNull',
    MonitorSteps = 'MonitorSteps',
    MonitorStep = 'MonitorStep',
    Recurring = 'Recurring',
    RestrictionTimes = 'RestrictionTimes',
    MonitorCriteria = 'MonitorCriteria',
    PositiveNumber = 'PositiveNumber',
    MonitorCriteriaInstance = 'MonitorCriteriaInstance',
    NotEqual = 'NotEqual',
    Email = 'Email',
    Phone = 'Phone',
    Color = 'Color',
    Domain = 'Domain',
    Version = 'Version',
    IP = 'IP',
    Route = 'Route',
    URL = 'URL',
    Permission = 'Permission',
    Search = 'Search',
    GreaterThan = 'GreaterThan',
    GreaterThanOrEqual = 'GreaterThanOrEqual',
    LessThan = 'LessThan',
    LessThanOrEqual = 'LessThanOrEqual',
    Port = 'Port',
    Hostname = 'Hostname',
    HashedString = 'HashedString',
    DateTime = 'DateTime',
    Buffer = 'Buffer',
    InBetween = 'InBetween',
    NotNull = 'NotNull',
    IsNull = 'IsNull',
}

export type JSONValue =
    | Array<string>
    | string
    | Array<number>
    | number
    | Array<boolean>
    | boolean
    | JSONObject
    | Uint8Array
    | JSONArray
    | Date
    | Array<Date>
    | ObjectID
    | Array<ObjectID>
    | BaseEntity
    | Array<BaseEntity>
    | Name
    | Array<Name>
    | Email
    | Array<Email>
    | Color
    | Array<Color>
    | Phone
    | Array<Phone>
    | Route
    | Array<Route>
    | URL
    | Array<URL>
    | Array<Version>
    | Version
    | Buffer
    | Permission
    | Array<Permission>
    | CheckOn
    | Array<CheckOn>
    | FilterType
    | Array<FilterType>
    | Search
    | Domain
    | Array<Domain>
    | Array<Search>
    | EqualToOrNull
    | Array<EqualToOrNull>
    | NotEqual
    | Array<NotEqual>
    | GreaterThan
    | Array<GreaterThan>
    | GreaterThanOrEqual
    | Array<GreaterThanOrEqual>
    | PositiveNumber
    | Array<PositiveNumber>
    | LessThan
    | Array<LessThan>
    | InBetween
    | Array<InBetween>
    | NotNull
    | Array<NotNull>
    | LessThanOrEqual
    | Array<LessThanOrEqual>
    | Port
    | Array<Port>
    | HashedString
    | Array<HashedString>
    | Hostname
    | Array<Hostname>
    | Array<JSONValue>
    | Array<Permission>
    | Array<JSONValue>
    | Array<ObjectID>
    | CallRequest
    | undefined
    | null
    | StartAndEndTime
    | Array<StartAndEndTime>;

export interface JSONObject {
    [x: string]: JSONValue;
}

export type JSONArray = Array<JSONObject>;

export type JSONObjectOrArray = JSONObject | JSONArray;
