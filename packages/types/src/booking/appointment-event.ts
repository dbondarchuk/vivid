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
  option: Omit<AppointmentOption, "fields" | "addons"> & {
    fields: Record<string, string>;
  };
  addons?: AppointmentAddon[];
  note?: string;
};
