import React, {
    Fragment,
    FunctionComponent,
    ReactElement,
    useState,
} from 'react';
import PageComponentProps from '../../PageComponentProps';
import Navigation from 'CommonUI/src/Utils/Navigation';
import ObjectID from 'Common/Types/ObjectID';
import Monitor from 'Model/Models/Monitor';
import CardModelDetail from 'CommonUI/src/Components/ModelDetail/CardModelDetail';
import IconProp from 'Common/Types/Icon/IconProp';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import { JSONObject } from 'Common/Types/JSON';
import MonitorStepsViewer from '../../../Components/Monitor/MonitorSteps/MonitorSteps';
import {
    CustomElementProps,
    FormFieldStyleType,
} from 'CommonUI/src/Components/Forms/Types/Field';
import FormValues from 'CommonUI/src/Components/Forms/Types/FormValues';
import MonitorStepsType from 'Common/Types/Monitor/MonitorSteps';
import MonitorStepsForm from '../../../Components/Form/Monitor/MonitorSteps';
import MonitorType from 'Common/Types/Monitor/MonitorType';
import { ModalWidth } from 'CommonUI/src/Components/Modal/Modal';
import ModelAPI from 'CommonUI/src/Utils/ModelAPI/ModelAPI';
import API from 'CommonUI/src/Utils/API/API';
import ComponentLoader from 'CommonUI/src/Components/ComponentLoader/ComponentLoader';
import ErrorMessage from 'CommonUI/src/Components/ErrorMessage/ErrorMessage';
import EmptyState from 'CommonUI/src/Components/EmptyState/EmptyState';
import DisabledWarning from '../../../Components/Monitor/DisabledWarning';
import { useAsyncEffect } from 'use-async-effect';

const MonitorCriteria: FunctionComponent<PageComponentProps> = (
    _props: PageComponentProps
): ReactElement => {
    const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [error, setError] = useState<string>('');

    const fetchItem: () => Promise<void> = async (): Promise<void> => {
        // get item.
        setIsLoading(true);

        setError('');
        try {
            const item: Monitor | null = await ModelAPI.getItem({
                modelType: Monitor,
                id: modelId,
                select: {
                    monitorType: true,
                },
            });

            if (!item) {
                setError(`Monitor not found`);

                return;
            }

            setMonitorType(item.monitorType);
        } catch (err) {
            setError(API.getFriendlyMessage(err));
        }
        setIsLoading(false);
    };

    const [monitorType, setMonitorType] = useState<MonitorType | undefined>(
        undefined
    );

    useAsyncEffect(async () => {
        // fetch the model
        await fetchItem();
    }, []);

    const getPageContent: Function = (): ReactElement => {
        if (!monitorType || isLoading) {
            return <ComponentLoader />;
        }

        if (error) {
            return <ErrorMessage error={error} />;
        }

        if (monitorType === MonitorType.Manual) {
            return (
                <EmptyState
                    id="monitoring-criteria-empty-state"
                    icon={IconProp.Criteria}
                    title={'No Criteria for Manual Monitors'}
                    description={
                        <>
                            This is a manual monitor and it cannot have any
                            criteria set. You can have monitoring criteria on
                            other monitor types.{' '}
                        </>
                    }
                />
            );
        }

        return (
            <CardModelDetail
                name="Monitoring Criteria"
                editButtonText="Edit Monitoring Criteria"
                cardProps={{
                    title: 'Monitoring Criteria',
                    description:
                        'Here is the criteria we use to monitor this resource.',
                }}
                createEditModalWidth={ModalWidth.Large}
                isEditable={true}
                formFields={[
                    {
                        field: {
                            monitorSteps: true,
                        },
                        stepId: 'criteria',
                        styleType: FormFieldStyleType.Heading,
                        title: 'Monitor Details',
                        fieldType: FormFieldSchemaType.CustomComponent,
                        required: true,
                        customValidation: (values: FormValues<Monitor>) => {
                            const error: string | null =
                                MonitorStepsType.getValidationError(
                                    values.monitorSteps as MonitorStepsType,
                                    monitorType
                                );

                            return error;
                        },
                        getCustomElement: (
                            _value: FormValues<Monitor>,
                            props: CustomElementProps
                        ) => {
                            return (
                                <MonitorStepsForm
                                    {...props}
                                    monitorType={
                                        monitorType || MonitorType.Manual
                                    }
                                    error={''}
                                />
                            );
                        },
                    },
                ]}
                modelDetailProps={{
                    showDetailsInNumberOfColumns: 1,
                    modelType: Monitor,
                    id: 'model-detail-monitors',
                    fields: [
                        {
                            field: {
                                monitorSteps: true,
                            },
                            title: '',
                            getElement: (item: JSONObject): ReactElement => {
                                return (
                                    <MonitorStepsViewer
                                        monitorSteps={
                                            item[
                                                'monitorSteps'
                                            ] as MonitorStepsType
                                        }
                                        monitorType={monitorType}
                                    />
                                );
                            },
                        },
                    ],
                    modelId: modelId,
                }}
            />
        );
    };

    return (
        <Fragment>
            <DisabledWarning monitorId={modelId} />
            {getPageContent()}
        </Fragment>
    );
};

export default MonitorCriteria;
