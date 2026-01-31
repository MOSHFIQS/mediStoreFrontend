import { apiFetch } from "@/lib/api"


export interface CreateReviewPayload {
     medicineId: string;
     rating: number;
     comment: string;
}


export const reviewService = {
     getAll: () => apiFetch("/review"),

     create: (payload : CreateReviewPayload) =>
          apiFetch("/review", {
               method: "POST",
               body: JSON.stringify(payload),
          }),
}
