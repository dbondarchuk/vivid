import { BaseReaderBlockProps } from "@vivid/builder";
import { z } from "zod";
import { zColorNullable, zStylesBase } from "../../style-inputs/helpers/zod";

export const ContainerPropsSchema = z.object({
  style: zStylesBase
    .pick({ backgroundColor: true, padding: true })
    .merge(
      z.object({
        borderColor: zColorNullable,
        borderRadius: z.coerce
          .number()
          .int("Should be the integer value")
          .optional()
          .nullable(),
      })
    )
    .optional()
    .nullable(),
  props: z.object({
    children: z.array(z.any()),
  }),
});

export type ContainerProps = z.infer<typeof ContainerPropsSchema>;
export type ContainerReaderProps = BaseReaderBlockProps<any> & ContainerProps;

export const ContainerPropsDefaults = {
  style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
  props: {
    children: [],
  },
} satisfies ContainerProps;
