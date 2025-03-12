import { ButtonProps, ButtonPropsDefaults } from "./schema";
import {
  getButtonSizePadding,
  getLinkStyles,
  getWrapperStyles,
} from "./styles";

export const Button = ({ style, props }: ButtonProps) => {
  const text = props?.text ?? ButtonPropsDefaults.props.text;
  const url = props?.url ?? ButtonPropsDefaults.props.url;

  const padding = getButtonSizePadding(props);
  const textRaise = (padding[1] * 2 * 3) / 4;
  const wrapperStyle = getWrapperStyles({ style });
  const linkStyle = getLinkStyles({ props, style });

  return (
    <div style={wrapperStyle}>
      <a href={url} style={linkStyle} target="_blank">
        <span
          dangerouslySetInnerHTML={{
            __html: `<!--[if mso]><i style="letter-spacing: ${padding[1]}px;mso-font-width:-100%;mso-text-raise:${textRaise}" hidden>&nbsp;</i><![endif]-->`,
          }}
        />
        <span>{text}</span>
        <span
          dangerouslySetInnerHTML={{
            __html: `<!--[if mso]><i style="letter-spacing: ${padding[1]}px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]-->`,
          }}
        />
      </a>
    </div>
  );
};
