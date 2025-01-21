import { IConnectedApp, IConnectedAppProps } from "@/types";
import { ICS_APP_NAME } from "./ics/ics.const";
import { IcsConnectedApp } from "./ics/ics.service";
import { OUTLOOK_APP_NAME } from "./outlook/outlook.const";
import { OutlookConnectedApp } from "./outlook/outlook.service";

export const InstalledAppServices: Record<
  string,
  (props: IConnectedAppProps) => IConnectedApp
> = {
  [OUTLOOK_APP_NAME]: (props) => new OutlookConnectedApp(props),
  [ICS_APP_NAME]: (props) => new IcsConnectedApp(props),
};
