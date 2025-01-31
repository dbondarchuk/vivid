import Header from "@/components/admin/layout/header";
import Sidebar from "@/components/admin/layout/sidebar";
import { Services } from "@/lib/services";
import { DateTime } from "luxon";
import type { Metadata } from "next";
import { PendingAppointmentsToast } from "./pendingAppointmentsToast";
import { navItems } from "@/constants/data";
import { AvailableApps } from "@/apps";
import { ComplexApp, NavItemWithOptionalChildren } from "@/types";

export const metadata: Metadata = {
  title: "CMS Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const beforeNow = DateTime.now().minus({ hours: 1 }).toJSDate();

  const pendingAppointments =
    await Services.EventsService().getPendingAppointments(0, beforeNow);

  const menuItems: NavItemWithOptionalChildren[] = JSON.parse(
    JSON.stringify(navItems)
  );

  const appsWithMenu = await Services.ConnectedAppService().getAppsByType(
    "complex"
  );
  const appsMenus = appsWithMenu.map(
    ({ name }) => (AvailableApps[name] as ComplexApp).menuItem
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
      <Sidebar menuItems={menuItems} />
      <PendingAppointmentsToast
        pendingAppointmentsCount={pendingAppointments.total}
      />
      <main className="w-full flex-1 overflow-hidden">
        <Header menuItems={menuItems} />
        {children}
      </main>
    </div>
  );
}
