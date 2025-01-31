import { EventAttributes } from "ics";
import { ConnectedAppData } from "../connectedApp.data";

export type IcalEventMethod = "PUBLISH" | "REQUEST" | "CANCEL" | "REPLY";

export type Email = {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  body: string;
  icalEvent?: {
    method: IcalEventMethod;
    filename?: string;
    content: EventAttributes;
  };
};

export type EmailResponse = {
  messageId: string;
};

export interface IMailSender {
  sendMail: (app: ConnectedAppData, mail: Email) => Promise<EmailResponse>;
}
