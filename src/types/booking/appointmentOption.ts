import { Id } from "../configuration";
import { Fields, WithLabelFieldData } from "./fields";

export type AppointmentOption = Id & {
  name: string;
  description: string;
  duration?: number;
  price?: number;
  fields?: Id[];
  addons?: Id[];
};

export type AppointmentChoice = Omit<AppointmentOption, "fields" | "addons"> & {
  fields: Fields<WithLabelFieldData>;
  addons: AppointmentAddon[];
};

export type AppointmentAddon = Id & {
  name: string;
  description: string;
  duration?: number;
  price?: number;
};
