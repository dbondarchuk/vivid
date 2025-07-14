import z from "zod";
import { zStyles } from "./styles";

export const SpacerPropsSchema = z.object({
  style: zStyles.optional().nullable(),
  props: z.object({}).optional().nullable(),
});

export type SpacerProps = z.infer<typeof SpacerPropsSchema>;

export const SpacerPropsDefaults = {
  props: {
    height: {
      value: 1,
      unit: "rem",
    },
    display: "block",
  },
} satisfies SpacerProps;
