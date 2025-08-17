"use client";

import {
  useCurrentBlock,
  useCurrentBlockId,
  useSelectedBlockId,
  useEditorArgs,
} from "@vivid/builder";
import { template } from "@vivid/utils";
import { Video } from "./reader";
import { VideoProps, VideoPropsDefaults } from "./schema";

export const VideoEditor = ({ props, style }: VideoProps) => {
  const currentBlock = useCurrentBlock<VideoProps>();
  const currentBlockId = useCurrentBlockId();
  const selectedBlockId = useSelectedBlockId();
  const isSelected = selectedBlockId === currentBlockId;
  const args = useEditorArgs();
  const baseProps = {
    ...VideoPropsDefaults.props,
    ...(currentBlock.data?.props ?? {}),
  };
  const updatedProps = {
    ...baseProps,
    src: template(baseProps.src ?? "", args, true),
  };
  return <Video props={updatedProps} style={style} block={currentBlock} />;
};
