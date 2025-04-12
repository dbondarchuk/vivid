import { getFontFamily, getPadding } from "../../style-inputs/helpers/styles";
import { ButtonProps, ButtonPropsDefaults } from "./schema";

function getRoundedCorners(props: ButtonProps["props"]) {
  const buttonStyle =
    props?.buttonStyle ?? ButtonPropsDefaults.props.buttonStyle;

  switch (buttonStyle) {
    case "rectangle":
      return undefined;
    case "pill":
      return 64;
    case "rounded":
    default:
      return 4;
  }
}

export const getButtonSizePadding = (props: ButtonProps["props"]) => {
  const size = props?.size ?? ButtonPropsDefaults.props.size;
  switch (size) {
    case "x-small":
      return [4, 8] as const;
    case "small":
      return [8, 12] as const;
    case "large":
      return [16, 32] as const;
    case "medium":
    default:
      return [12, 20] as const;
  }
};

export const getWrapperStyles = ({
  style,
}: ButtonProps): React.CSSProperties => ({
  backgroundColor: style?.backgroundColor ?? undefined,
  textAlign: style?.textAlign ?? undefined,
  padding: getPadding(style?.padding),
});

export const getLinkStyles = ({
  props,
  style,
}: ButtonProps): React.CSSProperties => {
  const padding = getButtonSizePadding(props);
  return {
    color: props?.buttonTextColor ?? ButtonPropsDefaults.props.buttonTextColor,
    fontSize: style?.fontSize ?? ButtonPropsDefaults.style.fontSize,
    fontFamily: getFontFamily(style?.fontFamily),
    fontWeight: style?.fontWeight ?? ButtonPropsDefaults.style.fontWeight,
    backgroundColor:
      props?.buttonBackgroundColor ??
      ButtonPropsDefaults.props.buttonBackgroundColor,
    borderRadius: getRoundedCorners(props),
    display:
      (props?.width ?? ButtonPropsDefaults.props.width) === "full"
        ? "block"
        : "inline-block",
    padding: `${padding[0]}px ${padding[1]}px`,
    textDecoration: "none",
  };
};
