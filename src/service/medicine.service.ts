import { apiFetch } from "@/lib/api"


interface GetMedicinesParams {
     page?: number
     limit?: number
     categoryId?: string
     search?: string
     sortBy?: string
     order?: "asc" | "desc"
}



export const medicineService = {
     getAll: async function (params?: GetMedicinesParams) {
          const searchParams = new URLSearchParams()

          if (params) {
               Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                         searchParams.append(key, String(value))
                    }
               })
          }

          const endpoint = `/medicines${searchParams.toString() ? `?${searchParams.toString()}` : ""
               }`

          return apiFetch(endpoint)
     },

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
