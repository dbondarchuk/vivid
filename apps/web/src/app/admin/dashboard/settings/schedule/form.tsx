"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@vivid/i18n";
import {
  ScheduleConfiguration,
  scheduleConfigurationSchema,
} from "@vivid/types";
import {
  Form,
  FormField,
  SaveButton,
  Scheduler,
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
  const t = useI18n("admin");
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
        success: t("settings.schedule.form.toasts.changesSaved"),
        error: t("settings.schedule.form.toasts.requestError"),
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
            <Scheduler value={field.value} onChange={field.onChange} />
          )}
        />
        <SaveButton form={form} disabled={loading} />
      </form>
    </Form>
  );
};
