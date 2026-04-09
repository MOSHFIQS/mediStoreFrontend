import { apiFetchServerMain } from "@/lib/apiFetchServer";

export interface CreateReviewPayload {
     medicineId: string;
     rating: number;
     comment: string;
     title?: string
}

export const reviewServiceServer = {
     getAll: (query?: string) => apiFetchServerMain(`/review?${query || ""}`),

     getByMedicine: (medicineId: string) =>
          apiFetchServerMain(`/review/${medicineId}`),

     create: (payload: CreateReviewPayload) =>
          apiFetchServerMain("/review", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     delete: (id: string) =>
          apiFetchServerMain(`/review/${id}`, { method: "DELETE" }),
};