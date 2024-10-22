import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Combobox, IComboboxItem } from "@/components/ui/combobox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CommunicationChannel,
  communicationChannels,
  ReminderType,
  reminderTypes,
} from "@/types";
import { Copy, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { stripObject } from "@/lib/stripObject";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Editor } from "@monaco-editor/react";
import { IFrame } from "@/components/ui/iframe";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker/time-picker";
import { DateTime } from "luxon";
import { templateSafeWithError } from "@/lib/string";

const reminderTypesEnum = z.enum(reminderTypes);
export const reminderTypeLabels: Record<ReminderType, string> = {
  timeBefore: "Time before",
  atTime: "At time",
};

const reminderTypeValues = Object.entries(reminderTypeLabels).map(
  ([value, label]) => ({ value, label } as IComboboxItem)
);

const reminderChannelesEnum = z.enum(communicationChannels);
export const reminderChannelLabels: Record<CommunicationChannel, string> = {
  email: "Email",
  sms: "SMS",
};

const reminderChannelValues = Object.entries(reminderChannelLabels).map(
  ([value, label]) => ({ value, label } as IComboboxItem)
);

const reminderTimeBeforeSchema = z.object({
  type: reminderTypesEnum.extract(["timeBefore"]),
  weeks: z.coerce
    .number()
    .min(0, "Min amount of weeks is 0")
    .max(10, "Max amount of weeks is 10")
    .optional(),
  days: z.coerce
    .number()
    .min(0, "Min amount of days is 0")
    .max(31, "Max amount of days is 31")
    .optional(),
  hours: z.coerce
    .number()
    .min(0, "Min amount of hours is 0")
    .max(24 * 5, "Max amount of hours is 120")
    .optional(),
  minutes: z.coerce
    .number()
    .min(0, "Min amount of minutes is 0")
    .max(60 * 10, "Max amount of minutes is 600"),
});

const reminderAtTimeSchema = z.object({
  type: reminderTypesEnum.extract(["atTime"]),
  weeks: z.coerce
    .number()
    .min(0, "Min amount of weeks is 0")
    .max(10, "Max amount of weeks is 10")
    .optional(),
  days: z.coerce
    .number()
    .min(0, "Min amount of days is 0")
    .max(31, "Max amount of days is 31"),
  time: z.object({
    hour: z.coerce
      .number()
      .min(0, "Hour should be between 0 and 23")
      .max(23, "Hour should be between 0 and 23"),
    minute: z.coerce
      .number()
      .min(0, "Minute should be between 0 and 59")
      .max(59, "Minute should be between 0 and 59"),
  }),
});

const reminderEmailSchema = z.object({
  channel: reminderChannelesEnum.extract(["email"]),
  body: z.string().min(1, "Email body is required"),
  subject: z.string().min(1, "Email subject is required"),
});

const reminderSmsSchema = z.object({
  channel: reminderChannelesEnum.extract(["sms"]),
  body: z.string().min(1, "SMS body is required"),
});

const reminderTypeSchema = z.discriminatedUnion("type", [
  reminderTimeBeforeSchema,
  reminderAtTimeSchema,
]);

const reminderChannelSchema = z.discriminatedUnion("channel", [
  reminderEmailSchema,
  reminderSmsSchema,
]);

const reminderGeneralSchema = z.object({
  name: z.string().min(2, "Reminder name must me at least 2 characters long"),
  id: z.string(),
});

export const reminderSchema = z
  .intersection(
    z.intersection(reminderGeneralSchema, reminderTypeSchema),
    reminderChannelSchema
  )
  .superRefine((arg, ctx) => {
    if (arg.type === "atTime" && !arg.weeks && !arg.days) {
      ctx.addIssue({
        code: "custom",
        path: ["days"],
        message:
          "Reminder should be sent at least 1 day before the appointment",
      });
    }
  });

export type ReminderSchema = z.infer<typeof reminderSchema>;

export type ReminderProps = {
  item: ReminderSchema;
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  remove: () => void;
  update: (newValue: ReminderSchema) => void;
  clone: () => void;
  demoArguments: Record<string, any>;
};

export const ReminderCard: React.FC<ReminderProps> = ({
  item,
  form,
  name,
  disabled,
  remove,
  update,
  clone,
  demoArguments,
}) => {
  const nameValue = form.getValues(`${name}.name`);

  const itemType = item.type;
  const changeType = (value: typeof itemType) => {
    const newValue = {
      ...form.getValues(name),
      type: value,
    };

    const strippedValue = stripObject(
      newValue,
      reminderSchema
    ) as ReminderSchema;

    update(strippedValue);
  };

  const itemChannel = item.channel;
  const changeChannel = (value: typeof itemChannel) => {
    const newValue = {
      ...form.getValues(name),
      channel: value,
    };

    const strippedValue = stripObject(
      newValue,
      reminderSchema
    ) as ReminderSchema;

    update(strippedValue);
  };

  return (
    <Card>
      <CardHeader className="justify-between relative flex flex-row items-center border-b-2 border-secondary px-3 py-3 w-full">
        <div className="w-full text-center">
          {nameValue || "Invalid reminder"}
        </div>
        <div className="flex flex-row gap-2">
          <Button
            disabled={disabled}
            variant="outline"
            className=""
            size="sm"
            type="button"
            title="Clone"
            onClick={clone}
          >
            <Copy size={20} />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={disabled}
                variant="destructive"
                className=""
                size="sm"
                type="button"
                title="Remove"
              >
                <Trash size={20} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  <p>Are you sure you want to remove this reminder?</p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button variant="destructive" onClick={remove}>
                    Delete
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-6 pt-3 text-left flex flex-col relative gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`${name}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>

                <FormControl>
                  <Input
                    disabled={disabled}
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
            name={`${name}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Combobox
                    disabled={disabled}
                    className="flex w-full font-normal text-base"
                    values={reminderTypeValues}
                    searchLabel="Select type"
                    value={field.value}
                    onItemSelect={(value) => {
                      field.onChange(value);
                      changeType(value as any);
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
                name={`${name}.weeks`}
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
                        disabled={disabled}
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
                name={`${name}.days`}
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
                        disabled={disabled}
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
                name={`${name}.hours`}
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
                        disabled={disabled}
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
                name={`${name}.minutes`}
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
                        disabled={disabled}
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
                name={`${name}.weeks`}
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
                        disabled={disabled}
                        placeholder="0"
                        {...field}
                        onChange={(args) => {
                          field.onChange(args);
                          form.trigger(`${name}.days`);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${name}.days`}
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
                        disabled={disabled}
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
                name={`${name}.time`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Time{" "}
                      <InfoTooltip>
                        At what hour to send the reminder
                      </InfoTooltip>
                    </FormLabel>

                    <FormControl>
                      <TimePicker
                        date={DateTime.fromObject({
                          hour: field.value?.hour,
                          minute: field.value?.minute,
                          second: field.value?.second,
                        }).toJSDate()}
                        setDate={(date) => {
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
            name={`${name}.channel`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Channel type{" "}
                  <InfoTooltip>Determines how to send the reminder</InfoTooltip>
                </FormLabel>
                <FormControl>
                  <Combobox
                    disabled={disabled}
                    className="flex w-full font-normal text-base"
                    values={reminderChannelValues}
                    searchLabel="Select channel type"
                    value={field.value}
                    onItemSelect={(value) => {
                      field.onChange(value);
                      changeChannel(value as any);
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
                name={`${name}.subject`}
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
                      <Input
                        disabled={disabled}
                        placeholder="Subject"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${name}.body`}
                render={({ field }) => (
                  <ResizablePanelGroup
                    direction="horizontal"
                    className="max-md:hidden"
                  >
                    <ResizablePanel className="pr-1">
                      <FormItem>
                        <FormLabel>
                          Email body
                          <InfoTooltip>
                            <p>
                              Body of the email, that your customers will see
                            </p>
                            <p>* Uses templated values</p>
                          </InfoTooltip>
                        </FormLabel>
                        <FormControl>
                          <Editor
                            height="60vh"
                            language="html"
                            theme="vs-dark"
                            value={field.value}
                            onChange={field.onChange}
                            onValidate={() => form.trigger(field.name)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel className="pl-1">
                      <FormItem>
                        <FormLabel>Preview</FormLabel>
                        <IFrame className="h-[60vh] w-full">
                          <ScrollArea className="h-[60vh] w-full">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: templateSafeWithError(
                                  field.value,
                                  demoArguments
                                ),
                              }}
                            />
                          </ScrollArea>
                        </IFrame>
                      </FormItem>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                )}
              />
            </>
          )}
          {itemChannel === "sms" && (
            <>
              <FormField
                control={form.control}
                name={`${name}.body`}
                render={({ field }) => (
                  <ResizablePanelGroup
                    direction="horizontal"
                    className="max-md:hidden"
                  >
                    <ResizablePanel className="px-4">
                      <FormItem>
                        <FormLabel>
                          SMS body
                          <InfoTooltip>
                            <p>Body of the SMS, that your customers will see</p>
                            <p>* Uses templated values</p>
                          </InfoTooltip>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={disabled}
                            placeholder="Body"
                            autoResize
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0} characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel className="px-4">
                      <FormItem>
                        <FormLabel>Preview</FormLabel>
                        <div
                          className="w-full text-sm"
                          dangerouslySetInnerHTML={{
                            __html: templateSafeWithError(
                              field.value || "",
                              demoArguments
                            ).replaceAll("\n", "<br/>"),
                          }}
                        />
                      </FormItem>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                )}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
