import {
  FormItem,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { FieldValues } from "react-hook-form";
import { FormFieldLabel } from "./formFieldLabel";
import { getFieldName, IFormFieldProps } from "./formFieldProps";
import { WithLabelFieldData } from "@/types";
import { FormFieldDescription } from "./formFieldDescription";

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
          <Textarea {...field} placeholder="Type your response here" />
        </FormControl>
        <FormFieldDescription description={props.data?.description} />
        <FormMessage />
      </FormItem>
    )}
  />
);
