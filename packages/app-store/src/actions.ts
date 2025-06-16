"use server";

import { ServicesContainer } from "@vivid/services";
import { AppScope, ConnectedAppStatusWithText } from "@vivid/types";

export const addNewApp = async (type: string) => {
  return await ServicesContainer.ConnectedAppsService().createNewApp(type);
};

export const getAppStatus = async (appId: string) => {
  return await ServicesContainer.ConnectedAppsService().getAppStatus(appId);
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

export const getAppLoginUrl = async (appId: string) => {
  return await ServicesContainer.ConnectedAppsService().requestLoginUrl(appId);
};

export const processRequest = async (appId: string, data: any) => {
  return await ServicesContainer.ConnectedAppsService().processRequest(
    appId,
    data
  );
};

export const processStaticRequest = async (appName: string, data: any) => {
  return await ServicesContainer.ConnectedAppsService().processStaticRequest(
    appName,
    data
  );
};

export const deleteApp = async (appId: string) => {
  return await ServicesContainer.ConnectedAppsService().deleteApp(appId);
};

export const getAppData = async (appId: string) => {
  return (await ServicesContainer.ConnectedAppsService().getApp(appId))?.data;
};

export const getApps = async (...scope: AppScope[]) => {
  return await ServicesContainer.ConnectedAppsService().getAppsByScope(
    ...scope
  );
};
