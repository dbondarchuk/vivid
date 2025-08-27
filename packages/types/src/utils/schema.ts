import { z } from "zod";

export const zEmail = z.string().email("common.email.invalid");
export const zPhone = z
  .string()
  .min(1, "common.phone.required")
  .refine((s) => !s?.includes("_"), "common.phone.invalid");

export function zUniqueArray<
  ArrSchema extends z.ZodArray<z.ZodTypeAny, "many">,
  UniqueVal,
>(
  schema: ArrSchema,
  uniqueBy: (item: z.infer<ArrSchema>[number]) => UniqueVal,
  errorMessage?: string,
) {
  return schema.superRefine((items, ctx) => {
    const seen = new Set<UniqueVal>();
    for (let index = 0; index < items.length; index++) {
      const item = items[index];

      const val = uniqueBy(item);
      if (seen.has(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: errorMessage || `Unique property validation failed`,
          path: [index],
        });
      } else {
        seen.add(val);
      }
    }
  }) as unknown as ArrSchema;
}

export function isPlainObject(
  value: unknown,
): value is Record<string | number | symbol, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

export function zStrictRecord<
  K extends z.ZodType<string | number | symbol>,
  V extends z.ZodTypeAny,
>(zKey: K, zValue: V) {
  return z.custom<Record<z.infer<K>, z.infer<V>>>((input: unknown) => {
    return (
      isPlainObject(input) &&
      Object.entries(input).every(
        ([key, value]) =>
          zKey.safeParse(key).success && zValue.safeParse(value).success,
      )
    );
  }, "zodStrictRecord: error");
}

export function zOptionalOrMinLengthString(
  minLength: number,
  minLengthErrorMessage?: string,
) {
  return z
    .union([
      z.string().min(minLength, { message: minLengthErrorMessage }),
      z.string().length(0),
    ])
    .optional()
    .transform((e) => (e === "" ? undefined : e));
}

const emptyStringToUndefined = z.literal("").transform(() => undefined);

export function asOptionalField<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional().or(emptyStringToUndefined);
}

export function asOptinalNumberField<T extends z.ZodNumber>(schema: T) {
  return z.preprocess(
    (arg) => (arg === "" ? undefined : arg),
    schema.optional(),
  ) as unknown as z.ZodOptional<T>;
}
