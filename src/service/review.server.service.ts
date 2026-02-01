import { apiFetchServerMain } from "@/lib/apiFetchServer";



export interface CreateReviewPayload {
     medicineId: string;
     rating: number;
     comment: string;
}

export const reviewServiceServer = {
     create: (payload: CreateReviewPayload) =>
          apiFetchServerMain("/review", {
               method: "POST",
               body: JSON.stringify(payload),
          }),
}