/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  output: 'standalone',
  webpack: (config) => {
    config.externals.push('bufferutil');
    config.externals.push('utf-8-validate');
    return config;
  },
};

module.exports = nextConfig;
