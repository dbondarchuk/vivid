"use client";

import { AppointmentCalendar } from "@/components/admin/appointments/appointment-calendar";
import {
  fieldSchemaMapper,
  fieldsComponentMap,
} from "@/components/web/forms/fields";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Appointment,
  AppointmentAddon,
  AppointmentChoice,
  AppointmentEvent,
  asOptionalField,
  Event,
  Field,
  getFields,
  WithLabelFieldData,
} from "@vivid/types";
import {
  Button,
  Checkbox,
  Combobox,
  DateTimePicker,
  DurationInput,
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
  Spinner,
  Textarea,
  toastPromise,
} from "@vivid/ui";
import { is12hourUserTimeFormat } from "@vivid/utils";
import { CalendarClock, Clock, DollarSign } from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, useFormState } from "react-hook-form";
import { z } from "zod";
import { createAppointment } from "./actions";

export type AppointmentScheduleFormProps = {
  options: AppointmentChoice[];
  knownFields: (Field<WithLabelFieldData> & { _id: string })[];
  timeZone: string;
  from?: Appointment | null;
};

const getSelectedFields = (
  selectedOption: AppointmentChoice | undefined,
  selectedAddons: AppointmentAddon[] | undefined,
  knownFields: AppointmentScheduleFormProps["knownFields"]
) => {
  if (!selectedOption) return [];

  const optionAndAddonFields = [
    ...(selectedOption?.fields || []),
    ...(selectedAddons?.flatMap((addon) => addon.fields) || []),
  ]
    .filter((f) => !!f)
    .reduce(
      (map, cur) => ({
        ...map,
        [cur.id]: !!map[cur.id] || !!cur.required,
      }),
      {} as Record<string, boolean>
    );

  const fieldsWithData = knownFields
    .filter((f) => f._id in optionAndAddonFields)
    .map((f) => ({
      ...f,
      required:
        (!!f.required || optionAndAddonFields[f._id]) && f.type !== "file",
    }));

  return getFields(fieldsWithData);
};

export const AppointmentScheduleForm: React.FC<
  AppointmentScheduleFormProps
> = ({ options, timeZone, knownFields, from }) => {
  const now = React.useMemo(
    () => DateTime.now().set({ second: 0 }).toJSDate(),
    []
  );

  const formSchema = z
    .object({
      dateTime: z.date({ message: "Date and time are required" }),
      totalDuration: z.coerce
        .number({ message: "Duration is required" })
        .int("Should be the integer value")
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
      const option = options.find((x) => x._id === args.option);
      if (!option) return;

      const addons =
        option.addons.filter((x) => args.addons?.some((a) => a.id === x._id)) ||
        [];
      const selectedFields = getSelectedFields(option, addons, knownFields);

      const fieldSchema = z.object(
        selectedFields.reduce(
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
      addons: from?.addons?.map(({ _id }) => ({ id: _id })) || [],
      fields: from?.fields || {
        name: "",
        email: "",
      },
      option: from?.option?._id || options[0]._id,
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
    () => options.find((x) => x._id === selectedOptionId),
    [options, selectedOptionId]
  );

  const selectedAddons = React.useMemo(
    () =>
      selectedOption?.addons?.filter((x) =>
        (selectedAddonIds || []).find((y) => y.id === x._id)
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
        (appStart >= appointmentStart && appStart <= appointmentEnd) ||
        (appointmentStart >= appStart && appointmentStart <= appEnd)
      );
    });
  }, [dateTime, duration, calendarEvents]);

  const { isValid } = useFormState(form);

  const onSubmit = async (data: FormValues) => {
    try {
      const option = options.find((opt) => opt._id === data.option);
      if (!option) return;

      const addons =
        data.addons
          ?.map((add) => (option.addons || []).find((a) => a._id === add.id))
          .filter((add) => !!add) || [];

      setLoading(true);
      const { addons: __, ...eventOption } = option;

      const selectedFields = getSelectedFields(option, addons, knownFields);

      // Clean up fields when switching option
      const fields = Object.entries(data.fields)
        .filter(([key]) => selectedFields.some((field) => field.name === key))
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

      const files = Object.entries(fields)
        .filter(([_, value]) => (value as any) instanceof File)
        .reduce(
          (map, [key, value]) => ({
            ...map,
            [key]: value as unknown as File,
          }),
          {} as Record<string, File>
        );

      const appointmentEvent: Omit<AppointmentEvent, "timeZone"> = {
        dateTime: data.dateTime.toISOString(),
        option: {
          ...eventOption,
          // @ts-ignore we just clear this
          addons: undefined,
          // @ts-ignore we just clear this
          fields: undefined,
        },
        fields,
        fieldsLabels: selectedFields.reduce(
          (acc, field) => ({
            ...acc,
            [field.name]: field.data?.label,
          }),
          {}
        ),
        totalDuration: data.totalDuration,
        totalPrice: data.totalPrice,
        addons,
        note: data.note,
      };

      const id = await toastPromise(
        createAppointment(appointmentEvent, files, data.confirmed),
        {
          success: "Appointment was succesfully scheduled",
          error: "There was a problem with your request.",
        }
      );

      router.push(`/admin/dashboard/appointments/${id}`);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setConfirmOverlap(false);
  }, [dateTime, duration, setConfirmOverlap]);

  const { name, email } = fields;

  const selectedFields = React.useMemo(
    () => getSelectedFields(selectedOption, selectedAddons, knownFields),
    [selectedAddons, selectedOption, knownFields]
  );

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
        fields: undefined,
        addons: undefined,
      },
      fieldsLabels: selectedFields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: field.data?.label,
        }),
        {}
      ),
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
      .filter((addon) =>
        selectedOption?.addons?.some((x) => x._id === addon._id)
      )
      .map(({ _id }) => ({ id: _id }));

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

    form.trigger("totalDuration");
  }, [selectedOption, selectedAddons]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-2">
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
                          value: x._id,
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
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        use12HourFormat={is12hourUserTimeFormat()}
                        disabled={loading}
                        commitOnChange
                        min={new Date()}
                        {...field}
                        className="flex w-full"
                        minutesDivisibleBy={5}
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
                            value: addon._id,
                            label: addon.name,
                          })) || []
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedFields.map((field) => (
                <React.Fragment key={field.name}>
                  {fieldsComponentMap("fields")[field.type](
                    field,
                    // @ts-expect-error ignore typecheck for form.control
                    form.control
                  )}
                </React.Fragment>
              ))}
              <FormField
                control={form.control}
                name="totalDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <DurationInput disabled={loading} {...field} />
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
          className="ml-auto self-end fixed bottom-4 right-4 inline-flex gap-1 items-center z-50"
          type="submit"
        >
          {loading ? (
            <Spinner className="w-4 h-4" />
          ) : (
            <CalendarClock className="w-4 h-4" />
          )}{" "}
          Schedule appointment
        </Button>
      </form>
    </Form>
  );
};
