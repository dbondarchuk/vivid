import { ConfigurationProps } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { InlineTextProps } from "./schema";
import { inlineTextShortcuts } from "./shortcuts";

export const InlineTextToolbar = (
  props: ConfigurationProps<InlineTextProps>,
) => {
  const t = useI18n("builder");

  return (
    <>
      <ShortcutsToolbar
        shortcuts={inlineTextShortcuts}
        data={props.data}
        setData={props.setData}
      />
    </>
  );
};
