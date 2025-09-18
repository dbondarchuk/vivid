import { useI18n } from "@vivid/i18n";
import { ToolbarButton, ToolbarGroup } from "@vivid/ui";
import { ClipboardCopy, ClipboardPaste } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import {
  useBlockParentData,
  useBlockType,
  useDispatchAction,
  useEditorStateStore,
  useRootBlockId,
  useSelectedBlockId,
  useSelectedView,
} from "../../../documents/editor/context";
import { useBlockClipboard } from "../../../documents/editor/copy";
import { TEditorBlock } from "../../../documents/editor/core";
import { cloneBlock } from "../../../documents/helpers/blocks";
import { usePortalContext } from "../portal-context";

const useParentData = (blockId: string | null | undefined) => {
  const parentData = useBlockParentData(blockId ?? null);
  const rootBlockId = useRootBlockId();
  const rootBlockType = useBlockType(rootBlockId);
  return (
    parentData ?? {
      parentBlockId: rootBlockId,
      parentProperty: null,
      index: null,
      depth: null,
      parentBlockType: rootBlockType,
    }
  );
};

export const ToolbarCopyPasteGroup = ({
  canDoBlockActions,
  disableClone,
}: {
  canDoBlockActions: boolean;
  disableClone: boolean;
}) => {
  const t = useI18n("builder");
  const dispatchAction = useDispatchAction();

  const isFirefox = useMemo(() => {
    return navigator.userAgent?.toLocaleLowerCase().includes("firefox");
  }, []);

  const store = useEditorStateStore();
  const { document: portalDocument } = usePortalContext();

  const selectedBlockId = useSelectedBlockId();
  const { hasBlockClipboard, copyToClipboard, clipboardBlock } =
    useBlockClipboard();

  const { hasBlockClipboard: hasBlockClipboardPortal } =
    useBlockClipboard(portalDocument);

  const parentData = useParentData(selectedBlockId);

  const isPreview = useSelectedView() === "preview";

  const handlePasteBlock = useCallback(
    (block: TEditorBlock | null | undefined) => {
      if (block && parentData && parentData.parentBlockId) {
        const allowedParents = store.getState().blocks[block.type]?.allowedIn;
        if (
          allowedParents &&
          parentData.parentBlockType &&
          !allowedParents.includes(parentData.parentBlockType)
        ) {
          return;
        }

        const allowedBlockTypes =
          store.getState().allowedBlockTypes[
            `${parentData.parentBlockId}/${parentData.parentProperty}`
          ];
        if (
          allowedBlockTypes?.length &&
          !allowedBlockTypes.includes(block.type)
        ) {
          return;
        }

        dispatchAction({
          type: "add-block",
          value: {
            block: cloneBlock(block),
            parentBlockId: parentData.parentBlockId,
            parentBlockProperty: parentData.parentProperty ?? undefined,
            index: parentData.index ? parentData.index + 1 : "last",
          },
        });
      }
    },
    [dispatchAction, parentData],
  );

  useEffect(() => {
    if (isPreview) return;

    const handleCopy = (event: ClipboardEvent) => {
      const somethingWasCopied = event.clipboardData?.types?.length;
      const selection = portalDocument.getSelection();
      const hasUserSelection = selection && !selection.isCollapsed;

      if (selectedBlockId && !somethingWasCopied && !hasUserSelection) {
        event.clipboardData?.setData(
          "text/plain",
          `block:${JSON.stringify(store.getState().indexes[selectedBlockId]?.block)}`,
        );
        event.preventDefault();
      }
    };

    const handlePaste = (event: ClipboardEvent) => {
      const text = event.clipboardData?.getData("text");
      if (text?.startsWith("block:")) {
        event.preventDefault();
        event.stopPropagation();
        const block = JSON.parse(text.slice(6)) as TEditorBlock;
        handlePasteBlock(block);
      }
    };

    portalDocument.addEventListener("copy", handleCopy);
    portalDocument.addEventListener("paste", handlePaste);

    return () => {
      portalDocument.removeEventListener("copy", handleCopy);
      portalDocument.removeEventListener("paste", handlePaste);
    };
  }, [portalDocument, selectedBlockId, store, handlePasteBlock, isPreview]);

  return (
    <ToolbarGroup>
      <ToolbarButton
        tooltip={t("baseBuilder.builderToolbar.copy")}
        disabled={
          !canDoBlockActions || disableClone || !selectedBlockId || isPreview
        }
        onClick={() =>
          selectedBlockId &&
          copyToClipboard(store.getState().indexes[selectedBlockId]?.block)
        }
      >
        <ClipboardCopy />
      </ToolbarButton>
      {/* Firefox shows a popup when reading the clipboard */}
      {!isFirefox && (
        <ToolbarButton
          tooltip={t("baseBuilder.builderToolbar.paste")}
          disabled={
            (!hasBlockClipboard && !hasBlockClipboardPortal) ||
            !parentData ||
            isPreview
          }
          onClick={() => {
            handlePasteBlock(clipboardBlock);
          }}
        >
          <ClipboardPaste />
        </ToolbarButton>
      )}
    </ToolbarGroup>
  );
};
