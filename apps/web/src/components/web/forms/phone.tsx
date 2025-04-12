import { FormControl, FormField, FormItem } from "@vivid/ui";
import React from "react";

import { FieldValues } from "react-hook-form";
import { getFieldName, IFormFieldProps } from "./form-fiel.types";

import { WithLabelFieldData } from "@vivid/types";
import { PhoneInput } from "@vivid/ui";
import { FormFieldDescription } from "./form-field-description";
import { FormFieldErrorMessage } from "./form-field-error-message";
import { FormFieldLabel } from "./form-field-label";
import { useI18n } from "@/i18n/i18n";

export const PhoneField: <T extends FieldValues>(
  p: IFormFieldProps<T, WithLabelFieldData>
) => React.ReactElement<IFormFieldProps<T, WithLabelFieldData>> = (props) => {
  const i18n = useI18n();
  return (
    <FormField
      control={props.control}
      name={getFieldName(props)}
      render={({ field }) => (
        <FormItem>
          <FormFieldLabel
            label={props.data.label || "form_phone_label"}
            required={props.required}
          />
          <FormControl>
            <PhoneInput {...field} label={i18n("form_phone_label")} />
          </FormControl>
          <FormFieldDescription description={props.data?.description} />
          <FormFieldErrorMessage />
        </FormItem>
      )}
    />
  );
};
