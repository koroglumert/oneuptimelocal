import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import PageComponentProps from '../PageComponentProps';
import ModelTable, {
    ShowTableAs,
} from 'CommonUI/src/Components/ModelTable/ModelTable';
import IncidentState from 'Model/Models/IncidentState';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import { JSONObject } from 'Common/Types/JSON';
import Pill from 'CommonUI/src/Components/Pill/Pill';
import Color from 'Common/Types/Color';
import SortOrder from 'Common/Types/BaseDatabase/SortOrder';
import BadDataException from 'Common/Types/Exception/BadDataException';
import Navigation from 'CommonUI/src/Utils/Navigation';
const IncidentsPage: FunctionComponent<PageComponentProps> = (
    _props: PageComponentProps
): ReactElement => {
    return (
        <Fragment>
            <ModelTable<IncidentState>
                modelType={IncidentState}
                id="incident-state-table"
                name="Settings > Incident State"
                isDeleteable={true}
                isEditable={true}
                isCreateable={true}
                cardProps={{
                    title: 'Incident State',
                    description:
                        'Incidents have multiple states like - created, acknowledged and resolved. You can more states help you manage incidents here.',
                }}
                sortBy="order"
                sortOrder={SortOrder.Ascending}
                onBeforeDelete={(
                    item: IncidentState
                ): Promise<IncidentState> => {
                    if (item.isCreatedState) {
                        throw new BadDataException(
                            'This incident cannot be deleted because its the created incident state of for this project. Created, Acknowledged, Resolved incident states cannot be deleted.'
                        );
                    }

                    if (item.isAcknowledgedState) {
                        throw new BadDataException(
                            'This incident cannot be deleted because its the acknowledged incident state of for this project. Created, Acknowledged, Resolved incident states cannot be deleted.'
                        );
                    }

                    if (item.isResolvedState) {
                        throw new BadDataException(
                            'This incident cannot be deleted because its the resolved incident state of for this project. Created, Acknowledged, Resolved incident states cannot be deleted.'
                        );
                    }

                    return Promise.resolve(item);
                }}
                selectMoreFields={{
                    color: true,
                    isCreatedState: true,
                    isAcknowledgedState: true,
                    isResolvedState: true,
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
                                    isMinimal={true}
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
                noItemsMessage={'No incident state found.'}
                viewPageRoute={Navigation.getCurrentRoute()}
                formFields={[
                    {
                        field: {
                            name: true,
                        },
                        title: 'Name',
                        fieldType: FormFieldSchemaType.Text,
                        required: true,
                        placeholder: 'Investigating',
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
                            'This incident state happens when the incident is investigated',
                    },
                    {
                        field: {
                            color: true,
                        },
                        title: 'Color',
                        fieldType: FormFieldSchemaType.Color,
                        required: true,
                        placeholder:
                            'Please select color for this incident state.',
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

export default IncidentsPage;
