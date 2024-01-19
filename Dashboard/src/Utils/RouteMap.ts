import Project from 'Model/Models/Project';
import Route from 'Common/Types/API/Route';
import Dictionary from 'Common/Types/Dictionary';
import ProjectUtil from 'CommonUI/src/Utils/Project';
import PageMap from './PageMap';
import RouteParams from './RouteParams';
import ObjectID from 'Common/Types/ObjectID';

export const MonitorsRoutePath: Dictionary<string> = {
    [PageMap.MONITORS_INOPERATIONAL]: 'inoperational',
    [PageMap.MONITORS_DISABLED]: 'disabled',
    [PageMap.MONITOR_VIEW]: `${RouteParams.ModelID}`,
    [PageMap.MONITOR_VIEW_INTERVAL]: `${RouteParams.ModelID}/interval`,
    [PageMap.MONITOR_VIEW_OWNERS]: `${RouteParams.ModelID}/owners`,
    [PageMap.MONITOR_VIEW_STATUS_TIMELINE]: `${RouteParams.ModelID}/status-timeline`,
    [PageMap.MONITOR_VIEW_INCIDENTS]: `${RouteParams.ModelID}/incidents`,
    [PageMap.MONITOR_VIEW_CUSTOM_FIELDS]: `${RouteParams.ModelID}/custom-fields`,
    [PageMap.MONITOR_VIEW_DELETE]: `${RouteParams.ModelID}/delete`,
    [PageMap.MONITOR_VIEW_SETTINGS]: `${RouteParams.ModelID}/settings`,
    [PageMap.MONITOR_VIEW_CRITERIA]: `${RouteParams.ModelID}/criteria`,
    [PageMap.MONITOR_VIEW_PROBES]: `${RouteParams.ModelID}/probes`,
};

export const WorkflowRoutePath: Dictionary<string> = {
    [PageMap.WORKFLOWS_LOGS]: 'logs',
    [PageMap.WORKFLOWS_VARIABLES]: 'variables',
    [PageMap.WORKFLOW_VARIABLES]: `workflow/${RouteParams.ModelID}/variables`,
    [PageMap.WORKFLOW_BUILDER]: `workflow/${RouteParams.ModelID}/builder`,
    [PageMap.WORKFLOW_VIEW]: `workflow/${RouteParams.ModelID}`,
    [PageMap.WORKFLOW_LOGS]: `workflow/${RouteParams.ModelID}/logs`,
    [PageMap.WORKFLOW_DELETE]: `workflow/${RouteParams.ModelID}/delete`,
    [PageMap.WORKFLOW_VIEW_SETTINGS]: `workflow/${RouteParams.ModelID}/settings`,
};

export const TelemetryRouthPath: Dictionary<string> = {
    [PageMap.TELEMETRY_SERVICES_VIEW]: `${RouteParams.ModelID}`,
    [PageMap.TELEMETRY_SERVICES_VIEW_DELETE]: `${RouteParams.ModelID}/delete`,
    [PageMap.TELEMETRY_SERVICES_VIEW_LOGS]: `${RouteParams.ModelID}/logs`,
    [PageMap.TELEMETRY_SERVICES_VIEW_TRACES]: `${RouteParams.ModelID}/traces`,
    [PageMap.TELEMETRY_SERVICES_VIEW_METRICS]: `${RouteParams.ModelID}/metrics`,
    [PageMap.TELEMETRY_SERVICES_VIEW_DASHBOARDS]: `${RouteParams.ModelID}/dashboards`,
    [PageMap.TELEMETRY_SERVICES_VIEW_SETTINGS]: `${RouteParams.ModelID}/settings`,
    [PageMap.TELEMETRY_SERVICES_VIEW_DOCUMENTATION]: `${RouteParams.ModelID}/documentation`,
};

export const StatusPagesRoutePath: Dictionary<string> = {
    [PageMap.STATUS_PAGE_VIEW]: `${RouteParams.ModelID}`,
    [PageMap.STATUS_PAGE_VIEW_BRANDING]: `${RouteParams.ModelID}/branding`,
    [PageMap.STATUS_PAGE_VIEW_OWNERS]: `${RouteParams.ModelID}/owners`,
    [PageMap.STATUS_PAGE_VIEW_GROUPS]: `${RouteParams.ModelID}/groups`,
    [PageMap.STATUS_PAGE_VIEW_DELETE]: `${RouteParams.ModelID}/delete`,
    [PageMap.STATUS_PAGE_VIEW_CUSTOM_FIELDS]: `${RouteParams.ModelID}/custom-fields`,
    [PageMap.STATUS_PAGE_VIEW_DOMAINS]: `${RouteParams.ModelID}/domains`,
    [PageMap.STATUS_PAGE_VIEW_EMAIL_SUBSCRIBERS]: `${RouteParams.ModelID}/email-subscribers`,
    [PageMap.STATUS_PAGE_VIEW_SMS_SUBSCRIBERS]: `${RouteParams.ModelID}/sms-subscribers`,
    [PageMap.STATUS_PAGE_VIEW_WEBHOOK_SUBSCRIBERS]: `${RouteParams.ModelID}/webhook-subscribers`,
    [PageMap.STATUS_PAGE_VIEW_HEADER_STYLE]: `${RouteParams.ModelID}/header-style`,
    [PageMap.STATUS_PAGE_VIEW_FOOTER_STYLE]: `${RouteParams.ModelID}/footer-style`,
    [PageMap.STATUS_PAGE_VIEW_PRIVATE_USERS]: `${RouteParams.ModelID}/private-users`,
    [PageMap.STATUS_PAGE_VIEW_NAVBAR_STYLE]: `${RouteParams.ModelID}/navbar-style`,
    [PageMap.STATUS_PAGE_VIEW_ANNOUNCEMENTS]: `${RouteParams.ModelID}/announcements`,
    [PageMap.STATUS_PAGE_VIEW_EMBEDDED]: `${RouteParams.ModelID}/embedded`,
    [PageMap.STATUS_PAGE_VIEW_SUBSCRIBER_SETTINGS]: `${RouteParams.ModelID}/subscriber-settings`,
    [PageMap.STATUS_PAGE_VIEW_SSO]: `${RouteParams.ModelID}/sso`,
    [PageMap.STATUS_PAGE_VIEW_CUSTOM_HTML_CSS]: `${RouteParams.ModelID}/custom-code`,
    [PageMap.STATUS_PAGE_VIEW_RESOURCES]: `${RouteParams.ModelID}/resources`,
    [PageMap.STATUS_PAGE_VIEW_ADVANCED_OPTIONS]: `${RouteParams.ModelID}/advanced-options`,
    [PageMap.STATUS_PAGE_VIEW_AUTHENTICATION_SETTINGS]: `${RouteParams.ModelID}/authentication-settings`,
    [PageMap.STATUS_PAGE_VIEW_SETTINGS]: `${RouteParams.ModelID}/settings`,
};

export const IncidentsRoutePath: Dictionary<string> = {
    [PageMap.UNRESOLVED_INCIDENTS]: 'unresolved',
    [PageMap.INCIDENT_VIEW]: `${RouteParams.ModelID}`,
    [PageMap.INCIDENT_VIEW_STATE_TIMELINE]: `${RouteParams.ModelID}/state-timeline`,
    [PageMap.INCIDENT_VIEW_OWNERS]: `${RouteParams.ModelID}/owners`,
    [PageMap.INCIDENT_VIEW_DELETE]: `${RouteParams.ModelID}/delete`,
    [PageMap.INCIDENT_VIEW_CUSTOM_FIELDS]: `${RouteParams.ModelID}/custom-fields`,
    [PageMap.INCIDENT_INTERNAL_NOTE]: `${RouteParams.ModelID}/internal-notes`,
    [PageMap.INCIDENT_PUBLIC_NOTE]: `${RouteParams.ModelID}/public-notes`,
};

export const ScheduledMaintenanceEventsRoutePath: Dictionary<string> = {
    [PageMap.ONGOING_SCHEDULED_MAINTENANCE_EVENTS]: 'ongoing',
    [PageMap.SCHEDULED_MAINTENANCE_VIEW]: `${RouteParams.ModelID}`,
    [PageMap.SCHEDULED_MAINTENANCE_VIEW_OWNERS]: `${RouteParams.ModelID}/owners`,
    [PageMap.SCHEDULED_MAINTENANCE_VIEW_STATE_TIMELINE]: `${RouteParams.ModelID}/state-timeline`,
    [PageMap.SCHEDULED_MAINTENANCE_VIEW_DELETE]: `${RouteParams.ModelID}/delete`,
    [PageMap.SCHEDULED_MAINTENANCE_INTERNAL_NOTE]: `${RouteParams.ModelID}/internal-notes`,
    [PageMap.SCHEDULED_MAINTENANCE_PUBLIC_NOTE]: `${RouteParams.ModelID}/public-notes`,
    [PageMap.SCHEDULED_MAINTENANCE_VIEW_CUSTOM_FIELDS]: `${RouteParams.ModelID}/custom-fields`,
};

export const SettingsRoutePath: Dictionary<string> = {
    [PageMap.SETTINGS_DANGERZONE]: 'danger-zone',
    [PageMap.SETTINGS_NOTIFICATION_SETTINGS]: 'notification-settings',
    [PageMap.SETTINGS_SMS_LOGS]: 'sms-logs',
    [PageMap.SETTINGS_EMAIL_LOGS]: 'email-logs',
    [PageMap.SETTINGS_CALL_LOGS]: 'call-logs',
    [PageMap.SETTINGS_APIKEYS]: `api-keys`,
    [PageMap.SETTINGS_APIKEY_VIEW]: `api-keys/${RouteParams.ModelID}`,
    [PageMap.SETTINGS_MONITORS_STATUS]: 'monitors-status',
    [PageMap.SETTINGS_MONITOR_CUSTOM_FIELDS]: 'monitor-custom-fields',
    [PageMap.SETTINGS_INCIDENT_CUSTOM_FIELDS]: 'incident-custom-fields',
    [PageMap.SETTINGS_ON_CALL_DUTY_POLICY_CUSTOM_FIELDS]:
        'on-call-duty-policy-custom-fields',
    [PageMap.SETTINGS_SCHEDULED_MAINTENANCE_CUSTOM_FIELDS]:
        'scheduled-maintenance-custom-fields',
    [PageMap.SETTINGS_STATUS_PAGE_CUSTOM_FIELDS]: 'status-page-custom-fields',
    [PageMap.SETTINGS_INCIDENTS_STATE]: 'incidents-state',
    [PageMap.SETTINGS_SCHEDULED_MAINTENANCE_STATE]:
        'scheduled-maintenance-state',
    [PageMap.SETTINGS_INCIDENTS_SEVERITY]: 'incidents-severity',
    [PageMap.SETTINGS_DOMAINS]: 'domains',
    [PageMap.SETTINGS_FEATURE_FLAGS]: 'feature-flags',
    [PageMap.SETTINGS_SSO]: 'sso',
    [PageMap.SETTINGS_TEAMS]: 'teams',
    [PageMap.SETTINGS_INCIDENT_TEMPLATES]: 'incident-templates',
    [PageMap.SETTINGS_INCIDENT_TEMPLATES_VIEW]: `incident-templates/${RouteParams.ModelID}`,
    [PageMap.SETTINGS_INCIDENT_NOTE_TEMPLATES]: 'incident-note-templates',
    [PageMap.SETTINGS_INCIDENT_NOTE_TEMPLATES_VIEW]: `incident-note-templates/${RouteParams.ModelID}`,
    [PageMap.SETTINGS_SCHEDULED_MAINTENANCE_NOTE_TEMPLATES]:
        'scheduled-maintenance-note-templates',
    [PageMap.SETTINGS_SCHEDULED_MAINTENANCE_NOTE_TEMPLATES_VIEW]: `scheduled-maintenance-note-templates/${RouteParams.ModelID}`,
    [PageMap.SETTINGS_BILLING]: 'billing',
    [PageMap.SETTINGS_BILLING_INVOICES]: 'invoices',
    [PageMap.SETTINGS_USAGE_HISTORY]: 'usage-history',
    [PageMap.SETTINGS_TEAM_VIEW]: `teams/${RouteParams.ModelID}`,
    [PageMap.SETTINGS_LABELS]: 'labels',
    [PageMap.SETTINGS_PROBES]: 'probes',
    [PageMap.SETTINGS_DATA_RETENTION]: 'data-retention',
};

export const OnCallDutyRoutePath: Dictionary<string> = {
    [PageMap.ON_CALL_DUTY_SCHEDULES]: 'schedules',
    [PageMap.ON_CALL_DUTY_SCHEDULE_VIEW]: `schedules/${RouteParams.ModelID}`,
    [PageMap.ON_CALL_DUTY_SCHEDULE_VIEW_DELETE]: `schedules/${RouteParams.ModelID}/delete`,
    [PageMap.ON_CALL_DUTY_SCHEDULE_VIEW_LAYERS]: `schedules/${RouteParams.ModelID}/layers`,
    [PageMap.ON_CALL_DUTY_POLICIES]: 'policies',
    [PageMap.ON_CALL_DUTY_POLICY_VIEW]: `policies/${RouteParams.ModelID}`,
    [PageMap.ON_CALL_DUTY_POLICY_VIEW_DELETE]: `policies/${RouteParams.ModelID}/delete`,
    [PageMap.ON_CALL_DUTY_POLICY_VIEW_EXECUTION_LOGS]: `policies/${RouteParams.ModelID}/execution-logs`,
    [PageMap.ON_CALL_DUTY_POLICY_VIEW_CUSTOM_FIELDS]: `policies/${RouteParams.ModelID}/custom-fields`,
    [PageMap.ON_CALL_DUTY_POLICY_VIEW_EXECUTION_LOG_VIEW]: `policies/${RouteParams.ModelID}/execution-logs/${RouteParams.SubModelID}`,
    [PageMap.ON_CALL_DUTY_POLICY_VIEW_ESCALATION]: `policies/${RouteParams.ModelID}/escalation`,
    [PageMap.ON_CALL_DUTY_EXECUTION_LOGS]: 'execution-logs',
    [PageMap.ON_CALL_DUTY_EXECUTION_LOGS_TIMELINE]: `execution-logs/${RouteParams.ModelID}`,
};

export const MonitorGroupRoutePath: Dictionary<string> = {
    [PageMap.MONITOR_GROUP_VIEW]: `${RouteParams.ModelID}`,
    [PageMap.MONITOR_GROUP_VIEW_OWNERS]: `${RouteParams.ModelID}/owners`,
    [PageMap.MONITOR_GROUP_VIEW_INCIDENTS]: `${RouteParams.ModelID}/incidents`,
    [PageMap.MONITOR_GROUP_VIEW_DELETE]: `${RouteParams.ModelID}/delete`,
    [PageMap.MONITOR_GROUP_VIEW_MONITORS]: `${RouteParams.ModelID}/monitors`,
};

export const UserSettingsRoutePath: Dictionary<string> = {
    [PageMap.USER_SETTINGS]: 'notification-methods',
    [PageMap.USER_SETTINGS_NOTIFICATION_SETTINGS]: 'notification-settings',
    [PageMap.USER_SETTINGS_NOTIFICATION_METHODS]: 'notification-methods',
    [PageMap.USER_SETTINGS_ON_CALL_RULES]: 'on-call-rules',
    [PageMap.USER_SETTINGS_ON_CALL_LOGS]: 'on-call-logs',
    [PageMap.USER_SETTINGS_ON_CALL_LOGS_TIMELINE]: `on-call-logs/${RouteParams.ModelID}`,
};

const RouteMap: Dictionary<Route> = {
    [PageMap.INIT]: new Route(`/dashboard`),

    [PageMap.WELCOME]: new Route(`/dashboard/welcome`),

    [PageMap.PROJECT_SSO]: new Route(`/dashboard/${RouteParams.ProjectID}/sso`),

    [PageMap.INIT_PROJECT]: new Route(`/dashboard/${RouteParams.ProjectID}`),

    [PageMap.HOME]: new Route(`/dashboard/${RouteParams.ProjectID}/home/`),

    [PageMap.HOME_NOT_OPERATIONAL_MONITORS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/home/monitors-inoperational`
    ),

    [PageMap.HOME_ONGOING_SCHEDULED_MAINTENANCE_EVENTS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/home/scheduled-maintenance-ongoing`
    ),

    [PageMap.MONITORS_ROOT]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors/*`
    ),
    [PageMap.MONITORS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors`
    ),

    [PageMap.MONITORS_INOPERATIONAL]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors/${
            MonitorsRoutePath[PageMap.MONITORS_INOPERATIONAL]
        }`
    ),

    [PageMap.MONITORS_DISABLED]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors/${
            MonitorsRoutePath[PageMap.MONITORS_DISABLED]
        }`
    ),

    [PageMap.MONITOR_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors/${
            MonitorsRoutePath[PageMap.MONITOR_VIEW]
        }`
    ),

    [PageMap.MONITOR_VIEW_INTERVAL]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors/${
            MonitorsRoutePath[PageMap.MONITOR_VIEW_INTERVAL]
        }`
    ),

    [PageMap.MONITOR_VIEW_OWNERS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors/${
            MonitorsRoutePath[PageMap.MONITOR_VIEW_OWNERS]
        }`
    ),

    [PageMap.MONITOR_VIEW_STATUS_TIMELINE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors/${
            MonitorsRoutePath[PageMap.MONITOR_VIEW_STATUS_TIMELINE]
        }`
    ),

    [PageMap.MONITOR_VIEW_CUSTOM_FIELDS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors/${
            MonitorsRoutePath[PageMap.MONITOR_VIEW_CUSTOM_FIELDS]
        }`
    ),

    [PageMap.MONITOR_VIEW_DELETE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors/${
            MonitorsRoutePath[PageMap.MONITOR_VIEW_DELETE]
        }`
    ),

    [PageMap.MONITOR_VIEW_INCIDENTS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors/${
            MonitorsRoutePath[PageMap.MONITOR_VIEW_INCIDENTS]
        }`
    ),

    [PageMap.MONITOR_VIEW_SETTINGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors/${
            MonitorsRoutePath[PageMap.MONITOR_VIEW_SETTINGS]
        }`
    ),

    [PageMap.MONITOR_VIEW_PROBES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors/${
            MonitorsRoutePath[PageMap.MONITOR_VIEW_PROBES]
        }`
    ),

    [PageMap.MONITOR_VIEW_CRITERIA]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors/${
            MonitorsRoutePath[PageMap.MONITOR_VIEW_CRITERIA]
        }`
    ),

    [PageMap.INCIDENTS_ROOT]: new Route(
        `/dashboard/${RouteParams.ProjectID}/incidents/*`
    ),

    [PageMap.INCIDENTS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/incidents`
    ),

    [PageMap.UNRESOLVED_INCIDENTS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/incidents/${
            IncidentsRoutePath[PageMap.UNRESOLVED_INCIDENTS]
        }`
    ),

    [PageMap.USER_PROFILE_OVERVIEW]: new Route(
        `/dashboard/user-profile/overview`
    ),
    [PageMap.USER_PROFILE_PASSWORD]: new Route(
        `/dashboard/user-profile/password-management`
    ),
    [PageMap.USER_PROFILE_PICTURE]: new Route(
        `/dashboard/user-profile/profile-picture`
    ),

    [PageMap.ACTIVE_INCIDENTS]: new Route(`/dashboard/active-incidents`),

    [PageMap.PROJECT_INVITATIONS]: new Route(`/dashboard/project-invitations`),

    [PageMap.INCIDENT_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/incidents/${
            IncidentsRoutePath[PageMap.INCIDENT_VIEW]
        }`
    ),

    [PageMap.INCIDENT_VIEW_STATE_TIMELINE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/incidents/${
            IncidentsRoutePath[PageMap.INCIDENT_VIEW_STATE_TIMELINE]
        }`
    ),

    [PageMap.INCIDENT_VIEW_OWNERS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/incidents/${
            IncidentsRoutePath[PageMap.INCIDENT_VIEW_OWNERS]
        }`
    ),

    [PageMap.INCIDENT_VIEW_DELETE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/incidents/${
            IncidentsRoutePath[PageMap.INCIDENT_VIEW_DELETE]
        }`
    ),

    [PageMap.INCIDENT_VIEW_CUSTOM_FIELDS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/incidents/${
            IncidentsRoutePath[PageMap.INCIDENT_VIEW_CUSTOM_FIELDS]
        }`
    ),

    [PageMap.INCIDENT_INTERNAL_NOTE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/incidents/${
            IncidentsRoutePath[PageMap.INCIDENT_INTERNAL_NOTE]
        }`
    ),

    [PageMap.INCIDENT_PUBLIC_NOTE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/incidents/${
            IncidentsRoutePath[PageMap.INCIDENT_PUBLIC_NOTE]
        }`
    ),

    [PageMap.SCHEDULED_MAINTENANCE_EVENTS_ROOT]: new Route(
        `/dashboard/${RouteParams.ProjectID}/scheduled-maintenance-events/*`
    ),

    [PageMap.SCHEDULED_MAINTENANCE_EVENTS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/scheduled-maintenance-events`
    ),

    [PageMap.ONGOING_SCHEDULED_MAINTENANCE_EVENTS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/scheduled-maintenance-events/${
            ScheduledMaintenanceEventsRoutePath[
                PageMap.ONGOING_SCHEDULED_MAINTENANCE_EVENTS
            ]
        }`
    ),

    [PageMap.SCHEDULED_MAINTENANCE_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/scheduled-maintenance-events/${
            ScheduledMaintenanceEventsRoutePath[
                PageMap.SCHEDULED_MAINTENANCE_VIEW
            ]
        }`
    ),

    [PageMap.SCHEDULED_MAINTENANCE_VIEW_OWNERS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/scheduled-maintenance-events/${
            ScheduledMaintenanceEventsRoutePath[
                PageMap.SCHEDULED_MAINTENANCE_VIEW_OWNERS
            ]
        }`
    ),

    [PageMap.SCHEDULED_MAINTENANCE_VIEW_STATE_TIMELINE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/scheduled-maintenance-events/${
            ScheduledMaintenanceEventsRoutePath[
                PageMap.SCHEDULED_MAINTENANCE_VIEW_STATE_TIMELINE
            ]
        }`
    ),

    [PageMap.SCHEDULED_MAINTENANCE_VIEW_DELETE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/scheduled-maintenance-events/${
            ScheduledMaintenanceEventsRoutePath[
                PageMap.SCHEDULED_MAINTENANCE_VIEW_DELETE
            ]
        }`
    ),

    [PageMap.SCHEDULED_MAINTENANCE_INTERNAL_NOTE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/scheduled-maintenance-events/${
            ScheduledMaintenanceEventsRoutePath[
                PageMap.SCHEDULED_MAINTENANCE_INTERNAL_NOTE
            ]
        }`
    ),

    [PageMap.SCHEDULED_MAINTENANCE_VIEW_CUSTOM_FIELDS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/scheduled-maintenance-events/${
            ScheduledMaintenanceEventsRoutePath[
                PageMap.SCHEDULED_MAINTENANCE_VIEW_CUSTOM_FIELDS
            ]
        }`
    ),

    [PageMap.SCHEDULED_MAINTENANCE_PUBLIC_NOTE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/scheduled-maintenance-events/${
            ScheduledMaintenanceEventsRoutePath[
                PageMap.SCHEDULED_MAINTENANCE_PUBLIC_NOTE
            ]
        }`
    ),

    [PageMap.STATUS_PAGES_ROOT]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/*`
    ),

    [PageMap.STATUS_PAGES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages`
    ),

    [PageMap.STATUS_PAGE_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_BRANDING]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_BRANDING]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_OWNERS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_OWNERS]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_GROUPS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_GROUPS]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_DELETE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_DELETE]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_CUSTOM_FIELDS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_CUSTOM_FIELDS]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_DOMAINS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_DOMAINS]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_EMAIL_SUBSCRIBERS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_EMAIL_SUBSCRIBERS]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_SMS_SUBSCRIBERS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_SMS_SUBSCRIBERS]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_WEBHOOK_SUBSCRIBERS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_WEBHOOK_SUBSCRIBERS]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_HEADER_STYLE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_HEADER_STYLE]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_FOOTER_STYLE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_FOOTER_STYLE]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_PRIVATE_USERS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_PRIVATE_USERS]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_NAVBAR_STYLE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_NAVBAR_STYLE]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_ANNOUNCEMENTS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_ANNOUNCEMENTS]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_EMBEDDED]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_EMBEDDED]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_SUBSCRIBER_SETTINGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_SUBSCRIBER_SETTINGS]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_SSO]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_SSO]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_CUSTOM_HTML_CSS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_CUSTOM_HTML_CSS]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_RESOURCES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_RESOURCES]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_ADVANCED_OPTIONS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_ADVANCED_OPTIONS]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_AUTHENTICATION_SETTINGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[
                PageMap.STATUS_PAGE_VIEW_AUTHENTICATION_SETTINGS
            ]
        }`
    ),

    [PageMap.STATUS_PAGE_VIEW_SETTINGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/${
            StatusPagesRoutePath[PageMap.STATUS_PAGE_VIEW_SETTINGS]
        }`
    ),

    [PageMap.LOGS]: new Route(`/dashboard/${RouteParams.ProjectID}/logs/`),

    [PageMap.AUTOMATION_SCRIPTS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/automation-scripts/`
    ),

    [PageMap.ON_CALL_DUTY_ROOT]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/*`
    ),

    [PageMap.ON_CALL_DUTY]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/policies`
    ),

    [PageMap.ON_CALL_DUTY_SCHEDULES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/${
            OnCallDutyRoutePath[PageMap.ON_CALL_DUTY_SCHEDULES]
        }`
    ),

    [PageMap.ON_CALL_DUTY_SCHEDULE_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/${
            OnCallDutyRoutePath[PageMap.ON_CALL_DUTY_SCHEDULE_VIEW]
        }`
    ),

    [PageMap.ON_CALL_DUTY_SCHEDULE_VIEW_DELETE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/${
            OnCallDutyRoutePath[PageMap.ON_CALL_DUTY_SCHEDULE_VIEW_DELETE]
        }`
    ),

    [PageMap.ON_CALL_DUTY_SCHEDULE_VIEW_LAYERS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/${
            OnCallDutyRoutePath[PageMap.ON_CALL_DUTY_SCHEDULE_VIEW_LAYERS]
        }`
    ),

    [PageMap.ON_CALL_DUTY_POLICIES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/policies`
    ),

    [PageMap.ON_CALL_DUTY_EXECUTION_LOGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/${
            OnCallDutyRoutePath[PageMap.ON_CALL_DUTY_EXECUTION_LOGS]
        }`
    ),

    [PageMap.ON_CALL_DUTY_EXECUTION_LOGS_TIMELINE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/${
            OnCallDutyRoutePath[PageMap.ON_CALL_DUTY_EXECUTION_LOGS_TIMELINE]
        }`
    ),

    [PageMap.ON_CALL_DUTY_POLICY_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/${
            OnCallDutyRoutePath[PageMap.ON_CALL_DUTY_POLICY_VIEW]
        }`
    ),

    [PageMap.ON_CALL_DUTY_POLICY_VIEW_DELETE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/${
            OnCallDutyRoutePath[PageMap.ON_CALL_DUTY_POLICY_VIEW_DELETE]
        }`
    ),

    [PageMap.ON_CALL_DUTY_POLICY_VIEW_EXECUTION_LOGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/${
            OnCallDutyRoutePath[PageMap.ON_CALL_DUTY_POLICY_VIEW_EXECUTION_LOGS]
        }`
    ),

    [PageMap.ON_CALL_DUTY_POLICY_VIEW_CUSTOM_FIELDS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/${
            OnCallDutyRoutePath[PageMap.ON_CALL_DUTY_POLICY_VIEW_CUSTOM_FIELDS]
        }`
    ),

    [PageMap.ON_CALL_DUTY_POLICY_VIEW_EXECUTION_LOG_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/${
            OnCallDutyRoutePath[
                PageMap.ON_CALL_DUTY_POLICY_VIEW_EXECUTION_LOG_VIEW
            ]
        }`
    ),

    [PageMap.ON_CALL_DUTY_POLICY_VIEW_ESCALATION]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call-duty/${
            OnCallDutyRoutePath[PageMap.ON_CALL_DUTY_POLICY_VIEW_ESCALATION]
        }`
    ),

    [PageMap.REPORTS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/reports/`
    ),

    [PageMap.ERROR_TRACKER]: new Route(
        `/dashboard/${RouteParams.ProjectID}/error-tracker/`
    ),

    [PageMap.TELEMETRY_ROOT]: new Route(
        `/dashboard/${RouteParams.ProjectID}/telemetry/services/*`
    ),

    [PageMap.TELEMETRY]: new Route(
        `/dashboard/${RouteParams.ProjectID}/telemetry/services`
    ),

    [PageMap.TELEMETRY_SERVICES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/telemetry/services`
    ),

    [PageMap.TELEMETRY_SERVICES_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/telemetry/services/${
            TelemetryRouthPath[PageMap.TELEMETRY_SERVICES_VIEW]
        }`
    ),

    [PageMap.TELEMETRY_SERVICES_VIEW_DOCUMENTATION]: new Route(
        `/dashboard/${RouteParams.ProjectID}/telemetry/services/${
            TelemetryRouthPath[PageMap.TELEMETRY_SERVICES_VIEW_DOCUMENTATION]
        }`
    ),

    [PageMap.TELEMETRY_SERVICES_VIEW_DELETE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/telemetry/services/${
            TelemetryRouthPath[PageMap.TELEMETRY_SERVICES_VIEW_DELETE]
        }`
    ),

    [PageMap.TELEMETRY_SERVICES_VIEW_SETTINGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/telemetry/services/${
            TelemetryRouthPath[PageMap.TELEMETRY_SERVICES_VIEW_SETTINGS]
        }`
    ),

    //TELEMETRY_SERVICE_VIEW_LOGS
    [PageMap.TELEMETRY_SERVICES_VIEW_LOGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/telemetry/services/${
            TelemetryRouthPath[PageMap.TELEMETRY_SERVICES_VIEW_LOGS]
        }`
    ),

    //TELEMETRY_SERVICE_VIEW_TRACES
    [PageMap.TELEMETRY_SERVICES_VIEW_TRACES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/telemetry/services/${
            TelemetryRouthPath[PageMap.TELEMETRY_SERVICES_VIEW_TRACES]
        }`
    ),

    // Metrics
    [PageMap.TELEMETRY_SERVICES_VIEW_METRICS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/telemetry/services/${
            TelemetryRouthPath[PageMap.TELEMETRY_SERVICES_VIEW_METRICS]
        }`
    ),

    // Dashboard
    [PageMap.TELEMETRY_SERVICES_VIEW_DASHBOARDS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/telemetry/services/${
            TelemetryRouthPath[PageMap.TELEMETRY_SERVICES_VIEW_DASHBOARDS]
        }`
    ),

    // User Settings Routes
    [PageMap.USER_SETTINGS_ROOT]: new Route(
        `/dashboard/${RouteParams.ProjectID}/user-settings/*`
    ),

    [PageMap.USER_SETTINGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/user-settings/${
            UserSettingsRoutePath[PageMap.USER_SETTINGS]
        }`
    ),

    [PageMap.USER_SETTINGS_NOTIFICATION_SETTINGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/user-settings/${
            UserSettingsRoutePath[PageMap.USER_SETTINGS_NOTIFICATION_SETTINGS]
        }`
    ),

    [PageMap.USER_SETTINGS_NOTIFICATION_METHODS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/user-settings/${
            UserSettingsRoutePath[PageMap.USER_SETTINGS_NOTIFICATION_METHODS]
        }`
    ),

    [PageMap.USER_SETTINGS_ON_CALL_RULES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/user-settings/${
            UserSettingsRoutePath[PageMap.USER_SETTINGS_ON_CALL_RULES]
        }`
    ),

    [PageMap.USER_SETTINGS_ON_CALL_LOGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/user-settings/${
            UserSettingsRoutePath[PageMap.USER_SETTINGS_ON_CALL_LOGS]
        }`
    ),

    [PageMap.USER_SETTINGS_ON_CALL_LOGS_TIMELINE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/user-settings/${
            UserSettingsRoutePath[PageMap.USER_SETTINGS_ON_CALL_LOGS_TIMELINE]
        }`
    ),

    // Settings Routes
    [PageMap.SETTINGS_ROOT]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/*`
    ),

    [PageMap.SETTINGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/`
    ),
    [PageMap.SETTINGS_DANGERZONE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_DANGERZONE]
        }`
    ),

    [PageMap.SETTINGS_NOTIFICATION_SETTINGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_NOTIFICATION_SETTINGS]
        }`
    ),

    [PageMap.SETTINGS_SMS_LOGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_SMS_LOGS]
        }`
    ),

    [PageMap.SETTINGS_EMAIL_LOGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_EMAIL_LOGS]
        }`
    ),

    [PageMap.SETTINGS_CALL_LOGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_CALL_LOGS]
        }`
    ),

    [PageMap.SETTINGS_APIKEYS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_APIKEYS]
        }`
    ),

    [PageMap.SETTINGS_APIKEY_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_APIKEY_VIEW]
        }`
    ),

    [PageMap.SETTINGS_MONITORS_STATUS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_MONITORS_STATUS]
        }`
    ),

    [PageMap.SETTINGS_INCIDENTS_STATE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_INCIDENTS_STATE]
        }`
    ),

    [PageMap.SETTINGS_SCHEDULED_MAINTENANCE_STATE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_SCHEDULED_MAINTENANCE_STATE]
        }`
    ),

    [PageMap.SETTINGS_INCIDENTS_SEVERITY]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_INCIDENTS_SEVERITY]
        }`
    ),

    [PageMap.SETTINGS_DOMAINS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_DOMAINS]
        }`
    ),

    [PageMap.SETTINGS_FEATURE_FLAGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_FEATURE_FLAGS]
        }`
    ),

    [PageMap.SETTINGS_SSO]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_SSO]
        }`
    ),

    [PageMap.SETTINGS_TEAMS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_TEAMS]
        }`
    ),

    [PageMap.SETTINGS_INCIDENT_TEMPLATES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_INCIDENT_TEMPLATES]
        }`
    ),

    [PageMap.SETTINGS_INCIDENT_TEMPLATES_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_INCIDENT_TEMPLATES_VIEW]
        }`
    ),

    [PageMap.SETTINGS_INCIDENT_NOTE_TEMPLATES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_INCIDENT_NOTE_TEMPLATES]
        }`
    ),

    [PageMap.SETTINGS_INCIDENT_NOTE_TEMPLATES_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_INCIDENT_NOTE_TEMPLATES_VIEW]
        }`
    ),

    [PageMap.SETTINGS_SCHEDULED_MAINTENANCE_NOTE_TEMPLATES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[
                PageMap.SETTINGS_SCHEDULED_MAINTENANCE_NOTE_TEMPLATES
            ]
        }`
    ),

    [PageMap.SETTINGS_SCHEDULED_MAINTENANCE_NOTE_TEMPLATES_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[
                PageMap.SETTINGS_SCHEDULED_MAINTENANCE_NOTE_TEMPLATES_VIEW
            ]
        }`
    ),
    [PageMap.SETTINGS_BILLING]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_BILLING]
        }`
    ),

    [PageMap.SETTINGS_DATA_RETENTION]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_DATA_RETENTION]
        }`
    ),

    [PageMap.SETTINGS_BILLING_INVOICES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_BILLING_INVOICES]
        }`
    ),

    [PageMap.SETTINGS_USAGE_HISTORY]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_USAGE_HISTORY]
        }`
    ),

    [PageMap.SETTINGS_TEAM_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_TEAM_VIEW]
        }`
    ),

    // labels.
    [PageMap.SETTINGS_LABELS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_LABELS]
        }`
    ),

    // Probes.
    [PageMap.SETTINGS_PROBES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_PROBES]
        }`
    ),

    // workflows.
    [PageMap.WORKFLOWS_ROOT]: new Route(
        `/dashboard/${RouteParams.ProjectID}/workflows/*`
    ),
    [PageMap.WORKFLOWS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/workflows`
    ),

    [PageMap.WORKFLOWS_LOGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/workflows/${
            WorkflowRoutePath[PageMap.WORKFLOWS_LOGS]
        }`
    ),

    [PageMap.WORKFLOWS_VARIABLES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/workflows/${
            WorkflowRoutePath[PageMap.WORKFLOWS_VARIABLES]
        }`
    ),

    [PageMap.WORKFLOW_VARIABLES]: new Route(
        `/dashboard/${RouteParams.ProjectID}/workflows/${
            WorkflowRoutePath[PageMap.WORKFLOW_VARIABLES]
        }`
    ),

    [PageMap.WORKFLOW_BUILDER]: new Route(
        `/dashboard/${RouteParams.ProjectID}/workflows/${
            WorkflowRoutePath[PageMap.WORKFLOW_BUILDER]
        }`
    ),

    [PageMap.WORKFLOW_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/workflows/${
            WorkflowRoutePath[PageMap.WORKFLOW_VIEW]
        }`
    ),

    [PageMap.WORKFLOW_LOGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/workflows/${
            WorkflowRoutePath[PageMap.WORKFLOW_LOGS]
        }`
    ),

    [PageMap.WORKFLOW_DELETE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/workflows/${
            WorkflowRoutePath[PageMap.WORKFLOW_DELETE]
        }`
    ),

    [PageMap.WORKFLOW_VIEW_SETTINGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/workflows/${
            WorkflowRoutePath[PageMap.WORKFLOW_VIEW_SETTINGS]
        }`
    ),

    /// custom fields settings.

    [PageMap.SETTINGS_MONITOR_CUSTOM_FIELDS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_MONITOR_CUSTOM_FIELDS]
        }`
    ),

    [PageMap.SETTINGS_ON_CALL_DUTY_POLICY_CUSTOM_FIELDS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[
                PageMap.SETTINGS_ON_CALL_DUTY_POLICY_CUSTOM_FIELDS
            ]
        }`
    ),

    [PageMap.SETTINGS_INCIDENT_CUSTOM_FIELDS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_INCIDENT_CUSTOM_FIELDS]
        }`
    ),

    [PageMap.SETTINGS_SCHEDULED_MAINTENANCE_CUSTOM_FIELDS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[
                PageMap.SETTINGS_SCHEDULED_MAINTENANCE_CUSTOM_FIELDS
            ]
        }`
    ),
    [PageMap.SETTINGS_STATUS_PAGE_CUSTOM_FIELDS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/${
            SettingsRoutePath[PageMap.SETTINGS_STATUS_PAGE_CUSTOM_FIELDS]
        }`
    ),

    // logout.
    [PageMap.LOGOUT]: new Route(`/dashboard/logout`),

    [PageMap.MONITOR_GROUPS_ROOT]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitor-groups/*`
    ),

    [PageMap.MONITOR_GROUPS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitor-groups`
    ),

    [PageMap.MONITOR_GROUP_VIEW]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitor-groups/${
            MonitorGroupRoutePath[PageMap.MONITOR_GROUP_VIEW]
        }`
    ),

    [PageMap.MONITOR_GROUP_VIEW_DELETE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitor-groups/${
            MonitorGroupRoutePath[PageMap.MONITOR_GROUP_VIEW_DELETE]
        }`
    ),

    [PageMap.MONITOR_GROUP_VIEW_MONITORS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitor-groups/${
            MonitorGroupRoutePath[PageMap.MONITOR_GROUP_VIEW_MONITORS]
        }`
    ),

    [PageMap.MONITOR_GROUP_VIEW_OWNERS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitor-groups/${
            MonitorGroupRoutePath[PageMap.MONITOR_GROUP_VIEW_OWNERS]
        }`
    ),

    [PageMap.MONITOR_GROUP_VIEW_INCIDENTS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitor-groups/${
            MonitorGroupRoutePath[PageMap.MONITOR_GROUP_VIEW_INCIDENTS]
        }`
    ),
};

export class RouteUtil {
    public static isGlobalRoute(route: Route): boolean {
        if (
            route.toString() ===
                RouteMap[PageMap.USER_PROFILE_OVERVIEW]?.toString() ||
            route.toString() ===
                RouteMap[PageMap.USER_PROFILE_PASSWORD]?.toString() ||
            route.toString() ===
                RouteMap[PageMap.USER_PROFILE_PICTURE]?.toString() ||
            route.toString() ===
                RouteMap[PageMap.PROJECT_INVITATIONS]?.toString() ||
            route.toString() === RouteMap[PageMap.ACTIVE_INCIDENTS]?.toString()
        ) {
            return true;
        }
        return false;
    }

    public static populateRouteParams(
        route: Route,
        props?: {
            modelId?: ObjectID;
            subModelId?: ObjectID;
        }
    ): Route {
        // populate projectid
        const project: Project | null = ProjectUtil.getCurrentProject();
        const tempRoute: Route = new Route(route.toString());

        if (project && project._id) {
            route = tempRoute.addRouteParam(RouteParams.ProjectID, project._id);
        }

        if (props && props.modelId) {
            route = tempRoute.addRouteParam(
                RouteParams.ModelID,
                props.modelId.toString()
            );
        }

        if (props && props.subModelId) {
            route = tempRoute.addRouteParam(
                RouteParams.SubModelID,
                props.subModelId.toString()
            );
        }

        return tempRoute;
    }

    public static getRoutes(): Array<{ path: string }> {
        return Object.values(RouteMap).map((route: Route) => {
            return {
                path: route.toString(),
            };
        });
    }

    public static getRouteString(key: string): string {
        return RouteMap[key]?.toString() || '';
    }

    public static getLastPath(path: string): string {
        const paths: string[] = path.split('/');
        return paths[paths.length - 1] || '';
    }

    public static getLastPathForKey(key: string, count: number = 1): string {
        const routePath: string = RouteMap[key]?.toString() || '';
        const paths: string[] = routePath.split('/');
        if (count === 1) {
            return paths[paths.length - 1] || '';
        }
        return paths.splice(paths.length - count, count).join('/');
    }
}

export default RouteMap;
