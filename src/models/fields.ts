export enum FieldType {
  Name = "name",
  Email = "email",
  Phone = "phone",
  OneLine = "oneLine",
  MultiLine = "multiLine",
}

export type FieldData<
  TData extends Record<string, any> | undefined = undefined,
> = {
  name: string;
  required: boolean;
} & (TData extends undefined ? { data?: never } : { data: TData });

export type Field<TData extends Record<string, any> | undefined = undefined> =
  FieldData<TData> & {
    type: FieldType;
  };

export type Fields<TData extends Record<string, any> | undefined = undefined> =
  Field<TData>[];
