import { renderToStaticMarkup } from "@vivid/email-builder/static";
import { ServicesContainer } from "@vivid/services";
import {
  Appointment,
  Customer,
  okStatus,
  sendCommunicationRequestSchema,
} from "@vivid/types";
import { getArguments, template } from "@vivid/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { error, success, data } = sendCommunicationRequestSchema.safeParse(
    await request.json()
  );
  if (!success || !data || error) {
    return NextResponse.json(
      {
        error: "bad_data",
        message: error?.message,
      },
      { status: 400 }
    );
  }

  let customer: Customer;
  let appointment: Appointment | null = null;

  if ("appointmentId" in data) {
    appointment = await ServicesContainer.EventsService().getAppointment(
      data.appointmentId
    );

    if (!appointment) {
      return NextResponse.json(
        {
          error: "appointment_not_found",
          message: `Appointment ${data.appointmentId} was not found`,
        },
        { status: 404 }
      );
    }

    customer = appointment.customer;
  } else {
    const _customer = await ServicesContainer.CustomersService().getCustomer(
      data.customerId! // Customer Id will be present
    );

    if (!_customer) {
      return NextResponse.json(
        {
          error: "customer_not_found",
          message: `Customer ${data.customerId} was not found`,
        },
        { status: 404 }
      );
    }

    customer = _customer;
  }

  const config =
    await ServicesContainer.ConfigurationService().getConfigurations(
      "booking",
      "general",
      "social"
    );

  const args = getArguments({ appointment, config, customer });

  const customerId = "customerId" in data ? data.customerId : undefined;
  const appointmentId =
    "appointmentId" in data ? data.appointmentId : undefined;

  const handledBy = customerId
    ? "Send Customer Message"
    : "Send Appointment Message";

  switch (data.channel) {
    case "text-message": {
      const body = template(data.content, args);
      await ServicesContainer.NotificationService().sendTextMessage({
        body,
        handledBy,
        participantType: "customer",
        phone: customer.phone,
        sender: config.general.name,
        customerId,
        appointmentId,
        webhookData: {
          customerId,
          appointmentId,
        },
      });

      break;
    }

    case "email": {
      const body = await renderToStaticMarkup({
        args: args,
        document: data.content,
      });

      await ServicesContainer.NotificationService().sendEmail({
        email: {
          body,
          subject: template(data.subject, args),
          to: customer.email,
        },
        handledBy,
        participantType: "customer",
        appointmentId,
        customerId,
      });
      break;
    }
  }

  return NextResponse.json(okStatus);
}
