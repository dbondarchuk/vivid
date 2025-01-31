"use server";

import { Services } from "@/lib/services";
import { DateTime } from "luxon";
import { InstallFormData } from "./types";

export async function install(data: InstallFormData) {
  await Services.ConfigurationService().setConfiguration("general", {
    ...data,
    description: "",
    keywords: "",
  });

  await Services.PagesService().createPage({
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

  await Services.ConfigurationService().setConfiguration("booking", {
    options: [],
    workHours: Array.from({ length: 5 }).map((_, index) => ({
      weekDay: index + 1,
      shifts,
    })),
    timezone: DateTime.now().zoneName,
  });

  await Services.ConfigurationService().setConfiguration("footer", {
    isCustom: false,
  });

  await Services.ConfigurationService().setConfiguration("header", {
    menu: [],
  });

  await Services.ConfigurationService().setConfiguration("social", {});
  await Services.ConfigurationService().setConfiguration("styling", {});
  await Services.ConfigurationService().setConfiguration("defaultApps", {
    email: {} as any,
  });
}
