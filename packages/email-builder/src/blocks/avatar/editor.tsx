"use client";

import { useEditorArgs } from "@vivid/builder";
import { templateSafeWithError } from "@vivid/utils";
import { Avatar } from "./reader";
import { AvatarProps } from "./schema";

export const AvatarEditor = ({ props, style }: AvatarProps) => {
  const args = useEditorArgs();
  const imageUrl = props?.imageUrl
    ? templateSafeWithError(props.imageUrl, args, true)
    : undefined;

  return (
    <Avatar
      style={style}
      props={{
        ...props,
        imageUrl,
      }}
    />
  );
};
