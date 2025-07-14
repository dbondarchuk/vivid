import { Prettify } from "@vivid/types";
import z from "zod";
import { zStyles } from "./styles";

export const HeadingPropsSchema = z.object({
  props: z
    .object({
      text: z.string().optional().nullable(),
      level: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).optional().nullable(),
    })
    .optional()
    .nullable(),
  style: zStyles,
});

export type HeadingProps = Prettify<z.infer<typeof HeadingPropsSchema>>;

export const HeadingPropsDefaults = {
  props: {
    level: "h2",
    text: "Hello friend",
  },
  style: {
    padding: [
      {
        value: {
          top: {
            value: 1,
            unit: "rem",
          },
          bottom: {
            value: 1,
            unit: "rem",
          },
          left: {
            value: 1.5,
            unit: "rem",
          },
          right: {
            value: 1.5,
            unit: "rem",
          },
        },
      },
    ],
    textAlign: [
      {
        value: "center",
      },
    ],
    fontWeight: [
      {
        value: "bold",
      },
    ],
    fontFamily: [
      {
        value: "SECONDARY",
      },
    ],
  },
} as const satisfies HeadingProps;
