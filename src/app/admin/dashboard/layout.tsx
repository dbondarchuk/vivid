import Header from "@/components/admin/layout/header";
import Sidebar from "@/components/admin/layout/sidebar";
import { Services } from "@/lib/services";
import { DateTime } from "luxon";
import type { Metadata } from "next";
import { PendingAppointmentsToast } from "./pendingAppointmentsToast";

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

  return (
    <div className="flex">
      <Sidebar />
      <PendingAppointmentsToast
        pendingAppointmentsCount={pendingAppointments.total}
      />
      <main className="w-full flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  );
}
