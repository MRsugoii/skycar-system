"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Users, Car, ShoppingBag, DollarSign, MoreHorizontal, Download, Calendar, X, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSystemActivity } from "../context/SystemActivityContext";

export default function DashboardPage() {
    const { logs } = useSystemActivity();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">儀表板概覽</h1>
                    <p className="text-sm text-gray-500 mt-1">歡迎回來，查看今日的派車狀況。</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2">
                        <Download size={16} />
                        下載報表
                    </button>
                    <Link href="/orders?new=true" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 flex items-center">
                        新增訂單
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="總訂單數" value="1,234" change="+12.5%" trend="up" icon={<ShoppingBag className="text-blue-600" />} color="blue" />
                <StatCard title="活躍司機" value="45" change="+3.2%" trend="up" icon={<Car className="text-green-600" />} color="green" />
                <StatCard title="註冊用戶" value="892" change="+5.4%" trend="up" icon={<Users className="text-purple-600" />} color="purple" />
                <StatCard title="今日營收" value="$12,450" change="-1.2%" trend="down" icon={<DollarSign className="text-orange-600" />} color="orange" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Order Overview */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">今日訂單狀況</h3>
                        <Link href="/orders" className="text-sm text-blue-600 font-medium hover:underline">查看全部</Link>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatusCard label="待派車" count={8} color="orange" icon={<Clock size={20} />} total={65} />
                        <StatusCard label="執行中" count={15} color="blue" icon={<Car size={20} />} total={65} />
                        <StatusCard label="已完成" count={42} color="green" icon={<CheckCircle size={20} />} total={65} />
                    </div>
                    <div className="px-6 pb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-4">系統即時動態</h4>
                        <div className="space-y-4">
                            {logs.slice(0, 5).map((log) => (
                                <div key={log.id} className="flex items-center gap-3 text-sm animate-in slide-in-from-left-2 duration-300">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.type === 'success' ? 'bg-green-500' : log.type === 'warning' ? 'bg-orange-500' : log.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                    <span className="text-gray-600 flex-1 truncate">{log.text}</span>
                                    <span className="text-gray-400 text-xs whitespace-nowrap">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Orders List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">最新訂單</h3>
                        <button className="p-1 hover:bg-gray-50 rounded text-gray-400">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto p-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${i % 2 === 0 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {i % 2 === 0 ? <Car size={18} /> : <ShoppingBag size={18} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">台北市信義區 &rarr; 中山區</p>
                                        <p className="text-xs text-gray-500">訂單 #CH20251016000{i} • 5 分鐘前</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">$350</p>
                                    <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                                        進行中
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-100">
                        <Link href="/orders" className="block w-full py-2 text-sm text-center text-gray-600 hover:text-gray-900 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            查看所有訂單
                        </Link>
                    </div>
                </div>
            </div>

            {/* Report Download Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">匯出報表</h3>
                            <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">選擇報表類型</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['訂單報表', '用戶名單', '司機清單', '財務營收'].map((type) => (
                                        <label key={type} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                            <span className="text-sm text-gray-700">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">選擇時間範圍</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <span className="text-xs text-gray-500">開始日期</span>
                                        <div className="relative">
                                            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="date" className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-gray-500">結束日期</span>
                                        <div className="relative">
                                            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="date" className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    取消
                                </button>
                                <button onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 flex items-center gap-2">
                                    <FileText size={16} />
                                    確認匯出
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusCard({ label, count, total, color, icon }: any) {
    const percentage = Math.round((count / total) * 100);
    const colors: any = {
        green: "bg-green-500",
        blue: "bg-blue-500",
        gray: "bg-gray-400",
        orange: "bg-orange-500"
    };
    const bgColors: any = {
        green: "bg-green-50 text-green-600",
        blue: "bg-blue-50 text-blue-600",
        gray: "bg-gray-50 text-gray-600",
        orange: "bg-orange-50 text-orange-600"
    };

    return (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${bgColors[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="text-xl font-bold text-gray-900">{count}</p>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${colors[color]}`} style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">{percentage}%</p>
        </div>
    );
}

function StatCard({ title, value, change, trend, icon, color }: any) {
    const bgColors: any = {
        blue: "bg-blue-50",
        green: "bg-green-50",
        purple: "bg-purple-50",
        orange: "bg-orange-50",
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${bgColors[color]} group-hover:scale-110 transition-transform duration-200`}>{icon}</div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {change}
                    {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">{value}</p>
        </div>
    );
}
