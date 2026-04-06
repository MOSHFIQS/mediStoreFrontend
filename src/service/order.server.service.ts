import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const orderServiceServer = {
     create: (payload: any) =>
          apiFetchServerMain("/orders", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     getMyOrders: () => apiFetchServerMain("/orders"),

     getById: (id: string) => apiFetchServerMain(`/orders/${id}`),

     cancel: (id: string) =>
          apiFetchServerMain(`/orders/${id}`, { method: "PATCH" }),

     updateStatus: (id: string, status: string) =>
          apiFetchServerMain(`/orders/seller/${id}`, {
               method: "PATCH",
               body: JSON.stringify({ status }),
          }),

     getSellerOrders: () => apiFetchServerMain("/orders/seller/my-orders"),
};