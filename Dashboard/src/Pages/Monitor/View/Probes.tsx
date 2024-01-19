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
import IconProp from 'Common/Types/Icon/IconProp';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import { JSONObject } from 'Common/Types/JSON';
import MonitorType from 'Common/Types/Monitor/MonitorType';
import ModelAPI, { ListResult } from 'CommonUI/src/Utils/ModelAPI/ModelAPI';
import API from 'CommonUI/src/Utils/API/API';
import ComponentLoader from 'CommonUI/src/Components/ComponentLoader/ComponentLoader';
import ErrorMessage from 'CommonUI/src/Components/ErrorMessage/ErrorMessage';
import EmptyState from 'CommonUI/src/Components/EmptyState/EmptyState';
import ModelTable from 'CommonUI/src/Components/ModelTable/ModelTable';
import MonitorProbe from 'Model/Models/MonitorProbe';
import DashboardNavigation from '../../../Utils/Navigation';
import Probe from 'Model/Models/Probe';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import ProbeElement from 'CommonUI/src/Components/Probe/Probe';
import { LIMIT_PER_PROJECT } from 'Common/Types/Database/LimitMax';
import URL from 'Common/Types/API/URL';
import { APP_API_URL } from 'CommonUI/src/Config';
import DisabledWarning from '../../../Components/Monitor/DisabledWarning';
import { ButtonStyleType } from 'CommonUI/src/Components/Button/Button';
import Modal, { ModalWidth } from 'CommonUI/src/Components/Modal/Modal';
import BadDataException from 'Common/Types/Exception/BadDataException';
import useAsyncEffect from 'use-async-effect';
import ProbeStatusElement from '../../../Components/Probe/ProbeStatus';

const MonitorProbes: FunctionComponent<PageComponentProps> = (
    _props: PageComponentProps
): ReactElement => {
    const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);
    const [showViewLogsModal, setShowViewLogsModal] = useState<boolean>(false);
    const [logs, setLogs] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [error, setError] = useState<string>('');

    const [probes, setProbes] = useState<Array<Probe>>([]);

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

            const projectProbeList: ListResult<Probe> = await ModelAPI.getList({
                modelType: Probe,
                query: {
                    projectId: DashboardNavigation.getProjectId()?.toString(),
                },
                limit: LIMIT_PER_PROJECT,
                skip: 0,
                select: {
                    name: true,
                    _id: true,
                },
                sort: {},
            });

            const globalProbeList: ListResult<Probe> = await ModelAPI.getList({
                modelType: Probe,
                query: {},
                limit: LIMIT_PER_PROJECT,
                skip: 0,
                select: {
                    name: true,
                    _id: true,
                },
                sort: {},
                requestOptions: {
                    overrideRequestUrl: URL.fromString(
                        APP_API_URL.toString()
                    ).addRoute('/probe/global-probes'),
                },
            });

            setProbes([...projectProbeList.data, ...globalProbeList.data]);
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
                    id="monitoring-probes-empty-state"
                    icon={IconProp.Signal}
                    title={'No Monitoring Probes for Manual Monitors'}
                    description={
                        <>
                            This is a manual monitor. It does not monitor
                            anything and so, it cannot have monitoring probes
                            set. You can have monitoring probes on other monitor
                            types.{' '}
                        </>
                    }
                />
            );
        }

        return (
            <ModelTable<MonitorProbe>
                modelType={MonitorProbe}
                query={{
                    projectId: DashboardNavigation.getProjectId()?.toString(),
                    monitorId: modelId.toString(),
                }}
                onBeforeCreate={(item: MonitorProbe): Promise<MonitorProbe> => {
                    item.monitorId = modelId;
                    item.projectId = DashboardNavigation.getProjectId()!;

                    return Promise.resolve(item);
                }}
                id="probes-table"
                name="Monitor > Monitor Probes"
                isDeleteable={false}
                isEditable={true}
                isCreateable={true}
                cardProps={{
                    title: 'Probes',
                    description:
                        'List of probes that help you monitor this resource.',
                }}
                noItemsMessage={
                    'No probes found for this resource. However, you can add some probes to monitor this resource.'
                }
                viewPageRoute={Navigation.getCurrentRoute()}
                selectMoreFields={{
                    lastMonitoringLog: true,
                }}
                actionButtons={[
                    {
                        title: 'View Logs',
                        buttonStyleType: ButtonStyleType.NORMAL,
                        icon: IconProp.List,
                        onClick: async (
                            item: JSONObject,
                            onCompleteAction: Function
                        ) => {
                            setLogs(
                                item['lastMonitoringLog']
                                    ? JSON.stringify(
                                          item['lastMonitoringLog'],
                                          null,
                                          2
                                      )
                                    : 'Not monitored yet'
                            );
                            setShowViewLogsModal(true);

                            onCompleteAction();
                        },
                    },
                ]}
                formFields={[
                    {
                        field: {
                            probe: true,
                        },
                        title: 'Probe',
                        stepId: 'incident-details',
                        description: 'Which probe do you want to use?',
                        fieldType: FormFieldSchemaType.Dropdown,
                        dropdownOptions: probes.map((probe: Probe) => {
                            if (!probe.name || !probe._id) {
                                throw new BadDataException(
                                    `Probe name or id is missing`
                                );
                            }

                            return {
                                label: probe.name,
                                value: probe._id,
                            };
                        }),
                        required: true,
                        placeholder: 'Probe',
                    },

                    {
                        field: {
                            isEnabled: true,
                        },
                        title: 'Enabled',
                        fieldType: FormFieldSchemaType.Toggle,
                        required: false,
                    },
                ]}
                showRefreshButton={true}
                showFilterButton={false}
                columns={[
                    {
                        field: {
                            probe: {
                                name: true,
                                iconFileId: true,
                            },
                        },
                        isFilterable: false,
                        title: 'Probe',
                        type: FieldType.Entity,
                        getElement: (item: JSONObject): ReactElement => {
                            return (
                                <ProbeElement
                                    probe={item['probe'] as JSONObject}
                                />
                            );
                        },
                    },
                    {
                        field: {
                            probe: {
                                lastAlive: true,
                            },
                        },
                        title: 'Probe Status',
                        type: FieldType.Text,
                        isFilterable: false,
                        getElement: (item: JSONObject): ReactElement => {
                            return (
                                <ProbeStatusElement
                                    probe={item['probe'] as JSONObject}
                                />
                            );
                        },
                    },
                    {
                        field: {
                            lastPingAt: true,
                        },
                        title: 'Last Monitored At',
                        type: FieldType.DateTime,
                        isFilterable: false,
                        noValueMessage: 'Will be picked up by this probe soon.',
                    },
                    {
                        field: {
                            isEnabled: true,
                        },
                        title: 'Enabled',
                        type: FieldType.Boolean,
                        isFilterable: false,
                    },
                ]}
            />
        );
    };

    return (
        <Fragment>
            <DisabledWarning monitorId={modelId} />
            {getPageContent()}
            {showViewLogsModal && (
                <Modal
                    title={'Monitoring Logs'}
                    description="Here are the latest monitoring log for this resource."
                    isLoading={false}
                    modalWidth={ModalWidth.Large}
                    onSubmit={() => {
                        setShowViewLogsModal(false);
                    }}
                    submitButtonText={'Close'}
                    submitButtonStyleType={ButtonStyleType.NORMAL}
                >
                    <div className="text-gray-500 mt-5 text-sm h-96 overflow-y-auto overflow-x-hidden p-5 border-gray-50 border border-2 bg-gray-100 rounded">
                        {logs.split('\n').map((log: string, i: number) => {
                            return <div key={i}>{log}</div>;
                        })}
                    </div>
                </Modal>
            )}
        </Fragment>
    );
};

export default MonitorProbes;
