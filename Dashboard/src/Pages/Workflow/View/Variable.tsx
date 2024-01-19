import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import PageComponentProps from '../../PageComponentProps';
import ModelTable from 'CommonUI/src/Components/ModelTable/ModelTable';
import WorkflowVariable from 'Model/Models/WorkflowVariable';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import Navigation from 'CommonUI/src/Utils/Navigation';
import DashboardNavigation from '../../../Utils/Navigation';
import ObjectID from 'Common/Types/ObjectID';

const Workflows: FunctionComponent<PageComponentProps> = (
    _props: PageComponentProps
): ReactElement => {
    const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

    return (
        <Fragment>
            <ModelTable<WorkflowVariable>
                modelType={WorkflowVariable}
                id="status-page-table"
                isDeleteable={true}
                isEditable={false}
                isCreateable={true}
                showViewIdButton={true}
                name="Workflows"
                isViewable={false}
                cardProps={{
                    title: 'Workflow Variables',
                    description:
                        'Here is a list of workflow secrets and variables for this specific workflow.',
                }}
                query={{
                    workflowId: modelId,
                    projectId: DashboardNavigation.getProjectId()?.toString(),
                }}
                onBeforeCreate={(
                    item: WorkflowVariable
                ): Promise<WorkflowVariable> => {
                    item.workflowId = modelId;
                    return Promise.resolve(item);
                }}
                noItemsMessage={'No workflow variables found.'}
                formFields={[
                    {
                        field: {
                            name: true,
                        },
                        title: 'Name',
                        fieldType: FormFieldSchemaType.Text,
                        required: true,
                        placeholder: 'Workflow Name',
                        validation: {
                            minLength: 2,
                            noSpaces: true,
                            noSpecialCharacters: true,
                            noNumbers: true,
                        },
                    },
                    {
                        field: {
                            description: true,
                        },
                        title: 'Description',
                        fieldType: FormFieldSchemaType.LongText,
                        required: true,
                        placeholder: 'Description',
                    },
                    {
                        field: {
                            isSecret: true,
                        },
                        title: 'Secret',
                        description:
                            'Is this variable secret or secure? Should this be encrypted in the Database?',
                        fieldType: FormFieldSchemaType.Toggle,
                        required: true,
                    },
                    {
                        field: {
                            content: true,
                        },
                        title: 'Content',
                        description: 'Enter the content of the variable',
                        fieldType: FormFieldSchemaType.LongText,
                        required: true,
                    },
                ]}
                showRefreshButton={true}
                showFilterButton={true}
                columns={[
                    {
                        field: {
                            name: true,
                        },
                        title: 'Name',
                        type: FieldType.Text,
                        isFilterable: true,
                    },
                    {
                        field: {
                            description: true,
                        },
                        title: 'Description',
                        type: FieldType.Text,
                        isFilterable: true,
                    },
                    {
                        field: {
                            isSecret: true,
                        },
                        title: 'Secret',
                        type: FieldType.Boolean,
                        isFilterable: true,
                    },
                    {
                        field: {
                            createdAt: true,
                        },
                        title: 'Created At',
                        type: FieldType.DateTime,
                        isFilterable: true,
                    },
                ]}
            />
        </Fragment>
    );
};

export default Workflows;
