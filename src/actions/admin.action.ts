"use server";

import { adminServiceServer } from "@/service/admin.server.service";


export async function getAllUsersAction() {
     try {
          const res = await adminServiceServer.getUsers();
          if (!res.ok) {
               return { ok: false, data: [], message: res.message || "Failed to fetch users" };
          }
          return { ok: true, data: res?.data?.data };
     } catch (err: any) {
          return { ok: false, data: [], message: err.message || "Something went wrong" };
     }
}


export async function updateUserStatusAction(id: string, status: string) {
     try {
          const res = await adminServiceServer.updateUserStatus(id, status);
          if (!res.ok) {
               return { ok: false, message: res.message || "Failed to update status" };
          }
          return { ok: true, message: "User status updated successfully" };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong" };
     }
}
