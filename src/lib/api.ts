export const API_BASE = process.env.NEXT_PUBLIC_API_URL

export async function apiFetchClient(endpoint: string, options?: RequestInit) {
     try {
          const res = await fetch(`${API_BASE}${endpoint}`, {
               credentials: "include",
               headers: {
                    "Content-Type": "application/json",
                    ...(options?.headers || {}),
               },
               ...options,
          })

          let data: any = null
          try {
               data = await res.json()
          } catch {
               data = {}
          }

          return {
               ok: res.ok,
               status: res.status,
               data,
               message: data?.message || (res.ok ? "Success" : "API request failed"),
          }

     } catch (error: any) {
          console.error("apiFetchClient error:", error)
          return {
               ok: false,
               status: 0,
               data: null,
               message: error.message || "Network error",
          }
     }
}
