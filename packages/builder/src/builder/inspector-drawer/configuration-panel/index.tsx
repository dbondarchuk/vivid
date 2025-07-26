import { useI18n } from "@vivid/i18n";
import {
  useDispatchAction,
  useEditorStateStore,
  useSelectedBlock,
} from "../../../documents/editor/context";
import { BaseBlockProps } from "../../../documents/types";
import { BaseSidebarPanel } from "./input-panels/helpers/base-sidebar-panel";
import { useCallback } from "react";

function renderMessage(val: string) {
  return (
    <div className="m-3 p-1 border-dashed border border-secondary">
      <div className="text-secondary-foreground">{val}</div>
    </div>
  );
}

export const ConfigurationPanel: React.FC = () => {
  const selectedBlock = useSelectedBlock();
  const dispatchAction = useDispatchAction();

  const blocks = useEditorStateStore((s) => s.blocks);
  const t = useI18n("builder");

  const setBlock = useCallback(
    (data: any) => {
      if (!selectedBlock) return;
      dispatchAction({
        type: "set-block-data",
        value: { blockId: selectedBlock.id, data },
      });
    },
    [dispatchAction, selectedBlock?.id]
  );

  const setBase = useCallback(
    (base: BaseBlockProps) => {
      if (!selectedBlock) return;
      dispatchAction({
        type: "set-block-base",
        value: { blockId: selectedBlock.id, base },
      });
    },
    [dispatchAction, selectedBlock?.id]
  );

  if (!selectedBlock) {
    return renderMessage(
      t("baseBuilder.inspector.configurationPanel.clickOnBlockToInspect")
    );
  }

  const { data, type, id, base } = selectedBlock;
  const Panel = blocks[type].Configuration;

  return (
    <BaseSidebarPanel title={t(blocks[selectedBlock.type].displayName)}>
      <Panel
        data={data}
        setData={setBlock}
        key={id}
        base={base}
        onBaseChange={setBase}
      />
    </BaseSidebarPanel>
  );
};
