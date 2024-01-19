import { EncryptionSecret } from 'CommonServer/EnvironmentConfig';
import { FileRoute } from 'Common/ServiceRoute';
import Express, {
    ExpressRequest,
    ExpressResponse,
    ExpressRouter,
    NextFunction,
} from 'CommonServer/Utils/Express';
import { JSONObject } from 'Common/Types/JSON';
import StatusPagePrivateUserService from 'CommonServer/Services/StatusPagePrivateUserService';
import ObjectID from 'Common/Types/ObjectID';
import BadDataException from 'Common/Types/Exception/BadDataException';
import MailService from 'CommonServer/Services/MailService';
import EmailTemplateType from 'Common/Types/Email/EmailTemplateType';
import URL from 'Common/Types/API/URL';
import Response from 'CommonServer/Utils/Response';
import JSONWebToken from 'CommonServer/Utils/JsonWebToken';
import OneUptimeDate from 'Common/Types/Date';
import PositiveNumber from 'Common/Types/PositiveNumber';
import logger from 'CommonServer/Utils/Logger';
import JSONFunctions from 'Common/Types/JSONFunctions';
import StatusPagePrivateUser from 'Model/Models/StatusPagePrivateUser';
import StatusPage from 'Model/Models/StatusPage';
import StatusPageService from 'CommonServer/Services/StatusPageService';
import Protocol from 'Common/Types/API/Protocol';
import Hostname from 'Common/Types/API/Hostname';
import DatabaseConfig from 'CommonServer/DatabaseConfig';
import CookieUtil from 'CommonServer/Utils/Cookie';
import BaseModel from 'Common/Models/BaseModel';

const router: ExpressRouter = Express.getRouter();

router.post(
    '/logout/:statuspageid',
    async (
        req: ExpressRequest,
        res: ExpressResponse,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.params['statuspageid']) {
                throw new BadDataException('Status Page ID is required.');
            }

            const statusPageId: ObjectID = new ObjectID(
                req.params['statuspageid'].toString()
            );

            CookieUtil.removeCookie(
                res,
                CookieUtil.getUserTokenKey(statusPageId)
            ); // remove the cookie.

            return Response.sendEmptyResponse(req, res);
        } catch (err) {
            return next(err);
        }
    }
);

router.post(
    '/forgot-password',
    async (
        req: ExpressRequest,
        res: ExpressResponse,
        next: NextFunction
    ): Promise<void> => {
        try {
            const data: JSONObject = req.body['data'];

            if (!data['email']) {
                throw new BadDataException('Email is required.');
            }

            const user: StatusPagePrivateUser = BaseModel.fromJSON(
                data as JSONObject,
                StatusPagePrivateUser
            ) as StatusPagePrivateUser;

            if (!user.statusPageId) {
                throw new BadDataException('Status Page ID is required.');
            }

            const statusPage: StatusPage | null =
                await StatusPageService.findOneById({
                    id: user.statusPageId!,
                    props: {
                        isRoot: true,
                        ignoreHooks: true,
                    },
                    select: {
                        _id: true,
                        name: true,
                        pageTitle: true,
                        logoFileId: true,
                        requireSsoForLogin: true,
                        projectId: true,
                    },
                });

            if (!statusPage) {
                throw new BadDataException('Status Page not found');
            }

            if (statusPage.requireSsoForLogin) {
                throw new BadDataException(
                    'Status Page supports authentication by SSO. You cannot use email and password for authentication.'
                );
            }

            const statusPageName: string | undefined =
                statusPage.pageTitle || statusPage.name;

            const statusPageURL: string =
                await StatusPageService.getStatusPageURL(statusPage.id!);

            const alreadySavedUser: StatusPagePrivateUser | null =
                await StatusPagePrivateUserService.findOneBy({
                    query: {
                        email: user.email!,
                        statusPageId: user.statusPageId!,
                    },
                    select: {
                        _id: true,
                        password: true,
                        email: true,
                    },
                    props: {
                        isRoot: true,
                    },
                });

            if (alreadySavedUser) {
                const token: string = ObjectID.generate().toString();
                await StatusPagePrivateUserService.updateOneBy({
                    query: {
                        _id: alreadySavedUser._id!,
                    },
                    data: {
                        resetPasswordToken: token,
                        resetPasswordExpires: OneUptimeDate.getOneDayAfter(),
                    },
                    props: {
                        isRoot: true,
                    },
                });

                const host: Hostname = await DatabaseConfig.getHost();
                const httpProtocol: Protocol =
                    await DatabaseConfig.getHttpProtocol();

                MailService.sendMail(
                    {
                        toEmail: user.email!,
                        subject: 'Password Reset Request for ' + statusPageName,
                        templateType:
                            EmailTemplateType.StatusPageForgotPassword,
                        vars: {
                            statusPageName: statusPageName!,
                            logoUrl: statusPage.logoFileId
                                ? new URL(httpProtocol, host)
                                      .addRoute(FileRoute)
                                      .addRoute(
                                          '/image/' + statusPage.logoFileId
                                      )
                                      .toString()
                                : '',
                            homeURL: statusPageURL,
                            tokenVerifyUrl: URL.fromString(statusPageURL)
                                .addRoute('/reset-password/' + token)
                                .toString(),
                        },
                    },
                    {
                        projectId: statusPage.projectId!,
                    }
                ).catch((err: Error) => {
                    logger.error(err);
                });

                return Response.sendEmptyResponse(req, res);
            }

            throw new BadDataException(
                `No user is registered with ${user.email?.toString()}`
            );
        } catch (err) {
            return next(err);
        }
    }
);

router.post(
    '/reset-password',
    async (
        req: ExpressRequest,
        res: ExpressResponse,
        next: NextFunction
    ): Promise<void> => {
        try {
            const data: JSONObject = JSONFunctions.deserialize(
                req.body['data']
            );

            if (!data['statusPageId']) {
                throw new BadDataException('Status Page ID is required.');
            }

            const user: StatusPagePrivateUser = BaseModel.fromJSON(
                data as JSONObject,
                StatusPagePrivateUser
            ) as StatusPagePrivateUser;

            await user.password?.hashValue(EncryptionSecret);

            const alreadySavedUser: StatusPagePrivateUser | null =
                await StatusPagePrivateUserService.findOneBy({
                    query: {
                        statusPageId: new ObjectID(
                            data['statusPageId'].toString()
                        ),
                        resetPasswordToken:
                            (user.resetPasswordToken as string) || '',
                    },
                    select: {
                        _id: true,
                        password: true,
                        email: true,
                        resetPasswordExpires: true,
                    },
                    props: {
                        isRoot: true,
                    },
                });

            if (!alreadySavedUser) {
                throw new BadDataException(
                    'Invalid link. Please go to forgot password page again and request a new link.'
                );
            }

            if (
                alreadySavedUser &&
                OneUptimeDate.hasExpired(alreadySavedUser.resetPasswordExpires!)
            ) {
                throw new BadDataException(
                    'Expired link. Please go to forgot password page again and request a new link.'
                );
            }

            const statusPage: StatusPage | null =
                await StatusPageService.findOneById({
                    id: new ObjectID(data['statusPageId'].toString()),
                    props: {
                        isRoot: true,
                        ignoreHooks: true,
                    },
                    select: {
                        _id: true,
                        name: true,
                        pageTitle: true,
                        logoFileId: true,
                        requireSsoForLogin: true,
                        projectId: true,
                    },
                });

            if (!statusPage) {
                throw new BadDataException('Status Page not found');
            }

            if (statusPage.requireSsoForLogin) {
                throw new BadDataException(
                    'Status Page supports authentication by SSO. You cannot use email and password for authentication.'
                );
            }

            const statusPageName: string | undefined =
                statusPage.pageTitle || statusPage.name;

            const statusPageURL: string =
                await StatusPageService.getStatusPageURL(statusPage.id!);

            await StatusPagePrivateUserService.updateOneById({
                id: alreadySavedUser.id!,
                data: {
                    password: user.password!,
                    resetPasswordToken: null!,
                    resetPasswordExpires: null!,
                },
                props: {
                    isRoot: true,
                },
            });

            const host: Hostname = await DatabaseConfig.getHost();
            const httpProtocol: Protocol =
                await DatabaseConfig.getHttpProtocol();

            MailService.sendMail(
                {
                    toEmail: alreadySavedUser.email!,
                    subject: 'Password Changed.',
                    templateType: EmailTemplateType.StatusPagePasswordChanged,
                    vars: {
                        homeURL: statusPageURL,
                        statusPageName: statusPageName || '',
                        logoUrl: statusPage.logoFileId
                            ? new URL(httpProtocol, host)
                                  .addRoute(FileRoute)
                                  .addRoute('/image/' + statusPage.logoFileId)
                                  .toString()
                            : '',
                    },
                },
                {
                    projectId: statusPage.projectId!,
                }
            ).catch((err: Error) => {
                logger.error(err);
            });

            return Response.sendEmptyResponse(req, res);
        } catch (err) {
            return next(err);
        }
    }
);

router.post(
    '/login',
    async (
        req: ExpressRequest,
        res: ExpressResponse,
        next: NextFunction
    ): Promise<void> => {
        try {
            const data: JSONObject = req.body['data'];

            const user: StatusPagePrivateUser = BaseModel.fromJSON(
                data as JSONObject,
                StatusPagePrivateUser
            ) as StatusPagePrivateUser;

            if (!user.statusPageId) {
                throw new BadDataException('Status Page ID not found');
            }

            const statusPage: StatusPage | null =
                await StatusPageService.findOneById({
                    id: user.statusPageId,
                    props: {
                        isRoot: true,
                        ignoreHooks: true,
                    },
                    select: {
                        requireSsoForLogin: true,
                    },
                });

            if (!statusPage) {
                throw new BadDataException('Status Page not found');
            }

            if (statusPage.requireSsoForLogin) {
                throw new BadDataException(
                    'Status Page supports authentication by SSO. You cannot use email and password for authentication.'
                );
            }

            await user.password?.hashValue(EncryptionSecret);

            const alreadySavedUser: StatusPagePrivateUser | null =
                await StatusPagePrivateUserService.findOneBy({
                    query: {
                        email: user.email!,
                        password: user.password!,
                        statusPageId: user.statusPageId!,
                    },
                    select: {
                        _id: true,
                        password: true,
                        email: true,
                        statusPageId: true,
                    },
                    props: {
                        isRoot: true,
                    },
                });

            if (alreadySavedUser) {
                const token: string = JSONWebToken.sign(
                    alreadySavedUser,
                    OneUptimeDate.getSecondsInDays(new PositiveNumber(30))
                );

                CookieUtil.setCookie(
                    res,
                    CookieUtil.getUserTokenKey(alreadySavedUser.statusPageId!),
                    token,
                    {
                        httpOnly: true,
                        maxAge: OneUptimeDate.getMillisecondsInDays(
                            new PositiveNumber(30)
                        ),
                    }
                );

                return Response.sendEntityResponse(
                    req,
                    res,
                    alreadySavedUser,
                    StatusPagePrivateUser,
                    {
                        miscData: {
                            token: token,
                        },
                    }
                );
            }
            throw new BadDataException(
                'Invalid login: Email or password does not match.'
            );
        } catch (err) {
            return next(err);
        }
    }
);

export default router;
