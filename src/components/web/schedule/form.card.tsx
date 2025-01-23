"use client";
import { DateTime, Time, AppointmentFields, getFields } from "@/types";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { Calendar, Clock, DollarSign, Globe2, Timer } from "lucide-react";

import { fallbackLanguage, useI18n } from "@/i18n/i18n";
import { TimeZone, getTimeZones } from "@vvo/tzdb";
import { HourNumbers, DateTime as Luxon, MinuteNumbers } from "luxon";
import { BaseCard, BaseCardProps } from "./baseCard";
import { durationToTime, formatTimeLocale } from "@/lib/time";
import { fieldSchemaMapper, fieldsComponentMap } from "../forms/fields";

export type FormCardProps = BaseCardProps & {
  dateTime: DateTime;
  duration: number;
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
};

class _FormCard extends BaseCard<_FormCardProps> {
  public get isPrevDisabled(): boolean {
    return false;
  }

  public get isNextDisabled(): boolean {
    return !this.props.form.formState.isValid;
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

    const fields = getFields(this.props.appointmentOption.fields);

    return (
      <Form {...this.props.form}>
        <form
          // @ts-expect-error This will have required fields
          onSubmit={this.props.form.handleSubmit(this.props.onSubmit)}
          className="space-y-8 not-prose"
        >
          <div className="py-4">
            <div className="mb-3 grid md:grid-cols-3 gap-2 ">
              <div className="md:col-span-1 md:pr-5 md:flex gap-3 md:flex-col grid grid-cols-2">
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
                      price: this.price.toFixed(2).replace(/\.00$/, ""),
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
  }
> = ({ values, onFormChange, ...props }) => {
  const formSchema = z.object(
    getFields(props.appointmentOption.fields).reduce((prev, field) => {
      prev[field.name] = fieldSchemaMapper(field);
      return prev;
    }, {} as { [field: string]: z.ZodType })
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
      // @ts-expect-error The form will have needed fields
      next={form.handleSubmit(props.onSubmit)}
      prev={() => {
        onFormChange?.(form.getValues());
        props.prev?.();
      }}
    />
  );
};
