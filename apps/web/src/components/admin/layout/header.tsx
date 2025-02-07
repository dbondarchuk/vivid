import { cn, Link } from "@vivid/ui";
import { Globe2 } from "lucide-react";
import { AppSidebarTrigger } from "./sidebar";
import ThemeToggle from "./themeToggle/themeToggle";
import { Breadcrumbs } from "./breadcrumbs";

export default function Header({}: {}) {
  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Settings", link: "/admin/dashboard" },
    { title: "Appointments", link: "/admin/dashboard/settings/appointments" },
  ];

  return (
    <header className="sticky inset-x-0 top-0 w-full">
      <nav className="flex items-center justify-between px-4 md:px-8 py-2 md:justify-end">
        <div className={cn("block lg:!hidden")}>
          <AppSidebarTrigger />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/"
            target="_blank"
            button
            variant="default"
            className="inline-flex items-center gap-1"
          >
            <Globe2 size={16} /> View website
          </Link>
        </div>
      </nav>
    </header>
  );
}
