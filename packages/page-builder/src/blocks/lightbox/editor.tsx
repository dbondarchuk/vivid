import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import { LightboxProvider } from "./context";
import { LightboxProps } from "./schema";

export const LightboxEditor = () => {
  const currentBlock = useCurrentBlock<LightboxProps>();

  return (
    <LightboxProvider>
      <EditorChildren blockId={currentBlock.id} property="props" />
      {/* Do not use Lightbox in editor, as it will interfere with the image editor */}
      {/* <Lightbox {...currentBlock.data?.props} /> */}
    </LightboxProvider>
  );
};
