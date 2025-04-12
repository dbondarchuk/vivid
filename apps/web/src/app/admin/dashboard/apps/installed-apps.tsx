import { ConnectedAppRow } from "@/components/admin/apps/connected-app";
import { AvailableApps } from "@vivid/app-store";
import { ServicesContainer } from "@vivid/services";
import React from "react";

export const InstalledApps: React.FC = async () => {
  const apps = (await ServicesContainer.ConnectedAppService().getApps()).filter(
    (app) => !AvailableApps[app.name].isHidden
  );

  return (
    <>
      {apps.map((app) => (
        <ConnectedAppRow app={app} key={app._id} />
      ))}
      {apps.length === 0 && (
        <div className="">You do not have any connected apps</div>
      )}
    </>
  );
};
