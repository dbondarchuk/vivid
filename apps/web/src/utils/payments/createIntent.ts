import { getAppointmentEventAndIsPaymentRequired } from "@/utils/appointments/get-payment-required";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import {
  appointmentRequestSchema,
  CollectPayment,
  IPaymentProcessor,
  PaymentIntentUpdateModel,
} from "@vivid/types";
import { NextRequest, NextResponse } from "next/server";

export const createOrUpdateIntent = async (
  request: NextRequest,
  intentId?: string,
) => {
  const logger = getLoggerFactory("PaymentsUtils")("createOrUpdateIntent");

  const body = await request.json();

  const {
    data: appointmentRequest,
    error,
    success,
  } = appointmentRequestSchema.safeParse(body);
  if (!success) {
    logger.error(
      {
        error,
        success,
        body,
      },
      "Failed to parse request",
    );

    return NextResponse.json(error, { status: 400 });
  }

  const isPaymentRequired = await getAppointmentEventAndIsPaymentRequired(
    appointmentRequest,
    true,
  );

  if (!isPaymentRequired) {
    logger.warn({ appointmentRequest }, "IsPaymentRequired is null");
    return NextResponse.json(null);
  }

  if ("error" in isPaymentRequired) {
    logger.error(
      {
        error: isPaymentRequired.error,
        appointmentRequest,
      },
      "Failed to get event or is payment required",
    );

    return NextResponse.json(
      {
        success: false,
        error: isPaymentRequired.error.code,
        message: isPaymentRequired.error.message,
      },
      { status: isPaymentRequired.error.status },
    );
  }

  if (!isPaymentRequired.isPaymentRequired) {
    logger.debug({ appointmentRequest }, "payment is not required");

    return NextResponse.json(null);
  }

  logger.debug({ ...isPaymentRequired, intentId }, "Payment is required.");

  const { amount, percentage, appId, customer } = isPaymentRequired;

  const { app, service } =
    await ServicesContainer.ConnectedAppsService().getAppService<IPaymentProcessor>(
      appId,
    );

  const formProps = service.getFormProps(app);

  const intentUpdate: Omit<PaymentIntentUpdateModel, "status"> = {
    amount,
    percentage,
    appId: app._id,
    appName: app.name,
    request: appointmentRequest,
    customerId: customer?._id,
  };

  logger.debug(
    { intent: intentUpdate, isUpdating: !!intentId },
    "Creating or updating intent",
  );

  const intent = intentId
    ? await ServicesContainer.PaymentsService().updateIntent(intentId, {
        ...intentUpdate,
        status: "created",
      })
    : await ServicesContainer.PaymentsService().createIntent(intentUpdate);

  logger.debug(
    { intent, isUpdating: !!intentId },
    "Successfully created or updated intent",
  );

  return NextResponse.json({
    formProps,
    intent,
  } satisfies CollectPayment);
};
