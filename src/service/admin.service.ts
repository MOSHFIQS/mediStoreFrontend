import { apiFetch } from "@/lib/api"

export const adminService = {
     getUsers: () => apiFetch("/admin/users"),

     updateUserStatus: (id: string, status: string) =>
          apiFetch(`/admin/users/${id}`, {
               method: "PATCH",
               body: JSON.stringify({ status }),
          }),
}
