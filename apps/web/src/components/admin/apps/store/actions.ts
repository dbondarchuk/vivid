"use server";

import { ServicesContainer } from "@vivid/services";
import { ConnectedAppStatusWithText } from "@vivid/types";

export const getInstalledApps = async (name: string) => {
  return await ServicesContainer.ConnectedAppService().getAppsByApp(name);
};

export const installComplexApp = async (name: string) => {
  const appId =
    await ServicesContainer.ConnectedAppService().createNewApp(name);
  await ServicesContainer.ConnectedAppService().updateApp(appId, {
    status: "connected",
    statusText: "Installed",
  });

  return appId;
};

export const setAppStatus = async (
  appId: string,
  status: ConnectedAppStatusWithText
) => {
  return await ServicesContainer.ConnectedAppService().updateApp(appId, status);
};
