import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: paymentId } = await params;

  const result =
    await ServicesContainer.PaymentsService().refundPayment(paymentId);
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: result.status }
    );
  }

  return NextResponse.json(
    { success: true, payment: result.updatedPayment },
    { status: 201 }
  );
}
