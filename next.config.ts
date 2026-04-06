import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     images: {
          domains: ["res.cloudinary.com", "muniquipllc.com"],
     },
     reactStrictMode: true,
     experimental: {
          serverActions: {
               bodySizeLimit: "5mb", // <-- increase limit here
               // allowedOrigins?: ["https://yourdomain.com"] // optional
          },
     },
};

export default nextConfig;