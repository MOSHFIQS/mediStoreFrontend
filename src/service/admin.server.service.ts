import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const adminServiceServer = {
     getStatistics: () => apiFetchServerMain("/admin/statistics"),

     getUsers: (query?: string) => apiFetchServerMain(`/admin/users?${query || ""}`),

     updateUserStatus: (id: string, status: string) =>
          apiFetchServerMain(`/admin/users/${id}`, {
               method: "PATCH",
               body: JSON.stringify({ status }),
          }),

     deleteUser: (id: string) =>
          apiFetchServerMain(`/admin/users/${id}`, {
               method: "DELETE",
          }),
}