"use server";

import { couponServiceServer } from "@/service/coupon.server.service";
import { revalidatePath } from "next/cache";

export async function createCouponAction(payload: any) {
     const res = await couponServiceServer.create(payload);
     if (!res.ok) throw new Error(res.message || "Failed to create coupon");
     revalidatePath("/admin-dashboard/coupons");
     return { ok: true };
}

export async function updateCouponAction(id: string, payload: any) {
     const res = await couponServiceServer.update(id, payload);
     if (!res.ok) throw new Error(res.message || "Failed to update coupon");
     revalidatePath("/admin-dashboard/coupons");
     return { ok: true };
}

export async function deleteCouponAction(id: string) {
     const res = await couponServiceServer.delete(id);
     if (!res.ok) throw new Error(res.message || "Failed to delete coupon");
     revalidatePath("/admin-dashboard/coupons");
     return { ok: true };
}

export async function validateCouponAction(code: string, orderAmount: number) {
     const res = await couponServiceServer.validate(code, orderAmount);
     if (!res.ok) throw new Error(res.message || "Invalid coupon");
     return res.data.data; // { coupon, discount }
}