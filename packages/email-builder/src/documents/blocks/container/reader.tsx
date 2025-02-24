import { Container as BaseContainer } from "@usewaypoint/block-container";

import { ReaderBlock } from "../../reader/block";
import { ContainerReaderProps } from "./schema";

export default function ContainerReader({
  style,
  props,
  args,
  document,
}: ContainerReaderProps) {
  const childrenIds = props?.childrenIds ?? [];
  return (
    <BaseContainer style={style}>
      {childrenIds.map((childId) => (
        <ReaderBlock
          key={childId}
          id={childId}
          document={document}
          args={args}
        />
      ))}
    </BaseContainer>
  );
}
