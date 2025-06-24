import Header from "@/components/admin/layout/header";
import { AppSidebar } from "@/components/admin/layout/sidebar";

import { navItems } from "@/constants/data";
import { AvailableApps } from "@vivid/app-store";
import { ServicesContainer } from "@vivid/services";
import { NavItemGroup } from "@vivid/types";
import { BreadcrumbsProvider, SidebarInset, SidebarProvider } from "@vivid/ui";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { CookiesProvider } from "../../../components/cookies-provider";
import { PendingAppointmentsToastStream } from "./pending-appointments-toast-stream";

export const metadata: Metadata = {
  title: "VIVID Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { name, logo } =
    await ServicesContainer.ConfigurationService().getConfiguration("general");

  const groups: NavItemGroup[] = [
    ...navItems.map((x) => ({
      ...x,
      children: [
        ...x.children.map((y) => ({
          ...y,
          items: y.items ? [...y.items] : [],
        })),
      ],
    })),
  ];

  const menuItems = groups.flatMap((group) => group.children);

  const appsWithMenu = await ServicesContainer.ConnectedAppsService().getApps();
  const appsMenus = appsWithMenu
    .map(({ name }) => AvailableApps[name]?.menuItems || [])
    .filter((menus) => menus && menus.length > 0)
    .flatMap((item) => item);

  appsMenus
    .filter((item) => !item.parent && !item.isHidden)
    .sort(({ order: aOrder = 0 }, { order: bOrder = 0 }) => bOrder - aOrder)
    .forEach(({ Page: _, ...item }) => {
      menuItems.push({
        ...item,
        href: `/admin/dashboard/${item.href}`,
        title: item.label,
      });
    });

  appsMenus
    .filter((item) => !!item.parent && !item.isHidden)
    .sort(({ order: aOrder = 0 }, { order: bOrder = 0 }) => bOrder - aOrder)
    .forEach(({ Page: _, ...item }) => {
      const parent = menuItems.find((parent) => item.parent === parent.id);
      if (!parent) return;

      parent.items = parent.items || [];

      parent.items.push({
        ...item,
        href: `/admin/dashboard/${item.href}`,
        title: item.label,
      });
    });

  return (
    <div className="flex">
      <SidebarProvider>
        <BreadcrumbsProvider>
          <CookiesProvider>
            <NuqsAdapter>
              <AppSidebar menuItems={groups} name={name} logo={logo} />
              <PendingAppointmentsToastStream />

              <SidebarInset>
                {/* <main className="w-full flex-1 overflow-hidden"> */}
                <Header />
                {children}
                {/* </main> */}
              </SidebarInset>
            </NuqsAdapter>
          </CookiesProvider>
        </BreadcrumbsProvider>
      </SidebarProvider>
    </div>
  );
}
