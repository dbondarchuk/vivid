import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import { BaseContainer } from "./base";
import { ContainerProps } from "./schema";

export const ContainerEditor = ({ style, props }: ContainerProps) => {
  const currentBlock = useCurrentBlock<ContainerProps>();

  const children = currentBlock.data?.props?.children;

  return (
    <BaseContainer style={currentBlock.data?.style}>
      <EditorChildren
        block={currentBlock}
        property="props"
        children={children || []}
      />
    </BaseContainer>
  );
};
