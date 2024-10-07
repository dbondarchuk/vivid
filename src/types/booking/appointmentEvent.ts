import { AppointmentAddon, AppointmentOption } from "./appointmentOption";

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
  option: Omit<AppointmentOption, "fields" | "addons">;
  addons?: AppointmentAddon[];
  note?: string;
};
