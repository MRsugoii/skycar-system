"use client";

import { useState } from "react";
import { FileText, MoreHorizontal, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FinanceContent() {
    // Mock Data - Consistent with Drivers Page
    const drivers = [
        { id: "1", name: "劉曉明" },
        { id: "2", name: "陳大華" },
        { id: "3", name: "林志豪" },
        { id: "4", name: "吳雅婷" },
        { id: "5", name: "張建國" },
        { id: "6", name: "陳小美" },
    ];

    // Mock Finance Data linked to drivers
    const initialFinanceData = [
        { driverId: "1", lastBillingDate: "2025-01-01", unbilledCount: 13, totalOrders: 45, totalRevenue: 58500, platformFee: 8775, netPayable: 49725 },
        { driverId: "2", lastBillingDate: "2025-01-02", unbilledCount: 0, totalOrders: 32, totalRevenue: 41600, platformFee: 6240, netPayable: 35360 },
        { driverId: "3", lastBillingDate: "2025-01-02", unbilledCount: 0, totalOrders: 28, totalRevenue: 36400, platformFee: 5460, netPayable: 30940 },
        { driverId: "4", lastBillingDate: "2025-01-02", unbilledCount: 0, totalOrders: 50, totalRevenue: 65000, platformFee: 9750, netPayable: 55250 },
        { driverId: "5", lastBillingDate: "2025-01-03", unbilledCount: 0, totalOrders: 42, totalRevenue: 54600, platformFee: 8190, netPayable: 46410 },
        { driverId: "6", lastBillingDate: "2025-01-03", unbilledCount: 0, totalOrders: 15, totalRevenue: 19500, platformFee: 2925, netPayable: 16575 },
    ];

    const [inputDriverName, setInputDriverName] = useState("");
    const router = useRouter();

    // Filter Logic
    const filteredData = initialFinanceData.filter(item => {
        const driver = drivers.find(d => d.id === item.driverId);
        const matchName = driver ? driver.name.includes(inputDriverName) : false;
        return matchName;
    });

    const handleBillingOperation = (driverName: string) => {
        // Redirect to Orders page filtered by Driver Name with finance mode
        router.push(`/orders?driver=${driverName}&mode=finance`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <FileText size={24} className="text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-900">訂單出帳</h1>
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">司機姓名</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="請輸入司機姓名"
                                value={inputDriverName}
                                onChange={(e) => setInputDriverName(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
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
                            <th className="py-4 px-6 text-left">編號</th>
                            <th className="py-4 px-6 text-left">司機姓名</th>
                            <th className="py-4 px-6 text-center">總單數</th>
                            <th className="py-4 px-6 text-center">總營收 (NT$)</th>
                            <th className="py-4 px-6 text-center">平台抽成 (NT$)</th>
                            <th className="py-4 px-6 text-center">應付金額 (NT$)</th>
                            <th className="py-4 px-6 text-center">未出帳</th>
                            <th className="py-4 px-6 text-center">最新操作出帳時間</th>
                            <th className="py-4 px-6 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredData.map((item) => {
                            const driver = drivers.find(d => d.id === item.driverId);
                            return (
                                <tr key={item.driverId} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="py-4 px-6 text-sm text-gray-600 text-left">#{item.driverId}</td>
                                    <td className="py-4 px-6 text-sm font-medium text-gray-900 text-left">{driver?.name}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600 text-center">{item.totalOrders}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600 text-center">{item.totalRevenue.toLocaleString()}</td>
                                    <td className="py-4 px-6 text-sm text-red-500 text-center">- {item.platformFee.toLocaleString()}</td>
                                    <td className="py-4 px-6 text-sm font-bold text-emerald-600 text-center">{item.netPayable.toLocaleString()}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600 text-center">{item.unbilledCount}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600 text-center">{item.lastBillingDate}</td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => handleBillingOperation(driver?.name || "")}
                                            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan={9} className="py-12 text-center text-gray-400 text-sm">
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
