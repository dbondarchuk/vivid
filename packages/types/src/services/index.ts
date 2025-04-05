import { IAssetsService } from "./assets.service";
import { ICommunicationLogsService } from "./communication-logs.service";
import { IConfigurationService } from "./configuration.service";
import { IConnectedAppsService } from "./connected-apps.service";
import { IEventsService } from "./events.service";
import { INotificationService } from "./notification.service";
import { IPagesService } from "./pages.service";
import { IScheduleService } from "./schedule.service";
import { IServicesService } from "./services.service";
import { ITemplatesService } from "./templates.service";

export * from "./assets.service";
export * from "./communication-logs.service";
export * from "./configuration.service";
export * from "./connected-apps.service";
export * from "./events.service";
export * from "./notification.service";
export * from "./pages.service";
export * from "./schedule.service";
export * from "./services.service";
export * from "./templates.service";

export type IServicesContainer = {
  ConfigurationService: () => IConfigurationService;
  AssetsService: () => IAssetsService;
  EventsService: () => IEventsService;
  PagesService: () => IPagesService;
  ServicesService: () => IServicesService;
  ScheduleService: () => IScheduleService;
  TemplatesService: () => ITemplatesService;
  CommunicationLogService: () => ICommunicationLogsService;
  ConnectedAppService: () => IConnectedAppsService;
  NotificationService: () => INotificationService;
};
