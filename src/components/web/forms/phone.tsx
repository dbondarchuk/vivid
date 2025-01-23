import { FormControl, FormField, FormItem } from "@/components/ui/form";
import React from "react";

import { FieldValues } from "react-hook-form";
import { getFieldName, IFormFieldProps } from "./formFieldProps";

import { FormFieldLabel } from "./formFieldLabel";
import { WithLabelFieldData } from "@/types";
import { FormFieldDescription } from "./formFieldDescription";
import { FormFieldErrorMessage } from "./formFieldErrorMessage";
import { PhoneInput } from "@/components/ui/phoneInput";

export const PhoneField: <T extends FieldValues>(
  p: IFormFieldProps<T, WithLabelFieldData>
) => React.ReactElement<IFormFieldProps<T, WithLabelFieldData>> = (props) => {
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
            <PhoneInput {...field} />
          </FormControl>
          <FormFieldDescription description={props.data?.description} />
          <FormFieldErrorMessage />
        </FormItem>
      )}
    />
  );
};
