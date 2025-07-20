import {
  useSelectedSidebarTab,
  useSetSidebarTab,
} from "../../documents/editor/context";

import {
  ScrollArea,
  Sidebar,
  SidebarContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@vivid/ui";
import { ConfigurationPanel } from "./configuration-panel";
import { StylesPanel } from "./styles-panel";
import { Paintbrush, SquareDashedMousePointer } from "lucide-react";
import { useI18n } from "@vivid/i18n";
import React from "react";

// Define the SidebarTab type
export type SidebarTab = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  content: React.ReactNode;
};

export const InspectorDrawer: React.FC<{ extraTabs?: SidebarTab[] }> = ({
  extraTabs = [],
}) => {
  const selectedTab = useSelectedSidebarTab();
  const setSidebarTab = useSetSidebarTab();
  const t = useI18n("builder");

  // Default tabs
  const defaultTabs: SidebarTab[] = [
    {
      value: "styles",
      label: t("baseBuilder.inspector.styles"),
      icon: <Paintbrush size={16} />,
      content: <StylesPanel />,
    },
    {
      value: "block-configuration",
      label: t("baseBuilder.inspector.inspect"),
      icon: <SquareDashedMousePointer size={16} />,
      content: <ConfigurationPanel />,
    },
  ];

  const allTabs = [...defaultTabs, ...extraTabs];

  return (
    <Sidebar
      side="right"
      className="absolute z-[45] h-full group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1.2)] pt-0 [&>[data-sidebar=sidebar]]:sticky [&>[data-sidebar=sidebar]]:top-0 [&>[data-sidebar=sidebar]]:h-fit"
      variant="inset"
    >
      <SidebarContent className="w-full border-b border-secondary bg-background relative h-full overflow-hidden">
        <div className="px-2 py-2">
          <Tabs
            defaultValue={allTabs[0].value}
            value={selectedTab}
            onValueChange={(value) => setSidebarTab(value as any)}
          >
            <TabsList className="w-full justify-between sticky top-0 z-[1] flex-wrap h-auto items-center">
              {allTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="gap-2"
                >
                  {tab.icon} {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
              {allTabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  {tab.content}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
