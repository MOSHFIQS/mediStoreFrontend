import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const notificationServiceServer = {
     getAll: () => apiFetchServerMain("/notifications"),
     getUnreadCount: () => apiFetchServerMain("/notifications/unread-count"),
     markAsRead: (id: string) =>
          apiFetchServerMain(`/notifications/${id}/read`, { method: "PATCH" }),
     markAllAsRead: () =>
          apiFetchServerMain("/notifications/mark-all-read", { method: "PATCH" }),
};