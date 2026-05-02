import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Both casatec.mx and pintatec.mx are served from a single Vercel deployment.
  // Domain routing is handled by middleware.ts:
  //   - casatec.mx  → / (full 12-service catalog)
  //   - pintatec.mx → /pintatec (painting-only, Pintatec brand)
};

export default nextConfig;
