import { FormControl, FormField, FormMessage } from "@/components/ui/form";

import { FieldValues } from "react-hook-form";
import { FormFieldLabel } from "./formFieldLabel";
import { getFieldName, IFormFieldProps } from "./formFieldProps";
import { WithLabelFieldData } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { FormFieldDescription } from "./formFieldDescription";

export const CheckboxField: <T extends FieldValues>(
  p: IFormFieldProps<T, WithLabelFieldData>
) => React.ReactElement<IFormFieldProps<T, WithLabelFieldData>> = (props) => (
  <FormField
    control={props.control}
    name={getFieldName(props)}
    render={({ field }) => (
      <div className="flex flex-row items-center gap-3 mt-5">
        <div>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={(e) => {
                field.onChange(e);
                field.onBlur();
              }}
            />
          </FormControl>
        </div>
        <div className="flex flex-col gap-1 leading-none">
          <FormFieldLabel
            label={props.data.label}
            required={props.required}
            className="mt-0"
          />
          <FormFieldDescription description={props.data?.description} />
          <FormMessage />
        </div>
      </div>
    )}
  />
);
