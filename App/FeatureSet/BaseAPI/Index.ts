import User from 'Model/Models/User';
import UserService, {
    Service as UserServiceType,
} from 'CommonServer/Services/UserService';

import BillingPaymentMethodAPI from 'CommonServer/API/BillingPaymentMethodAPI';

import BillingInvoiceAPI from 'CommonServer/API/BillingInvoiceAPI';

import Express, { ExpressApplication } from 'CommonServer/Utils/Express';

import ProjectAPI from 'CommonServer/API/ProjectAPI';

import GlobalConfigAPI from 'CommonServer/API/GlobalConfigAPI';

import ShortLink from 'Model/Models/ShortLink';
import ShortLinkService, {
    Service as ShortLinkServiceType,
} from 'CommonServer/Services/ShortLinkService';

import IncidentOwnerTeam from 'Model/Models/IncidentOwnerTeam';
import IncidentOwnerTeamService, {
    Service as IncidentOwnerTeamServiceType,
} from 'CommonServer/Services/IncidentOwnerTeamService';

import IncidentTemplate from 'Model/Models/IncidentTemplate';
import IncidentTemplateService, {
    Service as IncidentTemplateServiceType,
} from 'CommonServer/Services/IncidentTemplateService';

import IncidentNoteTemplate from 'Model/Models/IncidentNoteTemplate';
import IncidentNoteTemplateService, {
    Service as IncidentNoteTemplateServiceType,
} from 'CommonServer/Services/IncidentNoteTemplateService';

import ScheduledMaintenanceNoteTemplate from 'Model/Models/ScheduledMaintenanceNoteTemplate';
import ScheduledMaintenanceNoteTemplateService, {
    Service as ScheduledMaintenanceNoteTemplateServiceType,
} from 'CommonServer/Services/ScheduledMaintenanceNoteTemplateService';

import IncidentTemplateOwnerTeam from 'Model/Models/IncidentTemplateOwnerTeam';
import IncidentTemplateOwnerTeamService, {
    Service as IncidentTemplateOwnerTeamServiceType,
} from 'CommonServer/Services/IncidentTemplateOwnerTeamService';

import IncidentTemplateOwnerUser from 'Model/Models/IncidentTemplateOwnerUser';
import IncidentTemplateOwnerUserService, {
    Service as IncidentTemplateOwnerUserServiceType,
} from 'CommonServer/Services/IncidentTemplateOwnerUserService';

import MonitorOwnerTeam from 'Model/Models/MonitorOwnerTeam';
import MonitorOwnerTeamService, {
    Service as MonitorOwnerTeamServiceType,
} from 'CommonServer/Services/MonitorOwnerTeamService';

import StatusPageOwnerTeam from 'Model/Models/StatusPageOwnerTeam';
import StatusPageOwnerTeamService, {
    Service as StatusPageOwnerTeamServiceType,
} from 'CommonServer/Services/StatusPageOwnerTeamService';

import ScheduledMaintenanceOwnerTeam from 'Model/Models/ScheduledMaintenanceOwnerTeam';
import ScheduledMaintenanceOwnerTeamService, {
    Service as ScheduledMaintenanceOwnerTeamServiceType,
} from 'CommonServer/Services/ScheduledMaintenanceOwnerTeamService';

import IncidentOwnerUser from 'Model/Models/IncidentOwnerUser';
import IncidentOwnerUserService, {
    Service as IncidentOwnerUserServiceType,
} from 'CommonServer/Services/IncidentOwnerUserService';

import MonitorOwnerUser from 'Model/Models/MonitorOwnerUser';
import MonitorOwnerUserService, {
    Service as MonitorOwnerUserServiceType,
} from 'CommonServer/Services/MonitorOwnerUserService';

import StatusPageOwnerUser from 'Model/Models/StatusPageOwnerUser';
import StatusPageOwnerUserService, {
    Service as StatusPageOwnerUserServiceType,
} from 'CommonServer/Services/StatusPageOwnerUserService';

import ScheduledMaintenanceOwnerUser from 'Model/Models/ScheduledMaintenanceOwnerUser';
import ScheduledMaintenanceOwnerUserService, {
    Service as ScheduledMaintenanceOwnerUserServiceType,
} from 'CommonServer/Services/ScheduledMaintenanceOwnerUserService';

import Workflow from 'Model/Models/Workflow';
import WorkflowService, {
    Service as WorkflowServiceType,
} from 'CommonServer/Services/WorkflowService';

import WorkflowLog from 'Model/Models/WorkflowLog';
import WorkflowLogService, {
    Service as WorkflowLogServiceType,
} from 'CommonServer/Services/WorkflowLogService';

import ProjectSsoAPI from 'CommonServer/API/ProjectSSO';

import SmsLog from 'Model/Models/SmsLog';
import SmsLogService, {
    Service as SmsLogServiceType,
} from 'CommonServer/Services/SmsLogService';

import EmailLog from 'Model/Models/EmailLog';
import EmailLogService, {
    Service as EmailLogServiceType,
} from 'CommonServer/Services/EmailLogService';

import Reseller from 'Model/Models/Reseller';
import ResellerService, {
    Service as ResellerServiceType,
} from 'CommonServer/Services/ResellerService';

import CallLog from 'Model/Models/CallLog';
import CallLogService, {
    Service as CallLogServiceType,
} from 'CommonServer/Services/CallLogService';

import StatusPageSSO from 'Model/Models/StatusPageSso';
import StatusPageSSOService, {
    Service as StatusPageSSOServiceType,
} from 'CommonServer/Services/StatusPageSsoService';

import WorkflowVariable from 'Model/Models/WorkflowVariable';
import WorkflowVariableService, {
    Service as WorkflowVariableServiceType,
} from 'CommonServer/Services/WorkflowVariableService';

import TelemetryService from 'Model/Models/TelemetryService';
import TelemetryServiceService, {
    Service as TelemetryServiceServiceType,
} from 'CommonServer/Services/TelemetryServiceService';

import MonitorProbe from 'Model/Models/MonitorProbe';
import MonitorProbeService, {
    Service as MonitorProbeServiceType,
} from 'CommonServer/Services/MonitorProbeService';

import StatusPagePrivateUser from 'Model/Models/StatusPagePrivateUser';
import StatusPagePrivateUserService, {
    Service as StatusPagePrivateUserServiceType,
} from 'CommonServer/Services/StatusPagePrivateUserService';

import StatusPageFooterLink from 'Model/Models/StatusPageFooterLink';
import StatusPageFooterLinkService, {
    Service as StatusPageFooterLinkServiceType,
} from 'CommonServer/Services/StatusPageFooterLinkService';

import StatusPageHeaderLink from 'Model/Models/StatusPageHeaderLink';
import StatusPageHeaderLinkService, {
    Service as StatusPageHeaderLinkServiceType,
} from 'CommonServer/Services/StatusPageHeaderLinkService';

import FileAPI from 'CommonServer/API/FileAPI';

import UserNotificationRule from 'Model/Models/UserNotificationRule';
import UserNotificationRuleService, {
    Service as UserNotificationRuleServiceType,
} from 'CommonServer/Services/UserNotificationRuleService';

import StatusPageAnnouncement from 'Model/Models/StatusPageAnnouncement';
import StatusPageAnnouncementService, {
    Service as StatusPageAnnouncementServiceType,
} from 'CommonServer/Services/StatusPageAnnouncementService';

import EmailVerificationToken from 'Model/Models/EmailVerificationToken';
import EmailVerificationTokenService, {
    Service as EmailVerificationTokenServiceType,
} from 'CommonServer/Services/EmailVerificationTokenService';

import Team from 'Model/Models/Team';
import TeamService, {
    Service as TeamServiceType,
} from 'CommonServer/Services/TeamService';

import TeamMember from 'Model/Models/TeamMember';
import TeamMemberService, {
    TeamMemberService as TeamMemberServiceType,
} from 'CommonServer/Services/TeamMemberService';

import TeamPermission from 'Model/Models/TeamPermission';
import TeamPermissionService, {
    Service as TeamPermissionServiceType,
} from 'CommonServer/Services/TeamPermissionService';

import Label from 'Model/Models/Label';
import LabelService, {
    Service as LabelServiceType,
} from 'CommonServer/Services/LabelService';

import ProjectSmtpConfig from 'Model/Models/ProjectSmtpConfig';
import ProjectSmtpConfigService, {
    Service as ProjectSMTPConfigServiceType,
} from 'CommonServer/Services/ProjectSmtpConfigService';

import ApiKey from 'Model/Models/ApiKey';
import ApiKeyService, {
    Service as ApiKeyServiceType,
} from 'CommonServer/Services/ApiKeyService';

import ApiKeyPermission from 'Model/Models/ApiKeyPermission';
import ApiKeyPermissionService, {
    Service as ApiKeyPermissionServiceType,
} from 'CommonServer/Services/ApiKeyPermissionService';

import Monitor from 'Model/Models/Monitor';
import MonitorService, {
    Service as MonitorServiceType,
} from 'CommonServer/Services/MonitorService';

import OnCallDutyPolicy from 'Model/Models/OnCallDutyPolicy';
import OnCallDutyPolicyService, {
    Service as OnCallDutyPolicyServiceType,
} from 'CommonServer/Services/OnCallDutyPolicyService';

import MonitorStatus from 'Model/Models/MonitorStatus';
import MonitorStatusService, {
    Service as MonitorStatusServiceType,
} from 'CommonServer/Services/MonitorStatusService';

import MonitorTimelineStatus from 'Model/Models/MonitorStatusTimeline';
import MonitorTimelineStatusService, {
    Service as MonitorTimelineStatusServiceType,
} from 'CommonServer/Services/MonitorStatusTimelineService';

import ScheduledMaintenanceState from 'Model/Models/ScheduledMaintenanceState';
import ScheduledMaintenanceStateService, {
    Service as ScheduledMaintenanceStateServiceType,
} from 'CommonServer/Services/ScheduledMaintenanceStateService';

import ScheduledMaintenance from 'Model/Models/ScheduledMaintenance';
import ScheduledMaintenanceService, {
    Service as ScheduledMaintenanceServiceType,
} from 'CommonServer/Services/ScheduledMaintenanceService';

import ScheduledMaintenanceStateTimeline from 'Model/Models/ScheduledMaintenanceStateTimeline';
import ScheduledMaintenanceStateTimelineService, {
    Service as ScheduledMaintenanceStateTimelineServiceType,
} from 'CommonServer/Services/ScheduledMaintenanceStateTimelineService';

import ScheduledMaintenanceInternalNote from 'Model/Models/ScheduledMaintenanceInternalNote';
import ScheduledMaintenanceInternalNoteService, {
    Service as ScheduledMaintenanceInternalNoteServiceType,
} from 'CommonServer/Services/ScheduledMaintenanceInternalNoteService';

import ScheduledMaintenancePublicNote from 'Model/Models/ScheduledMaintenancePublicNote';
import ScheduledMaintenancePublicNoteService, {
    Service as ScheduledMaintenancePublicNoteServiceType,
} from 'CommonServer/Services/ScheduledMaintenancePublicNoteService';

import IncidentState from 'Model/Models/IncidentState';
import IncidentStateService, {
    Service as IncidentStateServiceType,
} from 'CommonServer/Services/IncidentStateService';

import Incident from 'Model/Models/Incident';
import IncidentService, {
    Service as IncidentServiceType,
} from 'CommonServer/Services/IncidentService';

import IncidentStateTimeline from 'Model/Models/IncidentStateTimeline';
import IncidentStateTimelineService, {
    Service as IncidentStateTimelineServiceType,
} from 'CommonServer/Services/IncidentStateTimelineService';

import IncidentInternalNote from 'Model/Models/IncidentInternalNote';
import IncidentInternalNoteService, {
    Service as IncidentInternalNoteServiceType,
} from 'CommonServer/Services/IncidentInternalNoteService';

import IncidentPublicNote from 'Model/Models/IncidentPublicNote';
import IncidentPublicNoteService, {
    Service as IncidentPublicNoteServiceType,
} from 'CommonServer/Services/IncidentPublicNoteService';

import Domain from 'Model/Models/Domain';
import DomainService, {
    Service as DomainServiceType,
} from 'CommonServer/Services/DomainService';

import StatusPageGroup from 'Model/Models/StatusPageGroup';
import StatusPageGroupService, {
    Service as StatusPageGroupServiceType,
} from 'CommonServer/Services/StatusPageGroupService';

import StatusPageResource from 'Model/Models/StatusPageResource';
import StatusPageResourceService, {
    Service as StatusPageResourceServiceType,
} from 'CommonServer/Services/StatusPageResourceService';

import IncidentSeverity from 'Model/Models/IncidentSeverity';
import IncidentSeverityService, {
    Service as IncidentSeverityServiceType,
} from 'CommonServer/Services/IncidentSeverityService';

import StatusPageDomain from 'Model/Models/StatusPageDomain';
import StatusPageDomainService, {
    Service as StatusPageDomainServiceType,
} from 'CommonServer/Services/StatusPageDomainService';

// User Notification methods.
import UserEmailAPI from 'CommonServer/API/UserEmailAPI';
import UserSMSAPI from 'CommonServer/API/UserSmsAPI';
import UserCallAPI from 'CommonServer/API/UserCallAPI';

// Import API
import ResellerPlanAPI from 'CommonServer/API/ResellerPlanAPI';
import StatusPageAPI from 'CommonServer/API/StatusPageAPI';
import ShortLinkAPI from 'CommonServer/API/ShortLinkAPI';
import NotificationAPI from 'CommonServer/API/NotificationAPI';
import MonitorGroupAPI from 'CommonServer/API/MonitorGroupAPI';

import Ingestor from 'CommonServer/API/ProbeAPI';

import StatusPageSubscriberAPI from 'CommonServer/API/StatusPageSubscriberAPI';

// Custom Fields API
import StatusPageCustomField from 'Model/Models/StatusPageCustomField';
import StatusPageCustomFieldService, {
    Service as StatusPageCustomFieldServiceType,
} from 'CommonServer/Services/StatusPageCustomFieldService';

import MonitorCustomField from 'Model/Models/MonitorCustomField';
import MonitorCustomFieldService, {
    Service as MonitorCustomFieldServiceType,
} from 'CommonServer/Services/MonitorCustomFieldService';

import IncidentCustomField from 'Model/Models/IncidentCustomField';
import IncidentCustomFieldService, {
    Service as IncidentCustomFieldServiceType,
} from 'CommonServer/Services/IncidentCustomFieldService';

import OnCallDutyPolicySchedule from 'Model/Models/OnCallDutyPolicySchedule';
import OnCallDutyPolicyScheduleService, {
    Service as OnCallDutyPolicyScheduleServiceType,
} from 'CommonServer/Services/OnCallDutyPolicyScheduleService';

import OnCallDutyPolicyScheduleLayer from 'Model/Models/OnCallDutyPolicyScheduleLayer';
import OnCallDutyPolicyScheduleLayerService, {
    Service as OnCallDutyPolicyScheduleLayerServiceType,
} from 'CommonServer/Services/OnCallDutyPolicyScheduleLayerService';

import OnCallDutyPolicyScheduleLayerUser from 'Model/Models/OnCallDutyPolicyScheduleLayerUser';
import OnCallDutyPolicyScheduleLayerUserService, {
    Service as OnCallDutyPolicyScheduleLayerUserServiceType,
} from 'CommonServer/Services/OnCallDutyPolicyScheduleLayerUserService';

import OnCallDutyPolicyExecutionLogTimeline from 'Model/Models/OnCallDutyPolicyExecutionLogTimeline';
import OnCallDutyPolicyExecutionLogTimelineService, {
    Service as OnCallDutyPolicyExecutionLogTimelineServiceType,
} from 'CommonServer/Services/OnCallDutyPolicyExecutionLogTimelineService';

import ScheduledMaintenanceCustomField from 'Model/Models/ScheduledMaintenanceCustomField';
import ScheduledMaintenanceCustomFieldService, {
    Service as ScheduledMaintenanceCustomFieldServiceType,
} from 'CommonServer/Services/ScheduledMaintenanceCustomFieldService';

import OnCallDutyPolicyExecutionLog from 'Model/Models/OnCallDutyPolicyExecutionLog';
import OnCallDutyPolicyExecutionLogService, {
    Service as OnCallDutyPolicyExecutionLogServiceType,
} from 'CommonServer/Services/OnCallDutyPolicyExecutionLogService';

import PromoCode from 'Model/Models/PromoCode';
import PromoCodeService, {
    Service as PromoCodeServiceType,
} from 'CommonServer/Services/PromoCodeService';

import OnCallDutyPolicyEscalationRule from 'Model/Models/OnCallDutyPolicyEscalationRule';
import OnCallDutyPolicyEscalationRuleService, {
    Service as OnCallDutyPolicyEscalationRuleServiceType,
} from 'CommonServer/Services/OnCallDutyPolicyEscalationRuleService';

import OnCallDutyPolicyEscalationRuleTeam from 'Model/Models/OnCallDutyPolicyEscalationRuleTeam';
import OnCallDutyPolicyEscalationRuleTeamService, {
    Service as OnCallDutyPolicyEscalationRuleTeamServiceType,
} from 'CommonServer/Services/OnCallDutyPolicyEscalationRuleTeamService';

import OnCallDutyPolicyEscalationRuleSchedule from 'Model/Models/OnCallDutyPolicyEscalationRuleSchedule';
import OnCallDutyPolicyEscalationRuleScheduleService, {
    Service as OnCallDutyPolicyEscalationRuleScheduleServiceType,
} from 'CommonServer/Services/OnCallDutyPolicyEscalationRuleScheduleService';

import OnCallDutyPolicyEscalationRuleUser from 'Model/Models/OnCallDutyPolicyEscalationRuleUser';
import OnCallDutyPolicyEscalationRuleUserService, {
    Service as OnCallDutyPolicyEscalationRuleUserServiceType,
} from 'CommonServer/Services/OnCallDutyPolicyEscalationRuleUserService';

import OnCallDutyPolicyCustomField from 'Model/Models/OnCallDutyPolicyCustomField';
import OnCallDutyPolicyCustomFieldService, {
    Service as OnCallDutyPolicyCustomFieldServiceType,
} from 'CommonServer/Services/OnCallDutyPolicyCustomFieldService';

import UserNotificationLogTimelineAPI from 'CommonServer/API/UserOnCallLogTimelineAPI';

import UserOnCallLog from 'Model/Models/UserOnCallLog';
import UserOnCallLogService, {
    Service as UserNotificationLogServiceType,
} from 'CommonServer/Services/UserOnCallLogService';

import UserNotificationSetting from 'Model/Models/UserNotificationSetting';
import UserNotificationSettingService, {
    Service as UserNotificationSettingServiceType,
} from 'CommonServer/Services/UserNotificationSettingService';

import MonitorGroupOwnerUser from 'Model/Models/MonitorGroupOwnerUser';
import MonitorGroupOwnerUserService, {
    Service as MonitorGroupOwnerUserServiceType,
} from 'CommonServer/Services/MonitorGroupOwnerUserService';

import MonitorGroupOwnerTeam from 'Model/Models/MonitorGroupOwnerTeam';
import MonitorGroupOwnerTeamService, {
    Service as MonitorGroupOwnerTeamServiceType,
} from 'CommonServer/Services/MonitorGroupOwnerTeamService';

import MonitorGroupResource from 'Model/Models/MonitorGroupResource';
import MonitorGroupResourceService, {
    Service as MonitorGroupResourceServiceType,
} from 'CommonServer/Services/MonitorGroupResourceService';

import Log from 'Model/AnalyticsModels/Log';
import LogService, {
    LogService as LogServiceType,
} from 'CommonServer/Services/LogService';

import UsageBilling from 'Model/Models/UsageBilling';
import UsageBillingService, {
    Service as UsageBillingServiceType,
} from 'CommonServer/Services/UsageBillingService';
import BaseAPI from 'CommonServer/API/BaseAPI';
import BaseAnalyticsAPI from 'CommonServer/API/BaseAnalyticsAPI';

import ProjectCallSMSConfig from 'Model/Models/ProjectCallSMSConfig';
import ProjectCallSMSConfigService, {
    Service as ProjectCallSMSConfigServiceType,
} from 'CommonServer/Services/ProjectCallSMSConfigService';

const app: ExpressApplication = Express.getExpressApp();

const APP_NAME: string = 'api';

//attach api's
app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<User, UserServiceType>(User, UserService).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAnalyticsAPI<Log, LogServiceType>(Log, LogService).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<UsageBilling, UsageBillingServiceType>(
        UsageBilling,
        UsageBillingService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<ShortLink, ShortLinkServiceType>(
        ShortLink,
        ShortLinkService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<MonitorProbe, MonitorProbeServiceType>(
        MonitorProbe,
        MonitorProbeService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageAnnouncement, StatusPageAnnouncementServiceType>(
        StatusPageAnnouncement,
        StatusPageAnnouncementService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<Team, TeamServiceType>(Team, TeamService).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<MonitorGroupOwnerUser, MonitorGroupOwnerUserServiceType>(
        MonitorGroupOwnerUser,
        MonitorGroupOwnerUserService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<OnCallDutyPolicySchedule, OnCallDutyPolicyScheduleServiceType>(
        OnCallDutyPolicySchedule,
        OnCallDutyPolicyScheduleService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        OnCallDutyPolicyScheduleLayer,
        OnCallDutyPolicyScheduleLayerServiceType
    >(
        OnCallDutyPolicyScheduleLayer,
        OnCallDutyPolicyScheduleLayerService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        OnCallDutyPolicyScheduleLayerUser,
        OnCallDutyPolicyScheduleLayerUserServiceType
    >(
        OnCallDutyPolicyScheduleLayerUser,
        OnCallDutyPolicyScheduleLayerUserService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<MonitorGroupOwnerTeam, MonitorGroupOwnerTeamServiceType>(
        MonitorGroupOwnerTeam,
        MonitorGroupOwnerTeamService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<ProjectCallSMSConfig, ProjectCallSMSConfigServiceType>(
        ProjectCallSMSConfig,
        ProjectCallSMSConfigService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<MonitorGroupResource, MonitorGroupResourceServiceType>(
        MonitorGroupResource,
        MonitorGroupResourceService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<TeamMember, TeamMemberServiceType>(
        TeamMember,
        TeamMemberService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<TeamPermission, TeamPermissionServiceType>(
        TeamPermission,
        TeamPermissionService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<MonitorStatus, MonitorStatusServiceType>(
        MonitorStatus,
        MonitorStatusService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentState, IncidentStateServiceType>(
        IncidentState,
        IncidentStateService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        ScheduledMaintenanceState,
        ScheduledMaintenanceStateServiceType
    >(ScheduledMaintenanceState, ScheduledMaintenanceStateService).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageResource, StatusPageResourceServiceType>(
        StatusPageResource,
        StatusPageResourceService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<Workflow, WorkflowServiceType>(
        Workflow,
        WorkflowService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<TelemetryService, TelemetryServiceServiceType>(
        TelemetryService,
        TelemetryServiceService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<WorkflowVariable, WorkflowVariableServiceType>(
        WorkflowVariable,
        WorkflowVariableService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<WorkflowLog, WorkflowLogServiceType>(
        WorkflowLog,
        WorkflowLogService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<Domain, DomainServiceType>(Domain, DomainService).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageGroup, StatusPageGroupServiceType>(
        StatusPageGroup,
        StatusPageGroupService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageDomain, StatusPageDomainServiceType>(
        StatusPageDomain,
        StatusPageDomainService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentStateTimeline, IncidentStateTimelineServiceType>(
        IncidentStateTimeline,
        IncidentStateTimelineService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        ScheduledMaintenanceStateTimeline,
        ScheduledMaintenanceStateTimelineServiceType
    >(
        ScheduledMaintenanceStateTimeline,
        ScheduledMaintenanceStateTimelineService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPagePrivateUser, StatusPagePrivateUserServiceType>(
        StatusPagePrivateUser,
        StatusPagePrivateUserService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<Incident, IncidentServiceType>(
        Incident,
        IncidentService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<ScheduledMaintenance, ScheduledMaintenanceServiceType>(
        ScheduledMaintenance,
        ScheduledMaintenanceService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<ApiKey, ApiKeyServiceType>(ApiKey, ApiKeyService).getRouter()
);
app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<ApiKeyPermission, ApiKeyPermissionServiceType>(
        ApiKeyPermission,
        ApiKeyPermissionService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageHeaderLink, StatusPageHeaderLinkServiceType>(
        StatusPageHeaderLink,
        StatusPageHeaderLinkService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<UserNotificationRule, UserNotificationRuleServiceType>(
        UserNotificationRule,
        UserNotificationRuleService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageFooterLink, StatusPageFooterLinkServiceType>(
        StatusPageFooterLink,
        StatusPageFooterLinkService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<ApiKey, ApiKeyServiceType>(ApiKey, ApiKeyService).getRouter()
);
app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<ApiKeyPermission, ApiKeyPermissionServiceType>(
        ApiKeyPermission,
        ApiKeyPermissionService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentSeverity, IncidentSeverityServiceType>(
        IncidentSeverity,
        IncidentSeverityService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentOwnerUser, IncidentOwnerUserServiceType>(
        IncidentOwnerUser,
        IncidentOwnerUserService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentOwnerTeam, IncidentOwnerTeamServiceType>(
        IncidentOwnerTeam,
        IncidentOwnerTeamService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentTemplate, IncidentTemplateServiceType>(
        IncidentTemplate,
        IncidentTemplateService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentNoteTemplate, IncidentNoteTemplateServiceType>(
        IncidentNoteTemplate,
        IncidentNoteTemplateService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        ScheduledMaintenanceNoteTemplate,
        ScheduledMaintenanceNoteTemplateServiceType
    >(
        ScheduledMaintenanceNoteTemplate,
        ScheduledMaintenanceNoteTemplateService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        IncidentTemplateOwnerTeam,
        IncidentTemplateOwnerTeamServiceType
    >(IncidentTemplateOwnerTeam, IncidentTemplateOwnerTeamService).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        IncidentTemplateOwnerUser,
        IncidentTemplateOwnerUserServiceType
    >(IncidentTemplateOwnerUser, IncidentTemplateOwnerUserService).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<MonitorOwnerUser, MonitorOwnerUserServiceType>(
        MonitorOwnerUser,
        MonitorOwnerUserService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<MonitorOwnerTeam, MonitorOwnerTeamServiceType>(
        MonitorOwnerTeam,
        MonitorOwnerTeamService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        ScheduledMaintenanceOwnerUser,
        ScheduledMaintenanceOwnerUserServiceType
    >(
        ScheduledMaintenanceOwnerUser,
        ScheduledMaintenanceOwnerUserService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        ScheduledMaintenanceOwnerTeam,
        ScheduledMaintenanceOwnerTeamServiceType
    >(
        ScheduledMaintenanceOwnerTeam,
        ScheduledMaintenanceOwnerTeamService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageOwnerUser, StatusPageOwnerUserServiceType>(
        StatusPageOwnerUser,
        StatusPageOwnerUserService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageOwnerTeam, StatusPageOwnerTeamServiceType>(
        StatusPageOwnerTeam,
        StatusPageOwnerTeamService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<Label, LabelServiceType>(Label, LabelService).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<EmailVerificationToken, EmailVerificationTokenServiceType>(
        EmailVerificationToken,
        EmailVerificationTokenService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<UserOnCallLog, UserNotificationLogServiceType>(
        UserOnCallLog,
        UserOnCallLogService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<UserNotificationSetting, UserNotificationSettingServiceType>(
        UserNotificationSetting,
        UserNotificationSettingService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        OnCallDutyPolicyCustomField,
        OnCallDutyPolicyCustomFieldServiceType
    >(
        OnCallDutyPolicyCustomField,
        OnCallDutyPolicyCustomFieldService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<ProjectSmtpConfig, ProjectSMTPConfigServiceType>(
        ProjectSmtpConfig,
        ProjectSmtpConfigService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<Monitor, MonitorServiceType>(
        Monitor,
        MonitorService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<SmsLog, SmsLogServiceType>(SmsLog, SmsLogService).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<EmailLog, EmailLogServiceType>(
        EmailLog,
        EmailLogService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<Reseller, ResellerServiceType>(
        Reseller,
        ResellerService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<CallLog, CallLogServiceType>(
        CallLog,
        CallLogService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageSSO, StatusPageSSOServiceType>(
        StatusPageSSO,
        StatusPageSSOService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<MonitorTimelineStatus, MonitorTimelineStatusServiceType>(
        MonitorTimelineStatus,
        MonitorTimelineStatusService
    ).getRouter()
);

app.use(`/${APP_NAME.toLocaleLowerCase()}`, new ShortLinkAPI().getRouter());
app.use(`/${APP_NAME.toLocaleLowerCase()}`, new StatusPageAPI().getRouter());
app.use(`/${APP_NAME.toLocaleLowerCase()}`, new FileAPI().getRouter());
app.use(`/${APP_NAME.toLocaleLowerCase()}`, new MonitorGroupAPI().getRouter());
app.use(`/${APP_NAME.toLocaleLowerCase()}`, new ProjectSsoAPI().getRouter());
app.use(`/${APP_NAME.toLocaleLowerCase()}`, new ResellerPlanAPI().getRouter());
app.use(`/${APP_NAME.toLocaleLowerCase()}`, new GlobalConfigAPI().getRouter());

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new UserNotificationLogTimelineAPI().getRouter()
);
app.use(`/${APP_NAME.toLocaleLowerCase()}`, new UserCallAPI().getRouter());
app.use(`/${APP_NAME.toLocaleLowerCase()}`, new UserEmailAPI().getRouter());
app.use(`/${APP_NAME.toLocaleLowerCase()}`, new UserSMSAPI().getRouter());
app.use(`/${APP_NAME.toLocaleLowerCase()}`, new Ingestor().getRouter());

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new StatusPageSubscriberAPI().getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BillingPaymentMethodAPI().getRouter()
);

app.use(`/${APP_NAME.toLocaleLowerCase()}`, new ProjectAPI().getRouter());

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BillingInvoiceAPI().getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        ScheduledMaintenancePublicNote,
        ScheduledMaintenancePublicNoteServiceType
    >(
        ScheduledMaintenancePublicNote,
        ScheduledMaintenancePublicNoteService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        ScheduledMaintenanceInternalNote,
        ScheduledMaintenanceInternalNoteServiceType
    >(
        ScheduledMaintenanceInternalNote,
        ScheduledMaintenanceInternalNoteService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentPublicNote, IncidentPublicNoteServiceType>(
        IncidentPublicNote,
        IncidentPublicNoteService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentInternalNote, IncidentInternalNoteServiceType>(
        IncidentInternalNote,
        IncidentInternalNoteService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<OnCallDutyPolicy, OnCallDutyPolicyServiceType>(
        OnCallDutyPolicy,
        OnCallDutyPolicyService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        ScheduledMaintenanceCustomField,
        ScheduledMaintenanceCustomFieldServiceType
    >(
        ScheduledMaintenanceCustomField,
        ScheduledMaintenanceCustomFieldService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        OnCallDutyPolicyEscalationRuleUser,
        OnCallDutyPolicyEscalationRuleUserServiceType
    >(
        OnCallDutyPolicyEscalationRuleUser,
        OnCallDutyPolicyEscalationRuleUserService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        OnCallDutyPolicyEscalationRuleTeam,
        OnCallDutyPolicyEscalationRuleTeamServiceType
    >(
        OnCallDutyPolicyEscalationRuleTeam,
        OnCallDutyPolicyEscalationRuleTeamService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        OnCallDutyPolicyEscalationRuleSchedule,
        OnCallDutyPolicyEscalationRuleScheduleServiceType
    >(
        OnCallDutyPolicyEscalationRuleSchedule,
        OnCallDutyPolicyEscalationRuleScheduleService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        OnCallDutyPolicyExecutionLog,
        OnCallDutyPolicyExecutionLogServiceType
    >(
        OnCallDutyPolicyExecutionLog,
        OnCallDutyPolicyExecutionLogService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<PromoCode, PromoCodeServiceType>(
        PromoCode,
        PromoCodeService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        OnCallDutyPolicyExecutionLogTimeline,
        OnCallDutyPolicyExecutionLogTimelineServiceType
    >(
        OnCallDutyPolicyExecutionLogTimeline,
        OnCallDutyPolicyExecutionLogTimelineService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentCustomField, IncidentCustomFieldServiceType>(
        IncidentCustomField,
        IncidentCustomFieldService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        OnCallDutyPolicyEscalationRule,
        OnCallDutyPolicyEscalationRuleServiceType
    >(
        OnCallDutyPolicyEscalationRule,
        OnCallDutyPolicyEscalationRuleService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<MonitorCustomField, MonitorCustomFieldServiceType>(
        MonitorCustomField,
        MonitorCustomFieldService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageCustomField, StatusPageCustomFieldServiceType>(
        StatusPageCustomField,
        StatusPageCustomFieldService
    ).getRouter()
);

app.use(`/${APP_NAME.toLocaleLowerCase()}`, NotificationAPI);
