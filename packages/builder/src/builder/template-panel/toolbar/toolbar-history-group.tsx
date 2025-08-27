"use client";

import { useI18n } from "@vivid/i18n";
import { ToolbarButton, ToolbarGroup } from "@vivid/ui";
import { Redo2, Undo2 } from "lucide-react";
import { useCallback, useEffect } from "react";
import { usePortalContext } from "../../../documents/blocks/helpers/block-wrappers/portal-context";
import {
  useCanRedoHistory,
  useCanUndoHistory,
  useRedoHistory,
  useUndoHistory,
} from "../../../documents/editor/context";
import { isUndoRedo } from "../../../documents/helpers/is-undo-redo";

export const ToolbarHistoryGroup = () => {
  const t = useI18n("builder");
  const canUndo = useCanUndoHistory();
  const canRedo = useCanRedoHistory();
  const undoHistory = useUndoHistory();
  const redoHistory = useRedoHistory();
  const { document: portalDocument } = usePortalContext();

  const undoRedo = useCallback(
    (e: KeyboardEvent) => {
      if (isUndoRedo(e) === "undo" && canUndo) {
        undoHistory();
        e.preventDefault();
        e.stopPropagation();
      } else if (isUndoRedo(e) === "redo" && canRedo) {
        redoHistory();
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [canUndo, canRedo, undoHistory, redoHistory],
  );

  useEffect(() => {
    window.addEventListener("keydown", undoRedo);
    if (portalDocument && portalDocument.defaultView !== window) {
      portalDocument.defaultView?.addEventListener("keydown", undoRedo);
    }
    return () => {
      window.removeEventListener("keydown", undoRedo);
      if (portalDocument && portalDocument.defaultView !== window) {
        portalDocument.defaultView?.removeEventListener("keydown", undoRedo);
      }
    };
  }, [undoRedo, portalDocument]);

  return (
    <ToolbarGroup>
      <ToolbarButton
        tooltip={t("baseBuilder.builderToolbar.undo")}
        disabled={!canUndo}
        onClick={() => undoHistory()}
      >
        <Undo2 />
      </ToolbarButton>
      <ToolbarButton
        tooltip={t("baseBuilder.builderToolbar.redo")}
        disabled={!canRedo}
        onClick={() => redoHistory()}
      >
        <Redo2 />
      </ToolbarButton>
    </ToolbarGroup>
  );
};
