import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Prisma out of the server bundle so its query engine binary resolves
  // correctly on serverless (Vercel).
  serverExternalPackages: ["@prisma/client", "prisma"],
  images: {
    remotePatterns: [
      // Product photos uploaded to Vercel Blob.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
