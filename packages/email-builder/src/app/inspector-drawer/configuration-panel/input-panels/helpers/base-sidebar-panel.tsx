import React from "react";

type SidebarPanelProps = {
  title: string;
  children: React.ReactNode;
};
export default function BaseSidebarPanel({
  title,
  children,
}: SidebarPanelProps) {
  return (
    <div className="p-2">
      <div className="mb-2 text-secondary-foreground">{title}</div>
      <div className="flex flex-col gap-5 mb-3">{children}</div>
    </div>
  );
}
