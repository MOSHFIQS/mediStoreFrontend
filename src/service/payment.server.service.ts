import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const paymentServiceServer = {
     initiate: (orderId: string) =>
          apiFetchServerMain(`/payment/initiate/${orderId}`, { method: "POST" }),

     getByOrder: (orderId: string) =>
          apiFetchServerMain(`/payment/order/${orderId}`),

     getMy: () =>
          apiFetchServerMain("/payment/my"),

     getSeller: () =>
          apiFetchServerMain("/payment/seller"),

     getAll: () =>
          apiFetchServerMain("/payment/admin"),

     refund: (paymentId: string) =>
          apiFetchServerMain(`/payment/admin/${paymentId}/refund`, { method: "PATCH" }),
};

