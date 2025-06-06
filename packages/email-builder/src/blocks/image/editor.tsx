"use client";

import {
  useCurrentBlock,
  useCurrentBlockId,
  useDispatchAction,
  useEditorArgs,
  useSelectedBlockId,
} from "@vivid/builder";
import { templateSafeWithError } from "@vivid/utils";
import { useCallback } from "react";
import { Image } from "./reader";
import { ResizableImage } from "./resizable-image";
import { ImageProps, ImagePropsDefaults } from "./schema";
import { getWrapperStyles } from "./styles";

export const ImageEditor = ({ props, style }: ImageProps) => {
  const args = useEditorArgs();
  const url = props?.url
    ? templateSafeWithError(props.url, args, true)
    : undefined;

  const currentBlock = useCurrentBlock<ImageProps>();
  const currentBlockId = useCurrentBlockId();
  const selectedBlockId = useSelectedBlockId();
  const isSelected = selectedBlockId === currentBlockId;

  const dispatchAction = useDispatchAction();
  const onDimensionsChange = useCallback(
    (width: number, height: number) => {
      dispatchAction({
        type: "set-block-data",
        value: {
          blockId: currentBlockId,
          data: {
            ...currentBlock.data,
            props: {
              ...currentBlock.data?.props,
              width,
              height,
            },
          },
        },
      });
    },
    [dispatchAction, currentBlock]
  );

  const onPositionChange = useCallback(
    (x: number, y: number) => {
      dispatchAction({
        type: "set-block-data",
        value: {
          blockId: currentBlockId,
          data: {
            ...currentBlock.data,
            props: {
              ...currentBlock.data?.props,
              x,
              y,
            },
          },
        },
      });
    },
    [dispatchAction, currentBlock]
  );

  return isSelected ? (
    <ResizableImage
      src={url || ""}
      alt={currentBlock.data?.props?.alt ?? undefined}
      wrapperStyles={getWrapperStyles({ style: currentBlock.data?.style })}
      onDimensionsChange={onDimensionsChange}
      onPositionChange={onPositionChange}
      initialWidth={currentBlock.data?.props?.width ?? undefined}
      initialHeight={currentBlock.data?.props?.height ?? undefined}
      initialX={currentBlock.data?.props?.x ?? ImagePropsDefaults.props.x}
      initialY={currentBlock.data?.props?.y ?? ImagePropsDefaults.props.y}
    />
  ) : (
    <Image props={props} style={style} />
  );
};
