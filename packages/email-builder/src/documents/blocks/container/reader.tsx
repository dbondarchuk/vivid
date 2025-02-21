import { Container as BaseContainer } from "@usewaypoint/block-container";

import { ContainerProps } from "./schema";
import { ReaderBlock } from "../../reader/block";

export default function ContainerReader({ style, props }: ContainerProps) {
  const childrenIds = props?.childrenIds ?? [];
  return (
    <BaseContainer style={style}>
      {childrenIds.map((childId) => (
        <ReaderBlock key={childId} id={childId} />
      ))}
    </BaseContainer>
  );
}
