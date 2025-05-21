"use server";

import {
  CUSTOMER_EMAIL_NOTIFICATION_APP_NAME,
  CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME,
  FILE_SYSTEM_ASSETS_STORAGE_APP_NAME,
  LOG_CLEANUP_APP_NAME,
  REMINDERS_APP_NAME,
} from "@vivid/app-store";
import { ServicesContainer } from "@vivid/services";
import { DateTime } from "luxon";
import { InstallFormData } from "./types";

export async function install(data: InstallFormData) {
  await ServicesContainer.ConfigurationService().setConfiguration("general", {
    ...data,
    description: "",
    keywords: "",
  });

  await ServicesContainer.PagesService().createPage({
    content: "<PageTitle/>",
    description: "Home",
    keywords: "home",
    publishDate: new Date(),
    slug: "home",
    title: "Home",
    published: true,
  });

  const shifts = [
    {
      start: "09:00",
      end: "17:00",
    },
  ];

  await ServicesContainer.ConfigurationService().setConfiguration("booking", {
    options: [],
    timeZone: DateTime.now().zoneName,
  });

  await ServicesContainer.ConfigurationService().setConfiguration("schedule", {
    schedule: Array.from({ length: 5 }).map((_, index) => ({
      weekDay: index + 1,
      shifts,
    })),
  });

  await ServicesContainer.ConfigurationService().setConfiguration("footer", {
    isCustom: false,
  });

  await ServicesContainer.ConfigurationService().setConfiguration("header", {
    menu: [],
  });

  await ServicesContainer.ConfigurationService().setConfiguration("social", {});
  await ServicesContainer.ConfigurationService().setConfiguration(
    "styling",
    {}
  );

  await ServicesContainer.ConnectedAppService().createNewApp(
    REMINDERS_APP_NAME
  );
  await ServicesContainer.ConnectedAppService().createNewApp(
    CUSTOMER_EMAIL_NOTIFICATION_APP_NAME
  );
  await ServicesContainer.ConnectedAppService().createNewApp(
    CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME
  );

  const logCleanerAppId =
    await ServicesContainer.ConnectedAppService().createNewApp(
      LOG_CLEANUP_APP_NAME
    );

  await ServicesContainer.ConnectedAppService().updateApp(logCleanerAppId, {
    status: "connected",
    statusText: "Installed",
    data: {
      amount: 1,
      type: "weeks",
    },
  });

  const assetsStorageAppId =
    await ServicesContainer.ConnectedAppService().createNewApp(
      FILE_SYSTEM_ASSETS_STORAGE_APP_NAME
    );

  await ServicesContainer.ConnectedAppService().updateApp(assetsStorageAppId, {
    status: "connected",
    statusText: "Installed",
  });

  await ServicesContainer.ConfigurationService().setConfiguration(
    "defaultApps",
    {
      email: {} as any,
      assetsStorage: {
        appId: assetsStorageAppId,
      },
    }
  );
}
