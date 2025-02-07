import { ConnectedAppData } from "../connectedApp.data";

export type TextMessageData = {
  appId: string;
  data: string;
};

export type TextMessage = {
  phone: string;
  message: string;
  data?: TextMessageData;
  sender?: string;
};

export type TextMessageResponse = {
  success: boolean;
  error?: string;
  textId?: string;
  data?: any;
};

export interface ITextMessageSender {
  sendTextMessage: (
    app: ConnectedAppData,
    message: TextMessage
  ) => Promise<TextMessageResponse>;
}
