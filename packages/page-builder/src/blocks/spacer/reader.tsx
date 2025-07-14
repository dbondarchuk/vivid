import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { SpacerProps } from "./schema";
import { getDefaults, styles } from "./styles";

export const Spacer = ({ props, style }: SpacerProps) => {
  const className = generateClassName();
  const defaults = getDefaults({ props, style });

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        defaults={defaults}
        styles={style}
      />
      <div className={className} />
    </>
  );
};
