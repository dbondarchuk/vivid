import { AvailabilityService } from "@/services/availabilityService";
import {
  CachedConfigurationService,
  ConfigurationService,
} from "@/services/configurationService";
import { EventsService } from "@/services/eventsService";
import { MeetingService } from "@/services/meetingService";
import { NotificationService } from "@/services/notifications/notificationService";
import { cache } from "react";

type Types = {
  ConfigurationService: () => ConfigurationService;
  EventsService: () => EventsService;
  MeetingService: () => MeetingService;
  AvailabilityService: () => AvailabilityService;
  NotificationService: () => NotificationService;
};

export const Services: Types = {
  ConfigurationService: cache(() => new CachedConfigurationService()),
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
};
