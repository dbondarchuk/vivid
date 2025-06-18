import { getLoggerFactory } from "@vivid/logger";
import { NextRequest } from "next/server";
import { createOrUpdateIntent } from "../../../../utils/payments/createIntent";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ intentId: string }> }
) {
  const logger = getLoggerFactory("API/payments-intent")("POST");
  const { intentId } = await params;

  logger.debug(
    {
      url: request.url,
      method: request.method,
      intentId,
    },
    "Processing payment intent API request"
  );

  try {
    const result = await createOrUpdateIntent(request, intentId);

    logger.debug(
      {
        intentId,
        success: true,
      },
      "Successfully processed payment intent"
    );

    return result;
  } catch (error: any) {
    logger.error(
      {
        intentId,
        error: error?.message || error?.toString(),
      },
      "Error processing payment intent"
    );
    throw error;
  }
}
