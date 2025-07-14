import { PlateStaticEditor } from "@vivid/rte";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { TextProps, TextPropsDefaults } from "./schema";
import { getDefaults, styles } from "./styles";

export const TextReader = ({ props, style }: TextProps) => {
  const value = props?.value ?? TextPropsDefaults.props.value;
  const defaults = getDefaults({ props, style }, false);

  const className = generateClassName();

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
      />
      <PlateStaticEditor value={value} className={className} />
    </>
  );
};
