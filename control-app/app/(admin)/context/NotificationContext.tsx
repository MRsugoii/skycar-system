"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: "order" | "system" | "driver";
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    addNotification: (notification: Omit<Notification, "id" | "time" | "read">) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            title: "新訂單通知",
            message: "收到一筆新的預約訂單 #CH202510160007",
            time: "剛剛",
            read: false,
            type: "order",
        },
        {
            id: "2",
            title: "司機審核通過",
            message: "司機 林志豪 已通過審核",
            time: "10 分鐘前",
            read: false,
            type: "driver",
        },
        {
            id: "3",
            title: "系統維護公告",
            message: "系統將於今晚 02:00 進行例行維護",
            time: "1 小時前",
            read: true,
            type: "system",
        },
    ]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const addNotification = (notification: Omit<Notification, "id" | "time" | "read">) => {
        const newNotification: Notification = {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            time: "剛剛",
            read: false,
        };
        setNotifications((prev) => [newNotification, ...prev]);
    };

    // Simulate real-time notifications
    useEffect(() => {
        const interval = setInterval(() => {
            const types: ("order" | "system" | "driver")[] = ["order", "driver", "system"];
            const randomType = types[Math.floor(Math.random() * types.length)];

            let title = "";
            let message = "";

            if (randomType === "order") {
                title = "新訂單通知";
                message = `收到一筆新的預約訂單 #CH20251016${Math.floor(Math.random() * 10000)}`;
            } else if (randomType === "driver") {
                title = "司機上線通知";
                message = "司機 王大明 已上線接單";
            } else {
                title = "系統通知";
                message = "系統檢測到伺服器負載正常";
            }

            addNotification({
                title,
                message,
                type: randomType,
            });
        }, 30000); // Add a notification every 30 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
                addNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
}
