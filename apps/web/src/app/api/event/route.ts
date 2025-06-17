import { getAppointmentEventAndIsPaymentRequired } from "@/utils/appointments/get-payment-required";
import { ServicesContainer } from "@vivid/services";
import {
  appointmentRequestSchema,
  AppointmentTimeNotAvaialbleError,
} from "@vivid/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const json = formData.get("json") as string;
  if (!json) {
    return NextResponse.json(
      {
        success: false,
        error: "json_missing",
        message: "JSON with event data is missing",
      },
      { status: 400 }
    );
  }

  const appointmentRequestParsed = JSON.parse(json);
  const {
    data: appointmentRequest,
    success: parseSuccess,
    error: parseError,
  } = appointmentRequestSchema.safeParse(appointmentRequestParsed);

  if (!parseSuccess) {
    return NextResponse.json(parseError, { status: 400 });
  }

  let files: Record<string, File> | undefined = undefined;
  const fileFields = formData.getAll("fileField") as string[];
  if (!!fileFields) {
    try {
      files = fileFields.reduce(
        (map, fileField) => {
          const file = formData.get(`file_${fileField}`) as File;
          if (!file) {
            throw new Error("File field is not present");
          }

          return {
            ...map,
            [fileField]: file,
          };
        },
        {} as Record<string, File>
      );
    } catch (e: any) {
      return NextResponse.json(
        { success: false, error: "file_not_uploaded", message: e?.message },
        { status: 400 }
      );
    }
  }

  const eventOrError = await getAppointmentEventAndIsPaymentRequired(
    appointmentRequest,
    false,
    files
  );

  if ("error" in eventOrError) {
    return NextResponse.json(
      {
        success: false,
        error: eventOrError.error.code,
        message: eventOrError.error.message,
      },
      { status: eventOrError.error.status }
    );
  }

  if (eventOrError.isPaymentRequired) {
    const paymentIntentId = appointmentRequest.paymentIntentId;
    if (!paymentIntentId) {
      return NextResponse.json(
        { success: false, error: "payment_required" },
        { status: 402 }
      ); // Payment required
    }

    const paymentIntent =
      await ServicesContainer.PaymentsService().getIntent(paymentIntentId);
    if (!paymentIntent) {
      return NextResponse.json(
        { success: false, error: "payment_intent_not_found" },
        { status: 402 }
      ); // Payment required
    }

    if (paymentIntent.status !== "paid") {
      return NextResponse.json(
        { success: false, error: "payment_not_paid" },
        { status: 402 }
      ); // Payment required
    }

    if (paymentIntent.amount !== eventOrError.amount) {
      return NextResponse.json(
        { success: false, error: "payment_amount_dont_match" },
        { status: 402 }
      ); // Payment required
    }
  }

  try {
    const { _id } = await ServicesContainer.EventsService().createEvent({
      event: eventOrError.event,
      paymentIntentId: appointmentRequest.paymentIntentId,
      files,
    });

    return NextResponse.json({ success: true, id: _id }, { status: 201 });
  } catch (e: any) {
    if (e instanceof AppointmentTimeNotAvaialbleError) {
      return NextResponse.json(
        { success: false, error: "time_not_available", message: e?.message },
        { status: 400 }
      );
    } else {
      throw e;
    }
  }
}
