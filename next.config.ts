import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "https://i.imgur.com",
      "i.imgur.com",
      "imgur.com",
      "res.cloudinary.com",
    ], // tambahin domain gambar kamu di sini
  },
};

export default nextConfig;
