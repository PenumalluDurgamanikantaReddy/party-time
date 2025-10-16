/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // By default PWA is enabled in production. For local testing you can
  // enable it by setting NEXT_PUBLIC_ENABLE_PWA=true in your environment.
  // This prevents accidental caching during normal development.
  disable: !(process.env.NEXT_PUBLIC_ENABLE_PWA === 'true' || process.env.NODE_ENV === 'production'),
});

const nextConfig = {
  reactStrictMode: true,
  // Enable static export output so `next build` creates a static site for `next export` behavior
  output: 'export',
  // any other configs
};

module.exports = withPWA(nextConfig);
