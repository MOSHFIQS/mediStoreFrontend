"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
     Popover,
     PopoverContent,
     PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { getNotificationsAction, markAllNotificationsReadAction, markNotificationReadAction } from "@/actions/notification.action";
import { cn } from "@/lib/utils";

export default function NotificationBell() {
     const [notifications, setNotifications] = useState<any[]>([]);
     const [open, setOpen] = useState(false);

     const unread = notifications.filter((n) => !n.isRead).length;

     const load = async () => {
          const res = await getNotificationsAction();
          console.log(res);
          if (res.ok) setNotifications(res.data);
     };

     useEffect(() => { load(); }, []);

     const handleMarkRead = async (id: string) => {
          await markNotificationReadAction(id);
          setNotifications((prev) =>
               prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
          );
     };

     const handleMarkAll = async () => {
          await markAllNotificationsReadAction();
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
     };

     const typeColors: Record<string, string> = {
          ORDER_UPDATE: "bg-blue-50 border-blue-200",
          PAYMENT_UPDATE: "bg-green-50 border-green-200",
          PRESCRIPTION_STATUS: "bg-purple-50 border-purple-200",
          PROMOTION: "bg-yellow-50 border-yellow-200",
          SYSTEM: "bg-gray-50 border-gray-200",
     };

     return (
          <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) load(); }}>
               <PopoverTrigger asChild>
                    <Button
                         variant="ghost"
                         size="icon"
                         className="relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                         {/* Bell Icon */}
                         <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />

                         {/* Notification Badge */}
                         {unread > 0 && (
                              <span
                                   className="
        absolute -top-1 -right-1
        min-w-[18px] h-[18px] px-[4px]
        bg-gradient-to-r from-red-500 to-pink-500
        text-white text-[10px] font-semibold
        rounded-full flex items-center justify-center
        shadow-md
        ring-2 ring-white dark:ring-gray-900
        animate-in fade-in zoom-in-50
      "
                              >
                                   {unread > 9 ? "9+" : unread}
                              </span>
                         )}
                    </Button>
               </PopoverTrigger>
               <PopoverContent className="w-80 p-0" align="end">
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                         <h3 className="font-semibold">Notifications</h3>
                         {unread > 0 && (
                              <button onClick={handleMarkAll} className="text-xs text-blue-600 hover:underline">
                                   Mark all read
                              </button>
                         )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y">
                         {notifications.length === 0 ? (
                              <p className="text-center text-sm text-muted-foreground py-6">No notifications</p>
                         ) : (
                              notifications.map((n) => (
                                   <div
                                        key={n.id}
                                        onClick={() => !n.isRead && handleMarkRead(n.id)}
                                        className={cn(
                                             "px-4 py-3 cursor-pointer hover:bg-gray-50 border-l-2 transition-colors",
                                             n.isRead ? "border-transparent opacity-60" : typeColors[n.type] || "border-gray-200"
                                        )}
                                   >
                                        <p className="text-sm font-medium">{n.title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">
                                             {new Date(n.createdAt).toLocaleString()}
                                        </p>
                                   </div>
                              ))
                         )}
                    </div>
               </PopoverContent>
          </Popover>
     );
}