const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  customWorkerDir: 'worker',
  runtimeCaching: [
    {
      urlPattern: ({ request, url }) =>
        request.mode === 'navigate' &&
        (url.pathname === '/admin' ||
          url.pathname.startsWith('/admin/') ||
          url.pathname === '/student' ||
          url.pathname.startsWith('/student/')),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'app-shell-admin-student',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 80,
          maxAgeSeconds: 60 * 60 * 24,
        },
      },
    },
  ],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'via.placeholder.com', pathname: '/**' },
    ],
  },
}

module.exports = withPWA(nextConfig)

