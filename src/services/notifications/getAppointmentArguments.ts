import { Services } from "@/lib/services";
import { Appointment } from "@/types";
import { getArguments } from "./getArguments";

export const getAppointmentArguments = async (
  appointment?: Appointment,
  useAppointmentTimezone = false
) => {
  const { booking, general, social } =
    await Services.ConfigurationService().getConfigurations(
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
