import { Email, TextMessageData, TextMessageResponse } from "../apps";
import { CommunicationParticipantType } from "../communication";

export type EmailNotificationRequest = {
  email: Email;
  handledBy: string;
  participantType: CommunicationParticipantType;
  appointmentId?: string;
  customerId?: string;
};

export type TextMessageNotificationRequest = {
  phone: string;
  body: string;
  sender?: string;
  handledBy: string;
  participantType: CommunicationParticipantType;
  webhookData?: TextMessageData;
  appointmentId?: string;
  customerId?: string;
};

export interface INotificationService {
  sendEmail(props: EmailNotificationRequest): Promise<void>;

  sendTextMessage(
    props: TextMessageNotificationRequest
  ): Promise<TextMessageResponse>;
}
