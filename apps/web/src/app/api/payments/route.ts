import { getLoggerFactory } from "@vivid/logger";
import { NextRequest } from "next/server";
import { createOrUpdateIntent } from "../../../utils/payments/createIntent";

export async function PUT(request: NextRequest) {
  const logger = getLoggerFactory("API/payments")("PUT");

  logger.debug(
    {
      url: request.url,
      method: request.method,
    },
    "Processing payments API request"
  );

  try {
    const result = await createOrUpdateIntent(request);

    if (!result || result.status >= 400) {
      logger.error(
        {
          status: result.status,
        },
        "Getting if payment is required has failed"
      );
    } else {
      logger.debug(
        {
          success: true,
        },
        "Successfully processed payment intent"
      );
    }

    return result;
  } catch (error: any) {
    logger.error(
      {
        error: error?.message || error?.toString(),
      },
      "Error processing payment intent"
    );
    throw error;
  }
}
