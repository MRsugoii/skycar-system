"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, ShoppingBag, Car, Info } from "lucide-react";
import { useNotification, Notification } from "../context/NotificationContext";
import { cn } from "@/lib/utils";

export default function NotificationPopover() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getIcon = (type: Notification["type"]) => {
        switch (type) {
            case "order":
                return <ShoppingBag size={16} className="text-blue-600" />;
            case "driver":
                return <Car size={16} className="text-green-600" />;
            case "system":
            default:
                return <Info size={16} className="text-gray-600" />;
        }
    };

    const getBgColor = (type: Notification["type"]) => {
        switch (type) {
            case "order":
                return "bg-blue-100";
            case "driver":
                return "bg-green-100";
            case "system":
            default:
                return "bg-gray-100";
        }
    };

    return (
        <div className="relative" ref={popoverRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full relative transition-colors focus:outline-none"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm">
                        <h3 className="font-semibold text-gray-900">通知中心</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                            >
                                <Check size={12} />
                                全部標為已讀
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => markAsRead(notification.id)}
                                        className={cn(
                                            "p-4 hover:bg-gray-50 transition-colors cursor-pointer group relative",
                                            !notification.read ? "bg-blue-50/30" : ""
                                        )}
                                    >
                                        {!notification.read && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r"></div>
                                        )}
                                        <div className="flex gap-3">
                                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", getBgColor(notification.type))}>
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <p className={cn("text-sm font-medium truncate", !notification.read ? "text-gray-900" : "text-gray-700")}>
                                                        {notification.title}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                        {notification.time}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-400">
                                <Bell size={32} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm">目前沒有新通知</p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-100 bg-gray-50/30 text-center">
                        <button className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors">
                            查看所有歷史通知
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
