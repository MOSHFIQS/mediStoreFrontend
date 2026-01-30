import { apiFetch } from "@/lib/api"

export const medicineService = {
     getAll: (query?: string) =>
          apiFetch(`/medicines${query ? `?${query}` : ""}`),

     getById: (id: string) =>
          apiFetch(`/medicines/${id}`),

     create: (payload: any) =>
          apiFetch("/medicines/seller", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     getSellerMedicines: () =>
          apiFetch("/medicines/seller"),


     update: (id: string, payload: any) =>
          apiFetch(`/medicines/seller/${id}`, {
               method: "PUT",
               body: JSON.stringify(payload),
          }),

     delete: (id: string) =>
          apiFetch(`/medicines/seller/${id}`, {
               method: "DELETE",
          }),
}
