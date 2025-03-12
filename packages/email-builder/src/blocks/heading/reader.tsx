import { HeadingProps, HeadingPropsDefaults } from "./schema";
import { getStyles } from "./styles";

export const Heading = ({ props, style }: HeadingProps) => {
  const level = props?.level ?? HeadingPropsDefaults.props.level;
  const text = props?.text ?? HeadingPropsDefaults.props.text;
  const hStyle = getStyles({ props, style });

  switch (level) {
    case "h1":
      return <h1 style={hStyle}>{text}</h1>;
    case "h2":
      return <h2 style={hStyle}>{text}</h2>;
    case "h3":
      return <h3 style={hStyle}>{text}</h3>;
  }
};
