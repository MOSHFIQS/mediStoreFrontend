import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const adminServiceServer = {
     getStatistics: () => apiFetchServerMain("/admin/statistics"),
     getUsers: () => apiFetchServerMain("/admin/users"),

     updateUserStatus: (id: string, status: string) =>
          apiFetchServerMain(`/admin/users/${id}`, {
               method: "PATCH",
               body: JSON.stringify({ status }),
          }),
}