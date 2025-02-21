import { z } from "zod";

import { TextPropsSchema as BaseTextPropsSchema } from "@usewaypoint/block-text";

const TextPropsSchema = z.object({
  style: BaseTextPropsSchema.shape.style,
  props: z
    .object({
      value: z.any().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export default TextPropsSchema;

export type TextProps = z.infer<typeof TextPropsSchema>;
