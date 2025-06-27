import { Language } from "@vivid/i18n";

export type TextMessageResenderMessage = {
  resendToUserFromCustomer: string;
  resendToUserFromUnknown: string;
};

export type TextMessageResenderMessages = {
  [key in Language]: TextMessageResenderMessage;
};
