import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
     server: {
          BACKEND_URL: z.url(),
          FRONTEND_URL: z.url(),
          API_URL: z.url(),
          JWT_SECRET: z.string(),
     },

     client: {
          NEXT_PUBLIC_AUTH_URL: z.url(), 
     },

     runtimeEnv: {
          BACKEND_URL: process.env.BACKEND_URL,
          FRONTEND_URL: process.env.FRONTEND_URL,
          API_URL: process.env.API_URL,
          JWT_SECRET: process.env.JWT_SECRET,
          NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL
     },
});
