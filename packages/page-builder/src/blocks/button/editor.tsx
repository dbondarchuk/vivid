"use client";

import React, { useRef } from "react";
import sanitizeHtml from "sanitize-html";

import {
  useCurrentBlock,
  useDispatchAction,
  useEditorArgs,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { ArgumentsAutocomplete, cn } from "@vivid/ui";
import { BlockStyle } from "../../helpers/styling";
import { ButtonProps } from "./schema";
import { getDefaults, styles } from "./styles";
import { generateClassName } from "../../helpers/class-name-generator";

export const ButtonEditor = ({ props, style }: ButtonProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const args = useEditorArgs();
  const currentBlock = useCurrentBlock<ButtonProps>();
  const value = currentBlock?.data?.props?.text;
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const sanitizeConf = {
    allowedTags: [],
    allowedAttributes: {},
  };

  const onChange = (value: string) => {
    dispatchAction({
      type: "set-block-data",
      value: {
        blockId: currentBlock.id,
        data: {
          ...currentBlock.data,
          props: {
            ...currentBlock.data?.props,
            text: sanitizeHtml(value, sanitizeConf),
          },
        },
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      ref?.current?.blur();
      setSelectedBlockId(null);
    }
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
      <ArgumentsAutocomplete
        ref={ref}
        args={args}
        asContentEditable
        element="a"
        className={cn(
          "border-0 bg-transparent focus-visible:ring-0 rounded-none h-auto p-0 border-none leading-normal md:leading-normal",
          className
        )}
        value={value ?? "Button"}
        placeholder="Button"
        onChange={onChange}
        onKeyDown={handleKeyPress}
        style={{
          // @ts-expect-error - TODO: remove this once we have a proper solution for this
          fieldSizing: "content",
        }}
        // asContentEditable
      />
    </>
  );
};
