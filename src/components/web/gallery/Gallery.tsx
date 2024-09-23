import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import React from "react";
import { GalleryProps } from "./Gallery.types";

export const Gallery: React.FC<GalleryProps> = ({
  title,
  className,
  children,
  basis = 1,
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
            <CarouselItem key={index} className={cn(`basis-1/${basis}`)}>
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
