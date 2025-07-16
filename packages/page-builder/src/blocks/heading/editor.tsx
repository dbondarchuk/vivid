"use client";

import React, { useCallback, useRef } from "react";
import sanitizeHtml from "sanitize-html";

import {
  useCurrentBlock,
  useDispatchAction,
  useEditorArgs,
  useSelectedBlockId,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { ArgumentsAutocomplete, cn } from "@vivid/ui";
import { BlockStyle } from "../../helpers/styling";
import { HeadingProps } from "./schema";
import { getDefaults, styles } from "./styles";
import { Heading } from "./reader";
import { generateClassName } from "../../helpers/class-name-generator";

export function HeadingEditor({ props, style }: HeadingProps) {
  const ref = useRef<HTMLInputElement>(null);
  const args = useEditorArgs();
  const currentBlock = useCurrentBlock<HeadingProps>();
  const value = currentBlock?.data?.props?.text;
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const selectedBlockId = useSelectedBlockId();
  const isSelected = selectedBlockId === currentBlock?.id;

  const sanitizeConf = {
    allowedTags: [],
    allowedAttributes: {},
  };

  const onChange = useCallback(
    (value: string) => {
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
    },
    [currentBlock]
  );

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      ref?.current?.blur();
      setSelectedBlockId(null);
    }
  }, []);

  const className = generateClassName();
  const defaults = getDefaults({ props, style }, true);
  const base = currentBlock.base;

  // return isSelected ? (
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
        className={cn(
          "w-full bg-transparent border-0 focus-visible:ring-0 rounded-none h-auto p-0 border-none leading-normal md:leading-normal",
          className,
          base?.className
        )}
        value={value ?? "Heading"}
        onChange={onChange}
        onKeyDown={handleKeyPress}
        asContentEditable
        element={currentBlock.data.props?.level || "h2"}
        placeholder="Heading"
        style={
          {
            //// @ts-expect-error - TODO: remove this once we have a proper solution for this
            // fieldSizing: "content",
          }
        }
        id={base?.id}
      />
    </>
  );
  // ) : (
  //   <Heading {...currentBlock.data} />
  // );
}
