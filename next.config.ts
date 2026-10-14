import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/nature_trip",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default createNextIntlPlugin("./i18n/request.ts")(nextConfig);
