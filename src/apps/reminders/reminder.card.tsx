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
import { CommunicationChannel } from "@/types";
import { Copy, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
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
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Reminder, reminderSchema, ReminderType } from "./reminders.models";

export const reminderTypeLabels: Record<ReminderType, string> = {
  timeBefore: "Time before",
  atTime: "At time",
};

const reminderTypeValues = Object.entries(reminderTypeLabels).map(
  ([value, label]) => ({ value, label } as IComboboxItem)
);

export const reminderChannelLabels: Record<CommunicationChannel, string> = {
  email: "Email",
  "text-message": "Text message",
};

const reminderChannelValues = Object.entries(reminderChannelLabels).map(
  ([value, label]) => ({ value, label } as IComboboxItem)
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
    };

    const strippedValue = stripObject(newValue, reminderSchema) as Reminder;

    update(strippedValue);
  };

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
                                  Body of the email, that your customers will
                                  see
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
              {itemChannel === "text-message" && (
                <>
                  <FormField
                    control={form.control}
                    name={`${name}.body`}
                    render={({ field }) => (
                      <ResizablePanelGroup
                        direction="horizontal"
                        className="max-md:hidden"
                      >
                        <ResizablePanel className="pr-4">
                          <FormItem>
                            <FormLabel>
                              Text Message body
                              <InfoTooltip>
                                <p>
                                  Body of the Text Message, that your customers
                                  will see
                                </p>
                                <p>* Uses templated values</p>
                              </InfoTooltip>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={disabled}
                                placeholder="Body"
                                className="mx-0 focus:mx-1 active:mx-1"
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
                        <ResizablePanel className="pl-4">
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
        </AccordionContent>
      </AccordionItem>
    </Card>
  );
};
