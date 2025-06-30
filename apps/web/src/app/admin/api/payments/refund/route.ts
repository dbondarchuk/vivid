import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Payment, zUniqueArray } from "@vivid/types";
import { NextRequest, NextResponse } from "next/server";
import pLimit from "p-limit";
import z from "zod";

const refundPaymentsSchema = z.object({
  ids: zUniqueArray(z.array(z.string().min(1)), (s) => s),
});

export async function POST(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/payments-refund")("POST");

  logger.debug(
    {
      url: request.url,
      method: request.method,
    },
    "Processing payments refund API request"
  );

  const limit = pLimit(2);

  const json = await request.json();
  const { data, success, error } = refundPaymentsSchema.safeParse(json);

  if (!success) {
    logger.warn("Invalid request format");
    return NextResponse.json({ success: false, error }, { status: 400 });
  }

  const successes: Record<string, Payment> = {};
  const errors: Record<string, string> = {};

  try {
    const promises = data.ids.map(async (paymentId) => {
      try {
        logger.debug(
          {
            paymentId,
          },
          "Refunding payment"
        );

        const result =
          await ServicesContainer.PaymentsService().refundPayment(paymentId);

        if (result.success) {
          successes[paymentId] = result.updatedPayment;

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
        } else {
          errors[paymentId] = result.error;
        }

        logger.debug(
          {
            paymentId,
            success: result.success,
          },
          `Refunding payment ${paymentId}: ${result.success ? "success" : "error"}`
        );
      } catch (e: any) {
        logger.error(
          {
            paymentId,
            error: e?.message || e?.toString(),
          },
          "Error refunding payment"
        );

        errors[paymentId] = e?.message || e?.toString();
      } finally {
      }
    });

    await Promise.all(promises.map((p) => limit(() => p)));
    return NextResponse.json(
      {
        success: Object.keys(successes).length === data.ids.length,
        updatedPayments: successes,
        errors,
      },
      { status: 201 }
    );
  } catch (e: any) {
    logger.error(
      {
        error: e?.message || e?.toString(),
      },
      "Error processing payments refund"
    );
    return NextResponse.json(
      { success: false, error: e?.message ?? e?.toString() },
      { status: 500 }
    );
  }
}
