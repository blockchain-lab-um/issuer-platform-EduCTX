/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_API_URL:
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      'NEXT_PUBLIC_BACKEND_API_URL_PLACEHOLDER',
  },
  basePath: '/interop-testing-frontend',
  output: 'standalone',
  webpack: (config) => {
    config.externals.push('bufferutil');
    config.externals.push('utf-8-validate');
    return config;
  },
};

module.exports = nextConfig;
