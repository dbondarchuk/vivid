import {
  useCurrentBlock,
  useCurrentBlockId,
  useDispatchAction,
  useSelectedBlockId,
} from "@vivid/builder";
import { PlateEditor, PlateStaticEditor } from "@vivid/rte";
import { TextProps } from "./schema";
import { getStyles } from "./styles";

export const TextEditor = ({ props, style }: TextProps) => {
  const styles = getStyles({ style });
  const currentBlock = useCurrentBlock<TextProps>();
  const dispatchAction = useDispatchAction();

  const currentBlockId = useCurrentBlockId();
  const selectedBlockId = useSelectedBlockId();
  const isSelected = selectedBlockId === currentBlockId;

  const onChange = (value: any) => {
    dispatchAction({
      type: "set-block-data",
      value: {
        blockId: currentBlock.id,
        data: {
          ...currentBlock.data,
          props: {
            ...currentBlock.data?.props,
            value,
          },
        },
      },
    });
  };

  return isSelected ? (
    <PlateEditor
      value={currentBlock?.data?.props?.value}
      onChange={onChange}
      style={styles}
    />
  ) : (
    <PlateStaticEditor value={props?.value} style={styles} />
  );
};
