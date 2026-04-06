"use server";

import { adminServiceServer } from "@/service/admin.server.service";

// Get all users
export async function getAllUsersAction() {
     try {
          const res = await adminServiceServer.getUsers();

          if (!res?.ok) {
               return {
                    ok: false,
                    message: res?.message || "Failed to fetch users",
                    data: [],
               };
          }

          return {
               ok: true,
               message: res?.message || "Users fetched successfully",
               data: res?.data?.data || [],
          };
     } catch (err: any) {
          return {
               ok: false,
               message: err?.message || "Something went wrong",
               data: [],
          };
     }
}

// Update user status
export async function updateUserStatusAction(id: string, status: string) {
     try {
          const res = await adminServiceServer.updateUserStatus(id, status);

          if (!res?.ok) {
               return {
                    ok: false,
                    message: res?.message || "Failed to update status",
               };
          }

          return {
               ok: true,
               message: res?.message || "User status updated successfully",
               data: res?.data,
          };
     } catch (err: any) {
          return {
               ok: false,
               message: err?.message || "Something went wrong",
          };
     }
}