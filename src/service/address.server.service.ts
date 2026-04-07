import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const addressServiceServer = {
     getAll: () => apiFetchServerMain("/address"),

     create: (payload: any) =>
          apiFetchServerMain("/address", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     update: (id: string, payload: any) =>
          apiFetchServerMain(`/address/${id}`, {
               method: "PATCH",
               body: JSON.stringify(payload),
          }),

     delete: (id: string) =>
          apiFetchServerMain(`/address/${id}`, { method: "DELETE" }),
};