import { FormControl, FormField, FormItem, Textarea } from "@vivid/ui";

import { WithLabelFieldData } from "@vivid/types";
import { FieldValues } from "react-hook-form";
import { FormFieldDescription } from "./form-field-description";
import { FormFieldErrorMessage } from "./form-field-error-message";
import { FormFieldLabel } from "./form-field-label";
import { getFieldName, IFormFieldProps } from "./form-field.types";

export const MultiLineField: <T extends FieldValues>(
  p: IFormFieldProps<T, WithLabelFieldData>
) => React.ReactElement<IFormFieldProps<T, WithLabelFieldData>> = (props) => (
  <FormField
    control={props.control}
    name={getFieldName(props)}
    render={({ field }) => (
      <FormItem>
        <FormFieldLabel label={props.data.label} required={props.required} />
        <FormControl>
          <Textarea
            {...field}
            placeholder="Type your response here"
            disabled={field.disabled || props.disabled}
          />
        </FormControl>
        <FormFieldDescription description={props.data?.description} />
        <FormFieldErrorMessage />
      </FormItem>
    )}
  />
);
