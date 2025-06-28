import { AppointmentStatusToICalMethodMap } from "@vivid/utils";

export type EmailTemplate = {
  title: string;
  text: string;
  previewText?: string;
};

export type EmailTemplates = {
  [key in
    | keyof typeof AppointmentStatusToICalMethodMap
    | "auto-confirmed"]: EmailTemplate;
} & {
  subject: string;
  buttonTexts: Record<"viewAppointment" | "decline" | "confirm", string>;
};
