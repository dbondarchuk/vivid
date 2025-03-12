"use client";

import {
  useCurrentBlock,
  useCurrentBlockId,
  useDispatchAction,
  useEditorArgs,
  useSelectedBlockId,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { ArgumentsAutocomplete, cn } from "@vivid/ui";
import { useRef } from "react";
import sanitizeHtml from "sanitize-html";
import { ButtonProps } from "./schema";
import { getLinkStyles, getWrapperStyles } from "./styles";
import { Button } from "./reader";

export const ButtonEditor = ({ props, style }: ButtonProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const wrapperStyles = getWrapperStyles({ style });
  const linkStyles = getLinkStyles({ props, style });

  const currentBlockId = useCurrentBlockId();
  const args = useEditorArgs();
  const currentBlock = useCurrentBlock<ButtonProps>();
  const selectedBlockId = useSelectedBlockId();
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const isSelected = selectedBlockId === currentBlockId;
  const value = currentBlock.data?.props?.text;

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

  return isSelected ? (
    <div style={wrapperStyles}>
      <ArgumentsAutocomplete
        ref={ref}
        args={args}
        asInput
        className={cn(
          "border-0 bg-transparent focus-visible:ring-0 rounded-none h-auto p-0 border-none leading-normal md:leading-normal",
          props?.width === "full" ? "w-full" : "w-auto"
        )}
        style={{ ...linkStyles, textAlign: style?.textAlign ?? undefined }}
        value={value ?? "Button"}
        onChange={onChange}
        onKeyDown={handleKeyPress}
      />
    </div>
  ) : (
    <Button props={props} style={style} />
  );
};
