import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  "allowedDevOrigins": ["http://localhost:3000", "http://localhost:3001", "http://192.168.5.45:3000", "http://192.168.5.45:3001"]
};

export default nextConfig;
