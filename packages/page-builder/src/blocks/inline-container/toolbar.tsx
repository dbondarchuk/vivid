import { ConfigurationProps } from "@vivid/builder";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { InlineContainerProps } from "./schema";
import { inlineContainerShortcuts } from "./shortcuts";

export const InlineContainerToolbar = (
  props: ConfigurationProps<InlineContainerProps>,
) => (
  <ShortcutsToolbar
    shortcuts={inlineContainerShortcuts}
    data={props.data}
    setData={props.setData}
  />
);
