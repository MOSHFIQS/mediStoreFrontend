export const API_BASE = process.env.NEXT_PUBLIC_API_URL

export async function apiFetchClient(
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
     if (!res.ok) {
          throw new Error(data.message || "API request failed");
     }

     console.log(data.message);

     return {
          ok: res.ok,
          status: res.status,
          data,
          message: data.message,
     }
}
