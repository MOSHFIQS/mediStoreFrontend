import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const paymentServiceServer = {
     initiate: (orderId: string) =>
          apiFetchServerMain(`/payment/initiate/${orderId}`, { method: "POST" }),

     getByOrder: (orderId: string) =>
          apiFetchServerMain(`/payment/order/${orderId}`),

     getMy: (query?: string) =>
          apiFetchServerMain(`/payment/my?${query || ""}`),

     getSeller: (query?: string) =>
          apiFetchServerMain(`/payment/seller?${query || ""}`),

     getAll: (query?: string) =>
          apiFetchServerMain(`/payment/admin?${query || ""}`),

     refund: (paymentId: string) =>
          apiFetchServerMain(`/payment/admin/${paymentId}/refund`, { method: "PATCH" }),
};

