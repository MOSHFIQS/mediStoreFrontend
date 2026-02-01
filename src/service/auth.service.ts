import { apiFetchServer } from "@/lib/api"

export const authService = {
     signUp: (payload: {
          name: string
          email: string
          password: string
          role: string
          image?: string
     }) =>
          apiFetchServer("/auth/register", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     signIn: (payload: { email: string; password: string }) =>
          apiFetchServer("/auth/login", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     getMe: () => apiFetchServer("/auth/me"),

     logout: () =>
          apiFetchServer("/auth/logout", {
               method: "POST",
          }),
}
