"use server";

import { imageHostingService } from "@/service/image-hosting.service";
import { prescriptionServiceServer } from "@/service/prescription.server.service";
import { revalidatePath } from "next/cache";

// Upload prescription
export async function uploadPrescriptionAction(payload: { images: string[]; notes?: string }) {
     try {
          const res = await prescriptionServiceServer.upload(payload);

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



// Get prescriptions of the logged-in user
export async function getMyPrescriptionsAction() {
     try {
          const res = await prescriptionServiceServer.getMy();

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to fetch your prescriptions", data: [] };
          }

          return { ok: true, message: res?.message || "Your prescriptions fetched successfully", data: res?.data|| [] };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while fetching your prescriptions", data: [] };
     }
}

// Get all prescriptions (admin)
export async function getAllPrescriptionsAction() {
     try {
          const res = await prescriptionServiceServer.getAll();

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to fetch prescriptions", data: [] };
          }

          return { ok: true, message: res?.message || "Prescriptions fetched successfully", data: res?.data || [] };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while fetching prescriptions", data: [] };
     }
}