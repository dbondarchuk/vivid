import { ServicesContainer } from "@vivid/services";
import {
  AppointmentEvent,
  AppointmentOption,
  AppointmentRequest,
  Customer,
} from "@vivid/types";
import { formatAmount } from "@vivid/utils";
import { getAppointmentEventFromRequest } from "./get-event";

type GetIsPaymentRequiredReturnType =
  | {
      amount: number;
      percentage: number;
      appId: string;
      option: AppointmentOption;
      customer: Customer | null;
      event: AppointmentEvent;
      isPaymentRequired: true;
    }
  | {
      error: {
        code: string;
        message: string;
        status: number;
      };
    }
  | {
      customer: Customer | null;
      event: AppointmentEvent;
      isPaymentRequired: false;
    };

export const getAppointmentEventAndIsPaymentRequired = async (
  appointmentRequest: AppointmentRequest,
  ignoreFieldValidation?: boolean,
  files?: Record<string, any>
): Promise<GetIsPaymentRequiredReturnType> => {
  const eventOrError = await getAppointmentEventFromRequest(
    appointmentRequest,
    ignoreFieldValidation,
    files
  );

  if ("error" in eventOrError) {
    return { error: eventOrError.error };
  }

  const { event, option, customer } = eventOrError;
  if (!event.totalPrice)
    return {
      event,
      customer,
      isPaymentRequired: false,
    };

  const config =
    await ServicesContainer.ConfigurationService().getConfiguration("booking");

  if (config.payments?.enable && config.payments.paymentAppId) {
    let percentage: number | null = null;

    if (customer?.requireDeposit === "always" && customer.depositPercentage) {
      percentage = customer.depositPercentage;
    } else if (customer?.requireDeposit === "never") {
      return {
        event,
        customer,
        isPaymentRequired: false,
      };
    } else if (option.requireDeposit === "always" && option.depositPercentage) {
      percentage = option.depositPercentage;
    } else if (option.requireDeposit === "never") {
      percentage = null;
    } else if (
      config.payments.requireDeposit &&
      config.payments.depositPercentage
    ) {
      percentage = config.payments.depositPercentage;
    }

    if (percentage !== null) {
      const amount = formatAmount((event.totalPrice * percentage) / 100);

      return {
        event,
        amount,
        percentage,
        appId: config.payments.paymentAppId,
        option,
        customer,
        isPaymentRequired: true,
      };
    }
  }

  return {
    event,
    customer,
    isPaymentRequired: false,
  };
};
