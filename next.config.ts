import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // In Next.js 16 reactCompiler is a stable, top-level option (it moved out
  // of `experimental`). Keep it if you're using babel-plugin-react-compiler;
  // remove it otherwise.
  reactCompiler: true,
  // No `images` block needed — all project screenshots are local under
  // /public, so there's no remote host to allowlist.
};

export default nextConfig;
