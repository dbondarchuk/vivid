"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { AppScope, ConnectedAppStatusWithText } from "@vivid/types";

const logger = getLoggerFactory("AppStoreActions");

export const addNewApp = async (type: string) => {
  const actionLogger = logger("addNewApp");
  actionLogger.debug({ type }, "Adding new app");
  try {
    const result =
      await ServicesContainer.ConnectedAppsService().createNewApp(type);
    actionLogger.debug({ type, appId: result }, "New app added successfully");
    return result;
  } catch (error) {
    actionLogger.error(
      { type, error: error instanceof Error ? error.message : String(error) },
      "Failed to add new app"
    );
    throw error;
  }
};

export const getAppStatus = async (appId: string) => {
  const actionLogger = logger("getAppStatus");
  actionLogger.debug({ appId }, "Getting app status");
  try {
    const result =
      await ServicesContainer.ConnectedAppsService().getAppStatus(appId);
    actionLogger.debug(
      { appId, status: result?.status },
      "App status retrieved"
    );
    return result;
  } catch (error) {
    actionLogger.error(
      { appId, error: error instanceof Error ? error.message : String(error) },
      "Failed to get app status"
    );
    throw error;
  }
};

export const setAppStatus = async (
  appId: string,
  status: ConnectedAppStatusWithText
) => {
  const actionLogger = logger("setAppStatus");
  actionLogger.debug(
    { appId, status: status.status, statusText: status.statusText },
    "Setting app status"
  );
  try {
    const result = await ServicesContainer.ConnectedAppsService().updateApp(
      appId,
      status
    );
    actionLogger.debug(
      { appId, status: status.status, statusText: status.statusText },
      "App status updated"
    );
    return result;
  } catch (error) {
    actionLogger.error(
      {
        appId,
        status: status.status,
        statusText: status.statusText,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to set app status"
    );
    throw error;
  }
};

export const getAppLoginUrl = async (appId: string) => {
  const actionLogger = logger("getAppLoginUrl");
  actionLogger.debug({ appId }, "Requesting app login URL");
  try {
    const result =
      await ServicesContainer.ConnectedAppsService().requestLoginUrl(appId);
    actionLogger.debug({ appId, hasUrl: !!result }, "App login URL retrieved");
    return result;
  } catch (error) {
    actionLogger.error(
      { appId, error: error instanceof Error ? error.message : String(error) },
      "Failed to get app login URL"
    );
    throw error;
  }
};

export const processRequest = async (appId: string, data: any) => {
  const actionLogger = logger("processRequest");
  actionLogger.debug({ appId, hasData: !!data }, "Processing app request");
  try {
    const result =
      await ServicesContainer.ConnectedAppsService().processRequest(
        appId,
        data
      );
    actionLogger.debug({ appId, hasData: !!data }, "App request processed");
    return result;
  } catch (error) {
    actionLogger.error(
      {
        appId,
        hasData: !!data,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to process app request"
    );
    throw error;
  }
};

export const processStaticRequest = async (appName: string, data: any) => {
  const actionLogger = logger("processStaticRequest");
  actionLogger.debug(
    { appName, hasData: !!data },
    "Processing static app request"
  );
  try {
    const result =
      await ServicesContainer.ConnectedAppsService().processStaticRequest(
        appName,
        data
      );
    actionLogger.debug(
      { appName, hasData: !!data },
      "Static app request processed"
    );
    return result;
  } catch (error) {
    actionLogger.error(
      {
        appName,
        hasData: !!data,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to process static app request"
    );
    throw error;
  }
};

export const deleteApp = async (appId: string) => {
  const actionLogger = logger("deleteApp");
  actionLogger.debug({ appId }, "Deleting app");
  try {
    const result =
      await ServicesContainer.ConnectedAppsService().deleteApp(appId);
    actionLogger.debug({ appId }, "App deleted");
    return result;
  } catch (error) {
    actionLogger.error(
      { appId, error: error instanceof Error ? error.message : String(error) },
      "Failed to delete app"
    );
    throw error;
  }
};

export const getAppData = async (appId: string) => {
  const actionLogger = logger("getAppData");
  actionLogger.debug({ appId }, "Getting app data");
  try {
    const result = (
      await ServicesContainer.ConnectedAppsService().getApp(appId)
    )?.data;
    actionLogger.debug({ appId, hasData: !!result }, "App data retrieved");
    return result;
  } catch (error) {
    actionLogger.error(
      { appId, error: error instanceof Error ? error.message : String(error) },
      "Failed to get app data"
    );
    throw error;
  }
};

export const getApps = async (...scope: AppScope[]) => {
  const actionLogger = logger("getApps");
  actionLogger.debug({ scope }, "Getting apps by scope");
  try {
    const result =
      await ServicesContainer.ConnectedAppsService().getAppsByScope(...scope);
    actionLogger.debug(
      { scope, count: result.length },
      "Apps by scope retrieved"
    );
    return result;
  } catch (error) {
    actionLogger.error(
      { scope, error: error instanceof Error ? error.message : String(error) },
      "Failed to get apps by scope"
    );
    throw error;
  }
};
