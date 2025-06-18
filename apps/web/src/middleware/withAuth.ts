import { AuthResult } from "../app/admin/auth";

import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const { auth } = AuthResult;

import { MiddlewareFactory } from "./types";

function containsAdminDashboard(value: string) {
  const regex = /^\/admin\/(api|dashboard)/i;
  return regex.test(value);
}

export const withAuth: MiddlewareFactory = (next) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { nextUrl } = request;
    const session = await auth();
    if (session == null && containsAdminDashboard(nextUrl.pathname)) {
      const url = `/admin?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`;
      return NextResponse.redirect(new URL(url, request.url));
    }

    return next(request, event);
  };
};
