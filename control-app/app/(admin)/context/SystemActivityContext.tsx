"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ActivityType = 'success' | 'info' | 'warning' | 'error';

export interface ActivityLog {
    id: string;
    text: string;
    time: string;
    type: ActivityType;
    timestamp: number;
}

interface SystemActivityContextType {
    logs: ActivityLog[];
    addLog: (text: string, type?: ActivityType) => void;
}

const SystemActivityContext = createContext<SystemActivityContextType | undefined>(undefined);

export function SystemActivityProvider({ children }: { children: ReactNode }) {
    const [logs, setLogs] = useState<ActivityLog[]>([
        { id: '1', text: "司機 陳大華 完成了訂單 #1001", time: "2 分鐘前", type: "success", timestamp: Date.now() - 120000 },
        { id: '2', text: "新用戶 李小美 註冊了帳號", time: "15 分鐘前", type: "info", timestamp: Date.now() - 900000 },

        { id: '4', text: "訂單 #1004 被取消", time: "1 小時前", type: "warning", timestamp: Date.now() - 3600000 },
    ]);

    const addLog = (text: string, type: ActivityType = 'info') => {
        const newLog: ActivityLog = {
            id: Math.random().toString(36).substr(2, 9),
            text,
            time: "剛剛",
            type,
            timestamp: Date.now(),
        };
        setLogs((prev) => [newLog, ...prev]);
    };

    return (
        <SystemActivityContext.Provider value={{ logs, addLog }}>
            {children}
        </SystemActivityContext.Provider>
    );
}

export function useSystemActivity() {
    const context = useContext(SystemActivityContext);
    if (context === undefined) {
        throw new Error('useSystemActivity must be used within a SystemActivityProvider');
    }
    return context;
}
