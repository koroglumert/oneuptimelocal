import UserOnCallLogTimeline from 'Model/Models/UserOnCallLogTimeline';
import UserOnCallLogTimelineService, {
    Service as UserNotificationLogTimelineServiceType,
} from '../Services/UserOnCallLogTimelineService';
import BaseAPI from './BaseAPI';
import {
    ExpressRequest,
    ExpressResponse,
    OneUptimeRequest,
} from '../Utils/Express';
import BadDataException from 'Common/Types/Exception/BadDataException';
import Response from '../Utils/Response';
import ObjectID from 'Common/Types/ObjectID';
import { JSONObject } from 'Common/Types/JSON';
import NotificationMiddleware from '../Middleware/NotificationMiddleware';
import OneUptimeDate from 'Common/Types/Date';
import URL from 'Common/Types/API/URL';
import { DashboardRoute } from 'Common/ServiceRoute';
import DatabaseConfig from '../DatabaseConfig';
import UserNotificationStatus from 'Common/Types/UserNotification/UserNotificationStatus';
import Hostname from 'Common/Types/API/Hostname';
import Protocol from 'Common/Types/API/Protocol';

export default class UserNotificationLogTimelineAPI extends BaseAPI<
    UserOnCallLogTimeline,
    UserNotificationLogTimelineServiceType
> {
    public constructor() {
        super(UserOnCallLogTimeline, UserOnCallLogTimelineService);

        this.router.post(
            `${new this.entityType()
                .getCrudApiPath()
                ?.toString()}/call/gather-input/:itemId`,
            NotificationMiddleware.isValidCallNotificationRequest,
            async (req: ExpressRequest, res: ExpressResponse) => {
                req = req as OneUptimeRequest;

                if (!req.params['itemId']) {
                    return Response.sendErrorResponse(
                        req,
                        res,
                        new BadDataException('Invalid item ID')
                    );
                }

                const token: JSONObject = (req as any).callTokenData;

                const itemId: ObjectID = new ObjectID(req.params['itemId']);

                const timelineItem: UserOnCallLogTimeline | null =
                    await this.service.findOneById({
                        id: itemId,
                        select: {
                            _id: true,
                            projectId: true,
                            triggeredByIncidentId: true,
                        },
                        props: {
                            isRoot: true,
                        },
                    });

                if (!timelineItem) {
                    return Response.sendErrorResponse(
                        req,
                        res,
                        new BadDataException('Invalid item Id')
                    );
                }

                // check digits.

                if (req.body['Digits'] === '1') {
                    // then ack incident
                    await this.service.updateOneById({
                        id: itemId,
                        data: {
                            acknowledgedAt: OneUptimeDate.getCurrentDate(),
                            isAcknowledged: true,
                            status: UserNotificationStatus.Acknowledged,
                            statusMessage: 'Notification Acknowledged',
                        },
                        props: {
                            isRoot: true,
                        },
                    });
                }

                return NotificationMiddleware.sendResponse(
                    req,
                    res,
                    token as any
                );
            }
        );

        this.router.get(
            `${new this.entityType()
                .getCrudApiPath()
                ?.toString()}/acknowledge/:itemId`,
            async (req: ExpressRequest, res: ExpressResponse) => {
                req = req as OneUptimeRequest;

                if (!req.params['itemId']) {
                    return Response.sendErrorResponse(
                        req,
                        res,
                        new BadDataException('Item ID is required')
                    );
                }

                const itemId: ObjectID = new ObjectID(req.params['itemId']);

                const timelineItem: UserOnCallLogTimeline | null =
                    await this.service.findOneById({
                        id: itemId,
                        select: {
                            _id: true,
                            projectId: true,
                            triggeredByIncidentId: true,
                        },
                        props: {
                            isRoot: true,
                        },
                    });

                if (!timelineItem) {
                    return Response.sendErrorResponse(
                        req,
                        res,
                        new BadDataException('Invalid item Id')
                    );
                }

                await this.service.updateOneById({
                    id: itemId,
                    data: {
                        acknowledgedAt: OneUptimeDate.getCurrentDate(),
                        isAcknowledged: true,
                        status: UserNotificationStatus.Acknowledged,
                        statusMessage: 'Notification Acknowledged',
                    },
                    props: {
                        isRoot: true,
                    },
                });

                // redirect to dashboard to incidents page.

                const host: Hostname = await DatabaseConfig.getHost();
                const httpProtocol: Protocol =
                    await DatabaseConfig.getHttpProtocol();

                return Response.redirect(
                    req,
                    res,
                    new URL(
                        httpProtocol,
                        host,
                        DashboardRoute.addRoute(
                            `/${timelineItem.projectId?.toString()}/incidents/${timelineItem.triggeredByIncidentId!.toString()}`
                        )
                    )
                );
            }
        );
    }
}
