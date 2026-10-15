import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/nature_trip",
  trailingSlash: true,
  /* Dev server only: phones on the Wi-Fi open it by the PC's LAN IP, and Next 16 blocks its scripts for
     any origin not listed here, so the page never starts (dead menu, header stuck see-through). */
  allowedDevOrigins: ["192.168.*.*"],
  images: {
    unoptimized: true,
  },
};

export default createNextIntlPlugin("./i18n/request.ts")(nextConfig);
