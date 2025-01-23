"use server";

import { demoAppointment } from "@/app/admin/dashboard/settings/appointments/fixtures";
import { Services } from "@/lib/services";
import { getArguments } from "@/services/notifications/getArguments";
import { ConnectedAppStatusWithText } from "@/types";

export const addNewApp = async (type: string) => {
  return await Services.ConnectedAppService().createNewApp(type);
};

export const getAppStatus = async (appId: string) => {
  return await Services.ConnectedAppService().getAppStatus(appId);
};

export const setAppStatus = async (
  appId: string,
  status: ConnectedAppStatusWithText
) => {
  return await Services.ConnectedAppService().updateApp(appId, status);
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

export const getDemoArguments = async () => {
  const { booking, general, social } =
    await Services.ConfigurationService().getConfigurations(
      "booking",
      "general",
      "social"
    );

  const { arg: demoArguments } = getArguments(
    demoAppointment,
    booking,
    general,
    social
  );

  return demoArguments;
};
