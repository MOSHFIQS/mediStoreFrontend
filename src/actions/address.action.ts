"use server";

import { addressServiceServer } from "@/service/address.server.service";
import { revalidatePath } from "next/cache";

// Create address
export async function createAddressAction(payload: any) {
     try {
          const res = await addressServiceServer.create(payload);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to create address" };
          }

          revalidatePath("/dashboard/addresses");

          return {
               ok: true,
               message: res?.message || "Address created successfully",
               data: res?.data?.data,
          };
     } catch (err: any) {
          return {
               ok: false,
               message: err?.message || "Something went wrong while creating address",
          };
     }
}

// Update address
export async function updateAddressAction(id: string, payload: any) {
     try {
          const res = await addressServiceServer.update(id, payload);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to update address" };
          }

          revalidatePath("/dashboard/addresses");

          return {
               ok: true,
               message: res?.message || "Address updated successfully",
               data: res?.data,
          };
     } catch (err: any) {
          return {
               ok: false,
               message: err?.message || "Something went wrong while updating address",
          };
     }
}

// Delete address
export async function deleteAddressAction(id: string) {
     try {
          const res = await addressServiceServer.delete(id);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to delete address" };
          }

          revalidatePath("/dashboard/addresses");

          return {
               ok: true,
               message: res?.message || "Address deleted successfully",
          };
     } catch (err: any) {
          return {
               ok: false,
               message: err?.message || "Something went wrong while deleting address",
          };
     }
}