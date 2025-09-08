import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  cn,
} from "@vivid/ui";
import { memo } from "react";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { CarouselProps, styles } from "./schema";

const CarouselItemWrapper = memo(
  ({ children }: { children: React.ReactNode }) => (
    <CarouselItem className="carousel-item">{children}</CarouselItem>
  ),
);
const CarouselItemsWrapper = memo(
  ({
    children,
    className,
    style,
    id,
    ref,
  }: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
    ref?: React.Ref<HTMLDivElement>;
  }) => (
    <Carousel className={className} style={style} id={id} ref={ref}>
      <CarouselContent className="relative">{children}</CarouselContent>
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  ),
);

export const CarouselEditor = ({ style, props }: CarouselProps) => {
  const currentBlock = useCurrentBlock<CarouselProps>();

  const className = useClassName();
  const base = currentBlock.base;

  // const newStyle: CarouselProps["style"] = {
  //   ...currentBlock.data?.style,
  //   display: [{ value: "flex" }],
  //   flexDirection: [{ value: "row" }],
  //   flexWrap: [{ value: "wrap" }],
  // };

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={currentBlock.data?.style}
      />
      <EditorChildren
        blockId={currentBlock.id}
        className={cn(
          "items-center",
          currentBlock.data?.props?.orientation === "vertical" && "flex-col",
          className,
          base?.className,
        )}
        id={base?.id}
        property="props"
        childWrapper={CarouselItemWrapper}
        childrenWrapper={CarouselItemsWrapper}
      />
    </>
  );
};
