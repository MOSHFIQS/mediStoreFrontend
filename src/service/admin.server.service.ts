import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const adminServiceServer = {
     getUsers: () => apiFetchServerMain("/admin/users"),
     
          updateUserStatus: (id: string, status: string) =>
               apiFetchServerMain(`/admin/users/${id}`, {
                    method: "PATCH",
                    body: JSON.stringify({ status }),
               }),
}