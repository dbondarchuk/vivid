import { useI18n } from "@vivid/i18n";
import {
  useDispatchAction,
  useEditorStateStore,
  useSelectedBlock,
} from "../../../documents/editor/context";
import { TEditorBlock } from "../../../documents/editor/core";
import BaseSidebarPanel from "./input-panels/helpers/base-sidebar-panel";
import { BaseBlockProps } from "../../../documents/types";

function renderMessage(val: string) {
  return (
    <div className="m-3 p-1 border-dashed border border-secondary">
      <div className="text-secondary-foreground">{val}</div>
    </div>
  );
}

export const ConfigurationPanel: React.FC = () => {
  const selectedBlock: TEditorBlock = useSelectedBlock();
  const dispatchAction = useDispatchAction();

  const blocks = useEditorStateStore((s) => s.blocks);
  const t = useI18n("builder");

  if (!selectedBlock) {
    return renderMessage(
      t("baseBuilder.inspector.configurationPanel.clickOnBlockToInspect")
    );
  }

  const setBlock = (data: any) => {
    dispatchAction({
      type: "set-block-data",
      value: { blockId: selectedBlock.id, data },
    });
  };

  const setBase = (base: BaseBlockProps) => {
    dispatchAction({
      type: "set-block-base",
      value: { blockId: selectedBlock.id, base },
    });
  };

  const { data, type, id, base } = selectedBlock;
  const Panel = blocks[type].Configuration;

  return (
    <BaseSidebarPanel title={blocks[selectedBlock.type].displayName}>
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
