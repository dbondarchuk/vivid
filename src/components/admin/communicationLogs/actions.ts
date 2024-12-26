"use server";

import { Services } from "@/lib/services";
import { okStatus } from "@/types/general/actionStatus";

export const clearAllCommunicationLogs = async () => {
  await Services.CommunicationLogService().clearAllLogs();

  return okStatus;
};

export const clearSelectedCommunicationLogs = async (ids: string[]) => {
  await Services.CommunicationLogService().clearSelectedLogs(ids);

  return okStatus;
};
