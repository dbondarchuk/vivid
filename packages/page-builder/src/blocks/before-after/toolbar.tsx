import { ConfigurationProps } from "@vivid/builder";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { BeforeAfterProps } from "./schema";
import { beforeAfterShortcuts } from "./shortcuts";

export const BeforeAfterToolbar = (
  props: ConfigurationProps<BeforeAfterProps>,
) => {
  return (
    <>
      <ShortcutsToolbar
        shortcuts={beforeAfterShortcuts}
        data={props.data}
        setData={props.setData}
      />
    </>
  );
};
