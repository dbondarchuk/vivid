import { AppsKeys } from "@vivid/i18n";
import { Appointment } from "../../booking";
import { CommunicationParticipantType } from "../../communication";
import { Customer } from "../../customers";
import { ConnectedAppData } from "../connected-app.data";
import { TextMessageData } from "./text-message-sender";

export type TextMessageReply = {
  from: string;
  message: string;
  data: TextMessageData;
  appointment: Appointment | null;
  customer: Customer | null;
  messageId?: string;
};

export type RespondResult = {
  handledBy: AppsKeys;
  participantType: CommunicationParticipantType;
};

export interface ITextMessageResponder {
  respond(
    appData: ConnectedAppData,
    reply: TextMessageReply,
  ): Promise<RespondResult | null>;
}
