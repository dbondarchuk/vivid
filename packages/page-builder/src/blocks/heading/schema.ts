import { BaseReaderBlockProps, generateId } from "@vivid/builder";
import { Prettify } from "@vivid/types";
import z from "zod";
import { InlineContainerPropsDefaults } from "../inline-container";
import { zStyles } from "./styles";

export const HeadingPropsSchema = z.object({
  props: z
    .object({
      children: z.array(z.any()).length(1),
      level: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).optional().nullable(),
    })
    .optional()
    .nullable(),
  style: zStyles,
});

export type HeadingProps = Prettify<z.infer<typeof HeadingPropsSchema>>;
export type HeadingReaderProps = BaseReaderBlockProps<any> & HeadingProps;

export const DefaultHeadingLevel = "h2";

export const HeadingPropsDefaults = () =>
  ({
    props: {
      level: DefaultHeadingLevel,
      children: [
        {
          type: "SimpleContainer",
          id: generateId(),
          data: {
            style: InlineContainerPropsDefaults.style,
            props: {
              children: [
                {
                  type: "SimpleText",
                  id: generateId(),
                  data: {
                    props: {
                      text: "Hello friend",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
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
  }) as const satisfies HeadingProps;
