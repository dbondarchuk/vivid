import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const logger = getLoggerFactory("AdminAPI/payment-refund")("POST");
  const { id: paymentId } = await params;

  logger.debug(
    {
      url: request.url,
      method: request.method,
      paymentId,
    },
    "Processing payment refund request"
  );

  const result =
    await ServicesContainer.PaymentsService().refundPayment(paymentId);

  if (!result.success) {
    logger.warn(
      {
        paymentId,
        error: result.error,
        status: result.status,
      },
      "Payment refund failed"
    );
    return NextResponse.json(
      { success: false, error: result.error },
      { status: result.status }
    );
  }

  await ServicesContainer.EventsService().addAppointmentHistory({
    type: "paymentRefunded",
    data: {
      payment: {
        id: result.updatedPayment._id,
        amount: result.updatedPayment.amount,
        status: result.updatedPayment.status,
        type: result.updatedPayment.type,
        appName:
          "appName" in result.updatedPayment
            ? result.updatedPayment.appName
            : undefined,
        externalId:
          "externalId" in result.updatedPayment
            ? result.updatedPayment.externalId
            : undefined,
      },
    },
    appointmentId: result.updatedPayment.appointmentId,
  });

  logger.debug(
    {
      paymentId,
      success: result.success,
    },
    "Payment refund successful"
  );

  return NextResponse.json(
    { success: true, payment: result.updatedPayment },
    { status: 201 }
  );
}
