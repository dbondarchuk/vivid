import type { Language } from "@vivid/i18n";

import {
  Appointment,
  AppointmentDiscount,
  AppointmentStatus,
  AssetEntity,
  BookingConfiguration,
  Customer,
  GeneralConfiguration,
  Payment,
  SocialConfiguration,
  SocialLinkType,
  socialType,
} from "@vivid/types";
import { DateTime } from "luxon";
import { formatAmountString } from "./currency";
import { durationToTime } from "./time";

const AppointmentStatusTexts: Record<
  AppointmentStatus,
  Record<Language, string>
> = {
  pending: {
    en: "Pending",
    uk: "Очікуєт підтвердження",
  },
  confirmed: {
    en: "Confirmed",
    uk: "Підтверджено",
  },
  declined: {
    en: "Declined",
    uk: "Скасовано",
  },
};

type Props<
  TAppointment extends Appointment | null | undefined,
  T extends Record<string | number, any> | undefined,
> = {
  appointment?: TAppointment;
  customer?: Customer | null;
  config: {
    booking: BookingConfiguration;
    general: GeneralConfiguration;
    social: SocialConfiguration;
  };
  locale?: Language;
  useAppointmentTimezone?: boolean;
  additionalProperties?: T;
};

type ArgsProps = {
  totalPriceFormatted?: string;
  payments?: (Omit<Payment, "paidAt" | "updatedAt" | "refunds"> & {
    amountFormatted: string;
    amountLeft: number;
    amountLeftFormatted: string;
    totalRefunded: number;
    totalRefundedFormatted: string;
    paidAt?: string;
    updatedAt?: string;
    refunds?: {
      amount: number;
      amountFormatted: string;
      refundedAt?: string;
    }[];
  })[];
  totalAmountPaid?: number;
  totalAmountPaidFormatted?: string;
  totalAmountLeft?: number;
  totalAmountLeftFormatted?: string;
  totalRefunded?: number;
  totalRefundedFormatted?: string;
  discount?: AppointmentDiscount & {
    discountAmountFormatted: string;
  };
  dateTime?: string;
  endAt?: string;
  restFields: {
    name: string;
    value: any;
    label: string;
  }[];
  files: AssetEntity[];
  images: (AssetEntity & { cid: string })[];
  statusText?: string;
  confirmed: boolean;
  declined: boolean;
  pending: boolean;
  duration?: {
    hours: number;
    minutes: number;
  };
  config: GeneralConfiguration;
  socials: {
    type: SocialLinkType;
    url: string;
  }[];
  locale: Language;
};

type BaseArgs<TAppointment extends Appointment | null | undefined> =
  TAppointment extends Appointment
    ? ArgsProps & Appointment
    : ArgsProps & Partial<Appointment>;

export type Args<
  TAppointment extends Appointment | null | undefined,
  TAdditional extends Record<string | number, any> | undefined,
> = TAdditional extends undefined
  ? BaseArgs<TAppointment>
  : BaseArgs<TAppointment> & TAdditional;

export const getArguments = <
  TAppointment extends Appointment | null | undefined,
  TAdditional extends Record<string | number, any> | undefined,
>({
  appointment,
  customer,
  config,
  locale = config.general.language,
  useAppointmentTimezone = false,
  additionalProperties,
}: Props<TAppointment, TAdditional>): Args<TAppointment, TAdditional> => {
  const { name, email, phone, ...restFields } = appointment?.fields || {};
  const payments: ArgsProps["payments"] =
    appointment?.payments
      // .filter(
      //     (payment) => payment.status === "paid"
      //     // allow to show refunded payments if the total refunded amount is less than the original amount
      //     // ||
      //     //   (payment.status === "refunded" &&
      //     //     (payment.refunds?.reduce((acc, refund) => acc + refund.amount, 0) ||
      //     //       0) < payment.amount)
      //   )
      ?.map((payment) => {
        const totalRefunded =
          payment.refunds?.reduce((acc, refund) => acc + refund.amount, 0) || 0;

        const amountLeft = payment.amount - totalRefunded;

        return {
          ...payment,
          amountFormatted: formatAmountString(payment.amount),
          amountLeft,
          amountLeftFormatted: formatAmountString(amountLeft),
          totalRefunded,
          totalRefundedFormatted: formatAmountString(totalRefunded),
          paidAt: payment.paidAt
            ? DateTime.fromJSDate(payment.paidAt)
                .setZone(
                  useAppointmentTimezone
                    ? appointment.timeZone
                    : config?.general?.timeZone
                )
                .toLocaleString(DateTime.DATETIME_FULL, { locale })
            : undefined,
          refunds: payment.refunds?.map((refund) => ({
            amount: refund.amount,
            amountFormatted: formatAmountString(refund.amount),
            refundedAt: refund.refundedAt
              ? DateTime.fromJSDate(refund.refundedAt)
                  .setZone(
                    useAppointmentTimezone
                      ? appointment.timeZone
                      : config?.general?.timeZone
                  )
                  .toLocaleString(DateTime.DATETIME_FULL, { locale })
              : undefined,
          })),
          updatedAt: payment.updatedAt
            ? DateTime.fromJSDate(payment.updatedAt)
                .setZone(
                  useAppointmentTimezone
                    ? appointment.timeZone
                    : config?.general?.timeZone
                )
                .toLocaleString(DateTime.DATETIME_FULL, { locale })
            : undefined,
        };
      }) || [];

  const totalAmountPaid = payments?.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const totalRefunded = payments?.reduce(
    (sum, payment) => sum + payment.totalRefunded,
    0
  );

  const totalAmountLeft = payments?.reduce(
    (sum, payment) => sum + payment.amountLeft,
    0
  );

  const extendedArgs: ArgsProps = {
    totalPriceFormatted: appointment?.totalPrice
      ? formatAmountString(appointment?.totalPrice)
      : undefined,
    payments,
    totalAmountPaid,
    totalAmountPaidFormatted: totalAmountPaid
      ? formatAmountString(totalAmountPaid)
      : undefined,
    totalAmountLeft,
    totalAmountLeftFormatted: totalAmountLeft
      ? formatAmountString(totalAmountLeft)
      : undefined,
    totalRefunded,
    totalRefundedFormatted: totalRefunded
      ? formatAmountString(totalRefunded)
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
              : config?.general?.timeZone
          )
          .toLocaleString(DateTime.DATETIME_FULL, { locale })
      : undefined,
    endAt: appointment
      ? DateTime.fromJSDate(appointment.endAt)
          .setZone(
            useAppointmentTimezone
              ? appointment.timeZone
              : config?.general?.timeZone
          )
          .toLocaleString(DateTime.DATETIME_FULL, { locale })
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
    images:
      appointment?.files
        ?.filter((file) => file.mimeType.startsWith("image/"))
        .map((file) => ({
          ...file,
          cid: file._id,
        })) || [],
    statusText: appointment?.status
      ? AppointmentStatusTexts[appointment.status][locale as Language] ||
        AppointmentStatusTexts[appointment.status]["en"]
      : undefined,
    confirmed: appointment?.status === "confirmed",
    declined: appointment?.status === "declined",
    pending: appointment?.status === "pending",
    duration: appointment
      ? durationToTime(appointment.totalDuration)
      : undefined,
    config: {
      ...config.general,
    },
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
    locale,
  };

  const baseArgs: BaseArgs<TAppointment> = {
    ...((appointment || {}) as TAppointment),
    ...extendedArgs,
    customer: customer || appointment?.customer,
  };

  const args = {
    ...baseArgs,
    ...(additionalProperties || {}),
  } as Args<TAppointment, TAdditional>;

  return args;
};
