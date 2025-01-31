import { ConnectedAppData } from "../connectedApp.data";
import { TextMessageData } from "./textMessageSender";

export type TextMessageReply = {
  from: string;
  message: string;
  data: TextMessageData;
};

export interface ITextMessageResponder {
  respond(
    appData: ConnectedAppData,
    data: string,
    reply: TextMessageReply
  ): Promise<void>;
}
