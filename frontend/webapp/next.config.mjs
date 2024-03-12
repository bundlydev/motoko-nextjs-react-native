/** @type {import('next').NextConfig} */

import { bootstrap } from './dfx.next.config.mjs';
bootstrap("../../", "NEXT_PUBLIC");

const nextConfig = {
  output: "export",
  distDir: "build",
};

export default nextConfig;
