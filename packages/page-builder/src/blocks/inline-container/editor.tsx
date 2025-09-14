import {
  EditorChildren,
  useBlockEditor,
  useCurrentBlock,
} from "@vivid/builder";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { useResizeBlockStyles } from "../../helpers/use-resize-block-styles";
import { InlineContainerProps, styles } from "./schema";

const allowOnly = ["InlineText", "Icon", "Link"];

export const InlineContainerEditor = ({
  style,
  props,
}: InlineContainerProps) => {
  const currentBlock = useCurrentBlock<InlineContainerProps>();
  const onResize = useResizeBlockStyles();
  const overlayProps = useBlockEditor(currentBlock.id, onResize);

  const className = useClassName();
  const base = currentBlock.base;

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={currentBlock.data?.style}
      />
      <span className={className} id={base?.id} {...overlayProps}>
        <EditorChildren
          blockId={currentBlock.id}
          property="props"
          allowOnly={allowOnly}
        />
      </span>
    </>
  );
};
