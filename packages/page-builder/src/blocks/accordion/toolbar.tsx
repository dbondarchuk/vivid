import { ConfigurationProps } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { AccordionProps } from "./schema";

export const AccordionToolbar = (props: ConfigurationProps<AccordionProps>) => {
  const t = useI18n("builder");

  return <>{/* No shortcuts for accordion */}</>;
};
