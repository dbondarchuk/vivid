"use client";

import { AppointmentCalendar } from "@/components/admin/appointments/appointment.calendar";
import {
  fieldSchemaMapper,
  fieldsComponentMap,
} from "@/components/web/forms/fields";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Appointment,
  AppointmentChoice,
  AppointmentEvent,
  asOptionalField,
  Event,
  getFields,
} from "@vivid/types";
import {
  Button,
  Checkbox,
  Combobox,
  DateTimePicker,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  InputGroup,
  InputGroupInput,
  InputGroupInputClasses,
  InputGroupSuffixClasses,
  InputSuffix,
  MultiSelect,
  Textarea,
  toast,
} from "@vivid/ui";
import { CalendarClock, Clock, DollarSign } from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, useFormState } from "react-hook-form";
import { z } from "zod";
import { createAppointment } from "./actions";

export type AppointmentScheduleFormProps = {
  options: AppointmentChoice[];
  timeZone: string;
  from?: Appointment | null;
};

export const AppointmentScheduleForm: React.FC<
  AppointmentScheduleFormProps
> = ({ options, timeZone, from }) => {
  const now = React.useMemo(
    () => DateTime.now().set({ second: 0 }).toJSDate(),
    []
  );

  const formSchema = z
    .object({
      dateTime: z.date({ message: "Date and time are required" }),
      totalDuration: z.coerce
        .number({ message: "Duration is required" })
        .min(1, "Minimum duration is 1 minute")
        .max(60 * 24 * 10, "Maximum duration is 10 days"),
      totalPrice: asOptionalField(
        z.coerce
          .number({ message: "Total price must be a number" })
          .min(0, "Minimum price is 0")
      ).transform((e) => (e === 0 ? undefined : e)),
      option: z.string({ message: "Option must be selected" }),
      addons: z
        .array(
          z.object({
            id: z.string({ message: "Addon must be selected" }),
          })
        )
        .optional(),
      fields: z
        .object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Must be a valid email"),
        })
        .and(z.record(z.string(), z.any().optional())),

      note: z.string().optional(),
      confirmed: z.coerce.boolean().optional(),
    })
    .superRefine((args, ctx) => {
      const option = options.find((x) => x.id === args.option);
      if (!option) return;

      const fieldSchema = z.object(
        getFields(option.fields).reduce(
          (prev, field) => {
            prev[field.name] = fieldSchemaMapper(field);
            return prev;
          },
          {} as { [field: string]: z.ZodType }
        )
      );

      const result = fieldSchema.safeParse(args.fields);
      if (!result.success) {
        result.error.issues.forEach((err) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`fields.${err.path}`],
            message: err.message,
          });
        });
      }
    });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    reValidateMode: "onChange",
    values: {
      dateTime: now,
      totalDuration: from?.totalDuration || options[0].duration || 0,
      totalPrice: from?.totalPrice || undefined,
      addons: from?.addons || [],
      fields: from?.fields || {
        name: "",
        email: "",
      },
      option: from?.option?.id || options[0].id,
      confirmed: true,
    },
  });

  const [loading, setLoading] = React.useState(false);
  const [confirmOverlap, setConfirmOverlap] = React.useState(false);
  const [calendarEvents, setCalendarEvents] = React.useState<Event[]>([]);

  const router = useRouter();

  const dateTime = form.watch("dateTime");
  const duration = form.watch("totalDuration");
  const fields = form.watch("fields");
  const price = form.watch("totalPrice");
  const selectedOptionId = form.watch("option");
  const selectedAddonIds = form.watch("addons");

  const selectedOption = React.useMemo(
    () => options.find((x) => x.id === selectedOptionId),
    [options, selectedOptionId]
  );

  const selectedAddons = React.useMemo(
    () =>
      selectedOption?.addons?.filter((x) =>
        (selectedAddonIds || []).find((y) => y.id === x.id)
      ),
    [selectedOption, selectedAddonIds]
  );

  const isOverlaping = React.useMemo(() => {
    const appointmentStart = DateTime.fromJSDate(dateTime);
    const appointmentEnd = appointmentStart.plus({
      minutes: duration || 0,
    });

    return calendarEvents.some((app) => {
      const appStart = DateTime.fromJSDate(app.dateTime);
      const appEnd = appStart.plus({ minutes: app.totalDuration });

      return (
        (appStart > appointmentStart && appStart < appointmentEnd) ||
        (appointmentStart > appStart && appointmentStart < appEnd)
      );
    });
  }, [dateTime, duration, calendarEvents]);

  const { isValid } = useFormState(form);

  const onSubmit = async (data: FormValues) => {
    try {
      const option = options.find((opt) => opt.id === data.option);
      if (!option) return;

      const addons =
        data.addons
          ?.map((add) => (option.addons || []).find((a) => a.id === add.id))
          .filter((add) => !!add) || [];

      setLoading(true);
      const { addons: __, ...eventOption } = option;

      // Clean up fields when switching option
      const fields = Object.entries(data.fields)
        .filter(([key]) =>
          eventOption.fields.some((field) => field.name === key)
        )
        .reduce(
          (acc, [name, value]) => ({
            ...acc,
            [name]: value,
          }),
          {
            name: data.fields.name,
            email: data.fields.email,
          }
        );

      const appointmentEvent: Omit<AppointmentEvent, "timeZone"> = {
        dateTime: data.dateTime.toISOString(),
        option: {
          ...eventOption,
          fields: (eventOption.fields || []).reduce(
            (acc, field) => ({
              ...acc,
              [field.name]: field.data.label,
            }),
            {}
          ),
        },
        fields,
        totalDuration: data.totalDuration,
        totalPrice: data.totalPrice,
        addons,
        note: data.note,
      };

      const id = await createAppointment(appointmentEvent, data.confirmed);
      router.push(`/admin/dashboard/appointments/${id}`);

      toast({
        variant: "default",
        title: "Scheduled",
        description: "Appointment was succesfully scheduled",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setConfirmOverlap(false);
  }, [dateTime, duration, setConfirmOverlap]);

  const { name, email } = fields;

  const appointment: Appointment | undefined = React.useMemo(() => {
    if (!selectedOption) return undefined;

    const dt = DateTime.fromJSDate(dateTime);

    return {
      _id: "",
      date: dt.startOf("day").toISODate(),
      time: {
        hour: dt.hour,
        minute: dt.minute,
      },
      dateTime,
      totalDuration: duration,
      totalPrice: price,
      fields: { name, email },
      option: {
        ...selectedOption,
        fields: (selectedOption.fields || []).reduce(
          (acc, field) => ({
            ...acc,
            [field.name]: field.data.label,
          }),
          {}
        ),
        addons: undefined,
      },
      status: "pending",
      timeZone,
      addons: selectedAddonIds,
      createdAt: now,
    } as Appointment;
  }, [
    dateTime,
    duration,
    price,
    selectedOption,
    selectedAddonIds,
    name,
    email,
  ]);

  React.useEffect(() => {
    const newAddons = (selectedAddons || [])
      .filter((addon) => selectedOption?.addons?.some((x) => x.id === addon.id))
      .map(({ id }) => ({ id }));

    form.setValue("addons", newAddons);
  }, [selectedOption]);

  React.useEffect(() => {
    const duration =
      (selectedOption?.duration || 0) +
      (selectedAddons || []).reduce(
        (prev, curr) => prev + (curr.duration || 0),
        0
      );

    let price: number | undefined =
      (selectedOption?.price || 0) +
      (selectedAddons || []).reduce(
        (prev, curr) => prev + (curr.price || 0),
        0
      );

    form.setValue("totalDuration", duration);
    form.setValue("totalPrice", price || 0);
  }, [selectedOption, selectedAddons]);

  const selectedFields = getFields(selectedOption?.fields || []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 w-full">
          <div className="md:grid grid-cols-2">
            <div className="w-full space-y-8 relative px-1 content-start">
              <FormField
                control={form.control}
                name="option"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment type</FormLabel>
                    <FormControl>
                      <Combobox
                        disabled={loading}
                        className="flex w-full font-normal text-base"
                        searchLabel="Select option"
                        value={field.value}
                        onItemSelect={field.onChange}
                        values={options.map((x) => ({
                          value: x.id,
                          shortLabel: x.name,
                          label: (
                            <div className="flex flex-col gap-1">
                              <div>{x.name}</div>
                              <div className="text-sm text-muted-foreground inline-flex items-center gap-2">
                                <div className="inline-flex items-center gap-1">
                                  <Clock size={16} />{" "}
                                  {!!x.duration ? (
                                    <>{x.duration} min</>
                                  ) : (
                                    "Custom"
                                  )}
                                </div>
                                {!!x.price && (
                                  <div className="inline-flex items-center gap-1">
                                    <DollarSign size={16} /> ${x.price}
                                  </div>
                                )}
                              </div>
                            </div>
                          ),
                        }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DateTime</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        disabled={loading}
                        fromDate={new Date()}
                        {...field}
                        className="flex w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addons"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Addons</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Select addons..."
                        selected={field.value?.map((x) => x.id) || []}
                        onChange={(value) =>
                          field.onChange(
                            (value as string[]).map((id) => ({ id }))
                          )
                        }
                        options={
                          selectedOption?.addons.map((addon) => ({
                            value: addon.id,
                            label: addon.name,
                          })) || []
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedFields.map((field) =>
                // @ts-expect-error ignore typecheck for form.control
                fieldsComponentMap("fields")[field.type](field, form.control)
              )}
              <FormField
                control={form.control}
                name="totalDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput>
                          <Input
                            disabled={loading}
                            placeholder="30"
                            type="number"
                            className={InputGroupInputClasses()}
                            {...field}
                          />
                        </InputGroupInput>
                        <InputSuffix className={InputGroupSuffixClasses()}>
                          minutes
                        </InputSuffix>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputSuffix
                          className={InputGroupSuffixClasses({
                            variant: "prefix",
                          })}
                        >
                          $
                        </InputSuffix>
                        <InputGroupInput>
                          <Input
                            disabled={loading}
                            placeholder="30"
                            type="number"
                            className={InputGroupInputClasses({
                              variant: "prefix",
                            })}
                            {...field}
                          />
                        </InputGroupInput>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea autoResize {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmed"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row items-center gap-2">
                      <Checkbox
                        id="confirmed"
                        disabled={loading}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormLabel htmlFor="confirmed" className="cursor-pointer">
                        Confirm appointment
                      </FormLabel>
                    </div>
                    <FormDescription>
                      Mark appointment as confirmed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isOverlaping && (
                <FormItem>
                  <div className="flex flex-row items-center gap-2">
                    <Checkbox
                      id="confirm-overlap"
                      disabled={loading}
                      checked={confirmOverlap}
                      onCheckedChange={(e) => setConfirmOverlap(!!e)}
                    />
                    <FormLabel
                      htmlFor="confirm-overlap"
                      className="cursor-pointer"
                    >
                      Confirm overlap
                    </FormLabel>
                  </div>
                  <FormDescription>
                    I understand that scheduling this appointment will create an
                    overlap in my schedule
                  </FormDescription>
                </FormItem>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {appointment && (
                <AppointmentCalendar
                  appointment={appointment}
                  onEventsLoad={setCalendarEvents}
                />
              )}
            </div>
          </div>
        </div>
        <Button
          disabled={loading || !isValid || (isOverlaping && !confirmOverlap)}
          className="ml-auto self-end fixed bottom-4 right-4 inline-flex gap-1 items-center"
          type="submit"
        >
          <CalendarClock size={20} /> Schedule appointment
        </Button>
      </form>
    </Form>
  );
};
