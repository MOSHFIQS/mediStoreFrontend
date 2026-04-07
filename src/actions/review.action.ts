"use server";

import { reviewServiceServer } from "@/service/review.server.service";
import { revalidatePath } from "next/cache";

// Create a review
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
     try {
          if (!medicineId) return { ok: false, message: "Medicine ID is required" };
          if (!rating || rating < 1) return { ok: false, message: "Rating must be at least 1" };
          if (!comment) return { ok: false, message: "Comment is required" };

          const res = await reviewServiceServer.create({ medicineId, rating, title, comment });

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to submit review" };
          }

          revalidatePath("/reviews");

          return { ok: true, message: res?.message || "Review submitted successfully", data: res?.data };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while submitting review" };
     }
}

// Delete a review
export async function deleteReviewAction(id: string) {
     try {
          if (!id) return { ok: false, message: "Review ID is required" };

          const res = await reviewServiceServer.delete(id);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to delete review" };
          }

          revalidatePath("/reviews");

          return { ok: true, message: res?.message || "Review deleted successfully" };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while deleting review" };
     }
}

// Get all reviews
export async function getAllReviewsAction() {
     try {
          const res = await reviewServiceServer.getAll();

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to fetch reviews", data: [] };
          }

          return { ok: true, message: res?.message || "Reviews fetched successfully", data: res?.data?.data || [] };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while fetching reviews", data: [] };
     }
}

// Get reviews for a specific medicine
export async function getMedicineReviewsAction(medicineId: string) {
     try {
          if (!medicineId) return { ok: false, message: "Medicine ID is required", data: [] };

          const res = await reviewServiceServer.getByMedicine(medicineId);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to fetch medicine reviews", data: [] };
          }

          return { ok: true, message: res?.message || "Medicine reviews fetched successfully", data: res?.data?.data || [] };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while fetching medicine reviews", data: [] };
     }
}