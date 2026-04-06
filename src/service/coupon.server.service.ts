import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const couponServiceServer = {
     getAll: () => apiFetchServerMain("/coupons"),

     create: (payload: any) =>
          apiFetchServerMain("/coupon", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     update: (id: string, payload: any) =>
          apiFetchServerMain(`/coupon/${id}`, {
               method: "PATCH",
               body: JSON.stringify(payload),
          }),

     delete: (id: string) =>
          apiFetchServerMain(`/coupon/${id}`, { method: "DELETE" }),

     validate: (code: string, orderAmount: number) =>
          apiFetchServerMain("/coupon/validate", {
               method: "POST",
               body: JSON.stringify({ code, orderAmount }),
          }),
};