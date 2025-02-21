import { ConnectedAppData } from "../connected-app.data";

export interface IScheduled {
  onTime(appData: ConnectedAppData, date: Date): Promise<void>;
}
