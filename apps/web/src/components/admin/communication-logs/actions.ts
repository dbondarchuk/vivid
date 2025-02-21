"use server";

import { ServicesContainer } from "@vivid/services";
import { okStatus } from "@vivid/types";

export const clearAllCommunicationLogs = async () => {
  await ServicesContainer.CommunicationLogService().clearAllLogs();

  return okStatus;
};

export const clearSelectedCommunicationLogs = async (ids: string[]) => {
  await ServicesContainer.CommunicationLogService().clearSelectedLogs(ids);

  return okStatus;
};
