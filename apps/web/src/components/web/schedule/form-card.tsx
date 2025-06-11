"use client";
import {
  ApplyDiscountRequest,
  ApplyDiscountResponse,
  AppointmentFields,
  DateTime,
  Fields,
  Time,
  WithLabelFieldData,
  getFields,
} from "@vivid/types";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import * as z from "zod";

import { Button, Form, FormItem, Input, Label, Spinner, cn } from "@vivid/ui";
import { Calendar, Clock, DollarSign, Globe2, Timer } from "lucide-react";

import { I18nKeys, fallbackLanguage, useI18n } from "@/i18n/i18n";
import {
  durationToTime,
  formatAmount,
  formatAmountString,
  formatTimeLocale,
} from "@vivid/utils";
import { TimeZone, getTimeZones } from "@vvo/tzdb";
import { HourNumbers, DateTime as Luxon, MinuteNumbers } from "luxon";
import { fieldSchemaMapper, fieldsComponentMap } from "../forms/fields";
import { BaseCard, BaseCardProps } from "./base-card";

export type FormCardProps = BaseCardProps & {
  dateTime: DateTime;
  duration: number;
  fields: Fields<WithLabelFieldData>;
  onSubmit: (values: AppointmentFields) => void;
};

const timeZones = getTimeZones();

type _FormCardProps = FormCardProps & {
  form: UseFormReturn<
    {
      [x: string]: any;
    },
    any,
    undefined
  >;

  onSubmit: (values: AppointmentFields) => void;
  showPromoCode?: boolean;
};

type _FormCardState = {
  promoCode: string;
  applyPromoCodeLoading: boolean;
  promoCodeError?: I18nKeys;
};

class _FormCard extends BaseCard<_FormCardProps, _FormCardState> {
  public constructor(props: _FormCardProps) {
    super(props);
    this.state = {
      promoCode: props.promoCode?.code ?? "",
      applyPromoCodeLoading: false,
    };
  }

  public get isPrevDisabled(): boolean {
    return false;
  }

  public get isNextDisabled(): boolean {
    return !this.props.form.formState.isValid;
  }

  public async applyPromoCode() {
    if (!this.state.promoCode) {
      this.setState((prev) => ({ ...prev, promoCodeError: undefined }));
    }

    this.setState((prev) => ({ ...prev, applyPromoCodeLoading: true }));

    try {
      const response = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: this.state.promoCode,
          optionId: this.props.appointmentOption._id,
          addons: this.props.selectedAddons?.map((addon) => addon._id),
          dateTime: Luxon.fromObject(
            {
              year: this.props.dateTime.date.getFullYear(),
              month: this.props.dateTime.date.getMonth() + 1,
              day: this.props.dateTime.date.getDate(),
              hour: this.props.dateTime.time.hour,
              minute: this.props.dateTime.time.minute,
              second: 0,
            },
            { zone: this.props.dateTime.timeZone }
          )
            .toUTC()
            .toJSDate(),
          name: this.props.form.getValues("name") || "",
          email: this.props.form.getValues("email") || "",
          phone: this.props.form.getValues("phone") || "",
        } satisfies ApplyDiscountRequest),
      });

      if (response.status >= 400) {
        throw new Error(
          `Failed to apply promo code: ${response.status}: ${await response.text()}`
        );
      }

      const result = (await response.json()) as ApplyDiscountResponse;
      this.props.setPromoCode(result);
      this.setState((prev) => ({
        ...prev,
        promoCodeError: undefined,
      }));
    } catch (e) {
      console.error(e);
      this.setState((prev) => ({
        ...prev,
        promoCodeError: "promo_code_error",
      }));

      this.props.setPromoCode(undefined);
    } finally {
      this.setState((prev) => ({ ...prev, applyPromoCodeLoading: false }));
    }
  }

  public get cardContent(): React.ReactNode {
    const date = Luxon.fromJSDate(this.props.dateTime.date);
    const timeEndLuxon = date
      .set({
        hour: this.props.dateTime.time.hour,
        minute: this.props.dateTime.time.minute,
      })
      .plus({ minutes: this.duration });

    const timeEnd: Time = {
      hour: timeEndLuxon.hour as HourNumbers,
      minute: timeEndLuxon.minute as MinuteNumbers,
    };

    let timeZone: TimeZone | undefined = timeZones.find((tz) => {
      return (
        this.props.dateTime.timeZone === tz.name ||
        tz.group.includes(this.props.dateTime.timeZone)
      );
    });
    if (!timeZone) {
      const defaultZone = Luxon.now().zoneName;
      timeZone = timeZones.find((tz) => {
        return defaultZone === tz.name || tz.group.includes(defaultZone || "");
      });
    }

    const fields = getFields(this.props.fields);

    return (
      <Form {...this.props.form}>
        <form
          // @ts-expect-error This will have required fields
          onSubmit={this.props.form.handleSubmit(this.props.onSubmit)}
          className="space-y-8 not-prose"
        >
          <div className="py-4">
            <div className="mb-3 grid md:grid-cols-3 gap-2 ">
              <div className="grid md:col-span-1 md:pr-5 md:flex gap-3 md:flex-col">
                <div className="flex items-center">
                  <Calendar className="mr-1" />
                  {this.props.i18n("form_date_label_format", {
                    date: date.toLocaleString(Luxon.DATE_FULL, {
                      locale: fallbackLanguage,
                    }),
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1" />
                  {this.props.i18n("form_time_label_format", {
                    start: formatTimeLocale(this.props.dateTime.time),
                    end: formatTimeLocale(timeEnd),
                  })}
                </div>
                {!!this.duration && (
                  <div className="flex items-center">
                    <Timer className="mr-1" />
                    {this.props.i18n(
                      "form_duration_hour_minutes_label_format",
                      durationToTime(this.duration)
                    )}
                  </div>
                )}
                {!!this.price && (
                  <div className="flex items-center">
                    <DollarSign className="mr-1" />
                    {this.props.i18n("form_price_label_format", {
                      price: formatAmountString(this.price),
                    })}
                  </div>
                )}
                <div className="flex items-center">
                  <Globe2 className="mr-1 flex-none" />
                  {this.props.i18n("timezone_format", {
                    timezone: timeZone?.currentTimeFormat,
                  })}
                </div>
              </div>
              <div className="md:col-span-2 md:pr-2 sm:mb-3">
                <div className="mb-3">
                  <h2 className="mt-0">
                    {this.props.i18n("form_title_label")}
                  </h2>
                </div>

                {fields.map((field) => (
                  <React.Fragment key={field.name}>
                    {fieldsComponentMap()[field.type](
                      field,
                      this.props.form.control
                    )}
                  </React.Fragment>
                ))}

                {this.props.showPromoCode && (
                  <FormItem>
                    <Label htmlFor="promo-code">
                      {this.props.i18n("form_promo_code")}
                    </Label>
                    <div className="flex flex-row gap-2">
                      <Input
                        className="w-full flex-1"
                        value={this.state.promoCode}
                        onChange={(e) => {
                          this.setState((prev) => ({
                            ...prev,
                            promoCode: e.target.value,
                            promoCodeError: undefined,
                          }));

                          this.props.setPromoCode(undefined);
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => this.applyPromoCode()}
                      >
                        {this.state.applyPromoCodeLoading && <Spinner />}{" "}
                        {this.props.i18n("apply")}
                      </Button>
                    </div>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        this.state.promoCodeError
                          ? "text-destructive"
                          : "text-green-700"
                      )}
                    >
                      {!!this.state.promoCodeError &&
                        this.props.i18n(this.state.promoCodeError)}
                      {this.props.promoCode &&
                        this.props.i18n("promo_code_success", {
                          code: this.props.promoCode.code,
                          discount: formatAmountString(this.discount),
                        })}
                    </p>
                  </FormItem>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    );
  }
}

export const FormCard: React.FC<
  Omit<FormCardProps, "i18n"> & {
    values?: Record<string, any>;
    onFormChange?: (formValue: Record<string, any>) => void;
    showPromoCode?: boolean;
  }
> = ({ values, onFormChange, showPromoCode, ...props }) => {
  const formSchema = z.object(
    getFields(props.fields).reduce(
      (prev, field) => {
        prev[field.name] = fieldSchemaMapper(field);
        return prev;
      },
      {} as { [field: string]: z.ZodType }
    )
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: values,
    mode: "all",
    reValidateMode: "onChange",
  });

  const i18n = useI18n();

  return (
    <_FormCard
      {...props}
      i18n={i18n}
      form={form}
      showPromoCode={showPromoCode}
      // @ts-expect-error The form will have needed fields
      next={form.handleSubmit(props.onSubmit)}
      prev={() => {
        onFormChange?.(form.getValues());
        props.prev?.();
      }}
    />
  );
};
