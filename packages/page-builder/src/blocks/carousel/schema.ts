import { BaseReaderBlockProps, generateId } from "@vivid/builder";
import { z } from "zod";
import { ALL_STYLES, getStylesSchema } from "../../style";

export const styles = ALL_STYLES;
export const zStyles = getStylesSchema(styles);

export const itemPositions = ["start", "center", "end", "stretch"] as const;

export const CarouselPropsSchema = z.object({
  style: zStyles,
  props: z.object({
    items: z.number().positive().min(1),
    itemsSm: z.number().positive().min(1).optional().nullable(),
    itemsMd: z.number().positive().min(1).optional().nullable(),
    itemsLg: z.number().positive().min(1).optional().nullable(),
    itemsXl: z.number().positive().min(1).optional().nullable(),
    items2Xl: z.number().positive().min(1).optional().nullable(),
    itemPosition: z.enum(itemPositions),
    loop: z.coerce.boolean().optional().nullable(),
    autoPlay: z.number().positive().min(1).max(30).optional().nullable(),
    children: z.array(z.any()),
  }),
});

export type CarouselProps = z.infer<typeof CarouselPropsSchema>;
export type CarouselReaderProps = BaseReaderBlockProps<any> & CarouselProps;

export const CarouselPropsDefaults = {
  style: {
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
    items: 1,
    itemsSm: 1,
    itemsMd: 2,
    itemsLg: 3,
    itemsXl: 4,
    items2Xl: 5,
    itemPosition: "center",
    children: [
      {
        type: "Image",
        id: generateId(),
        data: {
          props: {
            src: "/assets/placeholder/200x200.jpg",
            alt: "Placeholder",
          },
        },
      },
      {
        type: "Image",
        id: generateId(),
        data: {
          props: {
            src: "/assets/placeholder/200x200.jpg",
            alt: "Placeholder",
          },
        },
      },
    ],
  },
} as const satisfies CarouselProps;
