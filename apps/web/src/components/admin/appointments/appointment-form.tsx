"use client";

import { AppointmentCalendar } from "@/components/admin/appointments/appointment-calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@vivid/i18n";
import {
  Appointment,
  AppointmentAddon,
  AppointmentChoice,
  AppointmentDiscount,
  AppointmentEvent,
  asOptionalField,
  Customer,
  CustomerListModel,
  Discount,
  Event,
  Field,
  getFields,
  WithLabelFieldData,
} from "@vivid/types";
import {
  Button,
  Checkbox,
  Combobox,
  CustomerSelector,
  DateTimePicker,
  DurationInput,
  fieldSchemaMapper,
  fieldsComponentMap,
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
  PromoCodeSelector,
  Spinner,
  Textarea,
  toastPromise,
  use12HourFormat,
  useTimeZone,
} from "@vivid/ui";
import { formatAmount, getDiscountAmount } from "@vivid/utils";
import { CalendarClock, Clock, DollarSign } from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, useFormState } from "react-hook-form";
import { z } from "zod";
import { createAppointment, updateAppointment } from "./actions";

export type AppointmentScheduleFormProps = {
  options: AppointmentChoice[];
  knownFields: (Field<WithLabelFieldData> & { _id: string })[];
  customer?: Customer | null;
} & (
  | ({
      from: Appointment;
    } & (
      | {
          isEdit: true;
          id: string;
        }
      | {
          isEdit?: false;
          id?: never;
        }
    ))
  | {
      from?: null;
      isEdit?: false;
      id?: never;
    }
);

const getSelectedFields = (
  selectedOption: AppointmentChoice | undefined,
  selectedAddons: AppointmentAddon[] | undefined,
  knownFields: AppointmentScheduleFormProps["knownFields"],
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
      {} as Record<string, boolean>,
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
> = ({ options, knownFields, from, isEdit, id, customer: propsCustomer }) => {
  const t = useI18n("admin");
  const timeZone = useTimeZone();
  const now = React.useMemo(
    () => DateTime.now().set({ second: 0 }).toJSDate(),
    [],
  );

  const formSchema = z
    .object({
      dateTime: z.date({ message: t("appointments.form.dateTimeRequired") }),
      totalDuration: z.coerce
        .number({ message: t("appointments.form.durationRequired") })
        .int(t("appointments.form.durationInteger"))
        .min(1, t("appointments.form.durationMin"))
        .max(60 * 24 * 10, t("appointments.form.durationMax")),
      totalPrice: asOptionalField(
        z.coerce
          .number({ message: t("appointments.form.priceNumber") })
          .min(0, t("appointments.form.priceMin")),
      ).transform((e) => (e === 0 ? undefined : e)),
      option: z.string({ message: t("appointments.form.optionRequired") }),
      addons: z
        .array(
          z.object({
            id: z.string({ message: t("appointments.form.addonRequired") }),
          }),
        )
        .optional(),
      fields: z
        .object({
          name: z.string().trim(),
          email: z.string().trim(),
          phone: z.string().trim(),
        })
        .passthrough(),

      note: z.string().optional(),
      confirmed: z.coerce.boolean().optional(),
      customerId: z.string().optional(),
      promoCode: z.string().optional().nullable(),
      doNotNotifyCustomer: z.coerce.boolean().optional(),
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
          {} as { [field: string]: z.ZodType },
        ),
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
      dateTime: isEdit ? from.dateTime : now,
      totalDuration: from?.totalDuration || options[0].duration || 0,
      totalPrice: from?.totalPrice || undefined,
      addons: from?.addons?.map(({ _id }) => ({ id: _id })) || [],
      fields: from?.fields || {
        name: propsCustomer?.name ?? "",
        email: propsCustomer?.email ?? "",
        phone: propsCustomer?.phone ?? "",
      },
      customerId: from?.customerId ?? propsCustomer?._id,
      option: from?.option?._id || options[0]._id,
      confirmed: true,
      note: isEdit ? from?.note || "" : "",
      promoCode: isEdit ? from?.discount?.code : undefined,
      doNotNotifyCustomer: false,
    },
  });

  const [loading, setLoading] = React.useState(false);
  const [confirmOverlap, setConfirmOverlap] = React.useState(false);
  const [calendarEvents, setCalendarEvents] = React.useState<Event[]>([]);
  const customerId = form.watch("customerId");
  const [customer, setCustomer] = React.useState<
    CustomerListModel | undefined
  >();

  const [discount, setDiscount] = React.useState<
    (Discount & { code: string }) | undefined
  >();

  const [disabledFields, setDisabledFields] = React.useState<Set<String>>(
    new Set(),
  );

  const router = useRouter();

  const dateTime = form.watch("dateTime");
  const duration = form.watch("totalDuration");
  const fields = form.watch("fields");
  const price = form.watch("totalPrice");
  const selectedOptionId = form.watch("option");
  const selectedAddonIds = form.watch("addons");

  const selectedOption = React.useMemo(
    () => options.find((x) => x._id === selectedOptionId),
    [options, selectedOptionId],
  );

  const selectedAddons = React.useMemo(
    () =>
      selectedOption?.addons?.filter((x) =>
        (selectedAddonIds || []).find((y) => y.id === x._id),
      ),
    [selectedOption, selectedAddonIds],
  );

  const isOverlaping = React.useMemo(() => {
    const appointmentStart = DateTime.fromJSDate(dateTime);
    const appointmentEnd = appointmentStart.plus({
      minutes: duration || 0,
    });

    return calendarEvents.some((app) => {
      if (isEdit && "_id" in app && app._id === id) return false;

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
            phone: data.fields.phone,
          },
        );

      const files = Object.entries(fields)
        .filter(([_, value]) => (value as any) instanceof File)
        .reduce(
          (map, [key, value]) => ({
            ...map,
            [key]: value as unknown as File,
          }),
          {} as Record<string, File>,
        );

      let appointmentDiscount: AppointmentDiscount | undefined = undefined;
      if (data.promoCode && !discount) return;
      if (data.promoCode && discount && data.totalPrice) {
        appointmentDiscount = {
          code: data.promoCode,
          discountAmount: getDiscountAmount(data.totalPrice, discount),
          id: discount._id,
          name: discount.name,
        };
      }

      const appointmentEvent: Omit<AppointmentEvent, "timeZone"> = {
        dateTime: data.dateTime,
        option: {
          _id: eventOption._id,
          name: eventOption.name,
          price: eventOption.price,
          duration: eventOption.duration,
        },
        fields,
        fieldsLabels: selectedFields.reduce(
          (acc, field) => ({
            ...acc,
            [field.name]: field.data?.label,
          }),
          {},
        ),
        totalDuration: data.totalDuration,
        totalPrice: data.totalPrice,
        addons: addons.map((addon) => ({
          _id: addon._id,
          name: addon.name,
          price: addon.price,
          duration: addon.duration,
        })),
        note: data.note,
        discount: appointmentDiscount,
      };

      let appointmentId = id;
      if (isEdit) {
        await toastPromise(
          updateAppointment(id, appointmentEvent, files, data.confirmed),
          {
            success: t("appointments.form.updatedSuccess"),
            error: t("appointments.form.requestError"),
          },
        );
      } else {
        appointmentId = await toastPromise(
          createAppointment(appointmentEvent, files, data.confirmed),
          {
            success: t("appointments.form.scheduledSuccess"),
            error: t("appointments.form.requestError"),
          },
        );
      }

      router.push(`/admin/dashboard/appointments/${appointmentId}`);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setConfirmOverlap(false);
  }, [dateTime, duration, setConfirmOverlap]);

  const { name, email, phone } = fields;

  const selectedFields = React.useMemo(
    () => getSelectedFields(selectedOption, selectedAddons, knownFields),
    [selectedAddons, selectedOption, knownFields],
  );

  const appointment: Appointment | undefined = React.useMemo(() => {
    if (!selectedOption) return undefined;

    const dt = DateTime.fromJSDate(dateTime);

    return {
      _id: id || "",
      date: dt.startOf("day").toISODate(),
      time: {
        hour: dt.hour,
        minute: dt.minute,
      },
      dateTime,
      endAt: DateTime.fromJSDate(dateTime)
        .plus({ minutes: duration })
        .toJSDate(),
      totalDuration: duration,
      totalPrice: price,
      fields: { name, email, phone },
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
        {},
      ),
      status: "pending",
      timeZone,
      addons: selectedAddonIds,
      createdAt: now,
      customerId: from?.customerId ?? "unknown",
      customer: customer ??
        from?.customer ?? {
          _id: "unknown",
          name,
          email,
          phone,
          knownEmails: [],
          knownNames: [],
          knownPhones: [],
        },
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
        selectedOption?.addons?.some((x) => x._id === addon._id),
      )
      .map(({ _id }) => ({ id: _id }));

    form.setValue("addons", newAddons);
  }, [selectedOption]);

  React.useEffect(() => {
    const duration =
      (selectedOption?.duration || 0) +
      (selectedAddons || []).reduce(
        (prev, curr) => prev + (curr.duration || 0),
        0,
      );

    let price: number | undefined =
      (selectedOption?.price || 0) +
      (selectedAddons || []).reduce(
        (prev, curr) => prev + (curr.price || 0),
        0,
      );

    let priceDiscount = 0;
    if (discount) {
      priceDiscount = getDiscountAmount(price, discount);
    }

    price -= priceDiscount;

    form.setValue("totalDuration", duration);
    form.setValue("totalPrice", Math.max(formatAmount(price || 0), 0));

    form.trigger("totalDuration");
  }, [selectedOption, selectedAddons, discount]);

  React.useEffect(() => {
    setDisabledFields((prev) => {
      ["name", "email", "phone"].forEach((field) =>
        customerId ? prev.add(field) : prev.delete(field),
      );
      return prev;
    });
  }, [customerId, setDisabledFields]);

  const onCustomerChange = (c?: CustomerListModel) => {
    setCustomer(c);
    if (!!c) {
      form.setValue("fields.name", c.name);
      form.setValue("fields.email", c.email);
      form.setValue("fields.phone", c.phone);
    }
  };

  const uses12HourFormat = use12HourFormat();

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
                    <FormLabel>
                      {t("appointments.form.appointmentType")}
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        disabled={loading}
                        className="flex w-full font-normal text-base"
                        searchLabel={t("appointments.form.selectOption")}
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
                                    <>
                                      {x.duration} {t("appointments.form.min")}
                                    </>
                                  ) : (
                                    t("appointments.form.custom")
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
                    <FormLabel>{t("appointments.form.dateTime")}</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        use12HourFormat={uses12HourFormat}
                        disabled={loading}
                        commitOnChange
                        min={new Date()}
                        timeZone={timeZone}
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
                    <FormLabel>{t("appointments.form.addons")}</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder={t("appointments.form.selectAddons")}
                        selected={field.value?.map((x) => x.id) || []}
                        onChange={(value) =>
                          field.onChange(value.map((id) => ({ id })))
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
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("appointments.form.customer")}</FormLabel>
                    <FormControl>
                      <CustomerSelector
                        onItemSelect={field.onChange}
                        value={field.value}
                        disabled={
                          loading || !!from?.customerId || !!propsCustomer
                        }
                        onValueChange={onCustomerChange}
                        allowClear={!from && !propsCustomer}
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
                    form.control,
                    loading || disabledFields.has(field.name),
                  )}
                </React.Fragment>
              ))}
              <FormField
                control={form.control}
                name="promoCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("appointments.form.discount")}</FormLabel>
                    <FormControl>
                      <PromoCodeSelector
                        onItemSelect={(val) => {
                          field.onChange(val ?? null);
                          field.onBlur();
                        }}
                        value={field.value as string | undefined}
                        disabled={loading}
                        onValueChange={(val) => {
                          setDiscount(val);
                        }}
                        allowClear
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("appointments.form.duration")}</FormLabel>
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
                    <FormLabel>{t("appointments.form.price")}</FormLabel>
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
                    <FormLabel>{t("appointments.form.note")}</FormLabel>
                    <FormControl>
                      <Textarea autoResize {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(!isEdit || from?.status === "pending") && (
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
                        <FormLabel
                          htmlFor="confirmed"
                          className="cursor-pointer"
                        >
                          {t("appointments.form.confirmAppointment")}
                        </FormLabel>
                      </div>
                      <FormDescription>
                        {t("appointments.form.confirmAppointmentDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {isEdit && (
                <FormField
                  control={form.control}
                  name="doNotNotifyCustomer"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row items-center gap-2">
                        <Checkbox
                          id="doNotNotifyCustomer"
                          disabled={loading}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <FormLabel
                          htmlFor="doNotNotifyCustomer"
                          className="cursor-pointer"
                        >
                          {t("appointments.form.doNotNotifyCustomer")}
                        </FormLabel>
                      </div>
                      <FormDescription>
                        {t("appointments.form.doNotNotifyCustomerDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
                      {t("appointments.form.confirmOverlap")}
                    </FormLabel>
                  </div>
                  <FormDescription>
                    {t("appointments.form.confirmOverlapDescription")}
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
          {t(
            isEdit
              ? "appointments.form.updateAppointment"
              : "appointments.form.scheduleAppointment",
          )}
        </Button>
      </form>
    </Form>
  );
};
