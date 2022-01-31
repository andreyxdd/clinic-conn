/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['images.ctfassets.net'],
  },
  env: {
    NEXT_PUBLIC_SENDGRID_API_KEY: process.env.NEXT_PUBLIC_SENDGRID_API_KEY,
  },
};
