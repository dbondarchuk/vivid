import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { CarouselProps, styles } from "./schema";

export const CarouselEditor = ({ style, props }: CarouselProps) => {
  const currentBlock = useCurrentBlock<CarouselProps>();

  const children = currentBlock.data?.props?.children;
  const className = generateClassName();
  const base = currentBlock.base;

  // const childWrapper = useCallback(
  //   ({ children }: { children: React.ReactNode }) => (
  //     <CarouselItem className="carousel-item">{children}</CarouselItem>
  //   ),
  //   []
  // );

  // const childrenWrapper = useCallback(
  //   ({
  //     children,
  //     className,
  //     style,
  //     id,
  //     ref,
  //   }: {
  //     children: React.ReactNode;
  //     className?: string;
  //     style?: React.CSSProperties;
  //     id?: string;
  //     ref?: React.Ref<HTMLDivElement>;
  //   }) => (
  //     <Carousel className={className} style={style} id={id} ref={ref}>
  //       <CarouselContent className="relative">{children}</CarouselContent>
  //       <CarouselPrevious className="left-0" />
  //       <CarouselNext className="right-0" />
  //     </Carousel>
  //   ),
  //   []
  // );

  const newStyle: CarouselProps["style"] = {
    ...currentBlock.data?.style,
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
      <EditorChildren
        block={currentBlock}
        className={cn(
          "items-center",
          currentBlock.data?.props?.orientation === "vertical" && "flex-col",
          className,
          base?.className
        )}
        id={base?.id}
        property="props"
        children={children || []}
        // childWrapper={childWrapper}
        // childrenWrapper={childrenWrapper}
      />
    </>
  );
};
