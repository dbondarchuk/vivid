import { BaseReaderBlockProps, generateId } from "@vivid/builder";
import { Prettify } from "@vivid/types";
import z from "zod";
import { COLORS } from "../../style";
import { SimpleContainerPropsDefaults } from "../simple-container";
import { zStyles } from "./styles";

export const LinkPropsSchema = z.object({
  props: z
    .object({
      children: z.array(z.any()).length(1),
      url: z.string().optional().nullable(),
      target: z.enum(["_self", "_blank"]).optional().nullable(),
    })
    .optional()
    .nullable(),
  style: zStyles,
});

export type LinkProps = Prettify<z.infer<typeof LinkPropsSchema>>;
export type LinkReaderProps = BaseReaderBlockProps<any> & LinkProps;

export const LinkDefaultUrl = "/";
export const LinkDefaultTarget = "_self";

export const LinkPropsDefaults = () =>
  ({
    props: {
      url: LinkDefaultUrl,
      target: LinkDefaultTarget,
      children: [
        {
          type: "SimpleContainer",
          id: generateId(),
          data: {
            style: {
              ...SimpleContainerPropsDefaults.style,
              textDecoration: [
                {
                  value: "underline",
                },
              ],
            },
            props: {
              children: [
                {
                  type: "SimpleText",
                  id: generateId(),
                  data: {
                    props: {
                      text: "Link",
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
      color: [
        {
          value: COLORS["primary"].value,
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
          value: "left",
        },
      ],
      width: [
        {
          value: "max-content",
        },
      ],
      display: [
        {
          value: "inline",
        },
      ],
      transition: [
        {
          value: "color 0.2s ease",
        },
      ],
      //   filter: [
      //     {
      //       value: "brightness(0.9)",
      //       state: ["hover", "focus"],
      //     },
      //   ],
    },
  }) as const satisfies LinkProps;
