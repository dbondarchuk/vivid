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
import { getCarouselItemStyles } from "./styles";

export const CarouselReader = ({
  style,
  props,
  ...rest
}: CarouselReaderProps) => {
  const children = props?.children ?? [];

  const className = generateClassName();

  const carouselItemStyles = getCarouselItemStyles(props);

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <BlockStyle
        name={`${className} .carousel-item`}
        styleDefinitions={styles}
        styles={carouselItemStyles}
      />
      <Carousel
        opts={{
          loop: !!props.loop,
          align: "start",
        }}
        autoPlay={props.autoPlay ? props.autoPlay * 1000 : undefined}
      >
        <CarouselContent className={className}>
          {children.map((child) => (
            <CarouselItem key={child.id} className="carousel-item pl-4">
              <ReaderBlock key={child.id} block={child} {...rest} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </>
  );
};
