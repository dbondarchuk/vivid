import { z } from "zod";

import { WithDatabaseId } from "../database";
import {
  asOptionalField,
  zOptionalOrMinLengthString,
  zUniqueArray,
} from "../utils";
import { fieldTypes } from "./fields";

const fieldTypeEnum = z.enum(fieldTypes, {
  message: "fields.type.invalid",
});

export const defaultFieldDataSchema = z.object({
  label: z.string().min(1, "fields.label.required"),
  // description: z.array(z.any()),
  description: zOptionalOrMinLengthString(3, "fields.description.min"),
});

export const selectFieldDataSchema = defaultFieldDataSchema.merge(
  z.object({
    options: zUniqueArray(
      z.array(
        z.object({
          option: z.string().min(1, "fields.option.required"),
        })
      ),
      (item) => item.option,
      "fields.option.unique"
    ),
  })
);

export const fileFieldAcceptItemSchema = z
  .string()
  .min(1, "fields.accept.min")
  .regex(
    /(\.[a-zA-Z0-9]+$)|(^(image|video|audio)\/\*$)|(^[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_\.]+$)/,
    "fields.accept.invalid"
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
        .min(1, "fields.maxSizeMb.min")
        .max(100, "fields.maxSizeMb.max")
    ),
  })
);

export const baseFieldSchema = z.object({
  name: z
    .string()
    .min(2, "fields.name.required")
    .refine((s) => /^[a-z_][a-z0-9_]+$/i.test(s), "fields.name.invalid"),
  required: z.boolean().optional(),
});

export const fieldSchema = z.discriminatedUnion("type", [
  baseFieldSchema.merge(
    z.object({
      type: fieldTypeEnum.extract(["select"]),
      data: selectFieldDataSchema,
    })
  ),
  baseFieldSchema.merge(
    z.object({
      type: fieldTypeEnum.extract(["file"]),
      data: fileFieldDataSchema,
    })
  ),
  baseFieldSchema.merge(
    z.object({
      type: fieldTypeEnum.exclude(["select", "file"]),
      data: defaultFieldDataSchema,
    })
  ),
]);

export const getFieldSchemaWithUniqueCheck = (
  uniqueNameCheckFn: (name: string) => Promise<boolean>,
  message: string
) => {
  return fieldSchema.superRefine(async (args, ctx) => {
    const isUnique = await uniqueNameCheckFn(args.name);
    if (!isUnique) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message,
      });
    }
  });
};

export type FieldSchema = z.infer<typeof fieldSchema>;

export const fieldsSchema = z.array(fieldSchema).optional();
export type FieldsSchema = z.infer<typeof fieldsSchema>;

export type ServiceFieldUpdateModel = FieldSchema;
export type ServiceField = WithDatabaseId<ServiceFieldUpdateModel> & {
  updatedAt: Date;
};
