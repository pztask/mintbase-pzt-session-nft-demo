/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEAR_RPC_URL: process.env.NEAR_RPC_URL,
    NEAR_CONTRACT_ID: process.env.NEAR_CONTRACT_ID,
  },
};

module.exports = nextConfig;
