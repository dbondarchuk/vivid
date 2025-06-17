import { getAppointmentEventAndIsPaymentRequired } from "@/utils/appointments/get-payment-required";
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
  intentId?: string
) => {
  const body = await request.json();

  const {
    data: appointmentRequest,
    error,
    success,
  } = appointmentRequestSchema.safeParse(body);
  if (!success) {
    return NextResponse.json(error, { status: 400 });
  }

  const isPaymentRequired = await getAppointmentEventAndIsPaymentRequired(
    appointmentRequest,
    true
  );

  if (!isPaymentRequired) return NextResponse.json(null);

  if ("error" in isPaymentRequired) {
    return NextResponse.json(
      {
        success: false,
        error: isPaymentRequired.error.code,
        message: isPaymentRequired.error.message,
      },
      { status: isPaymentRequired.error.status }
    );
  }

  if (!isPaymentRequired.isPaymentRequired) return NextResponse.json(null);

  const { amount, percentage, appId, customer } = isPaymentRequired;

  const { app, service } =
    await ServicesContainer.ConnectedAppsService().getAppService<IPaymentProcessor>(
      appId
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

  const intent = intentId
    ? await ServicesContainer.PaymentsService().updateIntent(intentId, {
        ...intentUpdate,
        status: "created",
      })
    : await ServicesContainer.PaymentsService().createIntent(intentUpdate);

  return NextResponse.json({
    formProps,
    intent,
  } satisfies CollectPayment);
};
