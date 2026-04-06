"use server";

import { notificationServiceServer } from "@/service/notification.server.service";
import { revalidatePath } from "next/cache";

export async function getNotificationsAction() {
     const res = await notificationServiceServer.getAll();
     if (!res.ok) return { ok: false, data: [] };
     return { ok: true, data: res.data.data };
}

export async function markNotificationReadAction(id: string) {
     const res = await notificationServiceServer.markAsRead(id);
     if (!res.ok) throw new Error("Failed to mark as read");
     revalidatePath("/");
     return { ok: true };
}

export async function markAllNotificationsReadAction() {
     const res = await notificationServiceServer.markAllAsRead();
     if (!res.ok) throw new Error("Failed");
     revalidatePath("/");
     return { ok: true };
}