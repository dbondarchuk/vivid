import { BuilderKeys, useI18n } from "@vivid/i18n";
import React from "react";

type SidebarPanelProps = {
  title: BuilderKeys;
  children: React.ReactNode;
};
export default function BaseSidebarPanel({
  title,
  children,
}: SidebarPanelProps) {
  const t = useI18n("builder");
  return (
    <div className="p-2">
      <div className="mb-2 font-bold">{t(title)}</div>
      <div className="flex flex-col gap-5 mb-3">{children}</div>
    </div>
  );
}
