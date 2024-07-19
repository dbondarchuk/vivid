import { DateTime as Luxon } from "luxon";

export type Period = {
  startAt: Luxon;
  endAt: Luxon;
};
