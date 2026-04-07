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

     getAdminStatistics: () => apiFetchServerMain("/user/admin/statistics"),
     getCustomerStatistics: () => apiFetchServerMain("/user/customer/statistics"),
     getSellerStatistics: () => apiFetchServerMain("/user/seller/statistics"),
}