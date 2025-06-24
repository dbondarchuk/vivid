import { ConnectedAppRow } from "@/components/admin/apps/connected-app";
import { AvailableApps } from "@vivid/app-store";
import { ServicesContainer } from "@vivid/services";
import React from "react";
import { getI18nAsync } from "@vivid/i18n";

export const InstalledApps: React.FC = async () => {
  const t = await getI18nAsync("admin");

  const apps = (
    await ServicesContainer.ConnectedAppsService().getApps()
  ).filter(
    (app) => AvailableApps[app.name] && !AvailableApps[app.name].isHidden
  );

  return (
    <>
      {apps.map((app) => (
        <ConnectedAppRow app={app} key={app._id} />
      ))}
      {apps.length === 0 && <div className="">{t("apps.noConnectedApps")}</div>}
    </>
  );
};
