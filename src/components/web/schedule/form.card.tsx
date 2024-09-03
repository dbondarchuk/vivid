"use client";
import {
  DateTime,
  Time,
  Field,
  FieldType,
  AppointmentFields,
  Fields,
  WithLabelFieldData,
} from "@/types";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Control, UseFormReturn, useForm } from "react-hook-form";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { Calendar, Clock, DollarSign, Globe2, Timer } from "lucide-react";
import { EmailField } from "../forms/email";
import { NameField } from "../forms/name";
import { PhoneField } from "../forms/phone";

import { fallbackLanguage, useI18n } from "@/i18n/i18n";
import { TimeZone, getTimeZones } from "@vvo/tzdb";
import { HourNumbers, DateTime as Luxon, MinuteNumbers } from "luxon";
import { MultiLineField } from "../forms/multiLine";
import { OneLineField } from "../forms/oneLine";
import { BaseCard, BaseCardProps } from "./baseCard";
import { formatTime } from "@/lib/time";

export type FormCardProps = BaseCardProps & {
  dateTime: DateTime;
  duration: number;
  onSubmit: (values: AppointmentFields) => void;
};

const fieldsSchemaMap = {
  [FieldType.Name]: (field: Field) =>
    z.string().min(2, {
      message: "name_required_error",
    }),

  [FieldType.Email]: (field: Field) => z.string().email("invalid_email_error"),
  [FieldType.Phone]: (field: Field) =>
    z.string().refine((s) => !s?.includes("_"), "invalid_phone_error"),
  [FieldType.OneLine]: (field: Field) =>
    z.string().min(field.required ? 1 : 0, "field_required_error"),
  [FieldType.MultiLine]: (field: Field) =>
    z.string().min(field.required ? 1 : 0, "field_required_error"),
};

const fieldSchemaMapper = (field: Field) => {
  let schema: z.ZodType = fieldsSchemaMap[field.type](field);
  if (!field.required) schema = schema.optional();

  return schema;
};

type FieldComponentMapFn = (
  field: Field<any>,
  control: Control<
    {
      [x: string]: any;
    },
    any
  >
) => React.ReactNode;

const fieldsComponentMap: Record<FieldType, FieldComponentMapFn> = {
  [FieldType.Name]: (field, control) => (
    <NameField control={control} {...field} />
  ),
  [FieldType.Email]: (field, control) => (
    <EmailField control={control} {...field} />
  ),
  [FieldType.Phone]: (field, control) => (
    <PhoneField control={control} {...(field as Field<WithLabelFieldData>)} />
  ),
  [FieldType.OneLine]: (field, control) => (
    <OneLineField control={control} {...(field as Field<WithLabelFieldData>)} />
  ),
  [FieldType.MultiLine]: (field, control) => (
    <MultiLineField
      control={control}
      {...(field as Field<WithLabelFieldData>)}
    />
  ),
};

const getFields = (fields: Fields<WithLabelFieldData>): Fields<any> => {
  return [
    {
      name: "name",
      required: true,
      type: FieldType.Name,
    },
    {
      name: "email",
      required: true,
      type: FieldType.Email,
    },
    ...fields,
  ];
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
                    start: formatTime(this.props.dateTime.time),
                    end: formatTime(timeEnd),
                  })}
                </div>
                <div className="flex items-center">
                  <Timer className="mr-1" />
                  {this.props.i18n("form_duration_label_format", {
                    duration: this.duration,
                  })}
                </div>
                {this.price && (
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

                {fields.map((field) =>
                  fieldsComponentMap[field.type](field, this.props.form.control)
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    );
  }
}

export const FormCard: React.FC<Omit<FormCardProps, "i18n">> = (props) => {
  const formSchema = z.object(
    getFields(props.appointmentOption.fields).reduce((prev, field) => {
      prev[field.name] = fieldSchemaMapper(field);
      return prev;
    }, {} as { [field: string]: z.ZodType })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
    mode: "onBlur",
  });

  const i18n = useI18n();

  return (
    <_FormCard
      {...props}
      i18n={i18n}
      form={form}
      onSubmit={props.onSubmit}
      // @ts-expect-error The form will have needed fields
      next={form.handleSubmit(props.onSubmit)}
    />
  );
};
