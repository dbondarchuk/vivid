import { BaseReaderBlockProps } from "@vivid/builder";
import { Prettify } from "@vivid/types";
import z from "zod";
import { COLORS } from "../../style";
import { zStyles } from "./styles";

export const ButtonPropsSchema = z.object({
  props: z
    .object({
      text: z
        .string({
          message: "pageBuilder.blocks.button.errors.text",
        })
        .min(1, "pageBuilder.blocks.button.errors.text"),
      url: z.string().optional().nullable(),
      target: z.enum(["_self", "_blank"]).optional().nullable(),
    })
    .optional()
    .nullable(),
  style: zStyles,
});

export type ButtonProps = Prettify<z.infer<typeof ButtonPropsSchema>>;
export type ButtonReaderProps = BaseReaderBlockProps<any> & ButtonProps;

export const ButtonPropsDefaults = {
  props: {
    text: "Button",
    url: "https://vividnail.studio",
    target: "_self",
  },
  style: {
    color: [
      {
        value: COLORS["primary-foreground"].value,
      },
    ],
    padding: [
      {
        value: {
          top: { value: 0.75, unit: "rem" },
          right: { value: 1.5, unit: "rem" },
          bottom: { value: 0.75, unit: "rem" },
          left: { value: 1.5, unit: "rem" },
        },
      },
    ],
    backgroundColor: [
      {
        value: COLORS["primary"].value,
      },
    ],
    filter: [
      {
        value: "brightness(1.1)",
        state: ["hover", "focus", "active"],
      },
    ],
    transition: [
      {
        value: "filter 0.2s ease",
      },
    ],
    fontSize: [
      {
        value: {
          value: 1,
          unit: "rem",
        },
      },
    ],
    fontWeight: [
      {
        value: "normal",
      },
    ],
    textAlign: [
      {
        value: "center",
      },
    ],
    width: [
      {
        value: "auto",
      },
    ],
  },
} as const satisfies ButtonProps;
