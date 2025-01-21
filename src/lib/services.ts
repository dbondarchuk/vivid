import { AssetsService } from "@/services/assetsService";
import { CommunicationLogService } from "@/services/communicationLogService";
import {
  CachedConfigurationService,
  ConfigurationService,
} from "@/services/configurationService";
import { ConnectedAppService } from "@/services/connectedAppService";
import { EventsService } from "@/services/eventsService";
import { MeetingService } from "@/services/meetingService";
import { NotificationService } from "@/services/notifications/notificationService";
import { PagesService } from "@/services/pagesService";
import { ReminderService } from "@/services/reminders/reminderService";
import { cache } from "react";

type Types = {
  ConfigurationService: () => ConfigurationService;
  AssetsService: () => AssetsService;
  EventsService: () => EventsService;
  MeetingService: () => MeetingService;
  NotificationService: () => NotificationService;
  PagesService: () => PagesService;
  CommunicationLogService: () => CommunicationLogService;
  ConnectedAppService: () => ConnectedAppService;

  RemindersService: () => ReminderService;
};

export const Services: Types = {
  ConfigurationService: cache(() => new CachedConfigurationService()),
  AssetsService: cache(() => new AssetsService()),
  EventsService: cache(
    () =>
      new EventsService(
        Services.ConfigurationService(),
        Services.NotificationService(),
        Services.ConnectedAppService()
      )
  ),
  MeetingService: cache(
    () => new MeetingService(Services.ConfigurationService())
  ),
  NotificationService: cache(
    () => new NotificationService(Services.ConfigurationService())
  ),
  PagesService: cache(() => new PagesService()),
  CommunicationLogService: cache(() => new CommunicationLogService()),
  ConnectedAppService: cache(() => new ConnectedAppService()),

  RemindersService: () =>
    new ReminderService(
      Services.EventsService(),
      Services.ConfigurationService()
    ),
};
