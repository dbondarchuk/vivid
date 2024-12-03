import {
  FormItem,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { getFieldName, IFormFieldProps } from "./formFieldProps";
import { FieldValues } from "react-hook-form";
import { FormFieldLabel } from "./formFieldLabel";
import { FormFieldDescription } from "./formFieldDescription";

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
        <FormMessage />
      </FormItem>
    )}
  />
);
