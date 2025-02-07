import { IServicesContainer } from "@vivid/types";
import { cache } from "react";
import { AssetsService } from "./assets.service";
import { CommunicationLogService } from "./communicationLog.service";
import { CachedConfigurationService } from "./configuration.service";
import { ConnectedAppService } from "./connectedApp.service";
import { EventsService } from "./events.service";
import { NotificationService } from "./notifications.service";
import { PagesService } from "./pages.service";

export * from "./assets.service";
export * from "./communicationLog.service";
export * from "./configuration.service";
export * from "./connectedApp.service";
export * from "./events.service";
export * from "./meetingService";
export * from "./pages.service";

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
        ServicesContainer.AssetsService()
      )
  ),
  PagesService: cache(() => new PagesService()),
  CommunicationLogService: cache(() => new CommunicationLogService()),
  ConnectedAppService: cache(() => new ConnectedAppService()),
  NotificationService: cache(
    () =>
      new NotificationService(
        ServicesContainer.ConfigurationService(),
        ServicesContainer.ConnectedAppService(),
        ServicesContainer.CommunicationLogService()
      )
  ),
};
