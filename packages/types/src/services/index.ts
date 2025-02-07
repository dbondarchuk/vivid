import { IAssetsService } from "./assets.service";
import { ICommunicationLogService } from "./communicationLogs.service";
import { IConfigurationService } from "./configuration.service";
import { IConnectedAppService } from "./connectedApp.service";
import { IEventsService } from "./events.service";
import { INotificationService } from "./notification.service";
import { IPagesService } from "./pages.service";

export * from "./assets.service";
export * from "./communicationLogs.service";
export * from "./configuration.service";
export * from "./connectedApp.service";
export * from "./events.service";
export * from "./notification.service";
export * from "./pages.service";

export type IServicesContainer = {
  ConfigurationService: () => IConfigurationService;
  AssetsService: () => IAssetsService;
  EventsService: () => IEventsService;
  PagesService: () => IPagesService;
  CommunicationLogService: () => ICommunicationLogService;
  ConnectedAppService: () => IConnectedAppService;
  NotificationService: () => INotificationService;
};
