import { BaseReaderBlockProps, generateId } from "@vivid/builder";
import { z } from "zod";
import { getAllStylesWithAdditionalStyles, getStylesSchema } from "../../style";
import { carouselChildrenAlignStyle } from "./carousel-children-align";
import { carouselChildrenItemsPerSlideStyle } from "./carousel-children-items-per-slide";

export const styles = getAllStylesWithAdditionalStyles({
  carouselChildrenItemsPerSlide: carouselChildrenItemsPerSlideStyle,
  carouselChildrenAlign: carouselChildrenAlignStyle,
});

export const zStyles = getStylesSchema(styles);
export type CarouselStylesSchema = {
  [key in keyof typeof styles]: (typeof styles)[key]["schema"];
};

export const CarouselPropsSchema = z.object({
  style: zStyles,
  props: z.object({
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
    justifyItems: [
      {
        value: "center",
      },
    ],
    carouselChildrenItemsPerSlide: [
      {
        value: 1,
        breakpoint: [],
      },
      {
        value: 2,
        breakpoint: ["md"],
      },
      {
        value: 3,
        breakpoint: ["lg"],
      },
      {
        value: 4,
        breakpoint: ["xl"],
      },
    ],
  },
  props: {
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
