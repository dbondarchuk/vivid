import { FormControl, FormField, FormItem, Input } from "@vivid/ui";

import { FieldValues } from "react-hook-form";
import { FormFieldDescription } from "./formFieldDescription";
import { FormFieldErrorMessage } from "./formFieldErrorMessage";
import { FormFieldLabel } from "./formFieldLabel";
import { getFieldName, IFormFieldProps } from "./formFieldProps";

export const EmailField: <T extends FieldValues>(
  p: IFormFieldProps<T>
) => React.ReactElement<IFormFieldProps<T>> = (props) => (
  <FormField
    control={props.control}
    name={getFieldName(props)}
    render={({ field }) => (
      <FormItem>
        <FormFieldLabel
          label={props.data?.label || "form_email_label"}
          required={props.required}
        />
        <FormControl>
          <Input type="email" {...field} />
        </FormControl>
        <FormFieldDescription description={props.data?.description} />
        <FormFieldErrorMessage />
      </FormItem>
    )}
  />
);
