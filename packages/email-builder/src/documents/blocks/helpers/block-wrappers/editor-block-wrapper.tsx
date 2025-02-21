import { JSX, useState } from "react";

import { useCurrentBlockId } from "../../../editor/block";
import {
  setSelectedBlockId,
  useSelectedBlockId,
} from "../../../editor/context";

import { cn } from "@vivid/ui";
import TuneMenu from "./tune-menu";

type TEditorBlockWrapperProps = {
  children: JSX.Element;
};

export default function EditorBlockWrapper({
  children,
}: TEditorBlockWrapperProps) {
  const selectedBlockId = useSelectedBlockId();
  const [mouseInside, setMouseInside] = useState(false);
  const blockId = useCurrentBlockId();

  const renderMenu = () => {
    if (selectedBlockId !== blockId) {
      return null;
    }
    return <TuneMenu blockId={blockId} />;
  };

  return (
    <div
      className={cn(
        "relative max-w-full -outline-offset-1",
        selectedBlockId === blockId
          ? "outline outline-blue-600"
          : mouseInside
            ? "outline outline-blue-200"
            : ""
      )}
      onMouseEnter={(ev) => {
        setMouseInside(true);
        ev.stopPropagation();
      }}
      onMouseLeave={() => {
        setMouseInside(false);
      }}
      onClick={(ev) => {
        setSelectedBlockId(blockId);
        ev.stopPropagation();
        ev.preventDefault();
      }}
    >
      {renderMenu()}
      {children}
    </div>
  );
}
