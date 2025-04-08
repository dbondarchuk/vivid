import { Schedule, WeekIdentifier } from "@vivid/types";
import { processRequest } from "../../..";
import { RequestAction } from "../models";

export const getWeeklyEvents = async (
  appId: string,
  weekIdentifier: WeekIdentifier
) => {
  return (await processRequest(appId, {
    type: "get-weekly-busy-events",
    week: weekIdentifier,
  } as RequestAction)) as Schedule;
};

export const setEvents = async (
  appId: string,
  week: WeekIdentifier,
  events: Schedule
) => {
  await processRequest(appId, {
    type: "set-busy-events",
    events,
    week,
  } as RequestAction);
};
