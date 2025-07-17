import { useCurrentBlock } from "@vivid/builder";
import { YouTubeVideoReader } from "./reader";
import { YouTubeVideoProps } from "./schema";

export const YouTubeVideoEditor: React.FC<YouTubeVideoProps> = (props) => {
  const currentBlock = useCurrentBlock<YouTubeVideoProps>();

  return (
    <div
      className="relative"
      style={{
        pointerEvents: "none",
      }}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.preventDefault()}
    >
      <YouTubeVideoReader {...props} block={currentBlock} />
    </div>
  );
};
