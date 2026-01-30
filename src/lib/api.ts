export const API_BASE = process.env.NEXT_PUBLIC_API_URL

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
     if (!res.ok) {
          // Throw an error so React Query goes to onError
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
