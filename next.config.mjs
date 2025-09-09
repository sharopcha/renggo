import createNextIntlPlugin from 'next-intl/plugin';
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'renggo.com' }],
    unoptimized: true,
  },
}

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
