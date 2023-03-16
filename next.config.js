/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEAR_RPC_URL: process.env.NEAR_RPC_URL,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  },
};

module.exports = nextConfig;
