"use client";

import React from "react";

import { EditorBlock, useCurrentBlock, useEditorArgs } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { BlockStyle } from "../../helpers/styling";
import { HeadingProps } from "./schema";
import { getDefaults, styles } from "./styles";
import { generateClassName } from "../../helpers/class-name-generator";
import { EditorChildren } from "@vivid/builder";

const disable = {
  disableMove: true,
  disableDelete: true,
  disableClone: true,
  disableDrag: true,
};

export function HeadingEditor({ props, style }: HeadingProps) {
  const currentBlock = useCurrentBlock<HeadingProps>();
  const content = currentBlock?.data?.props?.children?.[0];
  const base = currentBlock.base;

  const className = generateClassName();
  const defaults = getDefaults({ props, style }, true);

  const Element = currentBlock?.data?.props?.level || "h2";

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
        isEditor
      />
      <Element className={cn(className, base?.className)} id={base?.id}>
        {content && (
          <EditorBlock key={content?.id} block={content} {...disable} />
        )}
      </Element>
    </>
  );
}
