import {
  Field,
  FieldOptionsData,
  FieldType,
  WithLabelFieldData,
} from "@/types";
import { Control } from "react-hook-form";
import { z } from "zod";
import { EmailField } from "./email";
import { MultiLineField } from "./multiLine";
import { NameField } from "./name";
import { OneLineField } from "./oneLine";
import { PhoneField } from "./phone";
import { CheckboxField } from "./checkboxField";
import { SelectField } from "./select";

export const fieldsSchemaMap = {
  [FieldType.Name]: (field: Field) =>
    z.string().min(2, {
      message: "name_required_error",
    }),

  [FieldType.Email]: (field: Field) =>
    z
      .string()
      .min(field.required ? 1 : 0, "field_required_error")
      .email("invalid_email_error"),
  [FieldType.Phone]: (field: Field) =>
    z
      .string()
      .min(field.required ? 1 : 0, "field_required_error")
      .refine((s) => !s?.includes("_"), "invalid_phone_error"),
  [FieldType.OneLine]: (field: Field) =>
    z.string().min(field.required ? 1 : 0, "field_required_error"),
  [FieldType.MultiLine]: (field: Field) =>
    z.string().min(field.required ? 1 : 0, "field_required_error"),
  [FieldType.Checkbox]: (field: Field) =>
    z
      .boolean()
      .default(false)
      .refine(
        (arg) => (field.required ? !!arg : true),
        "checkbox_required_error"
      ),
  [FieldType.Select]: (field: Field) => {
    const [firstOption, ...restOptions] = (
      field as unknown as Field<FieldOptionsData>
    ).data.options.map((x) => x.option);

    return z
      .enum([firstOption, ...restOptions], { message: "field_required_error" })
      .refine((arg) => (field.required ? !!arg : true), "field_required_error");
  },
};

export const fieldSchemaMapper = (field: Field) => {
  let schema: z.ZodType = fieldsSchemaMap[field.type](field);
  if (!field.required) schema = schema.optional();

  return schema;
};

export type FieldComponentMapFn = (
  field: Field<any>,
  control: Control
) => React.ReactNode;

export const fieldsComponentMap: (
  namespace?: string
) => Record<FieldType, FieldComponentMapFn> = (namespace) => ({
  [FieldType.Name]: (field, control) => (
    <NameField control={control} {...field} namespace={namespace} />
  ),
  [FieldType.Email]: (field, control) => (
    <EmailField control={control} {...field} namespace={namespace} />
  ),
  [FieldType.Phone]: (field, control) => (
    <PhoneField
      control={control}
      {...(field as Field<WithLabelFieldData>)}
      namespace={namespace}
    />
  ),
  [FieldType.OneLine]: (field, control) => (
    <OneLineField
      control={control}
      {...(field as Field<WithLabelFieldData>)}
      namespace={namespace}
    />
  ),
  [FieldType.MultiLine]: (field, control) => (
    <MultiLineField
      control={control}
      {...(field as Field<WithLabelFieldData>)}
      namespace={namespace}
    />
  ),
  [FieldType.Checkbox]: (field, control) => (
    <CheckboxField
      control={control}
      {...(field as Field<WithLabelFieldData>)}
      namespace={namespace}
    />
  ),
  [FieldType.Select]: (field, control) => (
    <SelectField
      control={control}
      {...(field as Field<WithLabelFieldData & FieldOptionsData>)}
      namespace={namespace}
    />
  ),
});
