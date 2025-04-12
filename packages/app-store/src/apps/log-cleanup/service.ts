import {
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IConnectedApp,
  IConnectedAppProps,
  IScheduled,
} from "@vivid/types";
import { DateTime } from "luxon";
import { LogCleanupConfiguration } from "./models";

export default class LogCleanupConnectedApp
  implements IConnectedApp, IScheduled
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: LogCleanupConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    const status: ConnectedAppStatusWithText = {
      status: "connected",
      statusText: `Successfully set up`,
    };

    this.props.update({
      data,
      ...status,
    });

    return status;
  }

  public async onTime(appData: ConnectedAppData, date: Date): Promise<void> {
    let data = appData.data as LogCleanupConfiguration;
    if (!data) {
      data = {} as LogCleanupConfiguration;
    }

    if (!data.amount) {
      data.amount = 1;
    }

    if (!data.type) {
      data.type = "months";
    }

    const dateTime = DateTime.fromJSDate(date);
    if (dateTime.hour !== 3 && dateTime.minute !== 0) return;

    const maxDate = dateTime.minus({
      [data.type]: data.amount,
    });

    console.log(
      `Cleaning up logs older than ${maxDate.toLocaleString(
        DateTime.DATETIME_FULL_WITH_SECONDS
      )}`
    );

    await this.props.services
      .CommunicationLogService()
      .clearOldLogs(maxDate.toJSDate());
  }
}
