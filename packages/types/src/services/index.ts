import { IAssetsService } from "./assets.service";
import { ICommunicationLogsService } from "./communication-logs.service";
import { IConfigurationService } from "./configuration.service";
import { IConnectedAppsService } from "./connected-apps.service";
import { IEventsService } from "./events.service";
import { INotificationService } from "./notification.service";
import { IPagesService } from "./pages.service";
import { ITemplatesService } from "./templates.service";

export * from "./assets.service";
export * from "./communication-logs.service";
export * from "./configuration.service";
export * from "./connected-apps.service";
export * from "./events.service";
export * from "./notification.service";
export * from "./pages.service";
export * from "./templates.service";

export type IServicesContainer = {
  ConfigurationService: () => IConfigurationService;
  AssetsService: () => IAssetsService;
  EventsService: () => IEventsService;
  PagesService: () => IPagesService;
  TemplatesService: () => ITemplatesService;
  CommunicationLogService: () => ICommunicationLogsService;
  ConnectedAppService: () => IConnectedAppsService;
  NotificationService: () => INotificationService;
};
