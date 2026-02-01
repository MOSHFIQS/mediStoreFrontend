import { apiFetchServerMain } from "@/lib/apiFetchServer";

interface GetMedicinesParams {
     page?: number
     limit?: number
     categoryId?: string
     search?: string
     sortBy?: string
     order?: "asc" | "desc"
}


export const medicineServiceServer = {

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

          return apiFetchServerMain(endpoint)
     },


     getById: (id: string) =>
          apiFetchServerMain(`/medicines/${id}`),
}
