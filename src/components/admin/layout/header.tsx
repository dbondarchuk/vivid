import ThemeToggle from "./ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import { Link } from "@/components/ui/link";
import { Globe2 } from "lucide-react";
import { NavItemWithOptionalChildren } from "@/types";

export default function Header({
  menuItems,
}: {
  menuItems: NavItemWithOptionalChildren[];
}) {
  return (
    <header className="sticky inset-x-0 top-0 w-full">
      <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar menuItems={menuItems} />
        </div>
        <div className="flex items-center gap-2">
          <UserNav />
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
