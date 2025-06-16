import { NextRequest } from "next/server";
import { createOrUpdateIntent } from "../../../utils/payments/createIntent";

export async function PUT(request: NextRequest) {
  return await createOrUpdateIntent(request);
}
