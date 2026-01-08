"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../components/PageHeader";
import { ChevronDown } from "lucide-react";
import { supabase } from "../../lib/supabase";

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
            setOrders([]);
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            // 1. Get Driver Info from Session/Local
            const idno = sessionStorage.getItem("driverIdno");
            if (!idno) {
                router.push('/login');
                return;
            }

            // Get Driver UUID
            const { data: driverData, error: driverError } = await supabase
                .from('drivers')
                .select('id')
                .eq('national_id', idno)
                .single();

            if (driverError || !driverData) {
                console.error("Could not find Supabase driver ID for", idno);
                setLoading(false);
                return;
            }

            const driverId = driverData.id;

            // 2. Fetch Completed Orders from Supabase
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('driver_id', driverId)
                .in('status', ['completed', 'cancelled']) // Fetch completed and cancelled
                .order('pickup_time', { ascending: false });

            if (error) {
                console.error('Error fetching history:', error);
            } else {
                const mappedOrders = (data || []).map((row: any) => ({
                    id: (row.note && row.note.match(/\[ID:\s?(CH[A-Z0-9-]+)\]/)) ? row.note.match(/\[ID:\s?(CH[A-Z0-9-]+)\]/)[1] : (row.id.length > 20 ? "CH-歷史訂單" : row.id),
                    status: row.status,
                    // Map to local fields for UI compatibility
                    isBilled: false, // Default for now
                    isPaid: false,  // Default for now
                    date: row.pickup_time ? new Date(row.pickup_time).toLocaleDateString() : 'N/A', // Format: YYYY/M/D or similar
                    time: row.pickup_time ? new Date(row.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
                    price: row.price,
                    serviceType: row.vehicle_type || '接送',
                    flow: row.status === 'completed' ? 'completed' : 'cancelled', // Derived flow
                    detail: {
                        pax: { adult: row.passenger_count || 1, child: 0 },
                        luggage: { s20: 0, s25: row.luggage_count || 0, s28: 0 },
                        contact: { name: row.contact_name, phone: row.contact_phone }
                    }
                }));
                setOrders(mappedOrders);
            }
            setLoading(false);
        };

        fetchHistory();
    }, []);

    // Derived Years
    const years = Array.from(new Set(orders.map(o => o.date.split('/')[0] || "2025"))).sort().reverse();
    if (years.length === 0) years.push("2025");

    // Filter Logic
    const filtered = orders.filter(o => {
        // Standardize date parsing from LocaleDateString (could be 2025/12/01 or 12/1/2025 etc depending on locale, but standardizing to parts)
        const dateStr = o.date.includes('/') ? o.date : o.date.replace(/-/g, '/');
        const parts = dateStr.split(' ')[0].split('/');
        // Simple check for YMD order. Assuming YYYY/MM/DD for now based on previous component logic
        const oYear = parts[0].length === 4 ? parts[0] : parts[2];
        const oMonth = parts[0].length === 4 ? parts[1] : parts[0];

        if (year && oYear !== year) return false;

        // Month filter: padStart to ensure '01' matches '1' if needed, or loose match
        if (month) {
            const mInt = parseInt(oMonth, 10);
            const targetInt = parseInt(month, 10);
            if (mInt !== targetInt) return false;
        }

        // Status Filter Logic
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
