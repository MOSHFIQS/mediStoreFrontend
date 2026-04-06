import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const addressServiceServer = {
     getAll: () => apiFetchServerMain("/addresses"),

     create: (payload: any) =>
          apiFetchServerMain("/addresses", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     update: (id: string, payload: any) =>
          apiFetchServerMain(`/addresses/${id}`, {
               method: "PATCH",
               body: JSON.stringify(payload),
          }),

     delete: (id: string) =>
          apiFetchServerMain(`/addresses/${id}`, { method: "DELETE" }),
};