import { apiFetchServerMain } from "@/lib/apiFetchServer";


export const medicineServiceServer = {

     getAll: async function (params?: { categoryId?: string; search?: string }) {
          const searchParams = new URLSearchParams();

          if (params) {
               Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                         searchParams.append(key, String(value));
                    }
               });
          }

          const endpoint = `/medicine${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

          return apiFetchServerMain(endpoint);
     },


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

     getSellerMedicines: () =>
          apiFetchServerMain("/medicine/seller"),

     delete: (id: string) =>
          apiFetchServerMain(`/medicine/seller/${id}`, {
               method: "DELETE",
          }),

}
