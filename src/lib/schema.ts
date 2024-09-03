import { z } from "zod";

export function zUniqueArray<
  ArrSchema extends z.ZodArray<z.ZodTypeAny, "many">,
  UniqueVal
>(
  schema: ArrSchema,
  uniqueBy: (item: z.infer<ArrSchema>[number]) => UniqueVal,
  errorMessage?: string
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
  });
}
