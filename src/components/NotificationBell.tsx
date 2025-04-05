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

  // Fetch notifications periodically regardless of popover state
  const fetchNotifications = () => {
    fetch("http://localhost:5003/api/notifications", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📥 Notifications fetched from backend:", data);

        setNotifications(data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };

  // Mark all as read when popover is opened
  const markAsRead = () => {
    fetch("http://localhost:5003/api/notifications/mark-read", {
      method: "PATCH",
      credentials: "include",
    })
      .then(() => {
        // Update local state to reflect read status
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      })
      .catch((error) => {
        console.error("Error marking notifications as read:", error);
      });
  };

  // Fetch notifications on component mount and every 30 seconds
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // When popover is opened, mark notifications as read
  useEffect(() => {
    if (open && notifications.some((n) => !n.isRead)) {
      markAsRead();
    }
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
          {notifications.length === 0 ? (
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
