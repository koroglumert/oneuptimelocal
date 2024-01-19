import React, { useState, useEffect } from 'react';
import Route from 'Common/Types/API/Route';
import {
    Routes,
    Route as PageRoute,
    useNavigate,
    useLocation,
    useParams,
} from 'react-router-dom';
import MasterPage from './Components/MasterPage/MasterPage';

import PageNotFound from './Pages/NotFound/PageNotFound';
import Overview from './Pages/Overview/Overview';
import IncidentList from './Pages/Incidents/List';
import IncidentDetail from './Pages/Incidents/Detail';
import AnnouncementList from './Pages/Announcement/List';
import AnnouncementDetail from './Pages/Announcement/Detail';
import ScheduledEventList from './Pages/ScheduledEvent/List';
import ScheduledEventDetail from './Pages/ScheduledEvent/Detail';
import EmailSubscribe from './Pages/Subscribe/EmailSubscribe';
import SMSSubscribe from './Pages/Subscribe/SmsSubscribe';
// Accounts.
import Login from './Pages/Accounts/Login';
import Sso from './Pages/Accounts/SSO';
import ForgotPassword from './Pages/Accounts/ForgotPassword';
import ResetPassword from './Pages/Accounts/ResetPassword';

import RouteMap from './Utils/RouteMap';
import PageMap from './Utils/PageMap';

import Navigation from 'CommonUI/src/Utils/Navigation';
import { JSONObject } from 'Common/Types/JSON';
import JSONFunctions from 'Common/Types/JSONFunctions';
import ObjectID from 'Common/Types/ObjectID';

// Logout.
import Logout from './Pages/Accounts/Logout';
import StatusPageUtil from './Utils/StatusPage';
import UpdateSubscription from './Pages/Subscribe/UpdateSubscription';

const App: () => JSX.Element = () => {
    Navigation.setNavigateHook(useNavigate());
    Navigation.setLocation(useLocation());
    Navigation.setParams(useParams());

    const [isPreview, setIsPreview] = useState<boolean>(false);
    const [enableEmailSubscribers, setenableEmailSubscribers] =
        useState<boolean>(true);
    const [
        allowSubscribersToChooseResources,
        setAllowSubscribersToChooseResources,
    ] = useState<boolean>(false);
    const [enableSMSSubscribers, setenableSMSSubscribers] =
        useState<boolean>(false);
    const [statusPageName, setStatusPageName] = useState<string>('');
    const [statusPageLogoFileId, setStatusPageLogoFileId] =
        useState<string>('');
    const [isPrivateStatusPage, setIsPrivateStatusPage] =
        useState<boolean>(false);

    const [hasEnabledSSO, setHasEnabledSSO] = useState<boolean>(false);
    const [forceSSO, setForceSSO] = useState<boolean>(false);

    useEffect(() => {
        const preview: boolean = StatusPageUtil.isPreviewPage();
        setIsPreview(preview);
    }, []);

    // js.
    const [javascript, setJavaScript] = useState<string | null>(null);

    const onPageLoadComplete: Function = (): void => {
        if (javascript) {
            // run custom javascipt.
            new Function(javascript)();
        }
    };

    return (
        <MasterPage
            isPreview={isPreview}
            enableSMSSubscribers={enableSMSSubscribers}
            enableEmailSubscribers={enableEmailSubscribers}
            isPrivateStatusPage={isPrivateStatusPage}
            onLoadComplete={(masterpage: JSONObject) => {
                document.title =
                    (JSONFunctions.getJSONValueInPath(
                        masterpage || {},
                        'statusPage.pageTitle'
                    ) as string | null) || 'Status Page';

                document
                    .querySelector('meta[name="description"]')
                    ?.setAttribute(
                        'content',
                        (JSONFunctions.getJSONValueInPath(
                            masterpage || {},
                            'statusPage.pageDescription'
                        ) as string | null) || ''
                    );

                const javascript: string | null =
                    JSONFunctions.getJSONValueInPath(
                        masterpage || {},
                        'statusPage.customJavaScript'
                    ) as string | null;
                if (javascript) {
                    setJavaScript(javascript);
                }

                const statusPageName: string | null =
                    JSONFunctions.getJSONValueInPath(
                        masterpage || {},
                        'statusPage.pageTitle'
                    ) as string | null;

                const isPrivateStatusPage: boolean =
                    !JSONFunctions.getJSONValueInPath(
                        masterpage || {},
                        'statusPage.isPublicStatusPage'
                    ) as boolean;

                const enableEmailSubscribers: boolean =
                    JSONFunctions.getJSONValueInPath(
                        masterpage || {},
                        'statusPage.enableEmailSubscribers'
                    ) as boolean;

                const enableSMSSubscribers: boolean =
                    JSONFunctions.getJSONValueInPath(
                        masterpage || {},
                        'statusPage.enableSmsSubscribers'
                    ) as boolean;

                const allowSubscribersToChooseResources: boolean =
                    JSONFunctions.getJSONValueInPath(
                        masterpage || {},
                        'statusPage.allowSubscribersToChooseResources'
                    ) as boolean;

                setAllowSubscribersToChooseResources(
                    allowSubscribersToChooseResources
                );

                setenableSMSSubscribers(enableSMSSubscribers);
                setenableEmailSubscribers(enableEmailSubscribers);

                StatusPageUtil.setIsPrivateStatusPage(isPrivateStatusPage);
                setIsPrivateStatusPage(isPrivateStatusPage);

                const statusPageId: string | null =
                    JSONFunctions.getJSONValueInPath(
                        masterpage || {},
                        'statusPage._id'
                    ) as string | null;

                StatusPageUtil.setStatusPageId(
                    statusPageId ? new ObjectID(statusPageId.toString()) : null
                );

                setStatusPageName(statusPageName || 'Status Page');

                const fileId: string | null = JSONFunctions.getJSONValueInPath(
                    masterpage || {},
                    'statusPage.logoFileId'
                ) as string | null;

                setStatusPageLogoFileId(fileId || '');

                setHasEnabledSSO(
                    JSONFunctions.getJSONValueInPath(
                        masterpage || {},
                        'hasEnabledSSO'
                    ) as boolean
                );

                setForceSSO(
                    JSONFunctions.getJSONValueInPath(
                        masterpage || {},
                        'statusPage.requireSsoForLogin'
                    ) as boolean
                );
            }}
        >
            <Routes>
                {/* Live */}

                <PageRoute
                    path={RouteMap[PageMap.OVERVIEW]?.toString() || ''}
                    element={
                        <Overview
                            pageRoute={RouteMap[PageMap.OVERVIEW] as Route}
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                        />
                    }
                />

                <PageRoute
                    path={RouteMap[PageMap.LOGIN]?.toString() || ''}
                    element={
                        <Login
                            statusPageName={statusPageName}
                            logoFileId={new ObjectID(statusPageLogoFileId)}
                            forceSSO={forceSSO}
                            hasEnabledSSOConfig={hasEnabledSSO}
                        />
                    }
                />

                <PageRoute
                    path={RouteMap[PageMap.SSO]?.toString() || ''}
                    element={
                        <Sso
                            statusPageName={statusPageName}
                            logoFileId={new ObjectID(statusPageLogoFileId)}
                        />
                    }
                />

                <PageRoute
                    path={RouteMap[PageMap.RESET_PASSWORD]?.toString() || ''}
                    element={
                        <ResetPassword
                            statusPageName={statusPageName}
                            logoFileId={new ObjectID(statusPageLogoFileId)}
                            forceSSO={forceSSO}
                        />
                    }
                />

                <PageRoute
                    path={RouteMap[PageMap.FORGOT_PASSWORD]?.toString() || ''}
                    element={
                        <ForgotPassword
                            statusPageName={statusPageName}
                            logoFileId={new ObjectID(statusPageLogoFileId)}
                            forceSSO={forceSSO}
                        />
                    }
                />

                <PageRoute
                    path={
                        RouteMap[PageMap.SCHEDULED_EVENT_DETAIL]?.toString() ||
                        ''
                    }
                    element={
                        <ScheduledEventDetail
                            pageRoute={
                                RouteMap[
                                    PageMap.SCHEDULED_EVENT_DETAIL
                                ] as Route
                            }
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                        />
                    }
                />

                <PageRoute
                    path={
                        RouteMap[PageMap.SCHEDULED_EVENT_LIST]?.toString() || ''
                    }
                    element={
                        <ScheduledEventList
                            pageRoute={
                                RouteMap[PageMap.SCHEDULED_EVENT_LIST] as Route
                            }
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                        />
                    }
                />

                <PageRoute
                    path={RouteMap[PageMap.INCIDENT_DETAIL]?.toString() || ''}
                    element={
                        <IncidentDetail
                            pageRoute={
                                RouteMap[PageMap.INCIDENT_DETAIL] as Route
                            }
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                        />
                    }
                />

                <PageRoute
                    path={RouteMap[PageMap.INCIDENT_LIST]?.toString() || ''}
                    element={
                        <IncidentList
                            pageRoute={RouteMap[PageMap.INCIDENT_LIST] as Route}
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                        />
                    }
                />

                <PageRoute
                    path={
                        RouteMap[PageMap.ANNOUNCEMENT_DETAIL]?.toString() || ''
                    }
                    element={
                        <AnnouncementDetail
                            pageRoute={
                                RouteMap[PageMap.ANNOUNCEMENT_DETAIL] as Route
                            }
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                        />
                    }
                />

                <PageRoute
                    path={RouteMap[PageMap.ANNOUNCEMENT_LIST]?.toString() || ''}
                    element={
                        <AnnouncementList
                            pageRoute={
                                RouteMap[PageMap.ANNOUNCEMENT_LIST] as Route
                            }
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                        />
                    }
                />

                <PageRoute
                    path={RouteMap[PageMap.SUBSCRIBE_EMAIL]?.toString() || ''}
                    element={
                        <EmailSubscribe
                            pageRoute={
                                RouteMap[PageMap.SUBSCRIBE_EMAIL] as Route
                            }
                            allowSubscribersToChooseResources={
                                allowSubscribersToChooseResources
                            }
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                            enableEmailSubscribers={enableEmailSubscribers}
                            enableSMSSubscribers={enableSMSSubscribers}
                        />
                    }
                />

                <PageRoute
                    path={RouteMap[PageMap.SUBSCRIBE_SMS]?.toString() || ''}
                    element={
                        <SMSSubscribe
                            pageRoute={RouteMap[PageMap.SUBSCRIBE_SMS] as Route}
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                            allowSubscribersToChooseResources={
                                allowSubscribersToChooseResources
                            }
                            enableEmailSubscribers={enableEmailSubscribers}
                            enableSMSSubscribers={enableSMSSubscribers}
                        />
                    }
                />

                <PageRoute
                    path={
                        RouteMap[PageMap.UPDATE_SUBSCRIPTION]?.toString() || ''
                    }
                    element={
                        <UpdateSubscription
                            pageRoute={
                                RouteMap[PageMap.UPDATE_SUBSCRIPTION] as Route
                            }
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                            allowSubscribersToChooseResources={
                                allowSubscribersToChooseResources
                            }
                            enableEmailSubscribers={enableEmailSubscribers}
                            enableSMSSubscribers={enableSMSSubscribers}
                        />
                    }
                />

                {/* Preview */}

                <PageRoute
                    path={RouteMap[PageMap.PREVIEW_OVERVIEW]?.toString() || ''}
                    element={
                        <Overview
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                            pageRoute={
                                RouteMap[PageMap.PREVIEW_OVERVIEW] as Route
                            }
                        />
                    }
                />

                <PageRoute
                    path={
                        RouteMap[PageMap.PREVIEW_SUBSCRIBE_EMAIL]?.toString() ||
                        ''
                    }
                    element={
                        <EmailSubscribe
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                            pageRoute={
                                RouteMap[
                                    PageMap.PREVIEW_SUBSCRIBE_EMAIL
                                ] as Route
                            }
                            allowSubscribersToChooseResources={
                                allowSubscribersToChooseResources
                            }
                            enableEmailSubscribers={enableEmailSubscribers}
                            enableSMSSubscribers={enableSMSSubscribers}
                        />
                    }
                />

                <PageRoute
                    path={
                        RouteMap[
                            PageMap.PREVIEW_UPDATE_SUBSCRIPTION
                        ]?.toString() || ''
                    }
                    element={
                        <UpdateSubscription
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                            pageRoute={
                                RouteMap[
                                    PageMap.PREVIEW_UPDATE_SUBSCRIPTION
                                ] as Route
                            }
                            allowSubscribersToChooseResources={
                                allowSubscribersToChooseResources
                            }
                            enableEmailSubscribers={enableEmailSubscribers}
                            enableSMSSubscribers={enableSMSSubscribers}
                        />
                    }
                />

                <PageRoute
                    path={
                        RouteMap[PageMap.PREVIEW_SUBSCRIBE_SMS]?.toString() ||
                        ''
                    }
                    element={
                        <SMSSubscribe
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                            pageRoute={
                                RouteMap[PageMap.PREVIEW_SUBSCRIBE_SMS] as Route
                            }
                            allowSubscribersToChooseResources={
                                allowSubscribersToChooseResources
                            }
                            enableEmailSubscribers={enableEmailSubscribers}
                            enableSMSSubscribers={enableSMSSubscribers}
                        />
                    }
                />

                <PageRoute
                    path={RouteMap[PageMap.PREVIEW_LOGOUT]?.toString() || ''}
                    element={<Logout />}
                />

                <PageRoute
                    path={RouteMap[PageMap.LOGOUT]?.toString() || ''}
                    element={<Logout />}
                />

                <PageRoute
                    path={
                        RouteMap[
                            PageMap.PREVIEW_SCHEDULED_EVENT_DETAIL
                        ]?.toString() || ''
                    }
                    element={
                        <ScheduledEventDetail
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                            pageRoute={
                                RouteMap[
                                    PageMap.PREVIEW_SCHEDULED_EVENT_DETAIL
                                ] as Route
                            }
                        />
                    }
                />

                <PageRoute
                    path={
                        RouteMap[
                            PageMap.PREVIEW_SCHEDULED_EVENT_LIST
                        ]?.toString() || ''
                    }
                    element={
                        <ScheduledEventList
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                            pageRoute={
                                RouteMap[
                                    PageMap.PREVIEW_SCHEDULED_EVENT_LIST
                                ] as Route
                            }
                        />
                    }
                />

                <PageRoute
                    path={
                        RouteMap[PageMap.PREVIEW_INCIDENT_DETAIL]?.toString() ||
                        ''
                    }
                    element={
                        <IncidentDetail
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                            pageRoute={
                                RouteMap[
                                    PageMap.PREVIEW_INCIDENT_DETAIL
                                ] as Route
                            }
                        />
                    }
                />

                <PageRoute
                    path={
                        RouteMap[PageMap.PREVIEW_INCIDENT_LIST]?.toString() ||
                        ''
                    }
                    element={
                        <IncidentList
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                            pageRoute={
                                RouteMap[PageMap.PREVIEW_INCIDENT_LIST] as Route
                            }
                        />
                    }
                />

                <PageRoute
                    path={
                        RouteMap[
                            PageMap.PREVIEW_ANNOUNCEMENT_DETAIL
                        ]?.toString() || ''
                    }
                    element={
                        <AnnouncementDetail
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                            pageRoute={
                                RouteMap[
                                    PageMap.PREVIEW_ANNOUNCEMENT_DETAIL
                                ] as Route
                            }
                        />
                    }
                />

                <PageRoute
                    path={
                        RouteMap[
                            PageMap.PREVIEW_ANNOUNCEMENT_LIST
                        ]?.toString() || ''
                    }
                    element={
                        <AnnouncementList
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                            pageRoute={
                                RouteMap[
                                    PageMap.PREVIEW_ANNOUNCEMENT_LIST
                                ] as Route
                            }
                        />
                    }
                />

                <PageRoute
                    path={RouteMap[PageMap.PREVIEW_LOGIN]?.toString() || ''}
                    element={
                        <Login
                            statusPageName={statusPageName}
                            logoFileId={new ObjectID(statusPageLogoFileId)}
                            forceSSO={forceSSO}
                            hasEnabledSSOConfig={hasEnabledSSO}
                        />
                    }
                />

                <PageRoute
                    path={
                        RouteMap[PageMap.PREVIEW_RESET_PASSWORD]?.toString() ||
                        ''
                    }
                    element={
                        <ResetPassword
                            statusPageName={statusPageName}
                            logoFileId={new ObjectID(statusPageLogoFileId)}
                            forceSSO={forceSSO}
                        />
                    }
                />

                <PageRoute
                    path={
                        RouteMap[PageMap.PREVIEW_FORGOT_PASSWORD]?.toString() ||
                        ''
                    }
                    element={
                        <ForgotPassword
                            statusPageName={statusPageName}
                            logoFileId={new ObjectID(statusPageLogoFileId)}
                            forceSSO={forceSSO}
                        />
                    }
                />

                <PageRoute
                    path={RouteMap[PageMap.PREVIEW_SSO]?.toString() || ''}
                    element={
                        <Sso
                            statusPageName={statusPageName}
                            logoFileId={new ObjectID(statusPageLogoFileId)}
                        />
                    }
                />

                {/* 👇️ only match this when no other routes match */}

                <PageRoute
                    path="*"
                    element={
                        <PageNotFound
                            onLoadComplete={() => {
                                onPageLoadComplete();
                            }}
                            pageRoute={RouteMap[PageMap.NOT_FOUND] as Route}
                        />
                    }
                />
            </Routes>
        </MasterPage>
    );
};

export default App;
