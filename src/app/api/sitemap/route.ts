import { Services } from "@/lib/services";
import { NextRequest } from "next/server";

type Sitemap = {
  url: string;
  lastModified: Date;
  priority: number;
}[];

function generateSiteMap(pages: Sitemap) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${pages
       .map(({ url, lastModified, priority }) => {
         return `
       <url>
           <loc>${url}</loc>
           <lastmod>${lastModified.toISOString()}</lastmod>
           <priority>${priority}</priority>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

export async function GET(req: NextRequest) {
  console.log("sitemap.xml", req.url); // we need to use request object to disable pre-render at build time

  const { url } = await Services.ConfigurationService().getConfiguration(
    "general"
  );

  const pages = await Services.PagesService().getPages({
    publishStatus: [true],
  });

  const sitemap: Sitemap = [
    {
      url,
      lastModified: new Date(),
      priority: 1,
    },
    ...pages.items.map((page) => ({
      url: `${url}/${page.slug}`,
      lastModified: page.updatedAt,
      priority: 0.8,
    })),
  ];

  return new Response(generateSiteMap(sitemap), {
    headers: { "Content-Type": "text/xml" },
  });
}

export const dynamic = "force-dynamic";
