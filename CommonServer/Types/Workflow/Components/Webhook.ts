import BadDataException from 'Common/Types/Exception/BadDataException';
import ObjectID from 'Common/Types/ObjectID';
import ComponentMetadata, { Port } from 'Common/Types/Workflow/Component';
import ComponentID from 'Common/Types/Workflow/ComponentID';
import WebhookComponents from 'Common/Types/Workflow/Components/Webhook';
import { ExpressRequest, ExpressResponse } from '../../../Utils/Express';
import Response from '../../../Utils/Response';
import TriggerCode, { ExecuteWorkflowType, InitProps } from '../TriggerCode';
import { JSONObject } from 'Common/Types/JSON';
import { RunOptions, RunReturnType } from '../ComponentCode';

export default class WebhookTrigger extends TriggerCode {
    public constructor() {
        super();
        const WebhookComponent: ComponentMetadata | undefined =
            WebhookComponents.find((i: ComponentMetadata) => {
                return i.id === ComponentID.Webhook;
            });

        if (!WebhookComponent) {
            throw new BadDataException('Webhook trigger not found.');
        }
        this.setMetadata(WebhookComponent);
    }

    public override async run(
        args: JSONObject,
        options: RunOptions
    ): Promise<RunReturnType> {
        const successPort: Port | undefined = this.getMetadata().outPorts.find(
            (p: Port) => {
                return p.id === 'out';
            }
        );

        if (!successPort) {
            throw options.onError(new BadDataException('Out port not found'));
        }

        return {
            returnValues: {
                ...args,
            },
            executePort: successPort,
        };
    }

    public override async init(props: InitProps): Promise<void> {
        props.router.get(
            `/trigger/:workflowId`,
            async (req: ExpressRequest, res: ExpressResponse) => {
                await this.initTrigger(req, res, props);
            }
        );

        props.router.post(
            `/trigger/:workflowId`,
            async (req: ExpressRequest, res: ExpressResponse) => {
                await this.initTrigger(req, res, props);
            }
        );
    }

    public async initTrigger(
        req: ExpressRequest,
        res: ExpressResponse,
        props: InitProps
    ): Promise<void> {
        /// Run Graph.

        // check if this workflow has the trigger enabled.

        const executeWorkflow: ExecuteWorkflowType = {
            workflowId: new ObjectID(req.params['workflowId'] as string),
            returnValues: {
                'request-headers': req.headers,
                'request-params': req.query,
                'request-body': req.body,
            },
        };

        await props.executeWorkflow(executeWorkflow);

        Response.sendJsonObjectResponse(req, res, { status: 'Scheduled' });
    }
}
