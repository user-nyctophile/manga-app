/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'uploads.mangadex.org' },
      { protocol: 'https', hostname: '**.mangadex.network' },
    ],
  },
};

module.exports = nextConfig;
