// Next.js config for a fully static export (GitHub Pages compatible).
// basePath is injected by the GitHub Actions workflow (NEXT_PUBLIC_BASE_PATH)
// since a site published at https://<user>.github.io/<repo>/ needs to know
// its sub-path to resolve assets correctly.
/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true, // next/image doesn't work with static export
  },
  trailingSlash: true,
};

module.exports = nextConfig;
