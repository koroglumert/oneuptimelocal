import Express, {
    ExpressRequest,
    ExpressResponse,
    ExpressRouter,
} from 'CommonServer/Utils/Express';
import Response from 'CommonServer/Utils/Response';
import ObjectID from 'Common/Types/ObjectID';
import BadDataException from 'Common/Types/Exception/BadDataException';
import QueueWorkflow from '../Services/QueueWorkflow';

export default class ManualAPI {
    public router!: ExpressRouter;

    public constructor() {
        this.router = Express.getRouter();

        this.router.get(`/run/:workflowId`, this.manuallyRunWorkflow);

        this.router.post(`/run/:workflowId`, this.manuallyRunWorkflow);
    }

    public async manuallyRunWorkflow(
        req: ExpressRequest,
        res: ExpressResponse
    ): Promise<void> {
        // add this workflow to the run queue and return the 200 response.

        if (!req.params['workflowId']) {
            return Response.sendErrorResponse(
                req,
                res,
                new BadDataException('workflowId not found in URL')
            );
        }

        await QueueWorkflow.addWorkflowToQueue({
            workflowId: new ObjectID(req.params['workflowId'] as string),
            returnValues: req.body.data || {},
        });

        return Response.sendJsonObjectResponse(req, res, {
            status: 'Scheduled',
        });
    }
}
