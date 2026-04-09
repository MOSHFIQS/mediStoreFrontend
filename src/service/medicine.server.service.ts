import { apiFetchServerMain } from "@/lib/apiFetchServer";


export const medicineServiceServer = {


     //  getAllEvents: (query?: string) =>
     //    apiFetchServerMain(`/event?${query || ""}`, {
     //        method: "GET",
     //    }),


     getAll: (query?: string) =>
          apiFetchServerMain(`/medicine?${query || ""}`, {
               method: "GET",
          }),


     getById: (id: string) =>
          apiFetchServerMain(`/medicine/${id}`),

     create: (payload: any) =>
          apiFetchServerMain("/medicine/seller", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     update: (id: string, payload: any) =>
          apiFetchServerMain(`/medicine/seller/${id}`, {
               method: "PUT",
               body: JSON.stringify(payload),
          }),

     getSellerMedicines: (query?: string) =>
          apiFetchServerMain(`/medicine/seller?${query || ""}`),

     delete: (id: string) =>
          apiFetchServerMain(`/medicine/seller/${id}`, {
               method: "DELETE",
          }),

}
