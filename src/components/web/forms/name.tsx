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
import { FormFieldLabel } from "./formFieldLabel";

export const NameField: <T extends FieldValues>(
  p: IFormFieldProps<T>
) => React.ReactElement<IFormFieldProps<T>> = (props) => (
  <FormField
    control={props.control}
    name={props.name}
    render={({ field }) => (
      <FormItem>
        <FormFieldLabel label="form_name_label" required={props.required} />
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormDescription></FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);
