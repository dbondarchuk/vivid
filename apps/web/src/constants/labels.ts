import {
  CommunicationChannel,
  CommunicationDirection,
  CommunicationParticipantType,
  FieldType,
} from "@vivid/types";

export const CommunicationChannelTexts: Record<CommunicationChannel, string> = {
  "text-message": "Text Message",
  email: "Email",
};

export const CommunicationDirectionTexts: Record<
  CommunicationDirection,
  string
> = {
  inbound: "Inbound",
  outbound: "Outbound",
};

export const CommunicationParticipantTypeTexts: Record<
  CommunicationParticipantType,
  string
> = {
  user: "User",
  customer: "Customer",
};

export const FieldTypeLabels: Record<FieldType, string> = {
  email: "Email",
  name: "Name",
  phone: "Phone",
  oneLine: "One line",
  multiLine: "Multi line",
  checkbox: "Checkbox",
  select: "Select",
  file: "File",
};
