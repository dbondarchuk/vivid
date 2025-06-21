import { getLoggerFactory } from "@vivid/logger";
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
  const logger = getLoggerFactory("AppointmentsUtils")("getPaymentRequired");

  logger.debug(
    {
      optionId: appointmentRequest.optionId,
      dateTime: appointmentRequest.dateTime,
      addonsCount: appointmentRequest.addonsIds?.length || 0,
      ignoreFieldValidation,
      hasFiles: !!files,
      fieldCount: Object.keys(appointmentRequest.fields).length,
    },
    "Processing appointment event and payment requirement"
  );

  const eventOrError = await getAppointmentEventFromRequest(
    appointmentRequest,
    ignoreFieldValidation,
    files
  );

  if ("error" in eventOrError) {
    logger.warn(
      {
        optionId: appointmentRequest.optionId,
        errorCode: eventOrError.error.code,
        errorMessage: eventOrError.error.message,
      },
      "Failed to create appointment event, returning error"
    );

    return { error: eventOrError.error };
  }

  const { event, option, customer } = eventOrError;

  logger.debug(
    {
      optionId: option._id,
      optionName: option.name,
      totalPrice: event.totalPrice,
      customerId: customer?._id,
      customerName: customer?.name,
    },
    "Successfully created appointment event, checking payment requirement"
  );

  if (!event.totalPrice) {
    logger.debug(
      { optionId: option._id, optionName: option.name },
      "No total price, payment not required"
    );

    return {
      event,
      customer,
      isPaymentRequired: false,
    };
  }

  logger.debug(
    { totalPrice: event.totalPrice },
    "Total price exists, checking payment configuration"
  );

  const config =
    await ServicesContainer.ConfigurationService().getConfiguration("booking");

  const customersPriorAppointmentsCount =
    await getCustomerCompletedAppointments(customer?._id);

  logger.debug(
    {
      customersPriorAppointmentsCount,
      paymentsEnabled: config.payments?.enable,
      paymentAppId: config.payments?.enable
        ? config.payments.paymentAppId
        : undefined,
      requireDeposit:
        config.payments?.enable && "requireDeposit" in config.payments
          ? config.payments.requireDeposit
          : undefined,
      depositPercentage:
        config.payments?.enable && "depositPercentage" in config.payments
          ? config.payments.depositPercentage
          : undefined,
    },
    "Retrieved booking configuration"
  );

  if (config.payments?.enable && config.payments.paymentAppId) {
    logger.debug(
      { paymentAppId: config.payments.paymentAppId },
      "Payments enabled, determining deposit requirement"
    );

    let percentage: number | null = null;

    if (customer?.requireDeposit === "always" && customer.depositPercentage) {
      percentage = customer.depositPercentage;
      logger.debug(
        {
          customerId: customer._id,
          customerName: customer.name,
          customerDepositPercentage: customer.depositPercentage,
          reason: "customer_always_require_deposit",
        },
        "Customer requires deposit"
      );
    } else if (customer?.requireDeposit === "never") {
      logger.debug(
        {
          customerId: customer._id,
          customerName: customer.name,
          reason: "customer_never_require_deposit",
        },
        "Customer never requires deposit"
      );

      return {
        event,
        customer,
        isPaymentRequired: false,
      };
    } else if (
      customer &&
      config.payments.requireDeposit &&
      "depositPercentage" in config.payments &&
      config.payments.depositPercentage &&
      config.payments.dontRequireIfMoreThanAppointments &&
      customersPriorAppointmentsCount >
        config.payments.dontRequireIfMoreThanAppointments
    ) {
      logger.debug(
        {
          customerId: customer._id,
          customerName: customer.name,
          customersPriorAppointmentsCount,
          reason: "customer_has_enough_appointments",
        },
        "Customer has enough appointments to not require deposit"
      );

      return {
        event,
        customer,
        isPaymentRequired: false,
      };
    } else if (option.requireDeposit === "always" && option.depositPercentage) {
      percentage = option.depositPercentage;
      logger.debug(
        {
          optionId: option._id,
          optionName: option.name,
          optionDepositPercentage: option.depositPercentage,
          reason: "option_always_require_deposit",
        },
        "Option requires deposit"
      );
    } else if (option.requireDeposit === "never") {
      percentage = null;
      logger.debug(
        {
          optionId: option._id,
          optionName: option.name,
          reason: "option_never_require_deposit",
        },
        "Option never requires deposit"
      );
    } else if (
      config.payments.requireDeposit &&
      "depositPercentage" in config.payments &&
      config.payments.depositPercentage
    ) {
      percentage = config.payments.depositPercentage;
      logger.debug(
        {
          configDepositPercentage: config.payments.depositPercentage,
          reason: "config_require_deposit",
        },
        "Configuration requires deposit"
      );
    }

    if (percentage !== null) {
      const amount = formatAmount((event.totalPrice * percentage) / 100);

      logger.info(
        {
          optionId: option._id,
          optionName: option.name,
          totalPrice: event.totalPrice,
          depositPercentage: percentage,
          depositAmount: amount,
          paymentAppId: config.payments.paymentAppId,
          customerId: customer?._id,
        },
        "Payment required with deposit"
      );

      return {
        event,
        amount,
        percentage,
        appId: config.payments.paymentAppId,
        option,
        customer,
        isPaymentRequired: true,
      };
    } else {
      logger.debug(
        {
          optionId: option._id,
          optionName: option.name,
          reason: "no_deposit_percentage_determined",
        },
        "No deposit percentage determined, payment not required"
      );
    }
  } else {
    logger.debug(
      {
        paymentsEnabled: config.payments?.enable,
        hasPaymentAppId: !!(
          config.payments?.enable && config.payments.paymentAppId
        ),
        reason: "payments_disabled_or_no_app_id",
      },
      "Payments disabled or no payment app configured"
    );
  }

  logger.info(
    {
      optionId: option._id,
      optionName: option.name,
      totalPrice: event.totalPrice,
      customerId: customer?._id,
    },
    "Payment not required for appointment"
  );

  return {
    event,
    customer,
    isPaymentRequired: false,
  };
};

const getCustomerCompletedAppointments = async (customerId?: string) => {
  if (!customerId) return 0;
  const result = await ServicesContainer.EventsService().getAppointments({
    customerId: customerId,
    limit: 0,
    status: ["confirmed"],
    endRange: {
      end: new Date(),
    },
  });

  return result.total;
};
