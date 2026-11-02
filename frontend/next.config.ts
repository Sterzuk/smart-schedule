import path from 'node:path';
import type { NextConfig } from 'next';

// STATIC_EXPORT=true включает полностью статическую сборку для Layero:
// сайт раздаётся файлами, без Node-контейнера и холодных стартов.
// Локально и на Vercel по умолчанию остаётся обычный SSR/Next-режим.
const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve('.'),
  ...(isStaticExport
    ? {
        output: 'export' as const,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
