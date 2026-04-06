"use server";

import { reviewServiceServer } from "@/service/review.server.service";
import { revalidatePath } from "next/cache";

export async function createReviewAction({
     medicineId,
     rating,
     title,
     comment,
}: {
     medicineId: string;
     rating: number;
     title?: string;
     comment: string;
}) {
     const res = await reviewServiceServer.create({ medicineId, rating, title, comment });
     if (!res.ok) throw new Error(res.message || "Failed to submit review");
     revalidatePath("/reviews");
     return res;
}

export async function deleteReviewAction(id: string) {
     const res = await reviewServiceServer.delete(id);
     if (!res.ok) throw new Error(res.message || "Failed to delete review");
     revalidatePath("/reviews");
     return { ok: true };
}

export async function getAllReviewsAction() {
     const res = await reviewServiceServer.getAll();
     if (!res.ok) return { ok: false, data: [], message: res.message };
     return { ok: true, data: res.data.data };
}

export async function getMedicineReviewsAction(medicineId: string) {
     const res = await reviewServiceServer.getByMedicine(medicineId);
     if (!res.ok) return { ok: false, data: [], message: res.message };
     return { ok: true, data: res.data.data };
}