import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const orderServiceServer = {
     create: (payload: any) =>
          apiFetchServerMain("/orders", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     updateStatus: (id: string, status: string) =>
          apiFetchServerMain(`/orders/seller/${id}`, {
               method: "PATCH",
               body: JSON.stringify({ status }),
          }),

     getMyOrders: () =>
          apiFetchServerMain("/orders"),

     cancel: (id: string) =>
          apiFetchServerMain(`/orders/${id}`, {
               method: "PATCH",
          }),

          getSellerOrders: () =>
                    apiFetchServerMain("/orders/seller/my-orders"),

}