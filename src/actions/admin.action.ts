"use server";

import { revalidatePath } from "next/cache";
import { adminServiceServer } from "@/service/admin.server.service";

// Get all users
export async function getAllUsersAction() {
     try {
          const res = await adminServiceServer.getUsers();
          if (!res?.ok) return { ok: false, message: res?.message || "Failed to fetch users", data: [] };
          return { ok: true, message: res?.message || "Users fetched successfully", data: res?.data || [] };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong", data: [] };
     }
}

// Update user status
export async function updateUserStatusAction(id: string, status: string) {
     try {
          const res = await adminServiceServer.updateUserStatus(id, status);
          if (!res?.ok) return { ok: false, message: res?.message || "Failed to update status" };
          revalidatePath("/admin-dashboard/users");
          return { ok: true, message: res?.message || "User status updated successfully", data: res?.data };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong" };
     }
}

// Delete user
export async function deleteUserAction(id: string) {
     try {
          const res = await adminServiceServer.deleteUser(id);
          if (!res?.ok) return { ok: false, message: res?.message || "Failed to delete user" };
          revalidatePath("/admin-dashboard/users");
          return { ok: true, message: res?.message || "User deleted successfully" };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong" };
     }
}