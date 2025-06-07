import { ServicesContainer } from "@vivid/services";
import { demoAppointment, getArguments } from "@vivid/utils";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-cache";
export const revalidate = 10;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const config =
    await ServicesContainer.ConfigurationService().getConfigurations(
      "booking",
      "general",
      "social"
    );

  const demoArguments = getArguments({
    appointment:
      params.get("noAppointment") !== "true" ? demoAppointment : undefined,
    config,
    customer: demoAppointment.customer,
  });

  const headers = new Headers();
  headers.append("Cache-Control", "max-age=10");

  return NextResponse.json(demoArguments, { headers });
}
