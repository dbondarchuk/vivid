import { z } from "zod";

const ConditionalContainerPropsSchema = z.object({
  props: z
    .object({
      condition: z.string().min(1),
      then: z.object({
        childrenIds: z.array(z.string()).optional().nullable(),
      }),
      otherwise: z.object({
        childrenIds: z.array(z.string()).optional().nullable(),
      }),
    })
    .optional()
    .nullable(),
});

export default ConditionalContainerPropsSchema;

export type ConditionalContainerProps = z.infer<
  typeof ConditionalContainerPropsSchema
>;
