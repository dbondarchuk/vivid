import { FieldData } from "@/models/fields";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export type IFormFieldProps<
  T extends FieldValues,
  TData extends Record<string, any> = any,
> = FieldData<TData> & {
  control: Control<T, any>;
  name: FieldPath<T>;
};

export type WithLabelFieldData = {
  label: string;
};
