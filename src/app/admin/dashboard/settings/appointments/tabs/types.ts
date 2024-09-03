import { UseFormReturn } from "react-hook-form";
import { AppointmentsSettingsFormValues } from "../schema";

export type TabProps = {
  form: UseFormReturn<AppointmentsSettingsFormValues>;
  disabled?: boolean;
};
