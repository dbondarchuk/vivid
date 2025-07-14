"use client";

import {
  BlockDisableOptions,
  EditorBlock,
  useCurrentBlock,
} from "@vivid/builder";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { PageHeroProps } from "./schema";
import { styles } from "./styles";
import { useMemo } from "react";

const disable = {
  disableMove: true,
  disableDelete: true,
  disableClone: true,
  disableDrag: true,
};

export const PageHeroEditor = ({ props, style }: PageHeroProps) => {
  const currentBlock = useCurrentBlock<PageHeroProps>();

  const title = currentBlock.data?.props?.title?.children?.[0];
  const subtitle = currentBlock.data?.props?.subtitle?.children?.[0];
  const buttons = currentBlock.data?.props?.buttons?.children?.[0];
  const className = generateClassName();

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <section className={className}>
        {/* <EditorChildren
          block={currentBlock}
          property="props.title"
          children={title || []}
          allowOnly="Heading"
          maxChildren={1}
          onChange={({ block, blockId, children }) => {
            dispatchAction({
              type: "set-block-data",
              value: {
                blockId: currentBlock.id,
                data: {
                  ...currentBlock.data,
                  props: {
                    ...currentBlock.data?.props,
                    title: {
                      ...currentBlock.data?.props?.title,
                      children,
                    },
                  },
                },
              },
            });

            setSelectedBlockId(blockId);
          }}
        /> */}
        {title && <EditorBlock block={title} {...disable} />}
        {subtitle && <EditorBlock block={subtitle} {...disable} />}
        {buttons && <EditorBlock block={buttons} {...disable} />}
        {/* <EditorChildren
          block={currentBlock}
          property="props.subtitle"
          children={subtitle || []}
          allowOnly="Heading"
          maxChildren={1}
          onChange={({ block, blockId, children }) => {
            dispatchAction({
              type: "set-block-data",
              value: {
                blockId: currentBlock.id,
                data: {
                  ...currentBlock.data,
                  props: {
                    ...currentBlock.data?.props,
                    subtitle: {
                      ...currentBlock.data?.props?.subtitle,
                      children,
                    },
                  },
                },
              },
            });

            setSelectedBlockId(blockId);
          }}
        />
        <EditorChildren
          block={currentBlock}
          property="props.buttons"
          children={buttons || []}
          allowOnly="Container"
          maxChildren={1}
          disabledDroppable
          onChange={({ block, blockId, children }) => {
            dispatchAction({
              type: "set-block-data",
              value: {
                blockId: currentBlock.id,
                data: {
                  ...currentBlock.data,
                  props: {
                    ...currentBlock.data?.props,
                    buttons: {
                      ...currentBlock.data?.props?.buttons,
                      children,
                    },
                  },
                },
              },
            });

            setSelectedBlockId(blockId);
          }}
        /> */}
      </section>
    </>
  );
};
