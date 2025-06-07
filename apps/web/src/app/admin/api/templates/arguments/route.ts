import { ServicesContainer } from "@vivid/services";
import { Appointment, Customer } from "@vivid/types";
import { getArguments } from "@vivid/utils";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-cache";
export const revalidate = 10;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const appointmentId = params.get("appointmentId");
  const customerId = params.get("customerId");
  if (!appointmentId && !customerId) {
    return NextResponse.json({ error: "id_not_provided" }, { status: 400 });
  }

  if (appointmentId && customerId) {
    return NextResponse.json({ error: "both_ids_provided" }, { status: 400 });
  }

  const config =
    await ServicesContainer.ConfigurationService().getConfigurations(
      "booking",
      "general",
      "social"
    );

  let appointment: Appointment | null = null;
  let customer: Customer;
  if (appointmentId) {
    appointment =
      await ServicesContainer.EventsService().getAppointment(appointmentId);
    if (!appointment) {
      return NextResponse.json(
        { error: "appointment_not_found" },
        { status: 404 }
      );
    }

    customer = appointment.customer;
  } else {
    const _customer = await ServicesContainer.CustomersService().getCustomer(
      customerId!
    );

    if (!_customer) {
      return NextResponse.json(
        { error: "customer_not_found" },
        { status: 404 }
      );
    }

    customer = _customer;
  }

  const args = getArguments({ appointment, config, customer });

  const headers = new Headers();
  headers.append("Cache-Control", "max-age=10");

  return NextResponse.json(args, { headers });
}
