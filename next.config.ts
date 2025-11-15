import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark server-side packages as external to avoid bundling their test files and dependencies
  serverExternalPackages: [
    'pino',
    'pino-pretty',
    'pino-abstract-transport',
    'thread-stream',
    'sonic-boom',
    'atomic-sleep',
    'fast-redact',
    'on-exit-leak-free',
    'quick-format-unescaped',
    '@browserbasehq/stagehand',
    'playwright',
    'playwright-core',
  ],
};

export default nextConfig;
