"use client";

import { useI18n } from "@vivid/i18n";
import { ToolbarButton, ToolbarGroup } from "@vivid/ui";
import { ArrowDown, ArrowUp, Copy, Trash } from "lucide-react";
import {
  useBlockDisableOptions,
  useDispatchAction,
  useRootBlockId,
  useSelectedBlockId,
  useSetSelectedBlockId,
} from "../../../documents/editor/context";

export const ToolbarBlockGroups = () => {
  const t = useI18n("builder");
  const dispatchAction = useDispatchAction();
  const selectedBlockId = useSelectedBlockId();
  const rootBlockId = useRootBlockId();
  const disable = useBlockDisableOptions(selectedBlockId);
  const canDoBlockActions = selectedBlockId && selectedBlockId !== rootBlockId;
  const setSelectedBlockId = useSetSelectedBlockId();

  const blockId = selectedBlockId ?? rootBlockId;
  return (
    <>
      <ToolbarGroup>
        <ToolbarButton
          tooltip={t("baseBuilder.builderToolbar.moveUp")}
          disabled={!canDoBlockActions || disable?.move}
          onClick={() =>
            dispatchAction({
              type: "move-block-up",
              value: {
                blockId,
              },
            })
          }
        >
          <ArrowUp />
        </ToolbarButton>
        <ToolbarButton
          tooltip={t("baseBuilder.builderToolbar.moveDown")}
          disabled={!canDoBlockActions || disable?.move}
          onClick={() =>
            dispatchAction({
              type: "move-block-down",
              value: {
                blockId,
              },
            })
          }
        >
          <ArrowDown />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarButton
          tooltip={t("baseBuilder.builderToolbar.clone")}
          disabled={!canDoBlockActions || disable?.clone}
          onClick={() =>
            dispatchAction({
              type: "clone-block",
              value: {
                blockId,
              },
            })
          }
        >
          <Copy />
        </ToolbarButton>
        <ToolbarButton
          tooltip={t("baseBuilder.builderToolbar.delete")}
          disabled={!canDoBlockActions || disable?.delete}
          onClick={() => {
            dispatchAction({
              type: "delete-block",
              value: {
                blockId,
              },
            });

            setSelectedBlockId(null);
          }}
        >
          <Trash />
        </ToolbarButton>
      </ToolbarGroup>
    </>
  );
};
