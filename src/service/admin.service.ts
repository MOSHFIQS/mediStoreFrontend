import { apiFetchServer } from "@/lib/api"

export const adminService = {
     getUsers: () => apiFetchServer("/admin/users"),

     updateUserStatus: (id: string, status: string) =>
          apiFetchServer(`/admin/users/${id}`, {
               method: "PATCH",
               body: JSON.stringify({ status }),
          }),
}
