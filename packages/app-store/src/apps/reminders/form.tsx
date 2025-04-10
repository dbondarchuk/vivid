"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DatabaseId } from "@vivid/types";
import {
  ArgumentsAutocomplete,
  Combobox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  IComboboxItem,
  InfoTooltip,
  Input,
  SaveButton,
  SimpleTimePicker,
  TemplateSelector,
  toastPromise,
} from "@vivid/ui";
import { is12hourUserTimeFormat } from "@vivid/utils";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDemoArguments } from "../../hooks";
import { checkUniqueName, create, update } from "./actions";
import { reminderChannelLabels, reminderTypeLabels } from "./const";
import {
  getReminderSchemaWithUniqueCheck,
  ReminderUpdateModel,
} from "./models";

const reminderTypeValues = Object.entries(reminderTypeLabels).map(
  ([value, label]) => ({ value, label }) as IComboboxItem
);

const reminderChannelValues = Object.entries(reminderChannelLabels).map(
  ([value, label]) => ({ value, label }) as IComboboxItem
);

export const ReminderForm: React.FC<{
  initialData?: ReminderUpdateModel & Partial<DatabaseId>;
  appId: string;
}> = ({ initialData, appId }) => {
  const formSchema = getReminderSchemaWithUniqueCheck(
    (name) => checkUniqueName(appId, name, initialData?._id),
    "Reminder name must be unique"
  );

  type FormValues = z.infer<typeof formSchema>;

  const demoArguments = useDemoArguments();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: initialData || {},
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const fn = async () => {
        if (!initialData?._id) {
          const { _id } = await create(appId, data);
          router.push(
            `/admin/dashboard/communications/reminders/edit?id=${_id}`
          );
        } else {
          await update(appId, initialData._id, data);

          router.refresh();
        }
      };

      await toastPromise(fn(), {
        success: "Your changes were saved.",
        error: "There was a problem with your request.",
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const itemType = form.watch("type");
  // const changeType = (value: typeof itemType) => {
  //   const newValue = {
  //     ...form.getValues(),
  //     type: value,
  //   };

  //   const strippedValue = stripObject(newValue, reminderSchema) as Reminder;

  //   update(strippedValue);
  // };

  const itemChannel = form.watch("channel");
  // const changeChannel = (value: typeof itemChannel) => {
  //   const newValue = {
  //     ...form.getValues(),
  //     channel: value,
  //     templateId: undefined,
  //   };

  //   const strippedValue = stripObject(newValue as any as Reminder, reminderSchema) as Reminder;

  //   update(strippedValue);
  // };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>

                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Reminder name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Combobox
                    disabled={loading}
                    className="flex w-full font-normal text-base"
                    values={reminderTypeValues}
                    searchLabel="Select type"
                    value={field.value}
                    onItemSelect={(value) => {
                      field.onChange(value);
                      field.onBlur();
                      // changeType(value as any);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {itemType === "timeBefore" && (
            <>
              <FormField
                control={form.control}
                name="weeks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Weeks{" "}
                      <InfoTooltip>
                        How many weeks before the appointment to send the
                        reminder
                      </InfoTooltip>
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Days{" "}
                      <InfoTooltip>
                        How many days before the appointment to send the
                        reminder
                      </InfoTooltip>
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Hours{" "}
                      <InfoTooltip>
                        How many hours before the appointment to send the
                        reminder
                      </InfoTooltip>
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Minutes{" "}
                      <InfoTooltip>
                        How many minutes before the appointment to send the
                        reminder
                      </InfoTooltip>
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {itemType === "atTime" && (
            <>
              <FormField
                control={form.control}
                name="weeks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Weeks{" "}
                      <InfoTooltip>
                        How many weeks before the appointment to send the
                        reminder
                      </InfoTooltip>
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="0"
                        {...field}
                        onChange={(args) => {
                          field.onChange(args);
                          form.trigger("days");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Days{" "}
                      <InfoTooltip>
                        How many days before the appointment to send the
                        reminder
                      </InfoTooltip>
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Time{" "}
                      <InfoTooltip>
                        At what hour to send the reminder
                      </InfoTooltip>
                    </FormLabel>

                    <FormControl>
                      <SimpleTimePicker
                        use12HourFormat={is12hourUserTimeFormat()}
                        value={DateTime.fromObject({
                          hour: field.value?.hour,
                          minute: field.value?.minute,
                          second: 0,
                        }).toJSDate()}
                        onChange={(date) => {
                          const dateTime = date
                            ? DateTime.fromJSDate(date)
                            : undefined;
                          field.onChange({
                            hour: dateTime?.hour,
                            minute: dateTime?.minute,
                            second: dateTime?.second,
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="channel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Channel type{" "}
                  <InfoTooltip>Determines how to send the reminder</InfoTooltip>
                </FormLabel>
                <FormControl>
                  <Combobox
                    disabled={loading}
                    className="flex w-full font-normal text-base"
                    values={reminderChannelValues}
                    searchLabel="Select channel type"
                    value={field.value}
                    onItemSelect={(value) => {
                      field.onChange(value);
                      field.onBlur();
                      // changeChannel(value as any);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {itemChannel === "email" && (
            <>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email subject
                      <InfoTooltip>
                        <p>
                          Subject of the email, that your customers will see.
                        </p>
                        <p>* Uses templated values</p>
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <ArgumentsAutocomplete
                        args={demoArguments}
                        asInput
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        disabled={loading}
                        placeholder="Subject"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormField
            control={form.control}
            name="templateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Template
                  <InfoTooltip>
                    Reminder body, that your customers will see.
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <TemplateSelector
                    type={itemChannel}
                    disabled={loading}
                    value={field.value}
                    onItemSelect={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SaveButton form={form} />
      </form>
    </Form>
  );
};
