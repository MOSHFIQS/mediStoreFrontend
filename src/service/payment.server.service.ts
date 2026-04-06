import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const paymentServiceServer = {
     initiate: (orderId: string) =>
          apiFetchServerMain(`/payment/initiate/${orderId}`, { method: "POST" }),

     getByOrder: (orderId: string) =>
          apiFetchServerMain(`/payment/order/${orderId}`),
};