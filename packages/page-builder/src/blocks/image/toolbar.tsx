import { ConfigurationProps } from "@vivid/builder";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { ImageProps } from "./schema";
import { imageShortcuts } from "./shortcuts";

export const ImageToolbar = (props: ConfigurationProps<ImageProps>) => (
  <ShortcutsToolbar
    shortcuts={imageShortcuts}
    data={props.data}
    setData={props.setData}
  />
);
