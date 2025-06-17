"use server";

import { ServicesContainer } from "@vivid/services";
import { ConnectedAppStatusWithText } from "@vivid/types";

export const getInstalledApps = async (name: string) => {
  return await ServicesContainer.ConnectedAppsService().getAppsByApp(name);
};

export const installComplexApp = async (name: string) => {
  const appId =
    await ServicesContainer.ConnectedAppsService().createNewApp(name);
  await ServicesContainer.ConnectedAppsService().updateApp(appId, {
    status: "connected",
    statusText: "Installed",
  });

  return appId;
};

export const setAppStatus = async (
  appId: string,
  status: ConnectedAppStatusWithText
) => {
  return await ServicesContainer.ConnectedAppsService().updateApp(
    appId,
    status
  );
};
