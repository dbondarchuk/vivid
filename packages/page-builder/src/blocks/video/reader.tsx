import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { VideoPropsDefaults, VideoReaderProps } from "./schema";
import { getDefaults, styles } from "./styles";

// Define the shape for the video props
interface VideoInnerProps {
  src?: string | null;
  poster?: string | null;
  controls?: boolean | null;
  autoplay?: boolean | null;
  loop?: boolean | null;
  muted?: boolean | null;
  preload?: "none" | "metadata" | "auto" | null;
}

export const Video = ({
  style,
  props,
  block,
}: Pick<VideoReaderProps, "style" | "props" | "block">) => {
  const base = block?.base;
  const className = generateClassName();
  const safeProps: VideoInnerProps = {
    ...VideoPropsDefaults.props,
    ...(props ?? {}),
  };
  const safeStyle = style ?? {};

  const videoElement = (
    <video
      className={cn(className, base?.className)}
      src={safeProps.src ?? ""}
      poster={safeProps.poster ?? undefined}
      controls={safeProps.controls ?? true}
      autoPlay={safeProps.autoplay ?? false}
      loop={safeProps.loop ?? false}
      muted={safeProps.muted ?? false}
      preload={safeProps.preload ?? "metadata"}
      id={base?.id}
    />
  );

  const defaults = getDefaults({ props: safeProps, style: safeStyle }, false);

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={safeStyle}
        defaults={defaults}
        isEditor={false}
      />
      {videoElement}
    </>
  );
};
