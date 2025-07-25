import { ConfigurationProps } from "@vivid/builder";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { TextProps } from "./schema";
import { textShortcuts } from "./shortcuts";

export const TextToolbar = (props: ConfigurationProps<TextProps>) => (
  <ShortcutsToolbar
    shortcuts={textShortcuts}
    data={props.data}
    setData={props.setData}
  />
);
