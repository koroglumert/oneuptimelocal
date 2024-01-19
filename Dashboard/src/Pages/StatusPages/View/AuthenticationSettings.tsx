import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import PageComponentProps from '../../PageComponentProps';
import ObjectID from 'Common/Types/ObjectID';
import StatusPage from 'Model/Models/StatusPage';
import CardModelDetail from 'CommonUI/src/Components/ModelDetail/CardModelDetail';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import Navigation from 'CommonUI/src/Utils/Navigation';

const StatusPageDelete: FunctionComponent<PageComponentProps> = (
    _props: PageComponentProps
): ReactElement => {
    const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

    return (
        <Fragment>
            <CardModelDetail<StatusPage>
                name="Status Page > Authentication Settings"
                cardProps={{
                    title: 'Authentication Settings',
                    description:
                        'Authentication settings for this status page.',
                }}
                editButtonText="Edit Settings"
                isEditable={true}
                formFields={[
                    {
                        field: {
                            isPublicStatusPage: true,
                        },
                        title: 'Is Visible to Public',
                        fieldType: FormFieldSchemaType.Toggle,
                        required: false,
                        placeholder: 'Is this status page visible to public',
                    },
                ]}
                modelDetailProps={{
                    showDetailsInNumberOfColumns: 1,
                    modelType: StatusPage,
                    id: 'model-detail-status-page',
                    fields: [
                        {
                            field: {
                                isPublicStatusPage: true,
                            },
                            fieldType: FieldType.Boolean,
                            title: 'Is Visible to Public',
                        },
                    ],
                    modelId: modelId,
                }}
            />
        </Fragment>
    );
};

export default StatusPageDelete;
