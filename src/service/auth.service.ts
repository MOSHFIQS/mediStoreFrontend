import { env } from "@/env";

const AUTH_URL = env.AUTH_URL;

export const authService = {
     async getMe() {
          try {
               const res = await fetch(`${AUTH_URL}/me`, {
                    credentials: "include",
                    cache: "no-store",
               })

               if (!res.ok) return null

               const data = await res.json()
               return data.data?.user ?? null
          } catch {
               return null
          }
     }
}
