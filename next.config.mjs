/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Prevents webpack from bundling pdf-parse (it must run in Node.js, not the browser)
    serverComponentsExternalPackages: ["pdf-parse"],
  },
};

export default nextConfig;
