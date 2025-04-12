import { Appointment } from "@vivid/types";
import { getArguments } from "@vivid/utils";
import { ServicesContainer } from "..";

export const getAppointmentArguments = async (
  appointment?: Appointment,
  useAppointmentTimezone = false
) => {
  const { booking, general, social } =
    await ServicesContainer.ConfigurationService().getConfigurations(
      "booking",
      "general",
      "social"
    );

  return getArguments(
    appointment,
    booking,
    general,
    social,
    useAppointmentTimezone
  );
};
