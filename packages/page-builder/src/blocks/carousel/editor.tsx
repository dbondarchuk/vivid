import {
  EditorChildren,
  useCurrentBlock,
  useDispatchAction,
  useSetSelectedBlockId,
} from "@vivid/builder";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@vivid/ui";
import React, { useCallback } from "react";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { CarouselProps, styles } from "./schema";
import { getCarouselItemStyles } from "./styles";

export const CarouselEditor = ({ style, props }: CarouselProps) => {
  const currentBlock = useCurrentBlock<CarouselProps>();
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const children = currentBlock.data?.props?.children;
  const className = generateClassName();

  const carouselItemStyles = getCarouselItemStyles(currentBlock.data.props);
  const childWrapper = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <CarouselItem className="carousel-item">{children}</CarouselItem>
    ),
    []
  );

  const childrenWrapper = useCallback(
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
    []
  );

  const newStyle: typeof style = {
    ...style,
    display: [{ value: "flex" }],
    flexDirection: [{ value: "row" }],
    flexWrap: [{ value: "wrap" }],
  };

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={newStyle}
      />
      {/* <BlockStyle
        name={`${className} .carousel-item`}
        styleDefinitions={styles}
        styles={carouselItemStyles}
      /> */}
      <EditorChildren
        block={currentBlock}
        className={className}
        property="props"
        children={children || []}
        // childWrapper={childWrapper}
        // childrenWrapper={childrenWrapper}
        onChange={({ block, blockId, children }) => {
          dispatchAction({
            type: "set-block-data",
            value: {
              blockId: currentBlock.id,
              data: {
                ...currentBlock.data,
                props: {
                  ...currentBlock.data?.props,
                  children,
                },
              },
            },
          });

          setSelectedBlockId(blockId);
        }}
      />
    </>
  );
};
