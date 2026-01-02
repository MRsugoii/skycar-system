"use client";

import { useState, useEffect } from "react";
import { User, MoreHorizontal, Search, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface DriverFinance {
    id: string;
    name: string;
    totalOrders: number;
    totalRevenue: number;
    platformFee: number;
    netPayable: number;
    unbilledCount: number;
    lastBillingDate: string;
}

export default function FinanceContent() {
    const [financeData, setFinanceData] = useState<DriverFinance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inputDriverName, setInputDriverName] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch Drivers
                const { data: drivers, error: driverError } = await supabase
                    .from('drivers')
                    .select('id, name')
                    .eq('status', 'active');

                if (driverError) throw driverError;

                // 2. Fetch Orders
                const { data: orders, error: orderError } = await supabase
                    .from('orders')
                    .select('driver_id, price, status')
                    .not('driver_id', 'is', null);

                if (orderError) throw orderError;

                // 3. Aggregate Data
                const stats: Record<string, { count: number, revenue: number }> = {};

                orders?.forEach((o: any) => {
                    if (!o.driver_id) return;
                    if (!stats[o.driver_id]) stats[o.driver_id] = { count: 0, revenue: 0 };

                    stats[o.driver_id].count += 1;
                    stats[o.driver_id].revenue += (o.price || 0);
                });

                // 4. Map
                const mapped: DriverFinance[] = (drivers || []).map(d => {
                    const s = stats[d.id] || { count: 0, revenue: 0 };
                    const fee = Math.round(s.revenue * 0.15); // 15% Platform Fee
                    return {
                        id: d.id,
                        name: d.name,
                        totalOrders: s.count,
                        totalRevenue: s.revenue,
                        platformFee: fee,
                        netPayable: s.revenue - fee,
                        unbilledCount: s.count,
                        lastBillingDate: new Date().toISOString().split('T')[0]
                    };
                });

                // Inject Mock Driver "王小明" if not present
                const mockDriverName = "王小明";
                if (!mapped.some(d => d.name === mockDriverName)) {
                    mapped.unshift({
                        id: "mock_driver_wang",
                        name: mockDriverName,
                        totalOrders: 12,
                        totalRevenue: 36500,
                        platformFee: 5475,
                        netPayable: 31025,
                        unbilledCount: 4,
                        lastBillingDate: new Date().toISOString().split('T')[0]
                    });
                }

                setFinanceData(mapped);

            } catch (err) {
                console.error("Error fetching finance data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredData = financeData.filter(item => {
        return item.name.includes(inputDriverName);
    });

    const handleBillingOperation = (driverName: string) => {
        router.push(`/orders?driver=${driverName}&mode=finance`);
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500">載入財務資料中...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <FileText size={24} className="text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-900">訂單出帳</h1>
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-medium text-gray-500">司機姓名</label>
                        <div className="relative">
                            <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-all overflow-hidden">
                                <div className="flex-shrink-0 w-10 h-10 text-gray-400 flex items-center justify-center">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="請輸入司機姓名"
                                    value={inputDriverName}
                                    onChange={(e) => setInputDriverName(e.target.value)}
                                    className="w-full h-full text-sm outline-none border-none bg-transparent text-gray-900 placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium shadow-sm">
                        <Search size={16} />
                        搜尋
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold whitespace-nowrap">
                            <th className="py-4 px-6 text-left">司機</th>
                            <th className="py-4 px-6 text-center">總單數</th>
                            <th className="py-4 px-6 text-center">總營收 (NT$)</th>
                            <th className="py-4 px-6 text-center">平台抽成 (NT$)</th>
                            <th className="py-4 px-6 text-center">應付金額 (NT$)</th>
                            <th className="py-4 px-6 text-center">未出帳</th>
                            <th className="py-4 px-6 text-center">出帳日期</th>
                            <th className="py-4 px-6 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredData.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => handleBillingOperation(item.name)}
                                className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                            >
                                <td className="py-4 px-6 text-sm font-medium text-gray-900 text-left">
                                    {item.name}
                                    <div className="text-xs text-gray-400 font-normal font-mono">#{item.id.slice(0, 6)}...</div>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600 text-center">{item.totalOrders}</td>
                                <td className="py-4 px-6 text-sm text-gray-600 text-center">{item.totalRevenue.toLocaleString()}</td>
                                <td className="py-4 px-6 text-sm text-red-500 text-center">- {item.platformFee.toLocaleString()}</td>
                                <td className="py-4 px-6 text-sm font-bold text-emerald-600 text-center">{item.netPayable.toLocaleString()}</td>
                                <td className="py-4 px-6 text-sm text-gray-600 text-center">{item.unbilledCount}</td>
                                <td className="py-4 px-6 text-sm text-gray-600 text-center">{item.lastBillingDate}</td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBillingOperation(item.name);
                                            }}
                                            className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-xs font-medium shadow-sm flex items-center gap-1"
                                        >
                                            <FileText size={14} />
                                            查看帳務
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                                    查無資料
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
