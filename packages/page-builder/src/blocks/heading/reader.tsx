import { v4 } from "uuid";
import { BlockStyle } from "../../helpers/styling";
import { HeadingProps, HeadingPropsDefaults } from "./schema";
import { getDefaults, styles } from "./styles";
import { generateClassName } from "../../helpers/class-name-generator";

export const Heading = ({ props, style }: HeadingProps) => {
  const level = props?.level ?? HeadingPropsDefaults.props.level;
  const text = props?.text ?? HeadingPropsDefaults.props.text;
  const defaults = getDefaults({ props, style }, false);

  const className = generateClassName();
  const Element = level;

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
      />
      <Element className={className}>{text}</Element>
    </>
  );
};
