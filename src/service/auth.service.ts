import { apiFetchClient } from "@/lib/api"



export interface UpdateProfilePayload {
     name?: string
     phone?: string
     image?: string
}

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

     getMe: () => apiFetchClient("/user/me"),

     updateMe: (payload: UpdateProfilePayload) =>
          apiFetchClient("/users/me", {
               method: "PATCH",
               body: JSON.stringify(payload),
          }),


     logout: () =>
          apiFetchClient("/auth/logout", {
               method: "POST",
          }),
}
