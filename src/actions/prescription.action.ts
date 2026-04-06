"use server";

import { imageHostingService } from "@/service/image-hosting.service";
import { prescriptionServiceServer } from "@/service/prescription.server.service";
import { revalidatePath } from "next/cache";

// Upload prescription
export async function uploadPrescriptionAction(formData: FormData) {
     try {
          const files = formData.getAll("images") as File[];
          const notes = formData.get("notes") as string;

          if (!files.length) return { ok: false, message: "At least one prescription image is required" };

          // Upload all images
          const uploadResults = await Promise.all(files.map((f) => imageHostingService.uploadImage(f)));
          const failed = uploadResults.find((r) => !r.ok);
          if (failed) return { ok: false, message: "One or more image uploads failed" };

          const imageUrls = uploadResults.map((r) => r.url as string);

          const res = await prescriptionServiceServer.upload({ images: imageUrls, notes });

          if (!res?.ok) return { ok: false, message: res?.message || "Failed to upload prescription" };

          revalidatePath("/dashboard/prescriptions");

          return { ok: true, message: res?.message || "Prescription uploaded successfully", data: res?.data };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while uploading prescription" };
     }
}

// Review prescription
export async function reviewPrescriptionAction(
     id: string,
     payload: { status: "APPROVED" | "REJECTED"; items?: any[] }
) {
     try {
          if (!id) return { ok: false, message: "Prescription ID is required" };
          if (!payload?.status) return { ok: false, message: "Status is required" };

          const res = await prescriptionServiceServer.review(id, payload);

          if (!res?.ok) return { ok: false, message: res?.message || "Failed to review prescription" };

          revalidatePath("/admin-dashboard/prescriptions");

          return { ok: true, message: res?.message || "Prescription reviewed successfully", data: res?.data };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while reviewing prescription" };
     }
}