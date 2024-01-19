import { EVERY_MINUTE } from 'Common/Utils/CronTime';
import StatusPageSubscriberService from 'CommonServer/Services/StatusPageSubscriberService';
import QueryHelper from 'CommonServer/Types/Database/QueryHelper';
import OneUptimeDate from 'Common/Types/Date';
import LIMIT_MAX, { LIMIT_PER_PROJECT } from 'Common/Types/Database/LimitMax';
import RunCron from '../../Utils/Cron';
import StatusPageSubscriber from 'Model/Models/StatusPageSubscriber';
import { FileRoute } from 'Common/ServiceRoute';
import URL from 'Common/Types/API/URL';
import MailService from 'CommonServer/Services/MailService';
import EmailTemplateType from 'Common/Types/Email/EmailTemplateType';
import logger from 'CommonServer/Utils/Logger';
import StatusPageResource from 'Model/Models/StatusPageResource';
import StatusPageResourceService from 'CommonServer/Services/StatusPageResourceService';
import Dictionary from 'Common/Types/Dictionary';
import StatusPageService from 'CommonServer/Services/StatusPageService';
import StatusPage from 'Model/Models/StatusPage';
import ObjectID from 'Common/Types/ObjectID';
import ScheduledMaintenance from 'Model/Models/ScheduledMaintenance';
import ScheduledMaintenanceService from 'CommonServer/Services/ScheduledMaintenanceService';
import Monitor from 'Model/Models/Monitor';
import ScheduledMaintenancePublicNote from 'Model/Models/ScheduledMaintenancePublicNote';
import ScheduledMaintenancePublicNoteService from 'CommonServer/Services/ScheduledMaintenancePublicNoteService';
import Markdown from 'CommonServer/Types/Markdown';
import ProjectSmtpConfigService from 'CommonServer/Services/ProjectSmtpConfigService';
import Protocol from 'Common/Types/API/Protocol';
import Hostname from 'Common/Types/API/Hostname';
import DatabaseConfig from 'CommonServer/DatabaseConfig';
import SMS from 'Common/Types/SMS/SMS';
import SmsService from 'CommonServer/Services/SmsService';
import ProjectCallSMSConfigService from 'CommonServer/Services/ProjectCallSMSConfigService';

RunCron(
    'ScheduledMaintenancePublicNote:SendNotificationToSubscribers',
    { schedule: EVERY_MINUTE, runOnStartup: false },
    async () => {
        // get all incident notes of all the projects

        const host: Hostname = await DatabaseConfig.getHost();
        const httpProtocol: Protocol = await DatabaseConfig.getHttpProtocol();

        const publicNotes: Array<ScheduledMaintenancePublicNote> =
            await ScheduledMaintenancePublicNoteService.findBy({
                query: {
                    isStatusPageSubscribersNotifiedOnNoteCreated: false,
                    createdAt: QueryHelper.lessThan(
                        OneUptimeDate.getCurrentDate()
                    ),
                },
                props: {
                    isRoot: true,
                },
                limit: LIMIT_MAX,
                skip: 0,
                select: {
                    _id: true,
                    note: true,
                    scheduledMaintenanceId: true,
                },
            });

        for (const publicNote of publicNotes) {
            // get all scheduled events of all the projects.
            const event: ScheduledMaintenance | null =
                await ScheduledMaintenanceService.findOneById({
                    id: publicNote.scheduledMaintenanceId!,
                    props: {
                        isRoot: true,
                    },
                    select: {
                        _id: true,
                        title: true,
                        description: true,
                        startsAt: true,
                        monitors: {
                            _id: true,
                        },
                    },
                });

            if (!event) {
                continue;
            }

            if (!event.monitors || event.monitors.length === 0) {
                continue;
            }

            await ScheduledMaintenancePublicNoteService.updateOneById({
                id: publicNote.id!,
                data: {
                    isStatusPageSubscribersNotifiedOnNoteCreated: true,
                },
                props: {
                    isRoot: true,
                    ignoreHooks: true,
                },
            });

            // get status page resources from monitors.

            const statusPageResources: Array<StatusPageResource> =
                await StatusPageResourceService.findBy({
                    query: {
                        monitorId: QueryHelper.in(
                            event.monitors
                                .filter((m: Monitor) => {
                                    return m._id;
                                })
                                .map((m: Monitor) => {
                                    return new ObjectID(m._id!);
                                })
                        ),
                    },
                    props: {
                        isRoot: true,
                        ignoreHooks: true,
                    },
                    skip: 0,
                    limit: LIMIT_PER_PROJECT,
                    select: {
                        _id: true,
                        displayName: true,
                        statusPageId: true,
                    },
                });

            const statusPageToResources: Dictionary<Array<StatusPageResource>> =
                {};

            for (const resource of statusPageResources) {
                if (!resource.statusPageId) {
                    continue;
                }

                if (!statusPageToResources[resource.statusPageId?.toString()]) {
                    statusPageToResources[resource.statusPageId?.toString()] =
                        [];
                }

                statusPageToResources[resource.statusPageId?.toString()]?.push(
                    resource
                );
            }

            const statusPages: Array<StatusPage> =
                await StatusPageSubscriberService.getStatusPagesToSendNotification(
                    Object.keys(statusPageToResources).map((i: string) => {
                        return new ObjectID(i);
                    })
                );

            for (const statuspage of statusPages) {
                if (!statuspage.id) {
                    continue;
                }

                const subscribers: Array<StatusPageSubscriber> =
                    await StatusPageSubscriberService.getSubscribersByStatusPage(
                        statuspage.id!,
                        {
                            isRoot: true,
                            ignoreHooks: true,
                        }
                    );

                const statusPageURL: string =
                    await StatusPageService.getStatusPageURL(statuspage.id);

                const statusPageName: string =
                    statuspage.pageTitle || statuspage.name || 'Status Page';

                // Send email to Email subscribers.

                for (const subscriber of subscribers) {
                    if (!subscriber._id) {
                        continue;
                    }

                    const shouldNotifySubscriber: boolean =
                        StatusPageSubscriberService.shouldSendNotification({
                            subscriber: subscriber,
                            statusPageResources:
                                statusPageToResources[statuspage._id!] || [],
                            statusPage: statuspage,
                        });

                    if (!shouldNotifySubscriber) {
                        continue;
                    }

                    const unsubscribeUrl: string =
                        StatusPageSubscriberService.getUnsubscribeLink(
                            URL.fromString(statusPageURL),
                            subscriber.id!
                        ).toString();

                    if (subscriber.subscriberPhone) {
                        const sms: SMS = {
                            message: `
                                    ${statusPageName} - New note has been posted to maintenance event.

                                    ${event.title || ''}
                                    
                                    To view this note, visit ${statusPageURL}
        
                                    To update notification preferences or unsubscribe, visit ${unsubscribeUrl}
                                    `,
                            to: subscriber.subscriberPhone,
                        };

                        // send sms here.
                        SmsService.sendSms(sms, {
                            projectId: statuspage.projectId,
                            customTwilioConfig:
                                ProjectCallSMSConfigService.toTwilioConfig(
                                    statuspage.callSmsConfig
                                ),
                        }).catch((err: Error) => {
                            logger.error(err);
                        });
                    }

                    if (subscriber.subscriberEmail) {
                        // send email here.

                        MailService.sendMail(
                            {
                                toEmail: subscriber.subscriberEmail,
                                templateType:
                                    EmailTemplateType.SubscriberScheduledMaintenanceEventNoteCreated,
                                vars: {
                                    note: Markdown.convertToHTML(
                                        publicNote.note!
                                    ),
                                    statusPageName: statusPageName,
                                    statusPageUrl: statusPageURL,
                                    logoUrl: statuspage.logoFileId
                                        ? new URL(httpProtocol, host)
                                              .addRoute(FileRoute)
                                              .addRoute(
                                                  '/image/' +
                                                      statuspage.logoFileId
                                              )
                                              .toString()
                                        : '',
                                    isPublicStatusPage:
                                        statuspage.isPublicStatusPage
                                            ? 'true'
                                            : 'false',
                                    resourcesAffected:
                                        statusPageToResources[statuspage._id!]
                                            ?.map((r: StatusPageResource) => {
                                                return r.displayName;
                                            })
                                            .join(', ') || 'None',

                                    scheduledAt:
                                        OneUptimeDate.getDateAsFormattedString(
                                            event.startsAt!
                                        ),
                                    eventTitle: event.title || '',
                                    eventDescription: event.description || '',
                                    unsubscribeUrl: unsubscribeUrl,
                                },
                                subject:
                                    statusPageName +
                                    ` - New note has been posted to maintenance event`,
                            },
                            {
                                mailServer:
                                    ProjectSmtpConfigService.toEmailServer(
                                        statuspage.smtpConfig
                                    ),
                                projectId: statuspage.projectId!,
                            }
                        ).catch((err: Error) => {
                            logger.error(err);
                        });
                    }
                }
            }
        }
    }
);
