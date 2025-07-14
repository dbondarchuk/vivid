import { StyleValue } from "../../style/css-renderer";
import {
  AllStylesSchemas,
  justifyItemsStyle,
  textAlignStyle,
} from "../../style/styles";
import { Breakpoint } from "../../style/zod";
import { CarouselProps } from "./schema";

const justifyItemsToTextAlignMap: Record<
  typeof justifyItemsStyle.schema._output,
  typeof textAlignStyle.schema._output
> = {
  center: "center",
  start: "left",
  end: "right",
  stretch: "justify",
};

export const getCarouselItemStyles = (props: CarouselProps["props"]) => {
  const { items, itemsSm, itemsMd, itemsLg, itemsXl, items2Xl, itemPosition } =
    props;

  return {
    justifyItems: [
      {
        value: itemPosition,
      },
    ],
    textAlign: [
      {
        value: justifyItemsToTextAlignMap[itemPosition],
      },
    ],
    flexBasis: [
      {
        value: parseFloat((100 / items).toFixed(2)),
      },
      ...(itemsSm
        ? [
            {
              value: parseFloat((100 / itemsSm).toFixed(5)),
              breakpoint: ["sm" as Breakpoint],
            },
          ]
        : []),
      ...(itemsMd
        ? [
            {
              value: parseFloat((100 / itemsMd).toFixed(5)),
              breakpoint: ["md" as Breakpoint],
            },
          ]
        : []),
      ...(itemsLg
        ? [
            {
              value: parseFloat((100 / itemsLg).toFixed(5)),
              breakpoint: ["lg" as Breakpoint],
            },
          ]
        : []),
      ...(itemsXl
        ? [
            {
              value: parseFloat((100 / itemsXl).toFixed(5)),
              breakpoint: ["xl" as Breakpoint],
            },
          ]
        : []),
      ...(items2Xl
        ? [
            {
              value: parseFloat((100 / items2Xl).toFixed(5)),
              breakpoint: ["2xl" as Breakpoint],
            },
          ]
        : []),
    ],
  } satisfies StyleValue<AllStylesSchemas>;
};
