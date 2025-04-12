import { NextRequest } from "next/server";
import { AuthResult } from "./app/admin/auth";

const func: (
  req: NextRequest,
  ctx: {
    params?: Record<string, string | string[]>;
  }
) => void | Response | Promise<void | Response> = AuthResult.auth(
  (req: NextRequest & { auth: any }) => {
    if (!req.auth) {
      const url = req.url.replace(req.nextUrl.pathname, "/admin");
      return Response.redirect(url);
    }
  }
);

export default func;

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
