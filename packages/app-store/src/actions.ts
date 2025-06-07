"use server";

import { ServicesContainer } from "@vivid/services";
import { AppScope, ConnectedAppStatusWithText } from "@vivid/types";

export const addNewApp = async (type: string) => {
  return await ServicesContainer.ConnectedAppService().createNewApp(type);
};

export const getAppStatus = async (appId: string) => {
  return await ServicesContainer.ConnectedAppService().getAppStatus(appId);
};

export const setAppStatus = async (
  appId: string,
  status: ConnectedAppStatusWithText
) => {
  return await ServicesContainer.ConnectedAppService().updateApp(appId, status);
};

export const getAppLoginUrl = async (appId: string) => {
  return await ServicesContainer.ConnectedAppService().requestLoginUrl(appId);
};

export const processRequest = async (appId: string, data: any) => {
  return await ServicesContainer.ConnectedAppService().processRequest(
    appId,
    data
  );
};

export const processStaticRequest = async (appName: string, data: any) => {
  return await ServicesContainer.ConnectedAppService().processStaticRequest(
    appName,
    data
  );
};

export const deleteApp = async (appId: string) => {
  return await ServicesContainer.ConnectedAppService().deleteApp(appId);
};

export const getAppData = async (appId: string) => {
  return (await ServicesContainer.ConnectedAppService().getApp(appId))?.data;
};

export const getApps = async (...scope: AppScope[]) => {
  return await ServicesContainer.ConnectedAppService().getAppsByScope(...scope);
};
