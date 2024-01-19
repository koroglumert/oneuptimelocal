import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import PageComponentProps from '../../PageComponentProps';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import CardModelDetail from 'CommonUI/src/Components/ModelDetail/CardModelDetail';
import Navigation from 'CommonUI/src/Utils/Navigation';
import { JSONArray, JSONObject } from 'Common/Types/JSON';
import ObjectID from 'Common/Types/ObjectID';
import BadDataException from 'Common/Types/Exception/BadDataException';
import ScheduledMaintenance from 'Model/Models/ScheduledMaintenance';
import Color from 'Common/Types/Color';
import Pill from 'CommonUI/src/Components/Pill/Pill';
import MonitorsElement from '../../../Components/Monitor/Monitors';
import Monitor from 'Model/Models/Monitor';
import ScheduledMaintenanceStateTimeline from 'Model/Models/ScheduledMaintenanceStateTimeline';
import ModelAPI, { ListResult } from 'CommonUI/src/Utils/ModelAPI/ModelAPI';
import ChangeScheduledMaintenanceState, {
    StateType,
} from '../../../Components/ScheduledMaintenance/ChangeState';
import BaseModel from 'Common/Models/BaseModel';
import Label from 'Model/Models/Label';
import LabelsElement from '../../../Components/Label/Labels';
import StatusPage from 'Model/Models/StatusPage';
import StatusPagesElement from '../../../Components/StatusPage/StatusPagesLabel';
import { LIMIT_PER_PROJECT } from 'Common/Types/Database/LimitMax';

const ScheduledMaintenanceView: FunctionComponent<PageComponentProps> = (
    _props: PageComponentProps
): ReactElement => {
    const modelId: ObjectID = Navigation.getLastParamAsObjectID();

    return (
        <Fragment>
            {/* ScheduledMaintenance View  */}
            <CardModelDetail<ScheduledMaintenance>
                name="Scheduled Maintenance Details"
                cardProps={{
                    title: 'Scheduled Maintenance Details',
                    description: 'Here are more details for this event.',
                }}
                formSteps={[
                    {
                        title: 'Event Info',
                        id: 'event-info',
                    },

                    {
                        title: 'Resources Affected',
                        id: 'resources-affected',
                    },
                    {
                        title: 'Status Pages',
                        id: 'status-pages',
                    },
                    {
                        title: 'Labels',
                        id: 'labels',
                    },
                ]}
                isEditable={true}
                formFields={[
                    {
                        field: {
                            title: true,
                        },
                        stepId: 'event-info',
                        title: 'Scheduled Maintenance Title',
                        fieldType: FormFieldSchemaType.Text,
                        required: true,
                        placeholder: 'Scheduled Maintenance Title',
                        validation: {
                            minLength: 2,
                        },
                    },

                    {
                        field: {
                            startsAt: true,
                        },
                        stepId: 'event-info',
                        title: 'Event Starts At',
                        fieldType: FormFieldSchemaType.DateTime,
                        required: true,
                        placeholder: 'Pick Date and Time',
                    },
                    {
                        field: {
                            endsAt: true,
                        },
                        title: 'Ends At',
                        stepId: 'event-info',
                        fieldType: FormFieldSchemaType.DateTime,
                        required: true,
                        placeholder: 'Pick Date and Time',
                    },
                    {
                        field: {
                            monitors: true,
                        },
                        title: 'Monitors affected ',
                        stepId: 'resources-affected',
                        description:
                            'Select monitors affected by this scheduled maintenance.',
                        fieldType: FormFieldSchemaType.MultiSelectDropdown,
                        dropdownModal: {
                            type: Monitor,
                            labelField: 'name',
                            valueField: '_id',
                        },
                        required: false,
                        placeholder: 'Monitors affected',
                    },
                    {
                        field: {
                            statusPages: true,
                        },
                        title: 'Show event on these status pages ',
                        stepId: 'status-pages',
                        description:
                            'Select status pages to show this event on',
                        fieldType: FormFieldSchemaType.MultiSelectDropdown,
                        dropdownModal: {
                            type: StatusPage,
                            labelField: 'name',
                            valueField: '_id',
                        },
                        required: false,
                        placeholder: 'Select Status Pages',
                    },
                    {
                        field: {
                            labels: true,
                        },
                        title: 'Labels ',
                        stepId: 'labels',
                        description:
                            'Team members with access to these labels will only be able to access this resource. This is optional and an advanced feature.',
                        fieldType: FormFieldSchemaType.MultiSelectDropdown,
                        dropdownModal: {
                            type: Label,
                            labelField: 'name',
                            valueField: '_id',
                        },
                        required: false,
                        placeholder: 'Labels',
                    },
                ]}
                modelDetailProps={{
                    onBeforeFetch: async (): Promise<JSONObject> => {
                        // get ack scheduledMaintenance.

                        const scheduledMaintenanceTimelines: ListResult<ScheduledMaintenanceStateTimeline> =
                            await ModelAPI.getList({
                                modelType: ScheduledMaintenanceStateTimeline,
                                query: {
                                    scheduledMaintenanceId: modelId,
                                },
                                limit: LIMIT_PER_PROJECT,
                                skip: 0,
                                select: {
                                    _id: true,

                                    createdAt: true,
                                    createdByUser: {
                                        name: true,
                                        email: true,
                                        profilePictureId: true,
                                    },
                                    scheduledMaintenanceState: {
                                        name: true,
                                        isResolvedState: true,
                                        isOngoingState: true,
                                        isScheduledState: true,
                                    },
                                },
                                sort: {},
                            });

                        return scheduledMaintenanceTimelines;
                    },
                    showDetailsInNumberOfColumns: 2,
                    modelType: ScheduledMaintenance,
                    id: 'model-detail-scheduledMaintenances',
                    fields: [
                        {
                            field: {
                                _id: true,
                            },
                            title: 'Scheduled Maintenance ID',
                            fieldType: FieldType.ObjectID,
                        },
                        {
                            field: {
                                title: true,
                            },
                            title: 'Scheduled Maintenance Title',
                            fieldType: FieldType.Text,
                        },
                        {
                            field: {
                                currentScheduledMaintenanceState: {
                                    color: true,
                                    name: true,
                                },
                            },
                            title: 'Current State',
                            fieldType: FieldType.Entity,
                            getElement: (item: JSONObject): ReactElement => {
                                if (!item['currentScheduledMaintenanceState']) {
                                    throw new BadDataException(
                                        'Scheduled Maintenance Status not found'
                                    );
                                }

                                return (
                                    <Pill
                                        color={
                                            (
                                                item[
                                                    'currentScheduledMaintenanceState'
                                                ] as JSONObject
                                            )['color'] as Color
                                        }
                                        text={
                                            (
                                                item[
                                                    'currentScheduledMaintenanceState'
                                                ] as JSONObject
                                            )['name'] as string
                                        }
                                    />
                                );
                            },
                        },
                        {
                            field: {
                                monitors: {
                                    name: true,
                                    _id: true,
                                },
                            },
                            title: 'Monitors Affected',
                            fieldType: FieldType.Element,
                            getElement: (item: JSONObject): ReactElement => {
                                return (
                                    <MonitorsElement
                                        monitors={
                                            BaseModel.fromJSON(
                                                (item[
                                                    'monitors'
                                                ] as JSONArray) || [],
                                                Monitor
                                            ) as Array<Monitor>
                                        }
                                    />
                                );
                            },
                        },
                        {
                            field: {
                                statusPages: {
                                    name: true,
                                    _id: true,
                                },
                            },
                            title: 'Shown on Status Pages',
                            fieldType: FieldType.Element,
                            getElement: (item: JSONObject): ReactElement => {
                                return (
                                    <StatusPagesElement
                                        statusPages={
                                            BaseModel.fromJSON(
                                                (item[
                                                    'statusPages'
                                                ] as JSONArray) || [],
                                                Monitor
                                            ) as Array<Monitor>
                                        }
                                    />
                                );
                            },
                        },
                        {
                            field: {
                                startsAt: true,
                            },
                            title: 'Starts At',
                            fieldType: FieldType.DateTime,
                        },
                        {
                            field: {
                                endsAt: true,
                            },
                            title: 'Ends At',
                            fieldType: FieldType.DateTime,
                        },
                        {
                            field: {
                                createdAt: true,
                            },
                            title: 'Created At',
                            fieldType: FieldType.DateTime,
                        },
                        {
                            field: {
                                labels: {
                                    name: true,
                                    color: true,
                                },
                            },
                            title: 'Labels',
                            fieldType: FieldType.Element,
                            getElement: (item: JSONObject): ReactElement => {
                                return (
                                    <LabelsElement
                                        labels={
                                            BaseModel.fromJSON(
                                                (item['labels'] as JSONArray) ||
                                                    [],
                                                Label
                                            ) as Array<Label>
                                        }
                                    />
                                );
                            },
                        },
                        {
                            title: 'Change State to Ongoing',
                            fieldType: FieldType.Element,
                            getElement: (
                                _item: JSONObject,
                                onBeforeFetchData: JSONObject | undefined,
                                fetchItems: Function | undefined
                            ): ReactElement => {
                                return (
                                    <ChangeScheduledMaintenanceState
                                        scheduledMaintenanceId={modelId}
                                        scheduledMaintenanceTimeline={
                                            onBeforeFetchData
                                                ? (onBeforeFetchData[
                                                      'data'
                                                  ] as Array<BaseModel>)
                                                : []
                                        }
                                        stateType={StateType.Ongoing}
                                        onActionComplete={() => {
                                            fetchItems && fetchItems();
                                        }}
                                    />
                                );
                            },
                        },
                        {
                            title: 'Change State to Completed',
                            fieldType: FieldType.Element,
                            getElement: (
                                _item: JSONObject,
                                onBeforeFetchData: JSONObject | undefined,
                                fetchItems: Function | undefined
                            ): ReactElement => {
                                return (
                                    <ChangeScheduledMaintenanceState
                                        scheduledMaintenanceId={modelId}
                                        scheduledMaintenanceTimeline={
                                            onBeforeFetchData
                                                ? (onBeforeFetchData[
                                                      'data'
                                                  ] as Array<BaseModel>)
                                                : []
                                        }
                                        stateType={StateType.Completed}
                                        onActionComplete={() => {
                                            fetchItems && fetchItems();
                                        }}
                                    />
                                );
                            },
                        },
                    ],
                    modelId: modelId,
                }}
            />

            <CardModelDetail
                name="Event Description"
                cardProps={{
                    title: 'Event Description',
                    description:
                        'Description for this event. This is visible on Status Page and is in markdown format.',
                }}
                editButtonText="Edit Event Description"
                isEditable={true}
                formFields={[
                    {
                        field: {
                            description: true,
                        },
                        title: 'Description',

                        fieldType: FormFieldSchemaType.Markdown,
                        required: true,
                        placeholder: 'Description',
                    },
                ]}
                modelDetailProps={{
                    showDetailsInNumberOfColumns: 1,
                    modelType: ScheduledMaintenance,
                    id: 'model-detail-event-description',
                    fields: [
                        {
                            field: {
                                description: true,
                            },
                            title: 'Description',
                            fieldType: FieldType.Markdown,
                        },
                    ],
                    modelId: modelId,
                }}
            />
        </Fragment>
    );
};

export default ScheduledMaintenanceView;
