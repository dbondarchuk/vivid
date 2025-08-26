import { TabsContent } from "@vivid/ui";
import { ComponentProps } from "react";
import { useDocument } from "../../documents/editor/context";
import { Reader } from "../../documents/reader/block";

export const Preview = ({
  args,
  readerBlocks,
}: {
  args: any;
  readerBlocks: ComponentProps<typeof Reader>["blocks"];
}) => {
  const document = useDocument();
  return (
    <TabsContent value="preview" className="mt-0">
      <Reader
        document={document}
        args={args || {}}
        blocks={readerBlocks}
        isEditor
      />
    </TabsContent>
  );
};
