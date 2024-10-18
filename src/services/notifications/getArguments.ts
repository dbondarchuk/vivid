import { StatusText } from "@/components/admin/appointments/types";
import { durationToTime } from "@/lib/time";
import {
  Appointment,
  BookingConfiguration,
  GeneralConfiguration,
  SocialConfiguration,
} from "@/types";
import { DateTime } from "luxon";

export const getArguments = (
  appointment: Appointment | undefined,
  bookingConfiguration: BookingConfiguration,
  generalConfiguration: GeneralConfiguration,
  socialConfiguration: SocialConfiguration
) => {
  const { name, email, ...restFields } = appointment?.fields || {};
  const arg = {
    ...appointment,
    dateTime: appointment
      ? DateTime.fromJSDate(appointment.dateTime).toLocaleString(
          DateTime.DATETIME_MED
        )
      : undefined,
    restFields: Object.entries(restFields).map(([name, value]) => ({
      name,
      value,
    })),
    statusText: appointment ? StatusText[appointment.status] : undefined,
    duration: appointment
      ? durationToTime(appointment.totalDuration)
      : undefined,
    config: {
      ...generalConfiguration,
      ...socialConfiguration,
    },
  };

  return {
    bookingConfiguration,
    generalConfiguration,
    socialConfiguration,
    arg,
  };
};
