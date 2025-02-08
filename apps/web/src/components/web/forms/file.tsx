import { FormControl, FormField, FormItem, Input } from "@vivid/ui";

import { FieldFileData, WithLabelFieldData } from "@vivid/types";
import { FieldValues } from "react-hook-form";
import { FormFieldDescription } from "./formFieldDescription";
import { FormFieldErrorMessage } from "./formFieldErrorMessage";
import { FormFieldLabel } from "./formFieldLabel";
import { getFieldName, IFormFieldProps } from "./formFieldProps";

export const FileField: <T extends FieldValues>(
  p: IFormFieldProps<T, WithLabelFieldData & FieldFileData>
) => React.ReactElement<
  IFormFieldProps<T, WithLabelFieldData & FieldFileData>
> = (props) => {
  return (
    <FormField
      control={props.control}
      name={getFieldName(props)}
      render={({ field: { value, ...field } }) => (
        <FormItem>
          <FormFieldLabel label={props.data.label} required={props.required} />
          <FormControl>
            <Input
              {...field}
              placeholder="Please select file"
              type="file"
              accept={props.data.accept?.join(",")}
              onChange={(event) => {
                field.onChange(event.target?.files?.[0]);
                field.onBlur();
              }}
            />
          </FormControl>
          <FormFieldDescription description={props.data?.description} />
          <FormFieldErrorMessage />
        </FormItem>
      )}
    />
  );
};
