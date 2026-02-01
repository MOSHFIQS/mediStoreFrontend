import { cookies } from "next/headers";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetchServerMain(
     endpoint: string,
     options?: RequestInit
) {
     // ✅ Get cookies from the incoming request
     const cookieStore = await cookies();
     const cookieHeader = cookieStore.toString();

     const res = await fetch(`${API_BASE}${endpoint}`, {
          method: options?.method || "GET",
          headers: {
               "Content-Type": "application/json",
               Cookie: cookieHeader, // ✅ Forward auth cookies to backend
               ...(options?.headers || {}),
          },
          body: options?.body,
          cache: "no-store", // ✅ Avoid Next caching
     });

     let data: any = {};
     try {
          data = await res.json();
     } catch {
          // in case backend sends empty response
     }

     if (!res.ok) {
          throw new Error(data.message || "API request failed");
     }

     return {
          ok: true,
          status: res.status,
          data,
          message: data.message,
     };
}
