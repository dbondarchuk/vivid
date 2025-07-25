import { BaseReaderBlockProps } from "@vivid/builder";
import { z } from "zod";
import { ALL_STYLES, getStylesSchema } from "../../style";

export const styles = ALL_STYLES;
export const zStyles = getStylesSchema(styles);

export const SimpleContainerPropsSchema = z.object({
  style: zStyles,
  props: z.object({
    children: z.array(z.any()),
  }),
});

export type SimpleContainerProps = z.infer<typeof SimpleContainerPropsSchema>;
export type SimpleContainerReaderProps = BaseReaderBlockProps<any> &
  SimpleContainerProps;

export const SimpleContainerPropsDefaults = {
  style: {
    padding: [
      {
        value: {
          top: { value: 0, unit: "rem" },
          bottom: { value: 0, unit: "rem" },
          left: { value: 0, unit: "rem" },
          right: { value: 0, unit: "rem" },
        },
      },
    ],
    display: [
      {
        value: "inline-flex",
      },
    ],
    flexDirection: [
      {
        value: "row",
      },
    ],
    alignItems: [
      {
        value: "center",
      },
    ],
    justifyContent: [
      {
        value: "center",
      },
    ],
    gap: [
      {
        value: {
          value: 0.5,
          unit: "rem",
        },
      },
    ],
  },
  props: {
    children: [],
  },
} as const satisfies SimpleContainerProps;
