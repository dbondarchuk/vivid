import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";

export type Credentials = {
  email: string;
  password: string;
};

export async function POST(request: NextRequest) {
  const credentials = (await request.json()) as Credentials;

  const { name, email } =
    await ServicesContainer.ConfigurationService().getConfiguration("general");
  if (
    email === credentials.email &&
    credentials.password === process.env.AUTH_PASSWORD
  ) {
    return NextResponse.json({
      id: "1",
      name,
      email,
    });
  }

  return NextResponse.json(null, { status: 401 });
}
