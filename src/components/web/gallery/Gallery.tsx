import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import React from "react";
import { GalleryItemPosition, GalleryProps } from "./Gallery.types";

const itemsPositions: Record<GalleryItemPosition, string> = {
  center: "justify-items-center",
  start: "justify-items-start",
  end: "justify-items-end",
  stretch: "justify-items-stretch",
};

export const Gallery: React.FC<GalleryProps> = ({
  title,
  className,
  children,
  basis = 1,
  itemsPos = "center",
  itemClassName,
  ...props
}) => {
  return (
    <section
      className={cn(
        "flex flex-col gap-10 w-full scroll-m-20 not-prose",
        className
      )}
      {...props}
    >
      <h3 className="w-full text-4xl text-center appear">{title}</h3>
      <Carousel>
        <CarouselContent>
          {React.Children.map(children, (child, index) => (
            <CarouselItem
              key={index}
              className={cn(
                "basis-full",
                `md:basis-1/${basis}`,
                itemsPositions[itemsPos],
                itemClassName
              )}
            >
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </section>
  );
};
