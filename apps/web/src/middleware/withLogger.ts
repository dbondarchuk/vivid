import { getBaseLoggerFactory } from "@vivid/logger";
import { NextFetchEvent, NextRequest } from "next/server";
import { MiddlewareFactory } from "./types";

export const withLogger: MiddlewareFactory = (next) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    if (
      /^(\/_next\/static|\/_next\/image|\/favicon.ico)/.test(
        request.nextUrl.pathname,
      )
    )
      return next(request, event);

    const correlationId = crypto.randomUUID();

    let originalSessionId = request.cookies.get("x-session-id");
    const sessionId = originalSessionId?.value || crypto.randomUUID();
    request.headers.append("x-correlation-id", correlationId);
    request.headers.append("x-session-id", sessionId);

    const logger = getBaseLoggerFactory(correlationId);

    logger.debug(
      { url: request.url, method: request.method, correlationId },
      "Incoming request",
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

    const result = await next(request, event);
    if (!originalSessionId) {
      result.cookies.set("x-session-id", sessionId);
    }

    return result;
  };
};
