"use client";

import { Fragment } from "react";

import {
  EditorChildren,
  useCurrentBlock,
  useDispatchAction,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { getFontFamily } from "../../style-inputs/helpers/styles";
import { PageLayoutProps } from "./schema";
import { COLORS, getColorStyle } from "../../style/helpers/colors";
import { cn } from "@vivid/ui";

export const PageLayoutEditor = (props: PageLayoutProps) => {
  const currentBlock = useCurrentBlock<PageLayoutProps>();
  const dispatchAction = useDispatchAction();
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
            props.backgroundColor ?? COLORS.background.value
          ),
          color: getColorStyle(props.textColor ?? COLORS.foreground.value),
          fontFamily: getFontFamily(props.fontFamily),
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
          className={cn("w-full", !props.fullWidth && "container mx-auto")}
          onChange={({ block, blockId, children }) => {
            dispatchAction({
              type: "set-block-data",
              value: {
                blockId: currentBlock.id,
                data: {
                  ...currentBlock.data,
                  children,
                },
              },
            });

            setSelectedBlockId(blockId);
          }}
        />
      </div>
    </Fragment>
  );
};
