"use client";

import { AvatarProps } from "./schema";
import { useEditorArgs } from "@vivid/builder";
import { template } from "@vivid/utils";
import { Avatar } from "./reader";

export const AvatarEditor = ({ props, style }: AvatarProps) => {
  const args = useEditorArgs();
  const imageUrl = props?.imageUrl
    ? template(props.imageUrl, args, true)
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
