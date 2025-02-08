import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: join(__dirname, "../../"),
  experimental: {
    serverActions: {
      bodySizeLimit: "150mb",
    },
    turbo: {
      rules: {
        "*.html": {
          loaders: ["raw-loader"],
          as: "*.js",
        },
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/,
      use: "raw-loader",
    });
    return config;
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
