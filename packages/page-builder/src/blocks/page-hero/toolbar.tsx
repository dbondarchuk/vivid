import { ConfigurationProps } from "@vivid/builder";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { PageHeroProps } from "./schema";
import { pageHeroShortcuts } from "./shortcuts";

export const PageHeroToolbar = (props: ConfigurationProps<PageHeroProps>) => (
  <ShortcutsToolbar
    shortcuts={pageHeroShortcuts}
    data={props.data}
    setData={props.setData}
  />
);
