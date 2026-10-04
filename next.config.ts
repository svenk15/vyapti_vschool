import type { NextConfig } from "next";
const config: NextConfig = { output: "standalone", distDir: process.env.VSCHOOL_E2E === "1" ? ".next-e2e" : ".next", devIndicators: false };
export default config;
