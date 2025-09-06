"use client";

import {
  EditorBlock,
  useBlockChildrenBlockIds,
  useCurrentBlock,
  useCurrentBlockId,
  useDispatchAction,
  usePortalContext,
} from "@vivid/builder";
import { cn } from "@vivid/ui";
import { useCallback } from "react";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { ImageProvider } from "../image/context";
import { BeforeAfterSlider } from "./before-after-slider";
import { NoImagesMessage } from "./no-images-message";
import { BeforeAfterProps } from "./schema";
import { styles } from "./styles";

const disable = {
  disableMove: true,
  disableDelete: true,
  disableClone: true,
  disableDrag: true,
};

export const BeforeAfterEditor = ({ props, style }: BeforeAfterProps) => {
  const currentBlock = useCurrentBlock<BeforeAfterProps>();
  const currentBlockId = useCurrentBlockId();
  const dispatchAction = useDispatchAction();
  const beforeId = useBlockChildrenBlockIds(
    currentBlock.id,
    "props.before",
  )?.[0];
  const afterId = useBlockChildrenBlockIds(currentBlock.id, "props.after")?.[0];
  const beforeLabelId = useBlockChildrenBlockIds(
    currentBlock.id,
    "props.beforeLabel",
  )?.[0];
  const afterLabelId = useBlockChildrenBlockIds(
    currentBlock.id,
    "props.afterLabel",
  )?.[0];

  const { document } = usePortalContext();

  const updateProps = useCallback(
    (newProps: Partial<BeforeAfterProps["props"]>) => {
      dispatchAction({
        type: "set-block-data",
        value: {
          blockId: currentBlockId,
          data: {
            ...currentBlock.data,
            props: {
              ...currentBlock.data.props,
              ...newProps,
            },
          },
        },
      });
    },
    [dispatchAction, currentBlock, currentBlockId],
  );

  const { sliderPosition, showLabels, beforeLabel, afterLabel, orientation } =
    currentBlock.data?.props || {};

  if (!beforeId || !afterId) {
    return <NoImagesMessage />;
  }

  const className = useClassName();

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={currentBlock.data?.style}
      />
      <ImageProvider allowResize={false}>
        <BeforeAfterSlider
          className={cn(className, currentBlock.base?.className)}
          id={currentBlock.base?.id}
          sliderPosition={sliderPosition || 50}
          showLabels={!!showLabels}
          beforeLabel={
            <EditorBlock
              key={beforeLabelId}
              blockId={beforeLabelId}
              {...disable}
              index={0}
              parentBlockId={currentBlock.id}
              parentProperty="props.beforeLabel"
              allowedTypes="InlineContainer"
            />
          }
          afterLabel={
            <EditorBlock
              key={afterLabelId}
              blockId={afterLabelId}
              {...disable}
              index={0}
              parentBlockId={currentBlock.id}
              parentProperty="props.afterLabel"
              allowedTypes="InlineContainer"
            />
          }
          orientation={orientation || "horizontal"}
          document={document}
          before={
            <EditorBlock
              key={beforeId}
              blockId={beforeId}
              {...disable}
              index={0}
              parentBlockId={currentBlock.id}
              parentProperty="props.before"
              allowedTypes="Container"
            />
          }
          after={
            <EditorBlock
              key={afterId}
              blockId={afterId}
              {...disable}
              index={0}
              parentBlockId={currentBlock.id}
              parentProperty="props.after"
              allowedTypes="Container"
            />
          }
        />
      </ImageProvider>
    </>
  );
};
