export const emailCommunicationChannel = "email" as const;
export const smsCommunicationChannel = "sms" as const;
export const communicationChannels = [
  emailCommunicationChannel,
  smsCommunicationChannel,
] as const;

export type CommunicationDirection = "outbound" | "inbound";

export type CommunicationChannel = (typeof communicationChannels)[number];

export type CommunicationLog = {
  _id: string;
  direction: CommunicationDirection;
  channel: CommunicationChannel;
  initiator: string;
  receiver: string;
  text: string;
  subject?: string;
  appointmentId?: string;
  data?: any;
  dateTime: Date;
};
