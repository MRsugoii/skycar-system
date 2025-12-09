"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../components/PageHeader";
import { ChevronDown } from "lucide-react";

export default function HistoryPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [year, setYear] = useState("2025");
    const [month, setMonth] = useState("12"); // Default to Dec for demo or Current
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        // Check for Pending/Failed Account Logic FIRST
        const currentDriverId = sessionStorage.getItem("driverIdno");
        if (currentDriverId === 'C123456789') {
            // Pending account should see NO history
            setOrders([]);
            setLoading(false);
            return;
        }

        // Load orders
        const local = JSON.parse(localStorage.getItem("orders") || "[]");

        // Mock Verified History Data (Standardized IDs)
        const mocks = [
            {
                id: "CH20251201001", status: "completed", isBilled: false, isPaid: false, date: "2025/12/01", time: "10:00",
                price: 1500, serviceType: "接機", flow: "completed",
                detail: { pax: { adult: 2, child: 0 }, luggage: { s20: 0, s25: 1, s28: 0 }, contact: { name: "陳先生", phone: "0912-345-678" } },
                audit: { completedAt: "2025-12-01T10:00:00Z" }
            },
            {
                id: "CH20251203002", status: "completed", isBilled: true, isPaid: false, date: "2025/12/03", time: "14:30",
                price: 800, serviceType: "市區", flow: "completed",
                detail: { pax: { adult: 1, child: 0 }, luggage: { s20: 1, s25: 0, s28: 0 }, contact: { name: "林小姐", phone: "0922-333-444" } },
                audit: { completedAt: "2025-12-03T14:30:00Z" }
            },
            {
                id: "CH20251205003", status: "completed", isBilled: true, isPaid: true, date: "2025/12/05", time: "09:00",
                price: 2200, serviceType: "包車", flow: "completed",
                detail: { pax: { adult: 4, child: 1 }, luggage: { s20: 2, s25: 2, s28: 0 }, contact: { name: "Customer", phone: "0900-000-000" } },
                audit: { completedAt: "2025-12-05T09:00:00Z" }
            }
        ];

        // Filter local to valid completed ones (Explicitly excluding active demo just in case)
        // Also exclude any OLD mocks that might be lingering (HIST-xxx or old CHxx)
        const mockIds = mocks.map(m => m.id);
        const localClean = local.filter((o: any) =>
            (o.status === 'completed' || o.flow === 'completed') &&
            o.id !== 'CH20251208999' && // Active Demo
            !o.id.startsWith('HIST-') && // Old Mocks
            !mockIds.includes(o.id) // Avoid dupe of current mocks (will re-add fresh)
        );

        // Merge strategy: Use mocks + Clean Local
        const combined = [...mocks, ...localClean];

        // PERSIST CLEAN MOCKS TO LOCALSTORAGE
        // We need to fetch FULL local list again to update it, not just completed
        // Filter OUT old mocks from full list, then ADD new mocks
        const fullLocal = JSON.parse(localStorage.getItem("orders") || "[]");
        const fullLocalClean = fullLocal.filter((o: any) =>
            !o.id.startsWith('HIST-') &&
            !mockIds.includes(o.id)
            // Don't delete Active Demo here, just mocks
        );
        const newFullLocal = [...fullLocalClean, ...mocks];

        // Save only if different? Just save to be safe and clean up
        localStorage.setItem("orders", JSON.stringify(newFullLocal));

        setOrders(combined);
        setLoading(false);

        // Set default month to current if not set? 
        // For demo screenshot shows "2025" "12". I'll stick to hardcoded defaults or current.
        // Let's use current date for defaults if we want to be smart, but "2025" is safe for this demo data.
    }, []);

    // Derived Years
    const years = Array.from(new Set(orders.map(o => o.date.split('/')[0] || "2025"))).sort().reverse();
    if (years.length === 0) years.push("2025");

    // Filter Logic
    const filtered = orders.filter(o => {
        const [y, m] = (o.date || "").split(' ')[0].split('/'); // "2025/10/20" or "2025-10-20"
        // Handle potential separator differences if any, strictly assuming / based on other files
        // But some files had replace(/-/g, '/').
        const dateStr = o.date.replace(/-/g, '/');
        const parts = dateStr.split('/');
        const oYear = parts[0];
        const oMonth = parts[1];

        if (year && oYear !== year) return false;
        if (month && oMonth !== month) return false;

        // Status Filter Logic (Strict Separation)
        // unreq: Not Applied (!isBilled AND !isPaid)
        // requesting: Applying (isBilled AND !isPaid)
        // paid: Completed (isPaid) - Admin has processed payment
        if (statusFilter === 'unreq') return !o.isBilled && !o.isPaid;
        if (statusFilter === 'requesting') return o.isBilled && !o.isPaid;
        if (statusFilter === 'paid') return o.isPaid;

        return true;
    });

    const total = filtered.reduce((sum, o) => {
        // Price might be string "$1,200" or number 1200
        const p = o.price || o.total || o.amount || 0;
        const num = typeof p === 'string' ? parseInt(p.replace(/[^\d]/g, ''), 10) : p;
        return sum + (num || 0);
    }, 0);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans max-w-[420px] mx-auto relative overflow-hidden flex flex-col">

            {/* Top Background - Immersive Style */}
            <div className="absolute top-0 left-0 right-0 h-[220px] bg-blue-600 rounded-b-[40px] shadow-lg z-0"></div>

            <div className="relative z-10 flex flex-col min-h-screen pb-20">
                <PageHeader title="歷史帳單" variant="ghost" />

                <div className="px-4 mt-4">
                    {/* Main Content Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* Time Filters - Capsules */}
                        <div className="flex gap-3 justify-center mb-6">
                            <div className="relative">
                                <select
                                    value={year} onChange={e => setYear(e.target.value)}
                                    className="appearance-none bg-white border border-blue-200 text-blue-900 font-bold rounded-full pl-6 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                >
                                    {years.map(y => <option key={y} value={y}>{y} 年</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={16} />
                            </div>
                            <div className="relative">
                                <select
                                    value={month} onChange={e => setMonth(e.target.value)}
                                    className="appearance-none bg-white border border-blue-200 text-blue-900 font-bold rounded-full pl-6 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                        <option key={m} value={m.toString().padStart(2, '0')}>{m} 月</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Status Tabs - Rounded Pills */}
                        <div className="flex gap-2 justify-between mb-6 overflow-x-auto pb-2 scrollbar-hide">
                            {[
                                { id: 'all', label: '全部' },
                                { id: 'unreq', label: '未申請' },
                                { id: 'requesting', label: '申請中' },
                                { id: 'paid', label: '已完成' }
                            ].map(tab => {
                                const active = statusFilter === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setStatusFilter(tab.id)}
                                        className={`flex-1 min-w-[70px] py-2 rounded-full font-bold text-sm transition-all border whitespace-nowrap ${active
                                            ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-sm'
                                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Order List */}
                        <div className="space-y-4">
                            {filtered.length > 0 ? (
                                <>
                                    {filtered.map((o, idx) => {
                                        const p = o.price || o.total || o.amount || 0;
                                        const priceVal = typeof p === 'string' ? parseInt(p.replace(/[^\d]/g, ''), 10) : p;
                                        const dateDisplay = o.date;

                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => router.push(`/order/${o.id}`)}
                                                className="bg-gray-50/50 rounded-xl p-4 border border-gray-200 shadow-sm active:scale-[0.99] transition-transform cursor-pointer hover:bg-gray-50 hover:border-blue-200"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="font-bold text-lg text-gray-900 tracking-tight">{o.id}</span>
                                                    <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded text-xs font-bold">
                                                        {o.serviceType || (o.flight ? '接機' : '市區')}
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-500 font-bold">完成時間</span>
                                                        <span className="text-gray-900 font-bold">{dateDisplay}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-500 font-bold">金額</span>
                                                        <span className="text-blue-600 font-bold text-lg">
                                                            ${priceVal.toLocaleString()} 元
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Summary Footer */}
                                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <span className="font-bold text-gray-900">本頁合計</span>
                                        <span className="font-bold text-blue-600 text-2xl">${total.toLocaleString()} 元</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-gray-400 space-y-3">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2 border border-gray-100">
                                        <span className="text-3xl grayscale opacity-50">📝</span>
                                    </div>
                                    <p className="font-medium">此區間無相關訂單</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Ensure clean export
