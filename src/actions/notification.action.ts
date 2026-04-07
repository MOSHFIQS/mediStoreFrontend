"use server";

import { notificationServiceServer } from "@/service/notification.server.service";
import { revalidatePath } from "next/cache";

// Get all notifications
export async function getNotificationsAction() {
     try {
          const res = await notificationServiceServer.getAll();

          if (!res?.ok) {
               return {
                    ok: false,
                    message: res?.message || "Failed to fetch notifications",
                    data: [],
               };
          }

          return {
               ok: true,
               message: res?.message || "Notifications fetched successfully",
               data: res?.data?.data || [],
          };
     } catch (err: any) {
          return {
               ok: false,
               message: err?.message || "Something went wrong while fetching notifications",
               data: [],
          };
     }
}

// Mark single notification as read
export async function markNotificationReadAction(id: string) {
     try {
          const res = await notificationServiceServer.markAsRead(id);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to mark notification as read" };
          }

          revalidatePath("/");

          return { ok: true, message: res?.message || "Notification marked as read" };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while marking notification" };
     }
}

// Mark all notifications as read
export async function markAllNotificationsReadAction() {
     try {
          const res = await notificationServiceServer.markAllAsRead();

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to mark all notifications as read" };
          }

          revalidatePath("/");

          return { ok: true, message: res?.message || "All notifications marked as read" };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while marking all notifications" };
     }
}