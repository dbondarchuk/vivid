import { WithId } from "../general";

export enum FieldType {
  Name = "name",
  Email = "email",
  Phone = "phone",
  OneLine = "oneLine",
  MultiLine = "multiLine",
  Checkbox = "checkbox",
  Select = "select",
}

export type WithLabelFieldData = {
  label: string;
  description?: string;
};

export type FieldData<
  TData extends Record<string, any> | undefined = undefined
> = {
  name: string;
  required?: boolean;
} & (TData extends undefined ? { data?: never } : { data: TData });

export type Field<TData extends Record<string, any> | undefined = undefined> =
  FieldData<TData> & {
    type: FieldType;
  };

export type Fields<TData extends Record<string, any> | undefined = undefined> =
  Field<TData>[];

export type FieldsWithId<
  TData extends Record<string, any> | undefined = undefined
> = WithId<Field<TData>>[];

export type FieldOptionsData = {
  options: {
    option: string;
  }[];
};

export const getFields = (
  fields: Fields<WithLabelFieldData>,
  defaultFieldLabels = false
): Fields<any> => {
  return [
    {
      name: "name",
      required: true,
      type: FieldType.Name,
      data: defaultFieldLabels
        ? {
            label: "Name",
          }
        : undefined,
    },
    {
      name: "email",
      required: true,
      type: FieldType.Email,
      data: defaultFieldLabels
        ? {
            label: "Email",
          }
        : undefined,
    },
    ...fields,
  ];
};
