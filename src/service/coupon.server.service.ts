import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const couponServiceServer = {
     getAll: () => apiFetchServerMain("/coupons"),

     create: (payload: any) =>
          apiFetchServerMain("/coupons", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     update: (id: string, payload: any) =>
          apiFetchServerMain(`/coupons/${id}`, {
               method: "PATCH",
               body: JSON.stringify(payload),
          }),

     delete: (id: string) =>
          apiFetchServerMain(`/coupons/${id}`, { method: "DELETE" }),

     validate: (code: string, orderAmount: number) =>
          apiFetchServerMain("/coupons/validate", {
               method: "POST",
               body: JSON.stringify({ code, orderAmount }),
          }),
};