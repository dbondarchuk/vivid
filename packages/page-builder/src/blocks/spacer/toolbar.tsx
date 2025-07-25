import { ConfigurationProps } from "@vivid/builder";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { SpacerProps } from "./schema";
import { spacerShortcuts } from "./shortcuts";

export const SpacerToolbar = (props: ConfigurationProps<SpacerProps>) => (
  <ShortcutsToolbar
    shortcuts={spacerShortcuts}
    data={props.data}
    setData={props.setData}
  />
);
