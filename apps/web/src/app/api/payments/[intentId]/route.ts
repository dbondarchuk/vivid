import { NextRequest } from "next/server";
import { createOrUpdateIntent } from "../../../../utils/payments/createIntent";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ intentId: string }> }
) {
  const { intentId } = await params;
  return await createOrUpdateIntent(request, intentId);
}
