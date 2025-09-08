import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import { BaseContainer } from "./base";
import { ContainerProps } from "./schema";

export const ContainerEditor = ({ style, props }: ContainerProps) => {
  const currentBlock = useCurrentBlock<ContainerProps>();

  return (
    <BaseContainer style={currentBlock.data?.style}>
      <EditorChildren blockId={currentBlock.id} property="props" />
    </BaseContainer>
  );
};
