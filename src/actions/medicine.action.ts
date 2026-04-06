"use server";

import { imageHostingService } from "@/service/image-hosting.service";
import { medicineServiceServer } from "@/service/medicine.server.service";
import { revalidatePath } from "next/cache";

// Create medicine
export async function createMedicineAction(data: {
     name: string;
     genericName?: string;
     brand?: string;
     manufacturer?: string;
     sku?: string;
     description: string;
     categoryId: string;
     dosageForm?: string;
     strength?: string;
     unit?: string;
     price: number;
     discountPrice?: number;
     stock: number;
     requiresPrescription: boolean;
     image: string;
     images?: string[];
}) {
     // Validate required fields
     if (!data.image) return { ok: false, message: "Image is required" };
     if (!data.name) return { ok: false, message: "Name is required" };
     if (!data.description) return { ok: false, message: "Description is required" };
     if (!data.categoryId) return { ok: false, message: "Category is required" };
     if (!data.price) return { ok: false, message: "Price is required" };
     if (data.stock === undefined || data.stock === null) return { ok: false, message: "Stock is required" };

     try {
          const res = await medicineServiceServer.create({
               name: data.name,
               genericName: data.genericName,
               brand: data.brand,
               manufacturer: data.manufacturer,
               sku: data.sku,
               description: data.description,
               categoryId: data.categoryId,
               dosageForm: data.dosageForm,
               strength: data.strength,
               unit: data.unit || "piece",
               price: data.price,
               discountPrice: data.discountPrice,
               stock: data.stock,
               requiresPrescription: data.requiresPrescription,
               image: data.image,
               images: data.images,
          });

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to create medicine" };
          }

          revalidatePath("/seller-dashboard/medicines");

          return {
               ok: true,
               message: res?.message || "Medicine created successfully",
               data: res?.data,
          };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while creating medicine" };
     }
}

// Update medicine
export async function updateMedicineAction(id: string, data: any) {
     try {
          const res = await medicineServiceServer.update(id, data);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to update medicine" };
          }

          revalidatePath("/seller-dashboard/medicines");

          return { ok: true, message: res?.message || "Medicine updated successfully", data: res?.data };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while updating medicine" };
     }
}

// Delete medicine
export async function deleteMedicineAction(id: string) {
     try {
          const res = await medicineServiceServer.delete(id);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to delete medicine" };
          }

          revalidatePath("/seller-dashboard/medicines");

          return { ok: true, message: res?.message || "Medicine deleted successfully" };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while deleting medicine" };
     }
}


// Get all medicines (optionally filtered by category or search)
export async function getAllMedicinesAction(params?: { categoryId?: string; search?: string }) {
     try {
          const res = await medicineServiceServer.getAll(params);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to fetch medicines", data: [] };
          }

          return { ok: true, message: res?.message || "Medicines fetched successfully", data: res?.data || [] };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while fetching medicines", data: [] };
     }
}

// Get a medicine by ID
export async function getMedicineByIdAction(id: string) {
     try {
          if (!id) return { ok: false, message: "Medicine ID is required", data: null };

          const res = await medicineServiceServer.getById(id);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to fetch medicine", data: null };
          }

          return { ok: true, message: res?.message || "Medicine fetched successfully", data: res?.data };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while fetching medicine", data: null };
     }
}