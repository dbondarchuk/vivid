import type { SlateElementProps } from "@udecode/plate";
import type { TCaptionElement } from "@udecode/plate-caption";
import type { TImageElement } from "@udecode/plate-media";

import {
  cn,
  Dialog,
  DialogContent,
  DialogTrigger,
  ImageZoom,
} from "@hacado/ui";
import { NodeApi, SlateElement } from "@udecode/plate";

export function ImageElementStatic({
  children,
  className,
  nodeProps,
  ...props
}: SlateElementProps) {
  const {
    align = "center",
    caption,
    url,
    width,
  } = props.element as TImageElement &
    TCaptionElement & {
      width: number;
    };

  return (
    <SlateElement
      className={cn(
        className,
        "py-2.5 flex flex-col items-center justify-center",
      )}
      {...props}
      nodeProps={nodeProps}
    >
      <figure
        className="group relative m-0 inline-block max-w-full"
        style={{ width }}
      >
        <div
          className="relative max-w-full min-w-[92px]"
          style={{ textAlign: align }}
        >
          <Dialog>
            <DialogTrigger asChild>
              <img
                className={cn(
                  "w-full max-w-full cursor-pointer object-cover px-0",
                  "rounded-sm",
                )}
                alt=""
                src={url}
                {...nodeProps}
              />
            </DialogTrigger>
            <DialogContent
              className="max-w-7xl border-0 bg-transparent p-0 shadow-none"
              closeClassName="bg-background"
            >
              <div className="relative h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-transparent shadow-none">
                <ImageZoom
                  src={url}
                  alt={caption ? NodeApi.string(caption[0]) : ""}
                />
              </div>
            </DialogContent>
          </Dialog>

          {caption && (
            <figcaption className="mx-auto mt-2 h-[24px] max-w-full">
              {NodeApi.string(caption[0])}
            </figcaption>
          )}
        </div>
      </figure>
      {children}
    </SlateElement>
  );
}
