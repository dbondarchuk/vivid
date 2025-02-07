import { NextRequest } from "next/server";
import { auth } from "./app/admin/auth";

export default auth((req: NextRequest & { auth: any }) => {
  if (!req.auth) {
    const url = req.url.replace(req.nextUrl.pathname, "/admin");
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
