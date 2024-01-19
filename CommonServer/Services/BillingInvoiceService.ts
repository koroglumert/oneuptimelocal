import PostgresDatabase from '../Infrastructure/PostgresDatabase';
import Model from 'Model/Models/BillingInvoice';
import DatabaseService from './DatabaseService';
import FindBy from '../Types/Database/FindBy';
import { OnFind } from '../Types/Database/Hooks';
import ProjectService from './ProjectService';
import BadDataException from 'Common/Types/Exception/BadDataException';
import Project from 'Model/Models/Project';
import BillingService, { Invoice } from './BillingService';
import URL from 'Common/Types/API/URL';
import { LIMIT_PER_PROJECT } from 'Common/Types/Database/LimitMax';

export class Service extends DatabaseService<Model> {
    public constructor(postgresDatabase?: PostgresDatabase) {
        super(Model, postgresDatabase);
        this.setDoNotAllowDelete(true);
    }

    protected override async onBeforeFind(
        findBy: FindBy<Model>
    ): Promise<OnFind<Model>> {
        if (!findBy.props.tenantId) {
            throw new BadDataException('ProjectID not found.');
        }

        const project: Project | null = await ProjectService.findOneById({
            id: findBy.props.tenantId!,
            props: {
                ...findBy.props,
                isRoot: true,
                ignoreHooks: true,
            },
            select: {
                _id: true,
                paymentProviderCustomerId: true,
            },
        });

        if (!project) {
            throw new BadDataException('Project not found');
        }

        if (!project.paymentProviderCustomerId) {
            throw new BadDataException(
                'Payment provider customer id not found.'
            );
        }

        const invoices: Array<Invoice> = await BillingService.getInvoices(
            project.paymentProviderCustomerId
        );

        await this.deleteBy({
            query: {
                projectId: findBy.props.tenantId!,
            },
            limit: LIMIT_PER_PROJECT,
            skip: 0,
            props: {
                isRoot: true,
                ignoreHooks: true,
            },
        });

        for (const invoice of invoices) {
            const billingInvoice: Model = new Model();

            billingInvoice.projectId = project.id!;

            billingInvoice.amount = invoice.amount;
            billingInvoice.downloadableLink = URL.fromString(
                invoice.downloadableLink
            );
            billingInvoice.currencyCode = invoice.currencyCode;
            billingInvoice.paymentProviderCustomerId = invoice.customerId || '';
            billingInvoice.paymentProviderSubscriptionId =
                invoice.subscriptionId || '';
            billingInvoice.status = invoice.status || '';
            billingInvoice.paymentProviderInvoiceId = invoice.id;

            await this.create({
                data: billingInvoice,
                props: {
                    isRoot: true,
                },
            });
        }

        return { findBy, carryForward: invoices };
    }
}

export default new Service();
