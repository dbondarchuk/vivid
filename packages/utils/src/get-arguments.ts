import {
  Appointment,
  BookingConfiguration,
  Customer,
  GeneralConfiguration,
  SocialConfiguration,
  socialType,
  StatusText,
} from "@vivid/types";
import { DateTime } from "luxon";
import { formatAmountString } from "./currency";
import { durationToTime } from "./time";

type Props = {
  appointment?: Appointment | null;
  customer?: Customer | null;
  config: {
    booking: BookingConfiguration;
    general: GeneralConfiguration;
    social: SocialConfiguration;
  };
  useAppointmentTimezone?: boolean;
  additionalProperties?: Record<string | number, any>;
};

export const getArguments = ({
  appointment,
  customer,
  config,
  useAppointmentTimezone = false,
  additionalProperties = {},
}: Props) => {
  const { name, email, phone, ...restFields } = appointment?.fields || {};
  const args = {
    ...(appointment || {}),
    totalPriceFormatted: appointment?.totalPrice
      ? formatAmountString(appointment?.totalPrice)
      : undefined,
    discount: appointment?.discount
      ? {
          ...appointment.discount,
          discountAmountFormatted: formatAmountString(
            appointment.discount.discountAmount
          ),
        }
      : undefined,
    dateTime: appointment
      ? DateTime.fromJSDate(appointment.dateTime)
          .setZone(
            useAppointmentTimezone
              ? appointment.timeZone
              : config.booking?.timeZone
          )
          .toLocaleString(DateTime.DATETIME_FULL)
      : undefined,
    restFields: Object.entries(restFields).map(([name, value]) => ({
      name,
      value,
      label: appointment?.fieldsLabels?.[name] || name,
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
      ...config.general,
    },
    customer,
    socials:
      config.social?.links?.map((link) =>
        Object.keys(socialType.Values).reduce(
          (acc, cur) => ({
            ...acc,
            [`is_${cur}`]: link.type === cur,
          }),
          { ...link }
        )
      ) || [],
    ...(additionalProperties || {}),
  };

  return args;
};
