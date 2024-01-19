import Route from '../API/Route';
import IconProp from '../Icon/IconProp';
import { JSONObject } from '../JSON';

export enum ComponentInputType {
    Text = 'Text',
    Password = 'Password',
    Date = 'Date',
    DateTime = 'Date Time',
    Boolean = 'True or False',
    Number = 'Number',
    Decimal = 'Decimal',
    JavaScript = 'JavaScript',
    AnyValue = 'Any Type',
    JSON = 'JSON',
    StringDictionary = 'Dictionary of String',
    URL = 'URL',
    Email = 'Email',
    CronTab = 'CronTab',
    Query = 'Database Query',
    Select = 'Database Select',
    BaseModel = 'Database Record',
    BaseModelArray = 'Database Records',
    JSONArray = 'List of JSON',
    LongText = 'Long Text',
    HTML = 'HTML',
    Operator = 'Operator',
    Markdown = 'Markdown',
}

export enum ComponentType {
    Trigger = 'Trigger',
    Component = 'Component',
}

export enum NodeType {
    Node = 'Node',
    PlaceholderNode = 'PlaceholderNode',
}

export interface NodeDataProp {
    error: string;
    id: string;
    nodeType: NodeType;
    onClick?: (node: NodeDataProp) => void | undefined;
    isPreview?: boolean | undefined; // is this used to show in the components modal?
    metadata: ComponentMetadata;
    metadataId: string;
    internalId: string;
    arguments: JSONObject;
    returnValues: JSONObject;
    componentType: ComponentType;
}

export interface Port {
    title: string;
    description: string;
    id: string;
}

export interface Argument {
    name: string;
    description: string;
    required: boolean;
    type: ComponentInputType;
    id: string;
    isAdvanced?: boolean | undefined;
    placeholder?: string | undefined;
}

export interface ReturnValue {
    id: string;
    name: string;
    description: string;
    type: ComponentInputType;
    required: boolean;
    placeholder?: string | undefined;
}

export default interface ComponentMetadata {
    id: string;
    title: string;
    category: string;
    description: string;
    iconProp: IconProp;
    componentType: ComponentType;
    arguments: Array<Argument>;
    returnValues: Array<ReturnValue>;
    inPorts: Array<Port>;
    outPorts: Array<Port>;
    tableName?: string | undefined;
    documentationLink?: Route;
}

export interface ComponentCategory {
    name: string;
    description: string;
    icon: IconProp;
}
