"use client";

import {
  BaseBlockProps,
  useEditorArgs,
  usePortalContext,
} from "@vivid/builder";
import { cn, useDebounce } from "@vivid/ui";
import { template } from "@vivid/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { ImageProps } from "./schema";
import { getDefaults, styles } from "./styles";
// import Image from "next/image";

type ResizableImageProps = {
  props: ImageProps;
  initialWidth?: number;
  initialHeight?: number;
  initialX: number;
  initialY: number;
  minWidth?: number;
  minHeight?: number;
  className?: string;
  base?: BaseBlockProps;
  onDimensionsChange: (width: number, height: number) => void;
  onPositionChange: (x: number, y: number) => void;
};

export const ResizableImage = ({
  props,
  initialWidth,
  initialHeight,
  initialX,
  initialY,
  minWidth = 100,
  minHeight = 100,
  className,
  onDimensionsChange,
  onPositionChange,
  base,
}: ResizableImageProps) => {
  const { src, alt } = props.props ?? {
    src: "/assets/placeholder/400x200.jpg",
    alt: "Sample image",
  };

  const { document: portalDocument } = usePortalContext();
  const documentOrPortal = portalDocument ?? document;

  // Add a new state to track if the image has loaded
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Update the dimensions state initialization to use initialWidth/initialHeight if provided
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
  });

  useEffect(() => {
    setDimensions({
      width: initialWidth,
      height: initialHeight,
    });
  }, [initialWidth, initialHeight]);

  const [resizing, setResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startDimensionsRef = useRef({ width: 0, height: 0 });

  const [newDimensions, setNewDimensions] = useState<
    { width: number; height: number } | undefined
  >();

  const debouncedNewDimensions = useDebounce(newDimensions, 200);

  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [objectPosition, setObjectPosition] = useState({
    x: initialX,
    y: initialY,
  });
  const debouncedObjectPosition = useDebounce(objectPosition, 200);

  useEffect(() => {
    setObjectPosition({ x: initialX, y: initialY });
  }, [initialX, initialY]);

  useEffect(() => {
    onPositionChange(debouncedObjectPosition.x, debouncedObjectPosition.y);
  }, [debouncedObjectPosition]);

  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const dragStartObjectPosRef = useRef({ x: 50, y: 50 });

  // Handle mouse down on resize handles
  const handleMouseDown = (e: React.MouseEvent, handle: string) => {
    if (!imageRef.current) return;
    e.preventDefault();
    setResizing(() => true);
    setActiveHandle(() => handle);

    startPosRef.current = { x: e.clientX, y: e.clientY };
    startDimensionsRef.current = {
      width: dimensions.width ?? imageRef.current.clientWidth,
      height: dimensions.height ?? imageRef.current.clientHeight,
    };
  };

  // Handle mouse move during resize
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resizing) return;

      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;

      let newWidth = startDimensionsRef.current.width;
      let newHeight = startDimensionsRef.current.height;

      // Adjust dimensions based on which handle is being dragged
      switch (activeHandle) {
        case "bottom-right":
          newWidth = Math.max(
            minWidth,
            startDimensionsRef.current.width + deltaX
          );
          newHeight = Math.max(
            minHeight,
            startDimensionsRef.current.height + deltaY
          );
          break;
        case "bottom-left":
          newWidth = Math.max(
            minWidth,
            startDimensionsRef.current.width - deltaX
          );
          newHeight = Math.max(
            minHeight,
            startDimensionsRef.current.height + deltaY
          );
          break;
        case "top-right":
          newWidth = Math.max(
            minWidth,
            startDimensionsRef.current.width + deltaX
          );
          newHeight = Math.max(
            minHeight,
            startDimensionsRef.current.height - deltaY
          );
          break;
        case "top-left":
          newWidth = Math.max(
            minWidth,
            startDimensionsRef.current.width - deltaX
          );
          newHeight = Math.max(
            minHeight,
            startDimensionsRef.current.height - deltaY
          );
          break;
      }

      setDimensions(() => ({ width: newWidth, height: newHeight }));
      setNewDimensions(() => ({ width: newWidth, height: newHeight }));
    },
    [
      resizing,
      minWidth,
      minHeight,
      startDimensionsRef.current.width,
      startDimensionsRef.current.height,
      startPosRef.current.x,
      startPosRef.current.y,
      activeHandle,
    ]
  );

  useEffect(() => {
    if (!newDimensions) return;
    onDimensionsChange(newDimensions.width, newDimensions.height);
  }, [debouncedNewDimensions]);

  // Handle mouse up to stop resizing
  const handleMouseUp = useCallback(() => {
    if (!resizing) return;

    setResizing(false);
    setActiveHandle(null);
    documentOrPortal.removeEventListener("mousemove", handleMouseMove);
    documentOrPortal.removeEventListener("mouseup", handleMouseUp);
  }, [resizing]);

  // Clean up event listeners on unmount
  useEffect(() => {
    // Add event listeners for mouse move and mouse up
    documentOrPortal.addEventListener("mousemove", handleMouseMove);
    documentOrPortal.addEventListener("mouseup", handleMouseUp);

    return () => {
      documentOrPortal.removeEventListener("mousemove", handleMouseMove);
      documentOrPortal.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    resizing,
    activeHandle,
    setDimensions,
    setActiveHandle,
    startDimensionsRef.current,
  ]);

  useEffect(() => {
    // documentOrBody.addEventListener("mousemove", handleMouseMove);
    // documentOrBody.addEventListener("mouseup", handleMouseUp);

    return () => {
      documentOrPortal.removeEventListener("mousemove", handleMouseMove);
      documentOrPortal.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Add a function to handle image load and get natural dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    setImageDimensions({
      width: naturalWidth,
      height: naturalHeight,
    });

    // if (!initialWidth || !initialHeight) {
    //   setDimensions({
    //     width: naturalWidth,
    //     height: naturalHeight,
    //   });
    // }

    setImageLoaded(true);
  };

  const handleImageMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only allow dragging if not resizing
      if (resizing) return;

      e.stopPropagation();
      setIsDraggingImage(true);
      dragStartPosRef.current = { x: e.clientX, y: e.clientY };
      dragStartObjectPosRef.current = { ...objectPosition };

      // Change cursor style
      documentOrPortal.body.style.cursor = "move";
    },
    [resizing, objectPosition]
  );

  const handleImageMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingImage || !imageRef.current) return;

      // Calculate the delta movement
      const deltaX = e.clientX - dragStartPosRef.current.x;
      const deltaY = e.clientY - dragStartPosRef.current.y;

      // Calculate new position (invert the movement for natural feeling)
      // and constrain between 0 and 100
      const newX = Math.max(
        0,
        Math.min(
          100,
          dragStartObjectPosRef.current.x -
            (deltaX / (dimensions.width ?? imageRef.current.clientWidth)) * 100
        )
      );
      const newY = Math.max(
        0,
        Math.min(
          100,
          dragStartObjectPosRef.current.y -
            (deltaY / (dimensions.height ?? imageRef.current?.clientHeight)) *
              100
        )
      );

      setObjectPosition({ x: Math.round(newX), y: Math.round(newY) });
    },
    [isDraggingImage, dimensions.width, dimensions.height, imageRef.current]
  );

  const handleImageMouseUp = useCallback(() => {
    if (isDraggingImage) {
      setIsDraggingImage(false);
      documentOrPortal.body.style.cursor = "default";
    }
  }, [isDraggingImage]);

  // Add event listeners for image dragging
  useEffect(() => {
    if (isDraggingImage) {
      documentOrPortal.addEventListener("mousemove", handleImageMouseMove);
      documentOrPortal.addEventListener("mouseup", handleImageMouseUp);
    }

    return () => {
      documentOrPortal.removeEventListener("mousemove", handleImageMouseMove);
      documentOrPortal.removeEventListener("mouseup", handleImageMouseUp);
    };
  }, [isDraggingImage, handleImageMouseMove, handleImageMouseUp]);

  const imgClassName = useClassName();
  const defaults = getDefaults(props, false);

  const args = useEditorArgs();

  return (
    <div className="w-full">
      <BlockStyle
        name={imgClassName}
        styleDefinitions={styles}
        styles={props.style}
        defaults={defaults}
        isEditor={true}
      />
      <div
        className={cn(
          "relative group block w-full h-full",
          resizing ? "select-none" : "",
          className,
          base?.className
        )}
        style={{}}
        id={base?.id}
      >
        <div className="relative w-full h-full overflow-hidden inline-block">
          <img
            ref={imageRef}
            src={template(src || "/assets/placeholder/400x200.jpg", args, true)}
            alt={alt ?? ""}
            className={imgClassName}
            style={{
              // objectFit: "cover",
              objectPosition: `${objectPosition.x}% ${objectPosition.y}%`,
              width: dimensions.width ? `${dimensions.width}px` : undefined,
              height: dimensions.height ? `${dimensions.height}px` : undefined,
              cursor: resizing ? "default" : "move",
            }}
            onLoad={handleImageLoad}
            onMouseDown={handleImageMouseDown}
            draggable={false}
          />
        </div>

        {/* Resize handles */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-transparent opacity-0 group-hover:opacity-100 cursor-nwse-resize"
          onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
        />
        <div
          className="absolute bottom-0 left-0 w-4 h-4 bg-transparent opacity-0 group-hover:opacity-100 cursor-nesw-resize"
          onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
        />
        <div
          className="absolute top-0 right-0 w-4 h-4 bg-transparent opacity-0 group-hover:opacity-100 cursor-nesw-resize"
          onMouseDown={(e) => handleMouseDown(e, "top-right")}
        />
        <div
          className="absolute top-0 left-0 w-4 h-4 bg-transparent opacity-0 group-hover:opacity-100 cursor-nwse-resize"
          onMouseDown={(e) => handleMouseDown(e, "top-left")}
        />

        {/* Update the dimensions display to show a loading state if needed */}
        {(resizing || isDraggingImage) && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-50 group-hover:opacity-100">
            {imageLoaded ? (
              <>
                <span>
                  {dimensions.width} × {dimensions.height}
                </span>
                <span className="ml-2">
                  | Pos: {objectPosition.x}%, {objectPosition.y}%
                </span>
              </>
            ) : (
              "Loading..."
            )}
          </div>
        )}
      </div>
    </div>
  );
};
