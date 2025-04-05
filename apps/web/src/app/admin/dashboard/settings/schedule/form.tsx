"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ScheduleConfiguration,
  scheduleConfigurationSchema,
} from "@vivid/types";
import {
  DayScheduleSelector,
  Form,
  FormField,
  SaveButton,
  toastPromise,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { updateScheduleConfiguration } from "./actions";

export type ScheduleSettingsFormProps = {
  values: ScheduleConfiguration;
};

export const ScheduleSettingsForm: React.FC<ScheduleSettingsFormProps> = ({
  values,
}) => {
  const form = useForm<ScheduleConfiguration>({
    resolver: zodResolver(scheduleConfigurationSchema),
    mode: "all",
    reValidateMode: "onChange",
    values,
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: ScheduleConfiguration) => {
    try {
      setLoading(true);
      await toastPromise(updateScheduleConfiguration(data), {
        success: "Your changes were saved.",
        error: "There was a problem with your request.",
      });
      router.refresh();
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 relative flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <DayScheduleSelector
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <SaveButton form={form} disabled={loading} />
      </form>
    </Form>
  );
};
