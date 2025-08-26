import { useCurrentBlock, useSetCurrentBlockRef } from "@vivid/builder";
import { YouTubeVideoReader } from "./reader";
import { YouTubeVideoProps } from "./schema";

export const YouTubeVideoEditor: React.FC<YouTubeVideoProps> = (props) => {
  const currentBlock = useCurrentBlock<YouTubeVideoProps>();
  const ref = useSetCurrentBlockRef();

  return <YouTubeVideoReader {...props} block={currentBlock} ref={ref} />;
};
