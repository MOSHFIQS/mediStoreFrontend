import { apiFetchServer } from "@/lib/api"

export const orderService = {
     create: (payload: any) =>
          apiFetchServer("/orders", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     getMyOrders: () =>
          apiFetchServer("/orders"),

     getById: (id: string) =>
          apiFetchServer(`/orders/${id}`),

     cancel: (id: string) =>
          apiFetchServer(`/orders/${id}`, {
               method: "PATCH",
          }),

     // Seller
     getSellerOrders: () =>
          apiFetchServer("/orders/seller/my-orders"),

     updateStatus: (id: string, status: string) =>
          apiFetchServer(`/orders/seller/${id}`, {
               method: "PATCH",
               body: JSON.stringify({ status }),
          }),
}
