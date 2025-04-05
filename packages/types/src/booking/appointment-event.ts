import { AppointmentAddon, AppointmentOption } from "./appointment-option";

export type AppointmentFields = Record<string, string> & {
  name: string;
  email: string;
};

export type AppointmentEvent = {
  totalDuration: number;
  totalPrice?: number;
  dateTime: string;
  timeZone: string;
  fields: AppointmentFields;
  option: Omit<AppointmentOption, "fields" | "addons" | "updatedAt">;
  fieldsLabels?: Record<string, string>;
  addons?: Omit<AppointmentAddon, "updatedAt">[];
  note?: string;
};
