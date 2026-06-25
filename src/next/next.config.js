const path = require("path");

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/warrantywallet";

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  output: "standalone",
  reactStrictMode: true,

  sassOptions: {
    includePaths: [
      path.join(__dirname, "../frontend/styles"),
      path.join(__dirname, "node_modules"),
    ],
  },

  // Allow importing shared SCSS from src/frontend during migration
  experimental: {
    externalDir: true,
  },

  // Dev convenience: proxy API/uploads to Express when running Next alone
  async rewrites() {
    const legacyApi = process.env.LEGACY_API_URL || "http://localhost:3000";
    return [
      {
        source: "/api/:path*",
        destination: `${legacyApi}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${legacyApi}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
