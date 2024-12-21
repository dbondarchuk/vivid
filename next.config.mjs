/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: {},
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  rewrites: () => [
    {
      source: "/robots.txt",
      destination: "/api/robots",
    },
    {
      source: "/sitemap.xml",
      destination: "/api/sitemap",
    },
  ],
};

export default nextConfig;
