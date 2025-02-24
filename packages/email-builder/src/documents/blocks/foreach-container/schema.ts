import { z } from "zod";
import { BaseReaderBlockProps } from "../../reader/core";

const ForeachContainerPropsSchema = z.object({
  props: z
    .object({
      value: z.string().min(1),
      childrenIds: z.array(z.string()).optional().nullable(),
    })
    .optional()
    .nullable(),
});

export default ForeachContainerPropsSchema;

export type ForeachContainerProps = z.infer<typeof ForeachContainerPropsSchema>;
export type ForeachContainerReaderProps = BaseReaderBlockProps &
  ForeachContainerProps;
