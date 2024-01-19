import Route from 'Common/Types/API/Route';
import SubscriptionPlan from 'Common/Types/Billing/SubscriptionPlan';
import { JSONObject } from 'Common/Types/JSON';
import { ButtonStyleType } from 'CommonUI/src/Components/Button/Button';
import Card from 'CommonUI/src/Components/Card/Card';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import IconProp from 'Common/Types/Icon/IconProp';
import CardModelDetail from 'CommonUI/src/Components/ModelDetail/CardModelDetail';
import ModelTable from 'CommonUI/src/Components/ModelTable/ModelTable';
import { RadioButton } from 'CommonUI/src/Components/RadioButtons/GroupRadioButtons';
import Navigation from 'CommonUI/src/Utils/Navigation';
import Project from 'Model/Models/Project';
import React, {
    Fragment,
    FunctionComponent,
    ReactElement,
    useRef,
    useState,
} from 'react';
import PageMap from '../../Utils/PageMap';
import RouteMap, { RouteUtil } from '../../Utils/RouteMap';
import PageComponentProps from '../PageComponentProps';
import BillingPaymentMethod from 'Model/Models/BillingPaymentMethod';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import Modal from 'CommonUI/src/Components/Modal/Modal';
import ButtonType from 'CommonUI/src/Components/Button/ButtonTypes';
import HTTPResponse from 'Common/Types/API/HTTPResponse';
import BaseAPI from 'CommonUI/src/Utils/API/API';
import URL from 'Common/Types/API/URL';
import {
    BILLING_ENABLED,
    BILLING_PUBLIC_KEY,
    APP_API_URL,
    getAllEnvVars,
} from 'CommonUI/src/Config';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import ModelAPI from 'CommonUI/src/Utils/ModelAPI/ModelAPI';
import useAsyncEffect from 'use-async-effect';
import CheckoutForm from './BillingPaymentMethodForm';
import Text from 'Common/Types/Text';
import DashboardNavigation from '../../Utils/Navigation';
import Toggle from 'CommonUI/src/Components/Toggle/Toggle';
import Reseller from 'Model/Models/Reseller';
import PageLoader from 'CommonUI/src/Components/Loader/PageLoader';
import ResellerPlan from 'Model/Models/ResellerPlan';
import ErrorMessage from 'CommonUI/src/Components/ErrorMessage/ErrorMessage';
import Icon from 'CommonUI/src/Components/Icon/Icon';

export interface ComponentProps extends PageComponentProps {}

const Settings: FunctionComponent<ComponentProps> = (
    _props: ComponentProps
): ReactElement => {
    const [isSubscriptionPlanYearly, setIsSubscriptionPlanYearly] =
        useState<boolean>(true);
    const [showPaymentMethodModal, setShowPaymentMethodModal] =
        useState<boolean>(false);
    const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
    const [isModalSubmitButtonLoading, setIsModalSubmitButtonLoading] =
        useState<boolean>(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const [setupIntent, setSetupIntent] = useState<string>('');
    const [stripe, setStripe] = useState<Stripe | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [error, setError] = useState<string | null>(null);

    const [reseller, setReseller] = useState<Reseller | null>(null);

    const [resellerPlan, setResellerPlan] = useState<ResellerPlan | null>(null);

    const formRef: any = useRef<any>(null);

    useAsyncEffect(async () => {
        setIsModalLoading(true);
        setStripe(await loadStripe(BILLING_PUBLIC_KEY));
        setIsModalLoading(false);

        setIsLoading(true);

        try {
            const project: Project | null = await ModelAPI.getItem<Project>({
                modelType: Project,
                id: DashboardNavigation.getProjectId()!,
                select: {
                    reseller: {
                        name: true,
                        description: true,
                        _id: true,
                        changePlanLink: true,
                    },
                    resellerPlan: {
                        name: true,
                        description: true,
                        _id: true,
                        monitorLimit: true,
                        teamMemberLimit: true,
                        planType: true,
                        otherFeatures: true,
                    },
                },
            });

            if (project?.reseller) {
                setReseller(project.reseller);
            }

            if (project?.resellerPlan) {
                setResellerPlan(project.resellerPlan);
            }
        } catch (err) {
            setError(BaseAPI.getFriendlyMessage(err));
        }

        setIsLoading(false);
    }, []);

    const fetchSetupIntent: () => Promise<void> = async (): Promise<void> => {
        try {
            setIsModalLoading(true);

            const response: HTTPResponse<JSONObject> =
                await BaseAPI.post<JSONObject>(
                    URL.fromString(APP_API_URL.toString()).addRoute(
                        `/billing-payment-methods/setup`
                    ),
                    {},
                    ModelAPI.getCommonHeaders()
                );
            const data: JSONObject = response.data;

            setSetupIntent(data['setupIntent'] as string);
            setIsModalLoading(false);
        } catch (err) {
            setModalError(BaseAPI.getFriendlyMessage(err));
            setIsModalLoading(false);
        }
    };

    const getFooter: Function = (): ReactElement => {
        if (!BILLING_ENABLED) {
            return <></>;
        }

        return (
            <Toggle
                title="Yearly Plan"
                initialValue={isSubscriptionPlanYearly}
                description="(Save 20%)"
                onChange={(value: boolean) => {
                    setIsSubscriptionPlanYearly(value);
                }}
            />
        );
    };

    return (
        <Fragment>
            {isLoading ? <PageLoader isVisible={true} /> : <></>}

            {error ? <ErrorMessage error={error} /> : <></>}

            {!isLoading && !error ? (
                <div>
                    {!reseller && (
                        <CardModelDetail
                            name="Plan Details"
                            cardProps={{
                                title: 'Current Plan',
                                description:
                                    'Here is the plan this project is subscribed to.',
                            }}
                            isEditable={true}
                            editButtonText={'Change Plan'}
                            formFields={[
                                {
                                    field: {
                                        paymentProviderPlanId: true,
                                    },
                                    validation: {
                                        minLength: 6,
                                    },
                                    fieldType: FormFieldSchemaType.RadioButton,
                                    radioButtonOptions:
                                        SubscriptionPlan.getSubscriptionPlans(
                                            getAllEnvVars()
                                        ).map(
                                            (
                                                plan: SubscriptionPlan
                                            ): RadioButton => {
                                                let description: string =
                                                    plan.isCustomPricing()
                                                        ? `Our sales team will contact you soon.`
                                                        : `Billed ${
                                                              isSubscriptionPlanYearly
                                                                  ? 'yearly'
                                                                  : 'monthly'
                                                          }. ${
                                                              plan.getTrialPeriod() >
                                                              0
                                                                  ? `Free ${plan.getTrialPeriod()} days trial.`
                                                                  : ''
                                                          }`;

                                                if (
                                                    isSubscriptionPlanYearly &&
                                                    plan.getYearlySubscriptionAmountInUSD() ===
                                                        0
                                                ) {
                                                    description =
                                                        'This plan is free, forever. ';
                                                }

                                                if (
                                                    !isSubscriptionPlanYearly &&
                                                    plan.getMonthlySubscriptionAmountInUSD() ===
                                                        0
                                                ) {
                                                    description =
                                                        'This plan is free, forever. ';
                                                }

                                                return {
                                                    value: isSubscriptionPlanYearly
                                                        ? plan.getYearlyPlanId()
                                                        : plan.getMonthlyPlanId(),
                                                    title: plan.getName(),
                                                    description: description,
                                                    sideTitle:
                                                        plan.isCustomPricing()
                                                            ? 'Custom Price'
                                                            : isSubscriptionPlanYearly
                                                            ? '$' +
                                                              plan
                                                                  .getYearlySubscriptionAmountInUSD()
                                                                  .toString() +
                                                              '/mo billed yearly'
                                                            : '$' +
                                                              plan
                                                                  .getMonthlySubscriptionAmountInUSD()
                                                                  .toString(),
                                                    sideDescription:
                                                        plan.isCustomPricing()
                                                            ? ''
                                                            : isSubscriptionPlanYearly
                                                            ? `~ $${
                                                                  plan.getYearlySubscriptionAmountInUSD() *
                                                                  12
                                                              } per user / year`
                                                            : `/month per user`,
                                                };
                                            }
                                        ),
                                    title: 'Please select a plan.',
                                    required: true,
                                    footerElement: getFooter(),
                                },
                            ]}
                            modelDetailProps={{
                                modelType: Project,
                                id: 'model-detail-project',
                                fields: [
                                    {
                                        field: {
                                            paymentProviderPlanId: true,
                                        },
                                        title: 'Current Plan',
                                        getElement: (
                                            item: JSONObject
                                        ): ReactElement => {
                                            const plan:
                                                | SubscriptionPlan
                                                | undefined = SubscriptionPlan.getSubscriptionPlanById(
                                                item[
                                                    'paymentProviderPlanId'
                                                ] as string,
                                                getAllEnvVars()
                                            );

                                            if (!plan) {
                                                return (
                                                    <p>
                                                        No plan selected for
                                                        this project
                                                    </p>
                                                );
                                            }

                                            const isYearlyPlan: boolean =
                                                SubscriptionPlan.isYearlyPlan(
                                                    item[
                                                        'paymentProviderPlanId'
                                                    ] as string,
                                                    getAllEnvVars()
                                                );

                                            let description: string =
                                                plan.isCustomPricing()
                                                    ? `Custom Pricing based on your needs. Our sales team will contact you shortly.`
                                                    : `$${
                                                          isYearlyPlan
                                                              ? plan.getYearlySubscriptionAmountInUSD()
                                                              : plan.getMonthlySubscriptionAmountInUSD()
                                                      } / month per user. Billed ${
                                                          isYearlyPlan
                                                              ? 'yearly'
                                                              : 'monthly'
                                                      }.`;

                                            if (
                                                isYearlyPlan &&
                                                plan.getYearlySubscriptionAmountInUSD() ===
                                                    0
                                            ) {
                                                description =
                                                    'This plan is free, forever. ';
                                            }

                                            if (
                                                !isYearlyPlan &&
                                                plan.getMonthlySubscriptionAmountInUSD() ===
                                                    0
                                            ) {
                                                description =
                                                    'This plan is free, forever. ';
                                            }

                                            return (
                                                <div>
                                                    <div className="bold">
                                                        {plan.getName()}
                                                    </div>
                                                    <div>{description}</div>
                                                </div>
                                            );
                                        },
                                    },
                                    {
                                        field: {
                                            paymentProviderSubscriptionSeats:
                                                true,
                                        },
                                        title: 'Seats',
                                        description:
                                            'These are current users in this project. To change this you need to add or remove them.',
                                        getElement: (
                                            item: JSONObject
                                        ): ReactElement => {
                                            return (
                                                <div>
                                                    <div className="bold">
                                                        {
                                                            item[
                                                                'paymentProviderSubscriptionSeats'
                                                            ] as string
                                                        }{' '}
                                                        users in this project.
                                                    </div>
                                                </div>
                                            );
                                        },
                                    },
                                ],
                                modelId: DashboardNavigation.getProjectId()!,
                            }}
                        />
                    )}

                    {reseller && (
                        <Card
                            title={`You have purchased this plan from ${reseller.name}`}
                            description={`If you would like to change the plan, please contact ${reseller.name} at ${reseller.description}`}
                            buttons={
                                reseller.changePlanLink
                                    ? [
                                          {
                                              title: `Change Plan`,
                                              onClick: () => {
                                                  Navigation.navigate(
                                                      reseller.changePlanLink!
                                                  );
                                              },
                                              icon: IconProp.Edit,
                                          },
                                      ]
                                    : []
                            }
                        >
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-gray-500">
                                    The plan you purchased from {reseller.name}{' '}
                                    is {resellerPlan?.name}
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500 mt-10">
                                        With the following features:
                                    </span>

                                    <ul className="space-y-1 mt-2">
                                        <li className="text-sm font-medium text-gray-500">
                                            {' '}
                                            <span className="text-gray-700 flex">
                                                <Icon
                                                    icon={IconProp.CheckCircle}
                                                    className="h-5 w-5 mr-1"
                                                />{' '}
                                                {resellerPlan?.monitorLimit}{' '}
                                                Monitors
                                            </span>
                                        </li>
                                        <li className="text-sm font-medium text-gray-500">
                                            {' '}
                                            <span className="text-gray-700 flex">
                                                <Icon
                                                    icon={IconProp.CheckCircle}
                                                    className="h-5 w-5 mr-1"
                                                />{' '}
                                                {resellerPlan?.teamMemberLimit}{' '}
                                                Team Members
                                            </span>
                                        </li>

                                        {resellerPlan?.otherFeatures ? (
                                            resellerPlan.otherFeatures
                                                .split(',')
                                                .map(
                                                    (
                                                        item: string,
                                                        i: number
                                                    ) => {
                                                        return (
                                                            <li
                                                                key={i}
                                                                className="text-sm font-medium text-gray-500"
                                                            >
                                                                {' '}
                                                                <span className="text-gray-700 flex">
                                                                    <Icon
                                                                        icon={
                                                                            IconProp.CheckCircle
                                                                        }
                                                                        className="h-5 w-5 mr-1"
                                                                    />{' '}
                                                                    {item}
                                                                </span>
                                                            </li>
                                                        );
                                                    }
                                                )
                                        ) : (
                                            <></>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    )}

                    <ModelTable<BillingPaymentMethod>
                        modelType={BillingPaymentMethod}
                        id="payment-methods-table"
                        isDeleteable={true}
                        isEditable={false}
                        isCreateable={false}
                        isViewable={false}
                        name="Settings > Billing > Add Payment Method"
                        cardProps={{
                            buttons: [
                                {
                                    title: 'Add Payment Method',
                                    icon: IconProp.Add,
                                    onClick: async () => {
                                        setShowPaymentMethodModal(true);
                                        await fetchSetupIntent();
                                    },
                                    buttonStyle: ButtonStyleType.NORMAL,
                                },
                            ],
                            title: 'Payment Methods',
                            description:
                                'Here is a list of payment methods attached to this project.',
                        }}
                        noItemsMessage={'No payment methods found.'}
                        query={{
                            projectId:
                                DashboardNavigation.getProjectId()?.toString(),
                        }}
                        showRefreshButton={true}
                        showFilterButton={true}
                        columns={[
                            {
                                field: {
                                    type: true,
                                },
                                title: 'Payment Method Type',
                                type: FieldType.Text,
                                isFilterable: true,
                                getElement: (item: JSONObject) => {
                                    return (
                                        <span>{`${Text.uppercaseFirstLetter(
                                            item['type'] as string
                                        )}`}</span>
                                    );
                                },
                            },
                            {
                                field: {
                                    last4Digits: true,
                                },
                                title: 'Number',
                                type: FieldType.Text,
                                isFilterable: true,
                                getElement: (item: JSONObject) => {
                                    return (
                                        <span>{`*****${item['last4Digits']}`}</span>
                                    );
                                },
                            },
                        ]}
                    />

                    {showPaymentMethodModal ? (
                        <Modal
                            title={`Add Payment Method`}
                            onSubmit={async () => {
                                setIsModalSubmitButtonLoading(true);
                                formRef.current.click();
                            }}
                            isLoading={isModalSubmitButtonLoading}
                            onClose={() => {
                                setShowPaymentMethodModal(false);
                            }}
                            submitButtonText={`Save`}
                            error={modalError || ''}
                            isBodyLoading={isModalLoading}
                            submitButtonType={ButtonType.Submit}
                        >
                            {setupIntent && !modalError && stripe ? (
                                <Elements
                                    stripe={stripe}
                                    options={{
                                        // passing the client secret obtained in step 3
                                        clientSecret: setupIntent,
                                    }}
                                >
                                    <CheckoutForm
                                        onSuccess={() => {
                                            setIsModalSubmitButtonLoading(
                                                false
                                            );
                                        }}
                                        onError={(errorMessage: string) => {
                                            setModalError(errorMessage);
                                            setIsModalSubmitButtonLoading(
                                                false
                                            );
                                        }}
                                        formRef={formRef}
                                    />
                                </Elements>
                            ) : (
                                <></>
                            )}
                            {!modalError && !setupIntent && !stripe ? (
                                <p>Loading...</p>
                            ) : (
                                <></>
                            )}
                        </Modal>
                    ) : (
                        <></>
                    )}

                    {!reseller && (
                        <Card
                            title={`Cancel Plan`}
                            description={`If you would like to cancel the plan, you need to delete the project.`}
                            buttons={[
                                {
                                    title: `Delete Project`,
                                    buttonStyle: ButtonStyleType.DANGER,
                                    onClick: () => {
                                        Navigation.navigate(
                                            RouteUtil.populateRouteParams(
                                                RouteMap[
                                                    PageMap.SETTINGS_DANGERZONE
                                                ] as Route
                                            ),
                                            {
                                                openInNewTab: true,
                                            }
                                        );
                                    },
                                    icon: IconProp.Close,
                                },
                            ]}
                        />
                    )}

                    {reseller && (
                        <Card
                            title={`Cancel Plan`}
                            description={`If you would like to cancel the plan or delete the project, please contact ${reseller.name} at ${reseller.description}`}
                        />
                    )}
                </div>
            ) : (
                <></>
            )}
        </Fragment>
    );
};

export default Settings;
