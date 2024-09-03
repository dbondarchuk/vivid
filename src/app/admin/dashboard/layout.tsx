import Header from "@/components/admin/layout/header";
import Sidebar from "@/components/admin/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  );
}
