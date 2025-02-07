import { z } from "zod";

import { FieldType } from "../../booking";
import {
  asOptionalField,
  zOptionalOrMinLengthString,
  zUniqueArray,
} from "../../utils";

const [firstFieldType, ...restFieldTypes] = Object.values(FieldType);
const fieldTypeEnum = z.enum([firstFieldType, ...restFieldTypes], {
  required_error: "Unknown field type",
});

export const defaultFieldDataSchema = z.object({
  label: z.string().min(1, "Field label is required"),
  description: zOptionalOrMinLengthString(
    3,
    "Field description should be at least 3 characters long"
  ),
});

export const selectFieldDataSchema = defaultFieldDataSchema.merge(
  z.object({
    options: zUniqueArray(
      z.array(
        z.object({
          option: z.string().min(1, "Option value is required"),
        })
      ),
      (item) => item.option,
      "All options should be unique"
    ),
  })
);

export const fileFieldAcceptItemSchema = z
  .string()
  .min(1, "Accept item should be at least one character")
  .regex(
    /(\.[a-zA-Z0-9]+$)|(^(image|video|audio)\/\*$)|(^[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_\.]+$)/,
    "Invalid accept type"
  );

export const fileFieldDataSchema = defaultFieldDataSchema.merge(
  z.object({
    accept: zUniqueArray(
      z.array(fileFieldAcceptItemSchema),
      (x) => x
    ).optional(),
    maxSizeMb: asOptionalField(
      z.coerce
        .number()
        .min(1, "Value should be at least 1")
        .max(100, "Max size allowed is 100mb")
    ),
  })
);

export const baseFieldSchema = z.object({
  name: z
    .string()
    .min(2, "Field name must me at least 2 characters long")
    .refine(
      (s) => /^[a-z_][a-z0-9_]+$/i.test(s),
      "Field name must start with letter and contain only letters, digits, and underscore (_)"
    ),
  id: z.string(),
  required: z.boolean().optional(),
});

export const fieldSchema = z.discriminatedUnion("type", [
  baseFieldSchema.merge(
    z.object({
      type: fieldTypeEnum.extract([FieldType.Select]),
      data: selectFieldDataSchema,
    })
  ),
  baseFieldSchema.merge(
    z.object({
      type: fieldTypeEnum.extract([FieldType.File]),
      data: fileFieldDataSchema,
    })
  ),
  baseFieldSchema.merge(
    z.object({
      type: fieldTypeEnum.exclude([FieldType.Select, FieldType.File]),
      data: defaultFieldDataSchema,
    })
  ),
]);

export type FieldSchema = z.infer<typeof fieldSchema>;

export const fieldsSchema = z.array(fieldSchema).optional();
export type FieldsSchema = z.infer<typeof fieldsSchema>;
