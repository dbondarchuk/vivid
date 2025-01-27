import { AssetsService } from "@/services/assetsService";
import { AvailabilityService } from "@/services/availabilityService";
import { CommunicationLogService } from "@/services/communicationLogService";
import {
  CachedConfigurationService,
  ConfigurationService,
} from "@/services/configurationService";
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
  AvailabilityService: () => AvailabilityService;
  NotificationService: () => NotificationService;
  PagesService: () => PagesService;
  CommunicationLogService: () => CommunicationLogService;

  RemindersService: () => ReminderService;
};

export const Services: Types = {
  ConfigurationService: cache(() => new CachedConfigurationService()),
  AssetsService: cache(() => new AssetsService()),
  EventsService: cache(
    () =>
      new EventsService(
        Services.ConfigurationService(),
        Services.NotificationService()
      )
  ),
  MeetingService: cache(
    () => new MeetingService(Services.ConfigurationService())
  ),
  AvailabilityService: cache(
    () =>
      new AvailabilityService(
        Services.ConfigurationService(),
        Services.EventsService()
      )
  ),
  NotificationService: cache(
    () => new NotificationService(Services.ConfigurationService())
  ),
  PagesService: cache(() => new PagesService()),
  CommunicationLogService: cache(() => new CommunicationLogService()),

  RemindersService: () =>
    new ReminderService(
      Services.EventsService(),
      Services.ConfigurationService()
    ),
};
