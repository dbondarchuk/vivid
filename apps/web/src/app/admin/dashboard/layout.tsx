import Header from "@/components/admin/layout/header";
import { AppSidebar } from "@/components/admin/layout/sidebar";

import { navItems } from "@/constants/data";
import { AvailableApps } from "@vivid/app-store";
import { ServicesContainer } from "@vivid/services";
import { ComplexApp, NavItemWithOptionalChildren } from "@vivid/types";
import { BreadcrumbsProvider, SidebarInset, SidebarProvider } from "@vivid/ui";
import { DateTime } from "luxon";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { PendingAppointmentsToast } from "./pending-appointments-toast";

export const metadata: Metadata = {
  title: "CMS Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { name, logo } =
    await ServicesContainer.ConfigurationService().getConfiguration("general");

  const beforeNow = DateTime.now().minus({ hours: 1 }).toJSDate();

  const pendingAppointments =
    await ServicesContainer.EventsService().getPendingAppointments(
      0,
      beforeNow
    );

  const menuItems: NavItemWithOptionalChildren[] = [
    ...navItems.map((x) => ({
      ...x,
      items: x.items ? [...x.items] : [],
    })),
  ];

  const appsWithMenu =
    await ServicesContainer.ConnectedAppService().getAppsByType("complex");
  const appsMenus = appsWithMenu.map(
    ({ name }) => (AvailableApps[name] as ComplexApp)?.menuItem
  );

  appsMenus
    .filter((item) => !item.parent)
    .forEach((item) => {
      menuItems.push({
        ...item,
        href: `/admin/dashboard/${item.href}`,
        title: item.label,
      });
    });

  appsMenus
    .filter((item) => !!item.parent)
    .forEach((item) => {
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
          <NuqsAdapter>
            <AppSidebar menuItems={menuItems} name={name} logo={logo} />
            <PendingAppointmentsToast
              pendingAppointmentsCount={pendingAppointments.total}
            />

            <SidebarInset>
              {/* <main className="w-full flex-1 overflow-hidden"> */}
              <Header />
              {children}
              {/* </main> */}
            </SidebarInset>
          </NuqsAdapter>
        </BreadcrumbsProvider>
      </SidebarProvider>
    </div>
  );
}
