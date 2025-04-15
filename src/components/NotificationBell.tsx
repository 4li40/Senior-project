"use client";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = () => {
    fetch("http://localhost:5003/api/notifications", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📥 Notifications fetched from backend:", data);

        // ✅ Make sure it's an array before setting it
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          console.warn("Unexpected notification response:", data);
          setNotifications([]); // fallback
        }
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };

  const markAsRead = () => {
    fetch("http://localhost:5003/api/notifications/mark-read", {
      method: "PATCH",
      credentials: "include",
    })
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      })
      .catch((error) => {
        console.error("Error marking notifications as read:", error);
      });
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open && notifications.some((n) => !n.isRead)) {
      markAsRead();
    }
  }, [open]);

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.isRead).length
    : 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <div className="relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <h4 className="font-semibold mb-2">Notifications</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {!Array.isArray(notifications) || notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`text-sm p-2 rounded ${
                  n.isRead ? "bg-gray-100" : "bg-blue-100"
                }`}
              >
                {n.message}
                <div className="text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
