import { BaseReaderBlockProps, generateId } from "@vivid/builder";
import z from "zod";
import { AccordionItemPropsDefaults } from "../accordion-item/schema";
import { zStyles } from "./styles";

export const AccordionPropsSchema = z.object({
  style: zStyles,
  props: z.object({
    allowMultipleOpen: z.boolean().optional().nullable(),
    defaultOpenFirst: z.boolean().optional().nullable(),
    animation: z.enum(["slide", "fade", "none"]).optional().nullable(),
    iconPosition: z.enum(["left", "right"]).optional().nullable(),
    iconStyle: z.enum(["plus", "arrow", "chevron"]).optional().nullable(),
    children: z.array(z.any()),
  }),
});

export type AccordionProps = z.infer<typeof AccordionPropsSchema>;
export type AccordionReaderProps = BaseReaderBlockProps<any> & AccordionProps;

export const AccordionPropsDefaults = {
  props: {
    allowMultipleOpen: false,
    defaultOpenFirst: false,
    animation: "slide" as const,
    iconPosition: "right" as const,
    iconStyle: "chevron" as const,
    children: [
      {
        type: "AccordionItem",
        data: AccordionItemPropsDefaults(),
        id: generateId(),
      },
    ],
  },
  style: {
    textAlign: [
      {
        value: "left",
      },
    ],
    width: [
      {
        value: {
          value: 100,
          unit: "%",
        },
      },
    ],
    margin: [
      {
        value: {
          left: {
            value: 0,
            unit: "px",
          },
          right: {
            value: 0,
            unit: "px",
          },
          top: {
            value: 0,
            unit: "px",
          },
          bottom: {
            value: 0,
            unit: "px",
          },
        },
      },
    ],
    padding: [
      {
        value: {
          left: {
            value: 0,
            unit: "px",
          },
          right: {
            value: 0,
            unit: "px",
          },
          top: {
            value: 0,
            unit: "px",
          },
          bottom: {
            value: 0,
            unit: "px",
          },
        },
      },
    ],
    display: [
      {
        value: "flex",
      },
    ],
    flexDirection: [
      {
        value: "column",
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
} as const satisfies AccordionProps;
