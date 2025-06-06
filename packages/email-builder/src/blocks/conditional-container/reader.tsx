import { evaluate, ReaderBlock } from "@vivid/builder";
import { ConditionalContainerReaderProps } from "./schema";

export const ConditionalContainerReader = ({
  props,
  ...rest
}: ConditionalContainerReaderProps) => {
  const thenChildren = props?.then?.children ?? [];
  const otherwiseChildren = props?.otherwise?.children ?? [];
  if (!props?.condition) return <></>;

  let result: boolean;
  try {
    result = !!evaluate(props?.condition, rest.args);
  } catch (e) {
    console.error(e);
    result = false;
  }

  return (
    <>
      {(result ? thenChildren : otherwiseChildren).map((child) => (
        <ReaderBlock key={child.id} block={child} {...rest} />
      ))}
    </>
  );
};
