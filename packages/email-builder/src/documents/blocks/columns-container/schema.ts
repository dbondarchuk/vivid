import { z } from "zod";

import { ColumnsContainerPropsSchema as BaseColumnsContainerPropsSchema } from "@usewaypoint/block-columns-container";
import { BaseReaderBlockProps } from "../../reader/core";

const BasePropsShape = BaseColumnsContainerPropsSchema.shape.props
  .unwrap()
  .unwrap().shape;

const ColumnsContainerPropsSchema = z.object({
  style: BaseColumnsContainerPropsSchema.shape.style,
  props: z
    .object({
      ...BasePropsShape,
      columns: z.tuple([
        z.object({ childrenIds: z.array(z.string()) }),
        z.object({ childrenIds: z.array(z.string()) }),
        z.object({ childrenIds: z.array(z.string()) }),
      ]),
    })
    .optional()
    .nullable(),
});

export type ColumnsContainerProps = z.infer<typeof ColumnsContainerPropsSchema>;
export type ColumnsContainerReaderProps = ColumnsContainerProps &
  BaseReaderBlockProps;
export default ColumnsContainerPropsSchema;
