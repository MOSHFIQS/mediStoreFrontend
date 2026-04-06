import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const orderServiceServer = {
     create: (payload: {
          items: { medicineId: string; quantity: number }[];
          addressId?: string;
          addressSnapshot?: object;
          couponCode?: string;
          notes?: string;
          shippingFee?: number;
     }) =>
          apiFetchServerMain("/order", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     getMyOrders: () => apiFetchServerMain("/order"),

     getById: (id: string) => apiFetchServerMain(`/order/${id}`),

     cancel: (id: string) =>
          apiFetchServerMain(`/order/${id}`, { method: "PATCH" }),

     updateStatus: (id: string, status: string) =>
          apiFetchServerMain(`/order/seller/${id}`, {
               method: "PATCH",
               body: JSON.stringify({ status }),
          }),

     getSellerOrders: () => apiFetchServerMain("/order/seller/my-orders"),
};