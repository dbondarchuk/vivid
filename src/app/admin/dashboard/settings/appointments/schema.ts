import { z } from "zod";
import { addonsSchema } from "./tabs/addons";
import { emailTabFormSchema } from "./tabs/email";
import { fieldsSchema } from "./tabs/fields";
import { mainTabFormSchema } from "./tabs/main";
import { optionsSchema } from "./tabs/options";
import { remindersSchema } from "./tabs/reminders";
import { shiftsSchema } from "./tabs/shifts";
import { textMessagesTabFormSchema } from "./tabs/textMessages";

export const appointmentsSettingsFormSchema = mainTabFormSchema.merge(
  z.object({
    workHours: shiftsSchema,
    addons: addonsSchema,
    fields: fieldsSchema,
    options: optionsSchema,
    email: emailTabFormSchema,
    textMessages: textMessagesTabFormSchema,
    reminders: remindersSchema,
  })
);
export type AppointmentsSettingsFormValues = z.infer<
  typeof appointmentsSettingsFormSchema
>;
