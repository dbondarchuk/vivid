import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export type Credentials = {
  email: string;
  password: string;
};

export async function POST(request: NextRequest) {
  const logger = getLoggerFactory("API/auth-check")("POST");

  logger.debug(
    {
      url: request.url,
      method: request.method,
    },
    "Processing auth check API request",
  );

  const credentials = (await request.json()) as Credentials;

  logger.debug(
    {
      email: credentials.email,
      hasPassword: !!credentials.password,
    },
    "Checking credentials",
  );

  const { name, email, language } =
    await ServicesContainer.ConfigurationService().getConfiguration("general");

  if (
    email === credentials.email &&
    credentials.password === process.env.AUTH_PASSWORD
  ) {
    logger.debug(
      {
        email: credentials.email,
        name,
      },
      "Authentication successful",
    );

    return NextResponse.json({
      id: "1",
      name,
      email,
      language,
    });
  }

  logger.warn(
    {
      email: credentials.email,
      emailMatch: email === credentials.email,
    },
    "Authentication failed",
  );

  return NextResponse.json(null, { status: 401 });
}
