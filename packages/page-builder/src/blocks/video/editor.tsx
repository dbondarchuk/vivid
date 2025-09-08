"use client";

import {
  useCurrentBlock,
  useEditorArgs,
  useSetCurrentBlockRef,
} from "@vivid/builder";
import { template } from "@vivid/utils";
import { Video } from "./reader";
import { VideoProps, VideoPropsDefaults } from "./schema";

export const VideoEditor = ({ props, style }: VideoProps) => {
  const currentBlock = useCurrentBlock<VideoProps>();
  const args = useEditorArgs();
  const ref = useSetCurrentBlockRef();

  const baseProps = {
    ...VideoPropsDefaults.props,
    ...(currentBlock.data?.props ?? {}),
  };
  const updatedProps = {
    ...baseProps,
    src: template(baseProps.src ?? "", args, true),
  };
  return (
    <Video props={updatedProps} style={style} block={currentBlock} ref={ref} />
  );
};
