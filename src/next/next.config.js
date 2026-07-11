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
      path.join(__dirname, "styles"),
      path.join(__dirname, "node_modules"),
    ],
  },

  // Legacy Vite SPA paths → Next.js routes
  async redirects() {
    return [
      {
        source: "/warranties/details/:id",
        destination: "/warrantyDetails/:id/",
        permanent: true,
      },
      {
        source: "/warranties/details/:id/",
        destination: "/warrantyDetails/:id/",
        permanent: true,
      },
      {
        source: "/warranties/delete/:id",
        destination: "/warrantyDetails/:id/",
        permanent: true,
      },
      {
        source: "/warranties/delete/:id/",
        destination: "/warrantyDetails/:id/",
        permanent: true,
      },
    ];
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
