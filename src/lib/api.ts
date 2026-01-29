// import { env } from "@/env"

export const API_BASE = "http://localhost:5000/api"

export async function apiFetch(
     endpoint: string,
     options?: RequestInit
) {
     const res = await fetch(`${API_BASE}${endpoint}`, {
          credentials: "include", 
          headers: {
               "Content-Type": "application/json",
               ...(options?.headers || {}),
          },
          ...options,
     })

     const data = await res.json()

     return {
          ok: res.ok,
          status: res.status,
          data,
          message: data.message,
     }
}
