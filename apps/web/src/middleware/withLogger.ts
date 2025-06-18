import { getBaseLoggerFactory } from "@vivid/logger";
import { NextFetchEvent, NextRequest } from "next/server";
import { MiddlewareFactory } from "./types";

export const withLogger: MiddlewareFactory = (next) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    if (
      /^(\/_next\/static|\/_next\/image|\/favicon.ico)/.test(
        request.nextUrl.pathname
      )
    )
      return next(request, event);

    const correlationId = crypto.randomUUID();
    request.headers.append("x-correlation-id", correlationId);

    const logger = getBaseLoggerFactory(correlationId);

    logger.info(
      { url: request.url, method: request.method, correlationId },
      "Incoming request"
    );

    // const start = performance.now();
    // const response = next(request, event);

    // after(() => {
    //   const end = performance.now();
    //   const diff = end - start;

    //   logger.info(
    //     {
    //       url: request.url,
    //       method: request.method,
    //       //   status: response.status,
    //       correlationId,
    //       time: `${diff.toFixed(4)}µs`,
    //     },
    //     "Response"
    //   );
    // });

    return next(request, event);
  };
};
