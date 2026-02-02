import { apiFetchServerMain } from "@/lib/apiFetchServer";

export interface UpdateProfilePayload {
     name?: string
     phone?: string
     image?: string
}

export const userServiceServer = {
     getMe: () => apiFetchServerMain("/user/me"),

     updateMe: (payload: UpdateProfilePayload) =>
          apiFetchServerMain("/user/me", {
               method: "PATCH",
               body: JSON.stringify(payload),
          }),
}