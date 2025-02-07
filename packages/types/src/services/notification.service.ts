import { Email, TextMessageData, TextMessageResponse } from "../apps";

export interface INotificationService {
  sendEmail(props: {
    email: Email;
    initiator: string;
    appointmentId?: string;
  }): Promise<void>;
  sendTextMessage(props: {
    phone: string;
    body: string;
    sender?: string;
    initiator: string;
    webhookData?: TextMessageData;
    appointmentId?: string;
  }): Promise<TextMessageResponse>;
}
