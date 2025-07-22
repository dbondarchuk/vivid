"use client";

import { Fragment } from "react";

import {
  EditorChildren,
  useCurrentBlock,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { cn } from "@vivid/ui";
import { getFontFamily } from "../../style-inputs/helpers/styles";
import { COLORS, getColorStyle } from "../../style/helpers/colors";
import { PageLayoutProps } from "./schema";

export const PageLayoutEditor = () => {
  const currentBlock = useCurrentBlock<PageLayoutProps>();
  const setSelectedBlockId = useSetSelectedBlockId();

  const children = currentBlock.data.children || [];

  return (
    <Fragment>
      <div
        onClick={() => {
          setSelectedBlockId(null);
        }}
        style={{
          backgroundColor: getColorStyle(
            currentBlock.data?.backgroundColor ?? COLORS.background.value
          ),
          color: getColorStyle(
            currentBlock.data?.textColor ?? COLORS.foreground.value
          ),
          fontFamily: getFontFamily(currentBlock.data?.fontFamily),
          fontSize: "16px",
          fontWeight: "400",
          letterSpacing: "0.15008px",
          lineHeight: "1.5",
          margin: "0",
          width: "100%",
          minHeight: "100%",
        }}
      >
        <EditorChildren
          block={currentBlock}
          property=""
          children={children || []}
          className={cn(
            "w-full",
            !currentBlock.data?.fullWidth && "container mx-auto"
          )}
        />
      </div>
    </Fragment>
  );
};
