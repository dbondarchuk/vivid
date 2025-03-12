import {
  useBlocks,
  useDispatchAction,
  useDocument,
} from "../../documents/editor/context";
import BaseSidebarPanel from "./configuration-panel/input-panels/helpers/base-sidebar-panel";

export const StylesPanel: React.FC = () => {
  const block = useDocument();
  const dispatchAction = useDispatchAction();

  if (!block) {
    return <p>Block not found</p>;
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
