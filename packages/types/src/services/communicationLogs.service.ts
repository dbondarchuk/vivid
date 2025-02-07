import {
  CommunicationChannel,
  CommunicationDirection,
  CommunicationLog,
} from "../communication";
import { Query, WithTotal } from "../database";
import { DateRange } from "../general";

export interface ICommunicationLogService {
  log(log: Omit<CommunicationLog, "dateTime" | "_id">): Promise<void>;
  getCommunicationLogs(
    query: Query & {
      direction: CommunicationDirection[];
      channel: CommunicationChannel[];
      range?: DateRange;
    }
  ): Promise<WithTotal<CommunicationLog>>;
  clearAllLogs(): Promise<void>;
  clearSelectedLogs(ids: string[]): Promise<void>;
  clearOldLogs(maxDate: Date): Promise<void>;
}
