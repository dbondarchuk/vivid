"use client";

import { useBlockEditor, useCurrentBlock, useEditorArgs } from "@vivid/builder";
import { templateSafeWithError } from "@vivid/utils";
import { Avatar } from "./avatar";
import { AvatarProps } from "./schema";

export const AvatarEditor = ({ props, style }: AvatarProps) => {
  const args = useEditorArgs();
  const currentBlock = useCurrentBlock<AvatarProps>();
  const overlayProps = useBlockEditor(currentBlock.id);
  const imageUrl = props?.imageUrl
    ? templateSafeWithError(props.imageUrl, args, true)
    : undefined;

  return (
    <Avatar
      {...overlayProps}
      style={style}
      props={{
        ...props,
        imageUrl,
      }}
    />
  );
};
