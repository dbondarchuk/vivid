import { useI18n } from "@vivid/i18n";
import {
  useBlocks,
  useDispatchAction,
  useDocument,
} from "../../documents/editor/context";
import BaseSidebarPanel from "./configuration-panel/input-panels/helpers/base-sidebar-panel";
import { BaseBlockProps } from "../../documents/types";

export const StylesPanel: React.FC = () => {
  const block = useDocument();
  const dispatchAction = useDispatchAction();
  const t = useI18n("builder");

  if (!block) {
    return <p>{t("baseBuilder.inspector.stylesPanel.blockNotFound")}</p>;
  }

  const { data, type, base } = block;
  const blocks = useBlocks();
  const Panel = blocks[block.type].Configuration;

  const setData = (data: any) => {
    dispatchAction({
      type: "set-block-data",
      value: { blockId: block.id, data },
    });
  };

  const setBase = (base: BaseBlockProps) => {
    dispatchAction({
      type: "set-block-base",
      value: { blockId: block.id, base },
    });
  };

  return (
    <BaseSidebarPanel title={blocks[type].displayName}>
      <Panel
        key="root"
        data={data}
        setData={setData}
        base={base}
        onBaseChange={setBase}
      />
    </BaseSidebarPanel>
  );
};
