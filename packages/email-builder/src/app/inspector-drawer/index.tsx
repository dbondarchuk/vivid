import {
  setSidebarTab,
  useSelectedSidebarTab,
} from "../../documents/editor/context";

import {
  Sidebar,
  SidebarContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@vivid/ui";
import ConfigurationPanel from "./configuration-panel";
import StylesPanel from "./styles-panel";
import { Paintbrush, SquareDashedMousePointer } from "lucide-react";

export const INSPECTOR_DRAWER_WIDTH = 320;

export default function InspectorDrawer() {
  const selectedTab = useSelectedSidebarTab();

  return (
    <Sidebar side="right" className="absolute" variant="inset">
      <SidebarContent className="w-full border-b border-secondary bg-background relative">
        <div className="px-2 py-2">
          <Tabs
            defaultValue="styles"
            value={selectedTab}
            onValueChange={(value) => setSidebarTab(value as any)}
          >
            <TabsList className="w-full justify-between sticky top-0">
              <TabsTrigger value="styles" className="gap-2">
                <Paintbrush size={16} /> Styles
              </TabsTrigger>
              <TabsTrigger value="block-configuration" className="gap-2">
                <SquareDashedMousePointer size={16} /> Inspect
              </TabsTrigger>
            </TabsList>
            <TabsContent value="styles">
              <StylesPanel />
            </TabsContent>
            <TabsContent value="block-configuration">
              <ConfigurationPanel />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
