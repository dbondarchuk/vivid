import { CommunicationChannel } from "@vivid/types";
import { FollowUpType } from "./models";

export const FOLLOW_UPS_APP_NAME = "follow-ups";

export const followUpChannelLabels: Record<CommunicationChannel, string> = {
  email: "Email",
  "text-message": "Text message",
};

export const followUpTypeLabels: Record<FollowUpType, string> = {
  timeAfter: "Time after",
  atTime: "At time",
};
