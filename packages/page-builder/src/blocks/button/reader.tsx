import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { ButtonProps, ButtonPropsDefaults } from "./schema";
import { getDefaults, styles } from "./styles";

export const Button = ({ props, style }: ButtonProps) => {
  const text = props?.text ?? ButtonPropsDefaults.props.text;
  const url = props?.url ?? ButtonPropsDefaults.props.url;
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
      <a href={url} target="_blank" className={className}>
        <span>{text}</span>
      </a>
    </>
  );
};
