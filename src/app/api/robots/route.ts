import { Services } from "@/lib/services";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("robots.txt", req.url); // we need to use request object to disable pre-render at build

  const { url } = await Services.ConfigurationService().getConfiguration(
    "general"
  );

  const robots = `User-Agent: *
Allow: /
Disallow: /admin/

Sitemap: ${url}/sitemap.xml`;

  return new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
}

export const dynamic = "force-dynamic";
