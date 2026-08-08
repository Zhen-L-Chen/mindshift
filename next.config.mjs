/** @type {import('next').NextConfig} */
const nextConfig = {
  // static export for GitHub Pages; NEXT_PUBLIC_BASE_PATH="/mindshift" in CI
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
};

export default nextConfig;
