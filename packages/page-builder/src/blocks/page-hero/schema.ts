import { BaseReaderBlockProps, generateId } from "@vivid/builder";
import z from "zod";
import { COLORS } from "../../style";
import { ButtonPropsDefaults } from "../button";
import { zStyles } from "./styles";

export const PageHeroPropsSchema = z.object({
  style: zStyles,
  props: z.object({
    title: z.object({
      children: z.array(z.any()).max(1),
    }),
    subtitle: z.object({
      children: z.array(z.any()).max(1),
    }),
    buttons: z.object({
      children: z.array(z.any()).max(1),
    }),
  }),
});

export type PageHeroProps = z.infer<typeof PageHeroPropsSchema>;
export type PageHeroReaderProps = BaseReaderBlockProps<any> & PageHeroProps;

export const PageHeroPropsDefaults = {
  style: {
    padding: [
      {
        value: {
          top: { value: 6, unit: "vw" },
          right: { value: 6, unit: "vw" },
          bottom: { value: 6, unit: "vw" },
          left: { value: 6, unit: "vw" },
        },
      },
    ],
    backgroundColor: [
      {
        value: COLORS["background"].value,
      },
    ],
    backgroundImage: [
      {
        value: {
          type: "url",
          value: "/assets/placeholder/1280x720.jpg",
        },
      },
    ],
    backgroundSize: [
      {
        value: "cover",
      },
    ],
    backgroundRepeat: [
      {
        value: "no-repeat",
      },
    ],
    backgroundColorOpacity: [
      {
        value: 50,
      },
    ],
    backgroundPosition: [
      {
        value: "center",
      },
    ],
    backgroundBlendMode: [
      {
        value: "overlay",
      },
    ],
    // borderRadius: [
    //   {
    //     value: { value: 0.5, unit: "rem" },
    //   },
    // ],
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
    textAlign: [
      {
        value: "center",
      },
    ],
    gap: [
      {
        value: {
          value: 2.5,
          unit: "rem",
        },
      },
    ],
  },
  props: {
    title: {
      children: [
        {
          type: "Heading",
          data: {
            props: {
              level: "h1",
              text: "Hello friend",
            },
            style: {
              fontFamily: [
                {
                  value: "SECONDARY",
                },
              ],
              fontSize: [
                {
                  value: { value: 2.8, unit: "rem" },
                },
              ],
            },
          },
          id: generateId(),
        },
      ],
    },
    subtitle: {
      children: [
        {
          type: "Heading",
          data: {
            props: {
              level: "h2",
              text: "Welcome to the page",
            },
            style: {
              fontFamily: [
                {
                  value: "PRIMARY",
                },
              ],
              fontSize: [
                {
                  value: { value: 1.8, unit: "rem" },
                },
              ],
            },
          },
          id: generateId(),
        },
      ],
    },
    buttons: {
      children: [
        {
          type: "Container",
          data: {
            props: {
              children: [
                {
                  type: "Button",
                  data: {
                    props: {
                      text: "Click me",
                      url: "/book",
                    },
                    style: ButtonPropsDefaults.style,
                  },
                  id: generateId(),
                },
              ],
            },
            style: {
              display: [
                {
                  value: "flex",
                },
              ],
              flexDirection: [
                {
                  value: "column",
                },
                {
                  value: "row",
                  breakpoint: ["sm"],
                },
              ],
              justifyContent: [
                {
                  value: "center",
                },
              ],
              alignItems: [
                {
                  value: "center",
                },
              ],
              gap: [
                {
                  value: {
                    value: 1,
                    unit: "rem",
                  },
                },
              ],
            },
            id: generateId(),
          },
          id: generateId(),
        },
      ],
    },
  },
} as const satisfies PageHeroProps;
