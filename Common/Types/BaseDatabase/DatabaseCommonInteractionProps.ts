import { PlanSelect } from '../Billing/SubscriptionPlan';
import Dictionary from '../Dictionary';
import ObjectID from '../ObjectID';
import {
    UserGlobalAccessPermission,
    UserTenantAccessPermission,
} from '../Permission';
import UserType from '../UserType';

export default interface DatabaseCommonInteractionProps {
    userId?: ObjectID | undefined;
    userGlobalAccessPermission?: UserGlobalAccessPermission | undefined;
    userTenantAccessPermission?:
        | Dictionary<UserTenantAccessPermission> // tenantId <-> UserTenantAccessPermission
        | undefined;
    userType?: UserType | undefined;
    tenantId?: ObjectID | undefined;
    isRoot?: boolean | undefined;
    isMultiTenantRequest?: boolean | undefined;
    ignoreHooks?: boolean | undefined;
    currentPlan?: PlanSelect | undefined;
    isSubscriptionUnpaid?: boolean | undefined;
    isMasterAdmin?: boolean | undefined;
}
