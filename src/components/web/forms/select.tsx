import { FormItem, FormControl, FormField } from "@/components/ui/form";

import { FieldValues } from "react-hook-form";
import { FormFieldLabel } from "./formFieldLabel";
import { getFieldName, IFormFieldProps } from "./formFieldProps";
import { FieldOptionsData, WithLabelFieldData } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormFieldDescription } from "./formFieldDescription";
import { FormFieldErrorMessage } from "./formFieldErrorMessage";

export const SelectField: <T extends FieldValues>(
  p: IFormFieldProps<T, WithLabelFieldData & FieldOptionsData>
) => React.ReactElement<
  IFormFieldProps<T, WithLabelFieldData & FieldOptionsData>
> = (props) => (
  <FormField
    control={props.control}
    name={getFieldName(props)}
    render={({ field }) => (
      <FormItem>
        <FormFieldLabel label={props.data.label} required={props.required} />
        <FormControl>
          <Select
            onValueChange={(e) => {
              field.onChange(e);
              field.onBlur();
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Please select the option" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {/* @ts-ignore-error Clear value */}
              <SelectItem value={null}>Not selected</SelectItem>
              {props.data.options.map(({ option }) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        <FormFieldDescription description={props.data?.description} />
        <FormFieldErrorMessage />
      </FormItem>
    )}
  />
);
