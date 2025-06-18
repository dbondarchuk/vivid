"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { ConnectedAppStatusWithText } from "@vivid/types";

const logger = getLoggerFactory("AppStoreActions");

export const getInstalledApps = async (name: string) => {
  const actionLogger = logger("getInstalledApps");

  actionLogger.debug(
    {
      appName: name,
    },
    "Getting installed apps"
  );

  try {
    const result =
      await ServicesContainer.ConnectedAppsService().getAppsByApp(name);

    actionLogger.debug(
      {
        appName: name,
        installedAppsCount: result.length,
      },
      "Installed apps retrieved successfully"
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        appName: name,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to get installed apps"
    );
    throw error;
  }
};

export const installComplexApp = async (name: string) => {
  const actionLogger = logger("installComplexApp");

  actionLogger.debug(
    {
      appName: name,
    },
    "Installing complex app"
  );

  try {
    const appId =
      await ServicesContainer.ConnectedAppsService().createNewApp(name);

    actionLogger.debug(
      {
        appName: name,
        appId,
      },
      "Complex app created, updating status"
    );

    await ServicesContainer.ConnectedAppsService().updateApp(appId, {
      status: "connected",
      statusText: "Installed",
    });

    actionLogger.debug(
      {
        appName: name,
        appId,
        status: "connected",
      },
      "Complex app installed successfully"
    );

    return appId;
  } catch (error) {
    actionLogger.error(
      {
        appName: name,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to install complex app"
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
    {
      appId,
      status: status.status,
      statusText: status.statusText,
    },
    "Setting app status"
  );

  try {
    const result = await ServicesContainer.ConnectedAppsService().updateApp(
      appId,
      status
    );

    actionLogger.debug(
      {
        appId,
        status: status.status,
        statusText: status.statusText,
      },
      "App status updated successfully"
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
