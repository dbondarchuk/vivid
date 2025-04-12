export const emailCommunicationChannel = "email" as const;
export const textMessageCommunicationChannel = "text-message" as const;
export const communicationChannels = [
  emailCommunicationChannel,
  textMessageCommunicationChannel,
] as const;

export const communicationDirectionSchema = ["outbound", "inbound"] as const;
export type CommunicationDirection =
  (typeof communicationDirectionSchema)[number];

export type CommunicationChannel = (typeof communicationChannels)[number];

export type CommunicationLog = {
  _id: string;
  direction: CommunicationDirection;
  channel: CommunicationChannel;
  initiator: string;
  receiver: string;
  text: string;
  html?: string;
  subject?: string;
  appointmentId?: string;
  data?: any;
  dateTime: Date;
};
