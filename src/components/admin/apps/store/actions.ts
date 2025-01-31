"use server";

import { Services } from "@/lib/services";

export const getInstalledApps = async (name: string) => {
  return await Services.ConnectedAppService().getAppsByApp(name);
};

export const installComplexApp = async (name: string) => {
  return await Services.ConnectedAppService().createNewApp(name);
};
