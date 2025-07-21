"use client";

import React, { useRef } from "react";
import sanitizeHtml from "sanitize-html";

import {
  EditorBlock,
  useCurrentBlock,
  useDispatchAction,
  useEditorArgs,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { ArgumentsAutocomplete, cn } from "@vivid/ui";
import { icons } from "lucide-react";
import { BlockStyle } from "../../helpers/styling";
import { ButtonProps } from "./schema";
import { getDefaults, styles } from "./styles";
import { generateClassName } from "../../helpers/class-name-generator";
import { EditorChildren } from "@vivid/builder";

const disable = {
  disableMove: true,
  disableDelete: true,
  disableClone: true,
  disableDrag: true,
};

export const ButtonEditor = ({ props, style }: ButtonProps) => {
  const currentBlock = useCurrentBlock<ButtonProps>();
  const content = currentBlock?.data?.props?.children?.[0];
  const base = currentBlock.base;

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
      <span className={cn(className, base?.className)} id={base?.id}>
        {content && (
          <EditorBlock key={content?.id} block={content} {...disable} />
        )}
      </span>
    </>
  );
};
