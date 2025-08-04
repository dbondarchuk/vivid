import { BaseReaderBlockProps } from "@vivid/builder";
import { Prettify } from "@vivid/types";
import z from "zod";
import { zStyles } from "./styles";

export const SimpleTextPropsSchema = z.object({
  props: z
    .object({
      text: z.string().optional().nullable(),
      // url: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  style: zStyles,
});

export type SimpleTextProps = Prettify<z.infer<typeof SimpleTextPropsSchema>>;
export type SimpleTextReaderProps = BaseReaderBlockProps<any> & SimpleTextProps;

export const SimpleTextPropsDefaults = {
  props: {
    text: "Hello friend",
  },
  style: {
    textAlign: [
      {
        value: "left",
      },
    ],
    fontFamily: [
      {
        value: "PRIMARY",
      },
    ],
  },
} as const satisfies SimpleTextProps;
