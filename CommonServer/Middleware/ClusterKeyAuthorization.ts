import { ClusterKey as ONEUPTIME_SECRET } from '../EnvironmentConfig';
import {
    ExpressRequest,
    ExpressResponse,
    NextFunction,
} from '../Utils/Express';

import Response from '../Utils/Response';
import BadDataException from 'Common/Types/Exception/BadDataException';
import ObjectID from 'Common/Types/ObjectID';
import Dictionary from 'Common/Types/Dictionary';

export default class ClusterKeyAuthorization {
    public static getClusterKeyHeaders(): Dictionary<string> {
        return {
            clusterkey: ONEUPTIME_SECRET.toString(),
        };
    }

    public static async isAuthorizedServiceMiddleware(
        req: ExpressRequest,
        res: ExpressResponse,
        next: NextFunction
    ): Promise<void> {
        let clusterKey: ObjectID;

        if (req.params && req.params['clusterKey']) {
            clusterKey = new ObjectID(req.params['clusterKey']);
        } else if (req.query && req.query['clusterKey']) {
            clusterKey = new ObjectID(req.query['clusterKey'] as string);
        } else if (req.headers && req.headers['clusterkey']) {
            // Header keys are automatically transformed to lowercase
            clusterKey = new ObjectID(req.headers['clusterkey'] as string);
        } else if (req.body && req.body.clusterKey) {
            clusterKey = new ObjectID(req.body.clusterKey);
        } else {
            return Response.sendErrorResponse(
                req,
                res,
                new BadDataException('Cluster key not found.')
            );
        }

        const isAuthorized: boolean =
            clusterKey.toString() === ONEUPTIME_SECRET.toString();

        if (!isAuthorized) {
            return Response.sendErrorResponse(
                req,
                res,
                new BadDataException('Invalid cluster key provided')
            );
        }

        return next();
    }
}
