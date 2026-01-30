import { apiFetch } from "@/lib/api"

export const orderService = {
     create: (payload: any) =>
          apiFetch("/orders", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     getMyOrders: () =>
          apiFetch("/orders"),

     getById: (id: string) =>
          apiFetch(`/orders/${id}`),

     cancel: (id: string) =>
          apiFetch(`/orders/${id}`, {
               method: "PATCH",
          }),

     // Seller
     getSellerOrders: () =>
          apiFetch("/orders/seller"),

     updateStatus: (id: string, status: string) =>
          apiFetch(`/orders/seller/${id}`, {
               method: "PATCH",
               body: JSON.stringify({ status }),
          }),
}
