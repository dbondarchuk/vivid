import { ServicesContainer } from "@vivid/services";
import {
  applyDiscountRequestSchema,
  ApplyDiscountResponse,
} from "@vivid/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error, success } = applyDiscountRequestSchema.safeParse(body);
  if (!success) {
    return NextResponse.json(error, { status: 400 });
  }

  const customer = await ServicesContainer.CustomersService().findCustomer(
    data.email,
    data.phone
  );

  const discount = await ServicesContainer.ServicesService().applyDiscount({
    code: data.code,
    optionId: data.optionId,
    addons: data.addons,
    customerId: customer?._id,
    dateTime: data.dateTime,
  });

  if (!discount) {
    return NextResponse.json({ error: "code_not_found" }, { status: 400 });
  }

  return NextResponse.json({
    code: data.code,
    type: discount.type,
    value: discount.value,
  } satisfies ApplyDiscountResponse);
}
