"use client";


import { useState, useEffect } from "react";
import Spinner from "@/app/components/Spinner";
import Notification from "@/app/components/Notification";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications", {
          credentials: "include",
        });
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-600 h-screen">No notifications at the moment.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification: any) => (
            <Notification key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
}
