import { Text } from "@usewaypoint/block-text";
import { PlateStaticEditor } from "@vivid/rte";
import { TextProps } from "./schema";

export default function TextReader({ style, props }: TextProps) {
  const styles = Text({ style }).props.style;
  const value = props?.value ?? [];
  return <PlateStaticEditor value={value} style={styles} />;
}
