import { Text } from "@usewaypoint/block-text";
import { PlateEditor, PlateStaticEditor } from "@vivid/rte";
import { useCurrentBlockId } from "../../editor/block";
import {
  setDocument,
  useDocument,
  useSelectedBlockId,
} from "../../editor/context";
import { TextProps } from "./schema";

export function TextEditor({ props, style }: TextProps) {
  const styles = Text({ style }).props.style;

  const document = useDocument();
  const currentBlockId = useCurrentBlockId();
  const selectedBlockId = useSelectedBlockId();

  const isSelected = selectedBlockId === currentBlockId;

  const onChange = (value: any) => {
    setDocument({
      [currentBlockId]: {
        type: "Text",
        data: {
          ...document[currentBlockId].data,
          props: {
            ...((document[currentBlockId].data as any) || {}).props,
            value: value,
          },
        },
      },
    });
  };

  return isSelected ? (
    <PlateEditor value={props?.value} onChange={onChange} style={styles} />
  ) : (
    <PlateStaticEditor value={props?.value} style={styles} />
  );
}
