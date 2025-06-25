import { User } from "next-auth";
import { NextFetchEvent, NextRequest } from "next/server";
import { AuthResult } from "../app/admin/auth";
const { auth } = AuthResult;

import { fallbackLanguage, Language } from "@vivid/i18n";
import { MiddlewareFactory } from "./types";
import { containsAdminDashboard } from "./utils";

export const withLanguage: MiddlewareFactory = (next) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { nextUrl } = request;
    const session = await auth();
    const user = session?.user as User & { language: Language };
    if (containsAdminDashboard(nextUrl.pathname)) {
      request.headers.set("x-language", user?.language || fallbackLanguage);
    }

    return next(request, event);
  };
};
