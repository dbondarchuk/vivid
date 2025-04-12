import { ConnectedAppData } from "../connected-app.data";
import { TextMessageData } from "./text-message-sender";

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
