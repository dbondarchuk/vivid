import { WithTotal } from "@vivid/types";
import { processRequest } from "../..";
import {
  GetRemindersAction,
  Reminder,
  ReminderUpdateModel,
  RequestAction,
} from "./models";

export const deleteReminder = async (appId: string, reminderId: string) => {
  return await processRequest(appId, {
    type: "delete-reminders",
    ids: [reminderId],
  } as RequestAction);
};

export const deleteSelectedReminders = async (appId: string, ids: string[]) => {
  return await processRequest(appId, {
    type: "delete-reminders",
    ids: ids,
  } as RequestAction);
};

export const getReminders = async (
  appId: string,
  query: GetRemindersAction["query"]
) => {
  return (await processRequest(appId, {
    type: "get-reminders",
    query,
  } as RequestAction)) as WithTotal<Reminder>;
};

export const getReminder = async (appId: string, id: string) => {
  return (await processRequest(appId, {
    type: "get-reminder",
    id,
  } as RequestAction)) as Reminder;
};

export const checkUniqueName = async (
  appId: string,
  name: string,
  id?: string
) => {
  return (await processRequest(appId, {
    type: "check-unique-name",
    name,
    id,
  } as RequestAction)) as boolean;
};

export const create = async (appId: string, reminder: ReminderUpdateModel) => {
  return await processRequest(appId, {
    type: "create-reminder",
    reminder,
  } as RequestAction);
};

export const update = async (
  appId: string,
  id: string,
  update: ReminderUpdateModel
) => {
  return await processRequest(appId, {
    type: "update-reminder",
    update,
    id,
  } as RequestAction);
};
