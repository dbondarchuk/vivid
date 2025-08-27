import type { Language } from "@vivid/i18n";

import {
  Appointment,
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
import { formatArguments, FormattedArguments } from "./format-arguments";
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
  images: (AssetEntity & { cid: string })[];
  statusText?: string;
  confirmed: boolean;
  declined: boolean;
  pending: boolean;
  totalAmountPaid?: number;
  payments?: (Payment & {
    amountLeft: number;
    totalRefunded: number;
  })[];
  files: AssetEntity[];
  totalAmountLeft?: number;
  totalRefunded?: number;
  restFields: {
    name: string;
    value: any;
    label: string;
  }[];
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
> = FormattedArguments<
  TAdditional extends undefined
    ? BaseArgs<TAppointment>
    : BaseArgs<TAppointment> & TAdditional
>;

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
}: Props<TAppointment, TAdditional>): FormattedArguments<
  Args<TAppointment, TAdditional>
> => {
  const { name, email, phone, ...restFields } = appointment?.fields || {};

  const payments = appointment?.payments?.map((payment) => {
    const totalRefunded =
      payment.refunds?.reduce((acc, refund) => acc + refund.amount, 0) || 0;

    const amountLeft = payment.amount - totalRefunded;

    return {
      ...payment,
      amountLeft,
      totalRefunded,
    };
  });

  const totalAmountPaid = payments?.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  const totalRefunded = payments?.reduce(
    (sum, payment) => sum + payment.totalRefunded,
    0,
  );

  const totalAmountLeft = payments?.reduce(
    (sum, payment) => sum + payment.amountLeft,
    0,
  );

  const extendedArgs: ArgsProps = {
    payments: payments || [],
    totalAmountLeft,
    totalRefunded,
    totalAmountPaid,
    restFields: Object.entries(restFields).map(([name, value]) => ({
      name,
      value,
      label: appointment?.fieldsLabels?.[name] || name,
    })),
    files:
      appointment?.files?.filter(
        (file) => !file.mimeType.startsWith("image/"),
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
          { ...link },
        ),
      ) || [],
    locale,
  };

  const baseArgs: BaseArgs<TAppointment> = {
    ...((appointment || {}) as TAppointment),
    ...extendedArgs,
    customer: customer || appointment?.customer,
  };

  const args = formatArguments(
    {
      ...baseArgs,
      ...(additionalProperties || {}),
    },
    config.general.language,
    useAppointmentTimezone ? appointment?.timeZone : config.general.timeZone,
  ) as FormattedArguments<
    TAdditional extends undefined
      ? BaseArgs<TAppointment>
      : BaseArgs<TAppointment> & TAdditional
  >;

  return args;
};
