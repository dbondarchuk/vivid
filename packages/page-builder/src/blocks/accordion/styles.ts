import { type AccordionProps } from "./schema";

import { ALL_STYLES } from "../../style/styles";
import { getStylesSchema } from "../../style/utils";

export const styles = ALL_STYLES;
export const zStyles = getStylesSchema(styles);

export const getDefaults = (
  { props, style }: AccordionProps,
  isEditor?: boolean
) => ({});
