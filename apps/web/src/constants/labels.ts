import { CommunicationChannel, CommunicationDirection } from "@vivid/types";

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
