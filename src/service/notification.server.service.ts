import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const notificationServiceServer = {
     getAll: () => apiFetchServerMain("/notification"),
     getUnreadCount: () => apiFetchServerMain("/notification/unread-count"),
     markAsRead: (id: string) =>
          apiFetchServerMain(`/notification/${id}/read`, { method: "PATCH" }),
     markAllAsRead: () =>
          apiFetchServerMain("/notification/mark-all-read", { method: "PATCH" }),
};