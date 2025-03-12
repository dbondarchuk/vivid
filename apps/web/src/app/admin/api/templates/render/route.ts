import { renderToStaticMarkup } from "@vivid/email-builder/static";
import { getAppointmentArguments, ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const id = params.get("id") as string;
  const appointmentId = params.get("appointmentId") as string;

  const appointment =
    await ServicesContainer.EventsService().getAppointment(appointmentId);

  const { arg: args } = await getAppointmentArguments(appointment!, true);
  const template = await ServicesContainer.TemplatesService().getTemplate(id);
  const result = await renderToStaticMarkup({
    args,
    document: template?.value!,
  });

  const headers = new Headers({
    "Content-type": "text/html",
  });

  return new NextResponse(result, { headers });
}
