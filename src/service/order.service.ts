import { apiFetchClient } from "@/lib/api"

export const orderService = {


     getMyOrders: () =>
          apiFetchClient("/orders"),

     getById: (id: string) =>
          apiFetchClient(`/orders/${id}`),

     cancel: (id: string) =>
          apiFetchClient(`/orders/${id}`, {
               method: "PATCH",
          }),

     // Seller
     getSellerOrders: () =>
          apiFetchClient("/orders/seller/my-orders"),

     updateStatus: (id: string, status: string) =>
          apiFetchClient(`/orders/seller/${id}`, {
               method: "PATCH",
               body: JSON.stringify({ status }),
          }),
}
