"use server";

import { Services } from "@/lib/services";

export const addNewApp = async (type: string) => {
  return await Services.ConnectedAppService().createNewApp(type);
};

export const getAppStatus = async (appId: string) => {
  return await Services.ConnectedAppService().getAppStatus(appId);
};

export const getAppLoginUrl = async (appId: string, baseUrl: string) => {
  return await Services.ConnectedAppService().requestLoginUrl(appId, baseUrl);
};

export const processRequest = async (appId: string, data: any) => {
  return await Services.ConnectedAppService().processRequest(appId, data);
};

export const deleteApp = async (appId: string) => {
  return await Services.ConnectedAppService().deleteApp(appId);
};

export const getAppData = async (appId: string) => {
  return (await Services.ConnectedAppService().getApp(appId))?.data;
};
