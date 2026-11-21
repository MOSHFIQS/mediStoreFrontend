import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     images: {
          remotePatterns: [
               { protocol: "https", hostname: "res.cloudinary.com" },
               { protocol: "https", hostname: "muniquipllc.com" },
               { protocol: "https", hostname: "i.ibb.co" },
               { protocol: "https", hostname: "i.ibb.co.com" },
          ],
     },
     reactStrictMode: true,
     experimental: {
          serverActions: {
               bodySizeLimit: "10mb", // <-- increase limit here
               // allowedOrigins?: ["https://yourdomain.com"] // optional
          },
     },
};

export default nextConfig;