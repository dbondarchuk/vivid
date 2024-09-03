import { AppointmentAddon, AppointmentOption } from "./appointmentOption";
import { Time } from "./dateTime";

export type AppointmentFields = Record<string, string> & {
  name: string;
  email: string;
};

export type AppointmentEvent = {
  totalDuration: number;
  totalPrice?: number;
  date: string;
  dateTime: string;
  time: Time;
  timeZone: string;
  fields: AppointmentFields;
  option: Omit<AppointmentOption, "fields" | "addons">;
  addons?: AppointmentAddon[];
};
