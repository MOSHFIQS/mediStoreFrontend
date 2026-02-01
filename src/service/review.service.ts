import { apiFetchServer } from "@/lib/api"


export interface CreateReviewPayload {
     medicineId: string;
     rating: number;
     comment: string;
}


export const reviewService = {
     getAll: () => apiFetchServer("/review"),

     create: (payload: CreateReviewPayload) =>
          apiFetchServer("/review", {
               method: "POST",
               body: JSON.stringify(payload),
          }),
}
