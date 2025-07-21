import { ReaderBlock } from "@vivid/builder";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { CarouselReaderProps, styles } from "./schema";
import { cn } from "@vivid/ui";

export const CarouselReader = ({
  style,
  props,
  block,
  ...rest
}: CarouselReaderProps) => {
  const children = props?.children ?? [];

  const className = generateClassName();
  const base = block.base;

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <Carousel
        opts={{
          loop: !!props.loop,
          align: "start",
        }}
        orientation={props.orientation ?? undefined}
        autoPlay={props.autoPlay ? props.autoPlay * 1000 : undefined}
        id={base?.id}
      >
        <CarouselContent className={cn(className, base?.className)}>
          {children.map((child) => (
            <CarouselItem key={child.id} className="carousel-item pl-4">
              <ReaderBlock key={child.id} {...rest} block={child} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {props.navigation && (
          <>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </>
        )}
      </Carousel>
    </>
  );
};
