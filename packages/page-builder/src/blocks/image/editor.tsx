"use client";

import {
  useCurrentBlock,
  useCurrentBlockId,
  useDispatchAction,
  useEditorArgs,
  useSelectedBlockId,
} from "@vivid/builder";
import { template } from "@vivid/utils";
import { useCallback } from "react";
import { Image } from "./reader";
import { ResizableImage } from "./resizable-image";
import { ImageProps } from "./schema";

export const ImageEditor = ({ props, style }: ImageProps) => {
  const currentBlock = useCurrentBlock<ImageProps>();
  const currentBlockId = useCurrentBlockId();
  const selectedBlockId = useSelectedBlockId();
  const isSelected = selectedBlockId === currentBlockId;

  const getUpdatedSize = (
    currentBlockData: ImageProps,
    width: number,
    height: number
  ) => {
    const newStyles = {
      ...(currentBlockData.style || {}),
    };

    newStyles.width =
      newStyles.width?.filter(
        (w) => !!w.breakpoint?.length || !!w.state?.length
      ) || [];
    newStyles.height =
      newStyles.height?.filter(
        (h) => !!h.breakpoint?.length || !!h.state?.length
      ) || [];

    newStyles.width.push({
      value: {
        value: width,
        unit: "px",
      },
    });

    newStyles.height.push({
      value: {
        value: height,
        unit: "px",
      },
    });

    return newStyles;
  };

  const getUpdatedPosition = (
    currentBlockData: ImageProps,
    x: number,
    y: number
  ) => {
    const newStyles = {
      ...(currentBlockData.style || {}),
    };

    newStyles.objectPosition =
      newStyles.objectPosition?.filter(
        (p) => !!p.breakpoint?.length || !!p.state?.length
      ) || [];

    newStyles.objectPosition.push({
      value: {
        x,
        y,
      },
    });

    return newStyles;
  };

  const dispatchAction = useDispatchAction();
  const onDimensionsChange = useCallback(
    (width: number, height: number) => {
      dispatchAction({
        type: "set-block-data",
        value: {
          blockId: currentBlockId,
          data: {
            ...currentBlock.data,
            style: getUpdatedSize(currentBlock.data, width, height),
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
            style: getUpdatedPosition(currentBlock.data, x, y),
          },
        },
      });
    },
    [dispatchAction, currentBlock]
  );

  const baseWidth = currentBlock.data?.style?.width?.find(
    (w) => !w.breakpoint?.length && !w.state?.length
  )?.value;

  const baseHeight = currentBlock.data?.style?.height?.find(
    (h) => !h.breakpoint?.length && !h.state?.length
  )?.value;

  const baseX = currentBlock.data?.style?.objectPosition?.find(
    (position) => !position.breakpoint?.length && !position.state?.length
  )?.value.x;

  const baseY = currentBlock.data?.style?.objectPosition?.find(
    (position) => !position.breakpoint?.length && !position.state?.length
  )?.value.y;

  const args = useEditorArgs();
  const updatedProps = {
    ...currentBlock.data?.props,
    src: template(currentBlock.data?.props?.src ?? "", args, true),
  };

  return isSelected ? (
    <ResizableImage
      props={currentBlock.data ?? {}}
      onDimensionsChange={onDimensionsChange}
      onPositionChange={onPositionChange}
      initialWidth={typeof baseWidth === "object" ? baseWidth.value : undefined}
      initialHeight={
        typeof baseHeight === "object" ? baseHeight.value : undefined
      }
      initialX={baseX ?? 50}
      initialY={baseY ?? 50}
    />
  ) : (
    <Image props={updatedProps} style={style} />
  );
};
