import React, { ReactElement, useRef, useState } from 'react';
import { ButtonStyleType } from '../Button/Button';
import Modal, { ModalWidth } from '../Modal/Modal';
import ModelForm, {
    ComponentProps as ModelFormComponentProps,
} from '../Forms/ModelForm';
import BaseModel from 'Common/Models/BaseModel';
import ButtonType from '../Button/ButtonTypes';
import { JSONObject } from 'Common/Types/JSON';
import ObjectID from 'Common/Types/ObjectID';
import Alert, { AlertType } from '../Alerts/Alert';
import FormValues from '../Forms/Types/FormValues';
import ModelAPI from '../../Utils/ModelAPI/ModelAPI';

export interface ComponentProps<TBaseModel extends BaseModel> {
    title: string;
    description?: string | undefined;
    modelAPI?: typeof ModelAPI | undefined;
    name?: string | undefined;
    modelType: { new (): TBaseModel };
    initialValues?: FormValues<TBaseModel> | undefined;
    onClose?: undefined | (() => void);
    submitButtonText?: undefined | string;
    modalWidth?: ModalWidth | undefined;
    onSuccess?: undefined | ((data: TBaseModel) => void);
    submitButtonStyleType?: undefined | ButtonStyleType;
    formProps: ModelFormComponentProps<TBaseModel>;
    modelIdToEdit?: ObjectID | undefined;
    onBeforeCreate?:
        | ((item: TBaseModel, miscDataProps: JSONObject) => Promise<TBaseModel>)
        | undefined;
    footer?: ReactElement | undefined;
}

const ModelFormModal: <TBaseModel extends BaseModel>(
    props: ComponentProps<TBaseModel>
) => ReactElement = <TBaseModel extends BaseModel>(
    props: ComponentProps<TBaseModel>
): ReactElement => {
    const [isFormLoading, setIsFormLoading] = useState<boolean>(false);

    const [submitButtonText, setSubmitButtonText] = useState<string>(
        props.submitButtonText || 'Save'
    );

    const [error, setError] = useState<string>('');

    const formRef: any = useRef<any>(null);

    let modalWidth: ModalWidth = props.modalWidth || ModalWidth.Normal;

    if (props.formProps.steps && props.formProps.steps.length > 0) {
        modalWidth = props.modalWidth || ModalWidth.Medium;
    }

    return (
        <Modal
            {...props}
            submitButtonText={submitButtonText}
            modalWidth={modalWidth}
            submitButtonType={ButtonType.Submit}
            isLoading={isFormLoading}
            description={props.description}
            disableSubmitButton={isFormLoading}
            onSubmit={() => {
                formRef.current.submitForm();
            }}
            error={error}
        >
            {!error ? (
                <>
                    <ModelForm<TBaseModel>
                        {...props.formProps}
                        name={props.name}
                        modelAPI={props.modelAPI}
                        modelType={props.modelType}
                        onIsLastFormStep={(isLastFormStep: boolean) => {
                            if (isLastFormStep) {
                                setSubmitButtonText(
                                    props.submitButtonText || 'Save'
                                );
                            } else {
                                setSubmitButtonText('Next');
                            }
                        }}
                        modelIdToEdit={props.modelIdToEdit}
                        hideSubmitButton={true}
                        formRef={formRef}
                        onLoadingChange={(isFormLoading: boolean) => {
                            setIsFormLoading(isFormLoading);
                        }}
                        initialValues={props.initialValues}
                        onSuccess={(data: TBaseModel) => {
                            props.onSuccess &&
                                props.onSuccess(
                                    BaseModel.fromJSONObject(
                                        data as TBaseModel,
                                        props.modelType
                                    )
                                );
                        }}
                        onError={(error: string) => {
                            setError(error);
                        }}
                        onBeforeCreate={props.onBeforeCreate}
                    />

                    {props.footer}
                </>
            ) : (
                <></>
            )}

            {error ? <Alert title={error} type={AlertType.DANGER} /> : <></>}
        </Modal>
    );
};

export default ModelFormModal;
