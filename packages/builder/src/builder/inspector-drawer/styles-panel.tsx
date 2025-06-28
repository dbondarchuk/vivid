import { useI18n } from "@vivid/i18n";
import {
  useBlocks,
  useDispatchAction,
  useDocument,
} from "../../documents/editor/context";
import BaseSidebarPanel from "./configuration-panel/input-panels/helpers/base-sidebar-panel";

export const StylesPanel: React.FC = () => {
  const block = useDocument();
  const dispatchAction = useDispatchAction();
  const t = useI18n("builder");

  if (!block) {
    return <p>{t("baseBuilder.inspector.stylesPanel.blockNotFound")}</p>;
  }

  const { data, type } = block;
  const blocks = useBlocks();
  const Panel = blocks[block.type].Configuration;

  const setData = (data: any) => {
    dispatchAction({
      type: "set-block-data",
      value: { blockId: block.id, data },
    });
  };

  return (
    <BaseSidebarPanel title={blocks[type].displayName}>
      <Panel key="root" data={data} setData={setData} />
    </BaseSidebarPanel>
  );
};
