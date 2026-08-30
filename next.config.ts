import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Prisma out of the server bundle so its query engine binary resolves
  // correctly on serverless (Vercel).
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
