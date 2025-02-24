"use client";

import { Editor } from "@monaco-editor/react";
import { CommunicationChannel } from "@vivid/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  CardContent,
  CardHeader,
  cn,
  Combobox,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  IComboboxItem,
  IFrame,
  InfoTooltip,
  Input,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  TemplateSelector,
  Textarea,
  TimePicker,
  useTheme,
} from "@vivid/ui";
import { stripObject, templateSafeWithError } from "@vivid/utils";
import { Copy, Trash } from "lucide-react";
import { DateTime } from "luxon";
import { UseFormReturn } from "react-hook-form";
import { Reminder, reminderSchema, ReminderType } from "./models";

export const reminderTypeLabels: Record<ReminderType, string> = {
  timeBefore: "Time before",
  atTime: "At time",
};

const reminderTypeValues = Object.entries(reminderTypeLabels).map(
  ([value, label]) => ({ value, label }) as IComboboxItem
);

export const reminderChannelLabels: Record<CommunicationChannel, string> = {
  email: "Email",
  "text-message": "Text message",
};

const reminderChannelValues = Object.entries(reminderChannelLabels).map(
  ([value, label]) => ({ value, label }) as IComboboxItem
);

export type ReminderProps = {
  item: Reminder;
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  remove: () => void;
  update: (newValue: Reminder) => void;
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
  const itemId = item.id;
  const changeType = (value: typeof itemType) => {
    const newValue = {
      ...form.getValues(name),
      type: value,
      id: itemId,
    };

    const strippedValue = stripObject(newValue, reminderSchema) as Reminder;

    update(strippedValue);
  };

  const itemChannel = item.channel;
  const changeChannel = (value: typeof itemChannel) => {
    const newValue = {
      ...form.getValues(name),
      channel: value,
      id: itemId,
      templateId: undefined,
    };

    const strippedValue = stripObject(newValue, reminderSchema) as Reminder;

    update(strippedValue);
  };

  const { resolvedTheme } = useTheme();

  return (
    <Card>
      <AccordionItem value={item.id}>
        <CardHeader className="justify-between relative flex flex-row items-center border-b-2 border-secondary px-3 py-3 w-full">
          <div className="hidden md:block">&nbsp;</div>
          <AccordionTrigger
            className={cn(
              "w-full text-center",
              !nameValue && "text-destructive"
            )}
          >
            {nameValue || "Invalid reminder"}
          </AccordionTrigger>
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
        <AccordionContent>
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
                      <InfoTooltip>
                        Determines how to send the reminder
                      </InfoTooltip>
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
                              Subject of the email, that your customers will
                              see.
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
                </>
              )}
              <FormField
                control={form.control}
                name={`${name}.templateId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tempalte
                      <InfoTooltip>
                        Reminder body, that your customers will see.
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <TemplateSelector
                        type={itemChannel}
                        disabled={disabled}
                        value={field.value}
                        onItemSelect={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </AccordionContent>
      </AccordionItem>
    </Card>
  );
};
