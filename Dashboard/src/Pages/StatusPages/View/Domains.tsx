import React, {
    Fragment,
    FunctionComponent,
    ReactElement,
    useState,
} from 'react';
import PageComponentProps from '../../PageComponentProps';
import DashboardNavigation from '../../../Utils/Navigation';
import ObjectID from 'Common/Types/ObjectID';
import StatusPageDomain from 'Model/Models/StatusPageDomain';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import Domain from 'Model/Models/Domain';
import IconProp from 'Common/Types/Icon/IconProp';
import ModelTable from 'CommonUI/src/Components/ModelTable/ModelTable';
import BadDataException from 'Common/Types/Exception/BadDataException';
import { StatusPageCNameRecord } from 'CommonUI/src/Config';
import Navigation from 'CommonUI/src/Utils/Navigation';
import { ButtonStyleType } from 'CommonUI/src/Components/Button/Button';
import { JSONObject } from 'Common/Types/JSON';
import ConfirmModal from 'CommonUI/src/Components/Modal/ConfirmModal';

const StatusPageDelete: FunctionComponent<PageComponentProps> = (
    props: PageComponentProps
): ReactElement => {
    const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

    const [cnameModalText, setCnameModalText] = useState<string>('');
    const [showSslProvisioningModal, setShowSslProvisioningModal] =
        useState<boolean>(false);

    return (
        <Fragment>
            <>
                <ModelTable<StatusPageDomain>
                    modelType={StatusPageDomain}
                    query={{
                        projectId:
                            DashboardNavigation.getProjectId()?.toString(),
                        statusPageId: modelId,
                    }}
                    name="Status Page > Domains"
                    id="domains-table"
                    isDeleteable={true}
                    isCreateable={true}
                    cardProps={{
                        title: 'Custom Domains',
                        description: `Important: Please add ${StatusPageCNameRecord} as your CNAME for these domains for this to work.`,
                    }}
                    onBeforeCreate={(
                        item: StatusPageDomain
                    ): Promise<StatusPageDomain> => {
                        if (
                            !props.currentProject ||
                            !props.currentProject._id
                        ) {
                            throw new BadDataException(
                                'Project ID cannot be null'
                            );
                        }
                        item.statusPageId = modelId;
                        item.projectId = new ObjectID(props.currentProject._id);
                        return Promise.resolve(item);
                    }}
                    actionButtons={[
                        {
                            title: 'Add CNAME',
                            buttonStyleType: ButtonStyleType.SUCCESS_OUTLINE,
                            icon: IconProp.Check,
                            isVisible: (item: JSONObject): boolean => {
                                if (item['isCnameVerified']) {
                                    return false;
                                }

                                return true;
                            },
                            onClick: async (
                                item: JSONObject,
                                onCompleteAction: Function,
                                onError: (err: Error) => void
                            ) => {
                                try {
                                    setCnameModalText(`${item['fullDomain']}`);

                                    onCompleteAction();
                                } catch (err) {
                                    onCompleteAction();
                                    onError(err as Error);
                                }
                            },
                        },
                        {
                            title: 'Provision SSL',
                            buttonStyleType: ButtonStyleType.SUCCESS_OUTLINE,
                            icon: IconProp.Check,
                            isVisible: (item: JSONObject): boolean => {
                                if (
                                    item['isCnameVerified'] &&
                                    !item['isSslProvisioned']
                                ) {
                                    return true;
                                }

                                return false;
                            },
                            onClick: async (
                                _item: JSONObject,
                                onCompleteAction: Function,
                                onError: (err: Error) => void
                            ) => {
                                try {
                                    setShowSslProvisioningModal(true);

                                    onCompleteAction();
                                } catch (err) {
                                    onCompleteAction();
                                    onError(err as Error);
                                }
                            },
                        },
                    ]}
                    noItemsMessage={'No custom domains found.'}
                    viewPageRoute={Navigation.getCurrentRoute()}
                    formFields={[
                        {
                            field: {
                                subdomain: true,
                            },
                            title: 'Subdomain',
                            fieldType: FormFieldSchemaType.Text,
                            required: true,
                            placeholder: 'status',
                            validation: {
                                minLength: 2,
                            },
                        },
                        {
                            field: {
                                domain: true,
                            },
                            title: 'Domain',
                            description:
                                'Please select a verified domain from this list. If you do not see any domains in this list, please head over to settings to add some.',
                            fieldType: FormFieldSchemaType.Dropdown,
                            dropdownModal: {
                                type: Domain,
                                labelField: 'domain',
                                valueField: '_id',
                            },
                            required: true,
                            placeholder: 'Select domain',
                        },
                    ]}
                    showRefreshButton={true}
                    showFilterButton={true}
                    columns={[
                        {
                            field: {
                                fullDomain: true,
                            },
                            title: 'Name',
                            type: FieldType.Text,
                            isFilterable: true,
                        },
                        {
                            field: {
                                isCnameVerified: true,
                            },
                            title: 'CNAME Valid',
                            type: FieldType.Boolean,
                            isFilterable: true,
                            tooltipText: (item: StatusPageDomain): string => {
                                if (item['isCnameVerified']) {
                                    return 'We have verified your CNAME record.';
                                }
                                return `Please add a new CNAME record to your domain ${item['fullDomain']}. It should look like CNAME ${item['fullDomain']} ${StatusPageCNameRecord}`;
                            },
                        },
                        {
                            field: {
                                isSslProvisioned: true,
                            },
                            title: 'SSL Provisioned',
                            type: FieldType.Boolean,
                            isFilterable: true,
                            tooltipText: (_item: StatusPageDomain): string => {
                                return 'This will happen automatically after CNAME is verified. Please allow 24 hours for SSL to be provisioned after CNAME is verified. If that does not happen in 24 hours, please contact support.';
                            },
                        },
                    ]}
                />

                {cnameModalText && (
                    <ConfirmModal
                        title={`Add CNAME`}
                        description={
                            <div>
                                <span>
                                    Please add CNAME record to your domain.
                                    Details of the CNAME records are:
                                </span>
                                <br />
                                <br />
                                <span>
                                    <b>Record Type: </b> CNAME
                                </span>
                                <br />
                                <span>
                                    <b>Name: </b>
                                    {cnameModalText}
                                </span>
                                <br />
                                <span>
                                    <b>Content: </b>
                                    {StatusPageCNameRecord}
                                </span>
                                <br />
                                <br />
                                <span>
                                    Once you have done this, it should take 24
                                    hours to automatically verify.
                                </span>
                            </div>
                        }
                        submitButtonText={'Close'}
                        onSubmit={() => {
                            return setCnameModalText('');
                        }}
                    />
                )}

                {showSslProvisioningModal && (
                    <ConfirmModal
                        title={`Provision SSL`}
                        description={`This is an automatic process and takes around 24 hours to complete. If you do not see your SSL provisioned in 24 hours. Please contact support@oneuptime.com`}
                        submitButtonText={'Close'}
                        onSubmit={() => {
                            return setShowSslProvisioningModal(false);
                        }}
                    />
                )}
            </>
        </Fragment>
    );
};

export default StatusPageDelete;
