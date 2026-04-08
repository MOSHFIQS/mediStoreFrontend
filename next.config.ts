import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     images: {
          domains: ["res.cloudinary.com", "muniquipllc.com", "i.ibb.co","i.ibb.co.com"],
     },
     reactStrictMode: true,
     experimental: {
          serverActions: {
               bodySizeLimit: "4.5mb", // <-- increase limit here
               // allowedOrigins?: ["https://yourdomain.com"] // optional
          },
     },
};

export default nextConfig;