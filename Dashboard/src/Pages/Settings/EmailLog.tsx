import React, {
    Fragment,
    FunctionComponent,
    ReactElement,
    useState,
} from 'react';
import PageComponentProps from '../PageComponentProps';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import IconProp from 'Common/Types/Icon/IconProp';
import EmailLog from 'Model/Models/EmailLog';
import ModelTable from 'CommonUI/src/Components/ModelTable/ModelTable';
import DashboardNavigation from '../../Utils/Navigation';
import { JSONObject } from 'Common/Types/JSON';
import { ButtonStyleType } from 'CommonUI/src/Components/Button/Button';
import Pill from 'CommonUI/src/Components/Pill/Pill';
import EmailStatus from 'Common/Types/Mail/MailStatus';
import { Green, Red } from 'Common/Types/BrandColors';
import Columns from 'CommonUI/src/Components/ModelTable/Columns';
import ConfirmModal from 'CommonUI/src/Components/Modal/ConfirmModal';
import CustomSMTPElement from '../../Components/CustomSMTP/CustomSMTPView';
import ProjectSmtpConfig from 'Model/Models/ProjectSmtpConfig';

const EmailLogs: FunctionComponent<PageComponentProps> = (
    _props: PageComponentProps
): ReactElement => {
    const [showViewEmailTextModal, setShowViewEmailTextModal] =
        useState<boolean>(false);
    const [EmailText, setEmailText] = useState<string>('');
    const [EmailModelTitle, setEmailModalTitle] = useState<string>('');

    const modelTableColumns: Columns<EmailLog> = [
        {
            field: {
                projectSmtpConfig: {
                    name: true,
                },
            },
            title: 'SMTP Server',
            type: FieldType.Element,
            getElement: (item: JSONObject): ReactElement => {
                return (
                    <CustomSMTPElement
                        smtp={item['projectSmtpConfig'] as ProjectSmtpConfig}
                    />
                );
            },
            isFilterable: false,
        },
        {
            field: {
                fromEmail: true,
            },
            isFilterable: true,

            title: 'From Email',
            type: FieldType.Email,
        },

        {
            field: {
                toEmail: true,
            },
            isFilterable: true,

            title: 'To Email',
            type: FieldType.Email,
        },
        {
            field: {
                createdAt: true,
            },
            title: 'Sent at',
            type: FieldType.DateTime,
            isFilterable: true,
        },
        {
            field: {
                status: true,
            },
            title: 'Status',
            type: FieldType.Text,
            getElement: (item: JSONObject): ReactElement => {
                if (item['status']) {
                    return (
                        <Pill
                            isMinimal={false}
                            color={
                                item['status'] === EmailStatus.Success
                                    ? Green
                                    : Red
                            }
                            text={item['status'] as string}
                        />
                    );
                }

                return <></>;
            },
            isFilterable: true,
        },
    ];

    return (
        <Fragment>
            <>
                <ModelTable<EmailLog>
                    modelType={EmailLog}
                    id="Email-logs-table"
                    isDeleteable={false}
                    isEditable={false}
                    isCreateable={false}
                    showViewIdButton={true}
                    name="Email Logs"
                    query={{
                        projectId:
                            DashboardNavigation.getProjectId()?.toString(),
                    }}
                    selectMoreFields={{
                        subject: true,
                        statusMessage: true,
                    }}
                    actionButtons={[
                        {
                            title: 'View Subject',
                            buttonStyleType: ButtonStyleType.NORMAL,
                            icon: IconProp.List,
                            onClick: async (
                                item: JSONObject,
                                onCompleteAction: Function
                            ) => {
                                setEmailText(
                                    JSON.stringify(item['subject']) as string
                                );

                                setEmailModalTitle('Subject of Email Message');
                                setShowViewEmailTextModal(true);

                                onCompleteAction();
                            },
                        },
                        {
                            title: 'View Status Message',
                            buttonStyleType: ButtonStyleType.NORMAL,
                            icon: IconProp.Error,
                            onClick: async (
                                item: JSONObject,
                                onCompleteAction: Function
                            ) => {
                                setEmailText(item['statusMessage'] as string);

                                setEmailModalTitle('Status Message');
                                setShowViewEmailTextModal(true);

                                onCompleteAction();
                            },
                        },
                    ]}
                    isViewable={false}
                    cardProps={{
                        title: 'Email Logs',
                        description:
                            'Logs of all the emails sent by this project in the last 30 days.',
                    }}
                    noItemsMessage={
                        'Looks like no email is sent by this project in the last 30 days.'
                    }
                    showRefreshButton={true}
                    showFilterButton={true}
                    columns={modelTableColumns}
                />

                {showViewEmailTextModal && (
                    <ConfirmModal
                        title={EmailModelTitle}
                        description={EmailText}
                        onSubmit={() => {
                            setShowViewEmailTextModal(false);
                        }}
                        submitButtonText="Close"
                        submitButtonType={ButtonStyleType.NORMAL}
                    />
                )}
            </>
        </Fragment>
    );
};

export default EmailLogs;
