import { ConnectedAppData } from "../connectedApp.data";

export interface IScheduled {
  onTime(appData: ConnectedAppData, date: Date): Promise<void>;
}
