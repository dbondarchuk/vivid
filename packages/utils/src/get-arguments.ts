import {
  Appointment,
  BookingConfiguration,
  GeneralConfiguration,
  SocialConfiguration,
  socialType,
  StatusText,
} from "@vivid/types";
import { DateTime } from "luxon";
import { durationToTime } from "./time";

export const getArguments = (
  appointment: Appointment | undefined | null,
  bookingConfiguration: BookingConfiguration,
  generalConfiguration: GeneralConfiguration,
  socialConfiguration: SocialConfiguration,
  useAppointmentTimezone = false
) => {
  const { name, email, ...restFields } = appointment?.fields || {};
  const arg = {
    ...(appointment || {}),
    dateTime: appointment
      ? DateTime.fromJSDate(appointment.dateTime)
          .setZone(
            useAppointmentTimezone
              ? appointment.timeZone
              : bookingConfiguration.timezone
          )
          .toLocaleString(DateTime.DATETIME_FULL)
      : undefined,
    restFields: Object.entries(restFields).map(([name, value]) => ({
      name,
      value,
      label: appointment?.option?.fields?.[name] || name,
    })),
    files:
      appointment?.files?.filter(
        (file) => !file.mimeType.startsWith("image/")
      ) || [],
    images: appointment?.files
      ?.filter((file) => file.mimeType.startsWith("image/"))
      .map((file) => ({
        ...file,
        cid: file._id,
      })),
    statusText: appointment ? StatusText[appointment.status] : undefined,
    duration: appointment
      ? durationToTime(appointment.totalDuration)
      : undefined,
    config: {
      ...generalConfiguration,
    },
    socials:
      socialConfiguration?.links?.map((link) =>
        Object.keys(socialType.Values).reduce(
          (acc, cur) => ({
            ...acc,
            [`is_${cur}`]: link.type === cur,
          }),
          { ...link }
        )
      ) || [],
  };

  return {
    bookingConfiguration,
    generalConfiguration,
    socialConfiguration,
    arg,
  };
};
