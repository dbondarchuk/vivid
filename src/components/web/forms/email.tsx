import {
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { IFormFieldProps } from "./formFieldProps";
import { FieldValues } from "react-hook-form";
import { FormFielLabel } from "./formFieldLabel";

export const EmailField: <T extends FieldValues>(
  p: IFormFieldProps<T>
) => React.ReactElement<IFormFieldProps<T>> = (props) => (
  <FormField
    control={props.control}
    name={props.name}
    render={({ field }) => (
      <FormItem>
        <FormFielLabel label="form_email_label" required={props.required} />
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormDescription></FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);
