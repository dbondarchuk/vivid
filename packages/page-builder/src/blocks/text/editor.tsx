"use client";

import React from "react";

import {
  useCurrentBlock,
  useDispatchAction,
  useEditorArgs,
} from "@vivid/builder";
import { PlateEditor } from "@vivid/rte";
import { BlockStyle } from "../../helpers/styling";
import { TextProps } from "./schema";
import { getDefaults, styles } from "./styles";
import { generateClassName } from "../../helpers/class-name-generator";
import { cn } from "@vivid/ui";

export const TextEditor = ({ props, style }: TextProps) => {
  const args = useEditorArgs();
  const currentBlock = useCurrentBlock<TextProps>();
  const value = currentBlock.data?.props?.value;
  const dispatchAction = useDispatchAction();

  const onChange = (value: any) => {
    dispatchAction({
      type: "set-block-data",
      value: {
        blockId: currentBlock.id,
        data: {
          ...currentBlock.data,
          props: {
            ...currentBlock.data?.props,
            value,
          },
        },
      },
    });
  };

  const className = generateClassName();
  const defaults = getDefaults({ props, style }, true);

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
        isEditor
      />
      <PlateEditor
        value={value ?? []}
        onChange={onChange}
        className={cn(
          "w-full bg-transparent border-0 focus-visible:ring-0 rounded-none h-auto p-0 border-none leading-normal md:leading-normal",
          className
        )}
      />
    </>
  );
};
