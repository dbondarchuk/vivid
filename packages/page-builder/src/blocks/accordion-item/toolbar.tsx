import { ConfigurationProps } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { AccordionItemProps } from "./schema";

export const AccordionItemToolbar = (
  props: ConfigurationProps<AccordionItemProps>,
) => {
  const t = useI18n("builder");

  return <>{/* No shortcuts for accordion item */}</>;
};
