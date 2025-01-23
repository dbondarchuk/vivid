import { ConnectedAppData } from "../connectedApp";

export type TextMessage = {
  phone: string;
  message: string;
  data?: string;
  sender?: string;
};

export type TextMessageResponse = {
  success: boolean;
  error?: string;
  textId?: string;
};

export interface ITextMessageSender {
  sendTextMessage: (
    app: ConnectedAppData,
    message: TextMessage
  ) => Promise<TextMessageResponse>;
}
