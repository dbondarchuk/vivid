import { ConfigurationProps } from "@vivid/builder";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { SimpleContainerProps } from "./schema";
import { containerShortcuts } from "./shortcuts";

export const SimpleContainerToolbar = (
  props: ConfigurationProps<SimpleContainerProps>,
) => (
  <ShortcutsToolbar
    shortcuts={containerShortcuts}
    data={props.data}
    setData={props.setData}
  />
);
