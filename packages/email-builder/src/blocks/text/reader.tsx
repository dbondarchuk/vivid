import { PlateStaticEditor } from "@vivid/rte";
import { TextProps } from "./schema";
import { getStyles } from "./styles";

export const TextReader = ({ style, props }: TextProps) => {
  const styles = getStyles({ style });
  const value = props?.value ?? [];
  return <PlateStaticEditor value={value} style={styles} />;
};
