import {
  EditorChildren,
  useCurrentBlock,
  useDispatchAction,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { ContainerProps } from "./schema";
import { BaseContainer } from "./base";

export const ContainerEditor = ({ style, props }: ContainerProps) => {
  const currentBlock = useCurrentBlock<ContainerProps>();
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const children = currentBlock.data?.props?.children;

  return (
    <BaseContainer style={style}>
      <EditorChildren
        block={currentBlock}
        property="data.props"
        children={children || []}
        onChange={({ block, blockId, children }) => {
          dispatchAction({
            type: "set-block-data",
            value: {
              blockId: currentBlock.id,
              data: {
                ...currentBlock.data,
                props: {
                  ...currentBlock.data?.props,
                  children,
                },
              },
            },
          });

          setSelectedBlockId(blockId);
        }}
      />
    </BaseContainer>
  );
};
