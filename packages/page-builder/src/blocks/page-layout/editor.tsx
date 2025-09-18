"use client";

import { Fragment } from "react";

import {
  EditorChildren,
  useBlockEditor,
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
  const overlayProps = useBlockEditor(currentBlock.id);

  return (
    <Fragment>
      <div
        style={{
          backgroundColor: getColorStyle(
            currentBlock?.data?.backgroundColor ?? COLORS.background.value,
          ),
          color: getColorStyle(
            currentBlock?.data?.textColor ?? COLORS.foreground.value,
          ),
          fontFamily: getFontFamily(currentBlock?.data?.fontFamily),
          fontSize: "16px",
          fontWeight: "400",
          letterSpacing: "0.15008px",
          lineHeight: "1.5",
          margin: "0",
          width: "100%",
          minHeight: "100%",
        }}
        {...overlayProps}
        onClick={() => {
          setSelectedBlockId(null);
        }}
      >
        <div
          className={cn(
            "w-full flex flex-col",
            !currentBlock?.data?.fullWidth && "container mx-auto",
          )}
        >
          <EditorChildren blockId={currentBlock?.id} property="" />
        </div>
      </div>
    </Fragment>
  );
};
