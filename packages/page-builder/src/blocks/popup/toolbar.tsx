import { ConfigurationProps } from "@vivid/builder";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { PopupProps } from "./schema";
import { popupShortcuts } from "./shortcuts";

export const PopupToolbar = (props: ConfigurationProps<PopupProps>) => (
  <ShortcutsToolbar
    shortcuts={popupShortcuts}
    data={props.data}
    setData={props.setData}
  />
);
