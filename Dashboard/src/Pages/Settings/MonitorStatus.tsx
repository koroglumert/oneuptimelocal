import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import PageComponentProps from '../PageComponentProps';
import ModelTable, {
    ShowTableAs,
} from 'CommonUI/src/Components/ModelTable/ModelTable';
import MonitorStatus from 'Model/Models/MonitorStatus';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import { JSONObject } from 'Common/Types/JSON';
import StatusBubble from 'CommonUI/src/Components/StatusBubble/StatusBubble';
import Color from 'Common/Types/Color';
import BadDataException from 'Common/Types/Exception/BadDataException';
import SortOrder from 'Common/Types/BaseDatabase/SortOrder';
import DashboardNavigation from '../../Utils/Navigation';
import Navigation from 'CommonUI/src/Utils/Navigation';
import ObjectID from 'Common/Types/ObjectID';
const Monitors: FunctionComponent<PageComponentProps> = (
    props: PageComponentProps
): ReactElement => {
    return (
        <Fragment>
            <ModelTable<MonitorStatus>
                modelType={MonitorStatus}
                query={{
                    projectId: DashboardNavigation.getProjectId()?.toString(),
                }}
                id="monitor-status-table"
                name="Settings > Monitor Status"
                isDeleteable={true}
                isEditable={true}
                isCreateable={true}
                cardProps={{
                    title: 'Monitor Status',
                    description:
                        'Define different status types (eg: Operational, Degraded, Down) here.',
                }}
                noItemsMessage={'No monitor status found.'}
                orderedStatesListProps={{
                    titleField: 'name',
                    descriptionField: 'description',
                    orderField: 'priority',
                }}
                showTableAs={ShowTableAs.OrderedStatesList}
                onBeforeDelete={(
                    item: MonitorStatus
                ): Promise<MonitorStatus> => {
                    if (item.isOperationalState) {
                        throw new BadDataException(
                            'This monitor status cannot be deleted because its the operational state of monitors. Operational status or Offline Status cannot be deleted.'
                        );
                    }

                    if (item.isOfflineState) {
                        throw new BadDataException(
                            'This monitor status cannot be deleted because its the offline state of monitors. Operational status or Offline Status cannot be deleted.'
                        );
                    }

                    return Promise.resolve(item);
                }}
                viewPageRoute={Navigation.getCurrentRoute()}
                onBeforeCreate={(
                    item: MonitorStatus
                ): Promise<MonitorStatus> => {
                    if (!props.currentProject || !props.currentProject._id) {
                        throw new BadDataException('Project ID cannot be null');
                    }

                    item.projectId = new ObjectID(props.currentProject._id);
                    return Promise.resolve(item);
                }}
                formFields={[
                    {
                        field: {
                            name: true,
                        },
                        title: 'Name',
                        fieldType: FormFieldSchemaType.Text,
                        required: true,
                        placeholder: 'Operational',
                        validation: {
                            minLength: 2,
                        },
                    },
                    {
                        field: {
                            description: true,
                        },
                        title: 'Description',
                        fieldType: FormFieldSchemaType.LongText,
                        required: true,
                        placeholder: 'Monitors are up and operating normally.',
                    },
                    {
                        field: {
                            color: true,
                        },
                        title: 'Monitor Status Color',
                        fieldType: FormFieldSchemaType.Color,
                        required: true,
                        placeholder:
                            'Please select color for this monitor status.',
                    },
                ]}
                sortBy="priority"
                sortOrder={SortOrder.Ascending}
                showRefreshButton={true}
                selectMoreFields={{
                    color: true,
                    isOperationalState: true,
                    isOfflineState: true,
                    priority: true,
                }}
                columns={[
                    {
                        field: {
                            name: true,
                        },
                        title: 'Name',
                        type: FieldType.Text,
                        isFilterable: true,

                        getElement: (item: JSONObject): ReactElement => {
                            return (
                                <StatusBubble
                                    color={item['color'] as Color}
                                    text={item['name'] as string}
                                    shouldAnimate={false}
                                />
                            );
                        },
                    },
                    {
                        field: {
                            description: true,
                        },
                        title: 'Description',
                        type: FieldType.Text,
                        isFilterable: true,
                        getElement: (item: JSONObject): ReactElement => {
                            return (
                                <div>
                                    <p>{`${item['description']}`}</p>
                                    <p className="text-xs text-gray-400">
                                        ID: {`${item['_id']}`}
                                    </p>
                                </div>
                            );
                        },
                    },
                ]}
            />
        </Fragment>
    );
};

export default Monitors;
