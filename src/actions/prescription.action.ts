"use server";

import { imageHostingService } from "@/service/image-hosting.service";
import { prescriptionServiceServer } from "@/service/prescription.server.service";
import { revalidatePath } from "next/cache";

export async function uploadPrescriptionAction(formData: FormData) {
     const files = formData.getAll("images") as File[];
     const notes = formData.get("notes") as string;

     if (!files.length) throw new Error("At least one prescription image is required");

     // Upload all images
     const uploadResults = await Promise.all(files.map((f) => imageHostingService.uploadImage(f)));
     const failed = uploadResults.find((r) => !r.ok);
     if (failed) throw new Error("One or more image uploads failed");

     const imageUrls = uploadResults.map((r) => r.url as string);

     const res = await prescriptionServiceServer.upload({ images: imageUrls, notes });
     if (!res.ok) throw new Error(res.message || "Failed to upload prescription");

     revalidatePath("/dashboard/prescriptions");
     return { ok: true };
}

export async function reviewPrescriptionAction(
     id: string,
     payload: { status: "APPROVED" | "REJECTED"; items?: any[] }
) {
     const res = await prescriptionServiceServer.review(id, payload);
     if (!res.ok) throw new Error(res.message || "Failed to review prescription");
     revalidatePath("/admin-dashboard/prescriptions");
     return { ok: true };
}