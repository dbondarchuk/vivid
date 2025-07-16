import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { ButtonPropsDefaults, ButtonReaderProps } from "./schema";
import { getDefaults, styles } from "./styles";

export const Button = ({ props, style, block }: ButtonReaderProps) => {
  const text = props?.text ?? ButtonPropsDefaults.props.text;
  const url = props?.url ?? ButtonPropsDefaults.props.url;
  const defaults = getDefaults({ props, style }, false);

  const className = generateClassName();
  const base = block.base;

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
      />
      <a
        href={url}
        target={props?.target ?? "_self"}
        className={cn(className, base?.className)}
        id={base?.id}
      >
        <span>{text}</span>
      </a>
    </>
  );
};
