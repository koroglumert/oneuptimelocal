import EmptyResponseData from 'Common/Types/API/EmptyResponse';
import HTTPResponse from 'Common/Types/API/HTTPResponse';
import Route from 'Common/Types/API/Route';
import URL from 'Common/Types/API/URL';
import { JSONObject } from 'Common/Types/JSON';
import API from 'Common/Utils/API';
import { AppApiHostname } from '../EnvironmentConfig';
import Email from 'Common/Types/Email/EmailMessage';
import EmailServer from 'Common/Types/Email/EmailServer';
import Protocol from 'Common/Types/API/Protocol';
import ClusterKeyAuthorization from '../Middleware/ClusterKeyAuthorization';
import ObjectID from 'Common/Types/ObjectID';
import BaseService from './BaseService';

export class MailService extends BaseService {
    public async sendMail(
        mail: Email,
        options?: {
            mailServer?: EmailServer | undefined;
            userOnCallLogTimelineId?: ObjectID;
            projectId?: ObjectID | undefined;
        }
    ): Promise<HTTPResponse<EmptyResponseData>> {
        const body: JSONObject = {
            ...mail,
            toEmail: mail.toEmail.toString(),
        };

        if (options && options.mailServer) {
            body['SMTP_ID'] = options.mailServer.id?.toString();
            body['SMTP_USERNAME'] = options.mailServer.username || undefined;
            body['SMTP_EMAIL'] = options.mailServer.fromEmail.toString();
            body['SMTP_FROM_NAME'] = options.mailServer.fromName;
            body['SMTP_IS_SECURE'] = options.mailServer.secure;
            body['SMTP_PORT'] = options.mailServer.port.toNumber();
            body['SMTP_HOST'] = options.mailServer.host.toString();
            body['SMTP_PASSWORD'] = options.mailServer.password || undefined;
        }

        if (options?.userOnCallLogTimelineId) {
            body['userOnCallLogTimelineId'] =
                options.userOnCallLogTimelineId.toString();
        }

        if (options?.projectId) {
            body['projectId'] = options.projectId.toString();
        }

        return await API.post<EmptyResponseData>(
            new URL(
                Protocol.HTTP,
                AppApiHostname,
                new Route('/api/notification/email/send')
            ),
            body,
            {
                ...ClusterKeyAuthorization.getClusterKeyHeaders(),
            }
        );
    }
}

export default new MailService();
