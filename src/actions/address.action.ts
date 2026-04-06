"use server";

import { addressServiceServer } from "@/service/address.server.service";
import { revalidatePath } from "next/cache";

export async function createAddressAction(payload: any) {
     const res = await addressServiceServer.create(payload);
     if (!res.ok) throw new Error(res.message || "Failed to create address");
     revalidatePath("/dashboard/addresses");
     return { ok: true, data: res.data.data };
}

export async function updateAddressAction(id: string, payload: any) {
     const res = await addressServiceServer.update(id, payload);
     if (!res.ok) throw new Error(res.message || "Failed to update address");
     revalidatePath("/dashboard/addresses");
     return { ok: true };
}

export async function deleteAddressAction(id: string) {
     const res = await addressServiceServer.delete(id);
     if (!res.ok) throw new Error(res.message || "Failed to delete address");
     revalidatePath("/dashboard/addresses");
     return { ok: true };
}