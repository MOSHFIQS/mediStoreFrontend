import { apiFetchClient } from "@/lib/api"

export const authService = {
     signUp: (payload: {
          name: string
          email: string
          password: string
          role: string
          image?: string
     }) =>
          apiFetchClient("/auth/register", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     signIn: (payload: { email: string; password: string }) =>
          apiFetchClient("/auth/login", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     getMe: () => apiFetchClient("/auth/me"),

     logout: () =>
          apiFetchClient("/auth/logout", {
               method: "POST",
          }),
}
