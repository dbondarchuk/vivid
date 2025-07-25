"use client";

import { useCurrentBlock } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { Booking } from "./components/booking";
import { BookingProps } from "./schema";
import { styles } from "./styles";

export const BookingEditor = ({ props, style }: BookingProps) => {
  const currentBlock = useCurrentBlock<BookingProps>();

  const className = useClassName();
  const base = currentBlock.base;

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <Booking
        className={cn(className, base?.className)}
        id={base?.id}
        successPage={props.confirmationPage}
      />
    </>
  );
};
