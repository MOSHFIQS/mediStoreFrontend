import { apiFetchClient } from "@/lib/api"

export const adminService = {
     getUsers: () => apiFetchClient("/admin/users"),

     updateUserStatus: (id: string, status: string) =>
          apiFetchClient(`/admin/users/${id}`, {
               method: "PATCH",
               body: JSON.stringify({ status }),
          }),
}
