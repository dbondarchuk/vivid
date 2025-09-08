"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { okStatus } from "@vivid/types";

const logger = getLoggerFactory("CommunicationLogsActions");

export const clearAllCommunicationLogs = async () => {
  const actionLogger = logger("clearAllCommunicationLogs");

  actionLogger.debug("Clearing all communication logs");

  try {
    await ServicesContainer.CommunicationLogsService().clearAllLogs();

    actionLogger.debug("All communication logs cleared successfully");

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to clear all communication logs",
    );
    throw error;
  }
};

export const clearSelectedCommunicationLogs = async (ids: string[]) => {
  const actionLogger = logger("clearSelectedCommunicationLogs");

  actionLogger.debug(
    {
      logIds: ids,
      count: ids.length,
    },
    "Clearing selected communication logs",
  );

  try {
    await ServicesContainer.CommunicationLogsService().clearSelectedLogs(ids);

    actionLogger.debug(
      {
        logIds: ids,
        count: ids.length,
      },
      "Selected communication logs cleared successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        logIds: ids,
        count: ids.length,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to clear selected communication logs",
    );
    throw error;
  }
};
