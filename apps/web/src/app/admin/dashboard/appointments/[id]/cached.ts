import { ServicesContainer } from "@vivid/services";
import { cache } from "react";

export const getAppointment = cache(async (id: string) => {
  return await ServicesContainer.EventsService().getAppointment(id);
});
