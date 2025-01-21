import { App } from "@/types";
import { IcsApp } from "./ics/ics.app";
import { ICS_APP_NAME } from "./ics/ics.const";
import { OutlookApp } from "./outlook/outlook.app";
import { OUTLOOK_APP_NAME } from "./outlook/outlook.const";

export const InstalledApps: Record<string, App> = {
  [OUTLOOK_APP_NAME]: OutlookApp,
  [ICS_APP_NAME]: IcsApp,
};
