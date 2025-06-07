import { AppointmentEntity } from "../booking";
import { Customer } from "../customers";

export const emailCommunicationChannel = "email" as const;
export const textMessageCommunicationChannel = "text-message" as const;
export const communicationChannels = [
  emailCommunicationChannel,
  textMessageCommunicationChannel,
] as const;

export type CommunicationChannel = (typeof communicationChannels)[number];

export const communicationDirectionSchema = ["outbound", "inbound"] as const;
export type CommunicationDirection =
  (typeof communicationDirectionSchema)[number];

export const communicationParticipantTypeSchema = ["customer", "user"] as const;
export type CommunicationParticipantType =
  (typeof communicationParticipantTypeSchema)[number];

export type CommunicationLogEntity = {
  _id: string;
  direction: CommunicationDirection;
  channel: CommunicationChannel;
  participant: string;
  participantType: CommunicationParticipantType;
  handledBy: string;
  text: string;
  html?: string;
  subject?: string;
  appointmentId?: string;
  customerId?: string;
  data?: any;
  dateTime: Date;
};

export type CommunicationLog = CommunicationLogEntity & {
  appointment?: AppointmentEntity;
  customer?: Customer;
};
