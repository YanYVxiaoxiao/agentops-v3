import type { NextConfig } from "next";

// 显式锁定 Turbopack 工作区根目录，防止 pnpm-workspace.yaml 导致误判到用户主目录
const projectRoot = process.cwd();

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
