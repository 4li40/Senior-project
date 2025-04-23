"use client";
import { useEffect, useState } from "react";
import {
  Bell,
  UserPlus,
  CalendarClock,
  Bell as BellIcon,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface Notification {
  _id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5003/api/auth/status", {
        credentials: "include",
      });

      // If not authenticated, don't try to fetch notifications
      if (!res.ok) {
        setNotifications([]);
        setError(null);
        return;
      }

      const notificationsRes = await fetch("http://localhost:5003/api/notifications", {
        credentials: "include",
      });

      if (!notificationsRes.ok) {
        throw new Error(`Failed to fetch notifications: ${notificationsRes.status}`);
      }

      const data = await notificationsRes.json();
      console.log("📥 Notifications fetched from backend:", data);

      // ✅ Make sure it's an array before setting it
      if (Array.isArray(data)) {
        setNotifications(data);
        setError(null); // Clear any previous errors
      } else {
        console.warn("Unexpected notification response:", data);
        setNotifications([]); // fallback
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
      setNotifications([]); // Reset notifications on error
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      const res = await fetch("http://localhost:5003/api/notifications/mark-read", {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to mark notifications as read");
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      // Don't show error to user for this non-critical operation
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Fetch every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open && notifications.some((n) => !n.isRead)) {
      markAsRead();
    }
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <UserPlus className="w-4 h-4 mr-2 text-green-500" />;
      case "review":
        return <Star className="w-4 h-4 mr-2 text-yellow-500" />;
      case "announcement":
      case "session":
        return <CalendarClock className="w-4 h-4 mr-2 text-blue-500" />;
      default:
        return <BellIcon className="w-4 h-4 mr-2 text-gray-500" />;
    }
  };

  // Get background color class based on notification type
  const getNotificationClass = (type: string, isRead: boolean) => {
    if (isRead) return "bg-gray-100";

    switch (type) {
      case "enrollment":
        return "bg-green-100 border-l-4 border-green-500";
      case "review":
        return "bg-yellow-100 border-l-4 border-yellow-500";
      case "announcement":
        return "bg-blue-100";
      case "session":
        return "bg-purple-100";
      default:
        return "bg-blue-100";
    }
  };

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
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-sm text-gray-500 text-center py-2">
              {error}
            </div>
          ) : !Array.isArray(notifications) || notifications.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`text-sm p-2 rounded ${getNotificationClass(
                  n.type,
                  n.isRead
                )}`}
              >
                <div className="flex items-start">
                  {getNotificationIcon(n.type)}
                  <div>
                    {n.message}
                    <div className="text-xs text-gray-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
