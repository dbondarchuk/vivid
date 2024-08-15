import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { FieldValues } from "react-hook-form";
import { FormFielLabel } from "./formFieldLabel";
import { IFormFieldProps, WithLabelFieldData } from "./formFieldProps";

export const MultiLineField: <T extends FieldValues>(
  p: IFormFieldProps<T, WithLabelFieldData>
) => React.ReactElement<IFormFieldProps<T, WithLabelFieldData>> = (props) => (
  <FormField
    control={props.control}
    name={props.name}
    render={({ field }) => (
      <FormItem>
        <FormFielLabel label={props.data.label} required={props.required} />
        <FormControl>
          <Textarea {...field} placeholder="Type your response here" />
        </FormControl>
        <FormDescription></FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);
