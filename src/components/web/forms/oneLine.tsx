import { FormItem, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { FieldValues } from "react-hook-form";
import { FormFieldLabel } from "./formFieldLabel";
import { getFieldName, IFormFieldProps } from "./formFieldProps";
import { WithLabelFieldData } from "@/types";
import { FormFieldDescription } from "./formFieldDescription";
import { FormFieldErrorMessage } from "./formFieldErrorMessage";

export const OneLineField: <T extends FieldValues>(
  p: IFormFieldProps<T, WithLabelFieldData>
) => React.ReactElement<IFormFieldProps<T, WithLabelFieldData>> = (props) => (
  <FormField
    control={props.control}
    name={getFieldName(props)}
    render={({ field }) => (
      <FormItem>
        <FormFieldLabel label={props.data.label} required={props.required} />
        <FormControl>
          <Input {...field} placeholder="Type your response here" />
        </FormControl>
        <FormFieldDescription description={props.data?.description} />
        <FormFieldErrorMessage />
      </FormItem>
    )}
  />
);
