import { apiFetch } from "@/lib/api"

export const authService = {
     signUp: (payload: {
          name: string
          email: string
          password: string
          role: string
          image?: string
     }) =>
          apiFetch("/auth/register", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     signIn: (payload: { email: string; password: string }) =>
          apiFetch("/auth/login", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     getMe: () => apiFetch("/auth/me"),

     logout: () =>
          apiFetch("/auth/logout", {
               method: "POST",
          }),
}
