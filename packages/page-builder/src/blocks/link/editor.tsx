"use client";

import React from "react";

import { EditorBlock, useCurrentBlock, useEditorArgs } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { BlockStyle } from "../../helpers/styling";
import { LinkProps } from "./schema";
import { getDefaults, styles } from "./styles";
import { generateClassName } from "../../helpers/class-name-generator";

const disable = {
  disableMove: true,
  disableDelete: true,
  disableClone: true,
  disableDrag: true,
};

export const LinkEditor = ({ props, style }: LinkProps) => {
  const currentBlock = useCurrentBlock<LinkProps>();
  const content = (currentBlock?.data?.props as any)?.children?.[0];
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
