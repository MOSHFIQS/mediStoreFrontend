"use server";

import { reviewServiceServer } from "@/service/review.server.service";

export async function createReviewAction({
     medicineId,
     rating,
     comment,
}: {
     medicineId: string;
     rating: number;
     comment: string;
}) {

     const res = await reviewServiceServer.create({ medicineId, rating, comment });

     if (!res.ok) throw new Error(res.message);

     return res;
}
