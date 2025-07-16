"use client";

import React from "react";
import {
  useCurrentBlock,
  useDispatchAction,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { BlockStyle } from "../../helpers/styling";
import { BookingProps } from "./schema";
import { styles } from "./styles";
import { Booking } from "./components/booking";
import { generateClassName } from "../../helpers/class-name-generator";
import { cn } from "@vivid/ui";

export const BookingEditor = ({ props, style }: BookingProps) => {
  const currentBlock = useCurrentBlock<BookingProps>();
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const className = generateClassName();
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
