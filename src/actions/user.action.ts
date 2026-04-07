"use server";

import { imageHostingService } from "@/service/image-hosting.service";
import { userServiceServer } from "@/service/user.server.service";
import { revalidatePath } from "next/cache";


export async function updateProfileAction({
     name,
     phone,
     image,
}: {
     name: string;
     phone: string;
     image: string ; 
}) {
     try {
          const res = await userServiceServer.updateMe({
               name,
               phone,
               image,
          });

          if (!res.ok) {
               return { ok: false, message: res.message || "Profile update failed" };
          }

          // Revalidate relevant paths
          revalidatePath("/dashboard/profile");
          revalidatePath("/seller-dashboard/profile");
          revalidatePath("/admin-dashboard/profile");
          revalidatePath("/");

          return { ok: true, message: "Profile updated successfully" };
     } catch (err) {
          return { ok: false, message: "Something went wrong" };
     }
}


export async function getAdminStatisticsAction() {
     try {
          const res = await userServiceServer.getAdminStatistics();
          if (!res?.ok) return { ok: false, message: res?.message || "Failed to fetch statistics", data: null };
          return { ok: true, message: "Statistics fetched", data: res?.data };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong", data: null };
     }
}
export async function getCustomerStatisticsAction() {
     try {
          const res = await userServiceServer.getCustomerStatistics();
          if (!res?.ok) return { ok: false, message: res?.message || "Failed to fetch statistics", data: null };
          return { ok: true, message: "Statistics fetched", data: res?.data };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong", data: null };
     }
}
export async function getSellerStatisticsAction() {
     try {
          const res = await userServiceServer.getSellerStatistics();
          if (!res?.ok) return { ok: false, message: res?.message || "Failed to fetch statistics", data: null };
          return { ok: true, message: "Statistics fetched", data: res?.data };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong", data: null };
     }
}


export async function getMeAction() {
     try {
          const res = await userServiceServer.getMe?.();

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to fetch user data", data: null };
          }

          return { ok: true, message: res?.message || "User data fetched successfully", data: res?.data || null };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while fetching user data", data: null };
     }
}