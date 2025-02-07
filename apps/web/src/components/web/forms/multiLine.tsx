import { FormControl, FormField, FormItem, Textarea } from "@vivid/ui";

import { WithLabelFieldData } from "@vivid/types";
import { FieldValues } from "react-hook-form";
import { FormFieldDescription } from "./formFieldDescription";
import { FormFieldErrorMessage } from "./formFieldErrorMessage";
import { FormFieldLabel } from "./formFieldLabel";
import { getFieldName, IFormFieldProps } from "./formFieldProps";

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
        <FormFieldErrorMessage />
      </FormItem>
    )}
  />
);
