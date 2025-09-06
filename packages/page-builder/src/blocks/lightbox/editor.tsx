import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import { LightboxProvider } from "./context";
import { Lightbox } from "./lightbox";
import { LightboxProps } from "./schema";

export const LightboxEditor = () => {
  const currentBlock = useCurrentBlock<LightboxProps>();

  return (
    <LightboxProvider>
      <EditorChildren blockId={currentBlock.id} property="props" />
      <Lightbox {...currentBlock.data?.props} />
    </LightboxProvider>
  );
};
