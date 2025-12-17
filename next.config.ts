import type { NextConfig } from "next";

// Определяем, запускаем ли мы сборку для GitHub Pages
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? '/logbook' : '';
const assetPrefix = isGithubPages ? '/logbook' : '';

const nextConfig: NextConfig = {
  // Настройки для GitHub Pages
  output: isGithubPages ? 'export' : undefined,
  basePath,
  assetPrefix,
  images: {
    unoptimized: true, // Необходимо для статического экспорта
  },
  // Настройки для PWA
  async headers() {
    // Headers не работают в статическом экспорте, поэтому только для dev/production сервера
    if (isGithubPages) {
      return [];
    }
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
