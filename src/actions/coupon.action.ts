"use server";

import { couponServiceServer } from "@/service/coupon.server.service";
import { buildQueryString } from "@/utils/buildQueryString";
import { revalidatePath } from "next/cache";

// Create coupon
export async function createCouponAction(payload: any) {
     try {
          const res = await couponServiceServer.create(payload);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to create coupon" };
          }

          revalidatePath("/admin-dashboard/coupons");

          return {
               ok: true,
               message: res?.message || "Coupon created successfully",
               data: res?.data,
          };
     } catch (err: any) {
          return {
               ok: false,
               message: err?.message || "Something went wrong while creating coupon",
          };
     }
}


export async function getAllCouponsAction(page?: number, limit?: number) {
     try {
          const query = buildQueryString({
               page,
               limit
          });
          const res = await couponServiceServer.getAll(query);
          if (!res?.ok) throw new Error(res?.message || "Failed to fetch coupons");
          return { ok: true, data: res.data, message: res?.message || "couponss fetched successfully" };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong", data: [] };
     }
}



// Update coupon
export async function updateCouponAction(id: string, payload: any) {
     try {
          const res = await couponServiceServer.update(id, payload);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to update coupon" };
          }

          revalidatePath("/admin-dashboard/coupons");

          return {
               ok: true,
               message: res?.message || "Coupon updated successfully",
               data: res?.data,
          };
     } catch (err: any) {
          return {
               ok: false,
               message: err?.message || "Something went wrong while updating coupon",
          };
     }
}

// Delete coupon
export async function deleteCouponAction(id: string) {
     try {
          const res = await couponServiceServer.delete(id);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to delete coupon" };
          }

          revalidatePath("/admin-dashboard/coupons");

          return {
               ok: true,
               message: res?.message || "Coupon deleted successfully",
          };
     } catch (err: any) {
          return {
               ok: false,
               message: err?.message || "Something went wrong while deleting coupon",
          };
     }
}

// Validate coupon
export async function validateCouponAction(code: string, orderAmount: number) {
     try {
          const res = await couponServiceServer.validate(code, orderAmount);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Invalid coupon" };
          }

          return {
               ok: true,
               message: res?.message || "Coupon applied successfully",
               data: res?.data, // { coupon, discount }
          };
     } catch (err: any) {
          return {
               ok: false,
               message: err?.message || "Something went wrong while validating coupon",
          };
     }
}