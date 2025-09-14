import {
  EditorChildren,
  useBlockEditor,
  useCurrentBlock,
} from "@vivid/builder";
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

export const CarouselEditor = ({ style, props }: CarouselProps) => {
  const currentBlock = useCurrentBlock<CarouselProps>();
  const overlayProps = useBlockEditor(currentBlock.id);

  const className = useClassName();
  const base = currentBlock.base;

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={currentBlock.data?.style}
      />
      <Carousel
        id={base?.id}
        opts={{
          loop: !!currentBlock.data?.props.loop,
          align: "start",
        }}
        orientation={currentBlock.data?.props.orientation ?? undefined}
        {...overlayProps}
      >
        <CarouselContent className={cn("relative", className, base?.className)}>
          <EditorChildren
            blockId={currentBlock.id}
            property="props"
            childWrapper={CarouselItemWrapper}
          />
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </>
  );
};
