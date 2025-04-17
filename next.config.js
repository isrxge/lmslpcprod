/** @type {import('next').NextConfig} */
const nextConfig = {

  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required to make Konva & react-konva work
    return config;
  },

  env: {},
  reactStrictMode: false,
};

module.exports = nextConfig;
