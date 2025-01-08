/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdfmake'],
  },
  env: {
    NEXT_PUBLIC_ISSUER_ENDPOINT:
      process.env.NEXT_PUBLIC_ISSUER_ENDPOINT ||
      'NEXT_PUBLIC_ISSUER_ENDPOINT_PLACEHOLDER',
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || 'NEXT_PUBLIC_APP_URL_PLACEHOLDER',
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  output: 'standalone',
  headers: () => {
    return [
      {
        source: '/api/issue-oidc',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, x-api-key, schemaType',
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.externals.push('bufferutil');
    config.externals.push('utf-8-validate');
    return config;
  },
};

module.exports = nextConfig;
