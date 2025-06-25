import { AppointmentStatusToICalMethodMap } from "@vivid/utils";

export type EmailTemplate = {
  title: string;
  text: string;
  previewText?: string;
};

export type EmailTemplates = Record<
  keyof typeof AppointmentStatusToICalMethodMap | "auto-confirmed",
  EmailTemplate
>;
