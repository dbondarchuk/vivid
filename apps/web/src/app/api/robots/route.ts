import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const logger = getLoggerFactory("API/robots")("GET");

  logger.debug(
    {
      url: req.url,
      method: req.method,
    },
    "Processing robots.txt request",
  );

  const { url } =
    await ServicesContainer.ConfigurationService().getConfiguration("general");

  const robots = `User-Agent: *
Allow: /
Disallow: /admin/

Sitemap: ${url}/sitemap.xml`;

  logger.debug(
    {
      sitemapUrl: `${url}/sitemap.xml`,
    },
    "Successfully generated robots.txt",
  );

  return new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
}

export const dynamic = "force-dynamic";
