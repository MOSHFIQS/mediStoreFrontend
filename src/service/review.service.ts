import { apiFetchClient } from "@/lib/api"


export interface CreateReviewPayload {
     medicineId: string;
     rating: number;
     comment: string;
}


export const reviewService = {
     getAll: () => apiFetchClient("/review"),

     create: (payload: CreateReviewPayload) =>
          apiFetchClient("/review", {
               method: "POST",
               body: JSON.stringify(payload),
          }),
}
