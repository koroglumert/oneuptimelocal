const IsBillingEnabled: boolean = process.env['BILLING_ENABLED'] === 'true';
const BillingPublicKey: string = process.env['BILLING_PUBLIC_KEY'] || '';
const BillingPrivateKey: string = process.env['BILLING_PRIVATE_KEY'] || '';

export default {
    IsBillingEnabled,
    BillingPublicKey,
    BillingPrivateKey,
};
