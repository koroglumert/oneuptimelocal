import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import PageComponentProps from '../PageComponentProps';
import ModelTable, {
    ShowTableAs,
} from 'CommonUI/src/Components/ModelTable/ModelTable';
import ScheduledMaintenanceState from 'Model/Models/ScheduledMaintenanceState';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import { JSONObject } from 'Common/Types/JSON';
import Pill from 'CommonUI/src/Components/Pill/Pill';
import Color from 'Common/Types/Color';
import SortOrder from 'Common/Types/BaseDatabase/SortOrder';
import BadDataException from 'Common/Types/Exception/BadDataException';
import Navigation from 'CommonUI/src/Utils/Navigation';
const ScheduledMaintenancesPage: FunctionComponent<PageComponentProps> = (
    _props: PageComponentProps
): ReactElement => {
    return (
        <Fragment>
            <ModelTable<ScheduledMaintenanceState>
                modelType={ScheduledMaintenanceState}
                id="ScheduledMaintenance-state-table"
                name="Settings > Scheduled Maintenance State"
                isDeleteable={true}
                isEditable={true}
                isCreateable={true}
                cardProps={{
                    title: 'Scheduled Maintenance State',
                    description:
                        'Scheduled Maintenance events have multiple states like - scheduled, ongoing and completed. You can more states help you manage Scheduled Maintenance events here.',
                }}
                sortBy="order"
                sortOrder={SortOrder.Ascending}
                onBeforeDelete={(
                    item: ScheduledMaintenanceState
                ): Promise<ScheduledMaintenanceState> => {
                    if (item.isScheduledState) {
                        throw new BadDataException(
                            'This Scheduled Maintenance cannot be deleted because its the scheduled state of for this project. Scheduled, Ongoing, Ended, Completed states cannot be deleted.'
                        );
                    }

                    if (item.isOngoingState) {
                        throw new BadDataException(
                            'This Scheduled Maintenance cannot be deleted because its the ongoing state of for this project. Scheduled, Ongoing, Ended, Completed states cannot be deleted.'
                        );
                    }

                    if (item.isResolvedState) {
                        throw new BadDataException(
                            'This Scheduled Maintenance cannot be deleted because its the resolved state of for this project. Scheduled, Ongoing, Ended, Completed states cannot be deleted.'
                        );
                    }

                    if (item.isEndedState) {
                        throw new BadDataException(
                            'This Scheduled Maintenance cannot be deleted because its the ended state of for this project. Scheduled, Ongoing, Ended, Completed states cannot be deleted.'
                        );
                    }

                    return Promise.resolve(item);
                }}
                selectMoreFields={{
                    color: true,
                    isScheduledState: true,
                    isOngoingState: true,
                    isResolvedState: true,
                    isEndedState: true,
                    order: true,
                }}
                columns={[
                    {
                        field: {
                            name: true,
                        },
                        title: 'Name',
                        type: FieldType.Text,
                        getElement: (item: JSONObject): ReactElement => {
                            return (
                                <Pill
                                    color={item['color'] as Color}
                                    text={item['name'] as string}
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
                noItemsMessage={'No Scheduled Maintenance state found.'}
                viewPageRoute={Navigation.getCurrentRoute()}
                formFields={[
                    {
                        field: {
                            name: true,
                        },
                        title: 'Name',
                        fieldType: FormFieldSchemaType.Text,
                        required: true,
                        placeholder: 'Monitoring',
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
                        placeholder:
                            'This Scheduled Maintenance state happens when the event is been monitored',
                    },
                    {
                        field: {
                            color: true,
                        },
                        title: 'Color',
                        fieldType: FormFieldSchemaType.Color,
                        required: true,
                        placeholder:
                            'Please select color for this Scheduled Maintenance state.',
                    },
                ]}
                showRefreshButton={true}
                showTableAs={ShowTableAs.OrderedStatesList}
                orderedStatesListProps={{
                    titleField: 'name',
                    descriptionField: 'description',
                    orderField: 'order',
                    shouldAddItemInTheEnd: true,
                }}
            />
        </Fragment>
    );
};

export default ScheduledMaintenancesPage;
