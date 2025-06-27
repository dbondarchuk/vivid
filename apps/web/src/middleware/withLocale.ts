import { NextFetchEvent, NextRequest } from "next/server";
import { MiddlewareFactory } from "./types";
import { containsAdminDashboard } from "./utils";

export const withLocale: MiddlewareFactory = (next) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    if (
      /^(\/_next\/static|\/_next\/image|\/favicon.ico)/.test(
        request.nextUrl.pathname
      )
    )
      return next(request, event);

    const { nextUrl } = request;
    const locale = nextUrl.searchParams.get("lng");
    if (locale) {
      request.headers.set("accept-language", locale);
    }

    request.headers.set(
      "x-is-admin-path",
      containsAdminDashboard(nextUrl.pathname).toString()
    );

    return next(request, event);
  };
};
