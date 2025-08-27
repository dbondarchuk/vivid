import { cn } from "@vivid/ui";
import React, { forwardRef, useCallback } from "react";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { YouTubeVideoPropsDefaults, YouTubeVideoReaderProps } from "./schema";
import { getDefaults, styles } from "./styles";
import { extractYouTubeVideoId } from "./utils";

// Define the shape for the YouTube video props
interface YouTubeVideoInnerProps {
  youtubeUrl?: string | null;
  autoplay?: boolean | null;
  controls?: boolean | null;
  loop?: boolean | null;
  muted?: boolean | null;
  showInfo?: boolean | null;
  rel?: boolean | null;
  modestbranding?: boolean | null;
  start?: number | null;
  end?: number | null;
  privacy?: boolean | null;
}

export const YouTubeVideoReader = forwardRef<
  HTMLDivElement,
  Pick<YouTubeVideoReaderProps, "props" | "style" | "block"> & {
    disableEvents?: boolean;
  }
>(({ props, style, block, disableEvents = false }, ref) => {
  const base = block?.base;
  const className = generateClassName();
  const safeProps: YouTubeVideoInnerProps = {
    ...YouTubeVideoPropsDefaults.props,
    ...(props ?? {}),
  };
  const safeStyle = style ?? {};

  const videoId = extractYouTubeVideoId(safeProps.youtubeUrl || "");
  if (!videoId) {
    return (
      <div className={cn(className, base?.className)} style={{ color: "red" }}>
        Invalid YouTube URL
      </div>
    );
  }

  // Privacy mode
  const privacy = safeProps.privacy || false;
  const baseUrl = privacy
    ? "https://www.youtube-nocookie.com/embed/"
    : "https://www.youtube.com/embed/";

  // Query params
  const params = new URLSearchParams({
    autoplay: safeProps.autoplay ? "1" : "0",
    controls: safeProps.controls === false ? "0" : "1",
    loop: safeProps.loop ? "1" : "0",
    mute: safeProps.muted ? "1" : "0",
    modestbranding: safeProps.modestbranding ? "1" : "0",
    rel: safeProps.rel ? "1" : "0",
    showinfo: safeProps.showInfo ? "1" : "0",
  });
  if (safeProps.start) params.set("start", String(safeProps.start));
  if (safeProps.end) params.set("end", String(safeProps.end));
  if (safeProps.loop) params.set("playlist", videoId);

  const src = `${baseUrl}${videoId}?${params.toString()}`;

  const eventListener = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disableEvents) {
        e.preventDefault();
      }
    },
    [disableEvents],
  );

  const iframeElement = (
    <div
      className={cn("relative", className, base?.className)}
      id={base?.id}
      ref={ref}
      style={{
        pointerEvents: disableEvents ? "none" : undefined,
      }}
      onMouseDown={eventListener}
      onClick={eventListener}
    >
      <iframe
        src={src}
        title="YouTube video"
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
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
      {iframeElement}
    </>
  );
});
