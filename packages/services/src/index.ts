import { IServicesContainer } from "@vivid/types";
import { cache } from "react";
import { AssetsService } from "./assets.service";
import { CommunicationLogsService } from "./communication-logs.service";
import { CachedConfigurationService } from "./configuration.service";
import { ConnectedAppsService } from "./connected-apps.service";
import { EventsService } from "./events.service";
import { NotificationService } from "./notifications.service";
import { PagesService } from "./pages.service";
import { ScheduleService } from "./schedule.service";
import { ServicesService } from "./services.service";
import { TemplatesService } from "./templates.service";

export * from "./assets.service";
export * from "./communication-logs.service";
export * from "./configuration.service";
export * from "./connected-apps.service";
export * from "./events.service";
export * from "./pages.service";
export * from "./schedule.service";
export * from "./services.service";

export * from "./notifications";

export const ServicesContainer: IServicesContainer = {
  ConfigurationService: cache(() => new CachedConfigurationService()),
  AssetsService: cache(
    () =>
      new AssetsService(
        ServicesContainer.ConfigurationService(),
        ServicesContainer.ConnectedAppService()
      )
  ),
  EventsService: cache(
    () =>
      new EventsService(
        ServicesContainer.ConfigurationService(),
        ServicesContainer.ConnectedAppService(),
        ServicesContainer.AssetsService(),
        ServicesContainer.ScheduleService()
      )
  ),
  PagesService: cache(() => new PagesService()),
  ServicesService: cache(() => new ServicesService()),
  ScheduleService: cache(
    () =>
      new ScheduleService(
        ServicesContainer.ConnectedAppService(),
        ServicesContainer.ConfigurationService()
      )
  ),
  TemplatesService: cache(() => new TemplatesService()),
  CommunicationLogService: cache(() => new CommunicationLogsService()),
  ConnectedAppService: cache(() => new ConnectedAppsService()),
  NotificationService: cache(
    () =>
      new NotificationService(
        ServicesContainer.ConfigurationService(),
        ServicesContainer.ConnectedAppService(),
        ServicesContainer.CommunicationLogService()
      )
  ),
};
