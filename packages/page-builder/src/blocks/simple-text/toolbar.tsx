import { ConfigurationProps } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { SimpleTextProps } from "./schema";
import { simpleTextShortcuts } from "./shortcuts";

export const SimpleTextToolbar = (
  props: ConfigurationProps<SimpleTextProps>,
) => {
  const t = useI18n("builder");

  return (
    <>
      <ShortcutsToolbar
        shortcuts={simpleTextShortcuts}
        data={props.data}
        setData={props.setData}
      />
    </>
  );
};
