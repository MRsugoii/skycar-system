"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from "recharts";
import {
    DollarSign,
    Users,
    ShoppingBag,
    TrendingUp,
    Clock,
    Award
} from "lucide-react";
import {
    revenueData,
    orderStatusData,
    peakHoursData,
    driverPerformanceData,
    kpiMetrics
} from "./data";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">數據分析中心</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiMetrics.map((metric, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                {metric.icon === 'dollar' && <DollarSign className="text-blue-600" size={24} />}
                                {metric.icon === 'cart' && <ShoppingBag className="text-purple-600" size={24} />}
                                {metric.icon === 'users' && <Users className="text-green-600" size={24} />}
                                {metric.icon === 'orders' && <TrendingUp className="text-orange-600" size={24} />}
                            </div>
                            <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                {metric.change}
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mt-4">{metric.title}</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend - Full Width on Mobile, 2/3 Width on Desktop */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900">年度營收趨勢</h3>
                        <select className="text-sm border-gray-200 rounded-lg text-gray-500">
                            <option>2025</option>
                            <option>2024</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => [`NT$ ${value.toLocaleString()}`, '營收']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-6">訂單狀態分佈</h3>
                    <div className="h-[260px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-bold text-gray-900">85%</span>
                            <p className="text-xs text-gray-500 font-medium mt-1">完成率</p>
                        </div>
                    </div>
                    {/* Custom Legend */}
                    <div className="flex justify-center flex-wrap gap-4 mt-2">
                        {orderStatusData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1.5 transform hover:scale-105 transition-transform duration-200 cursor-default">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-sm text-gray-600 font-medium">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Peak Hours Analysis */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="text-blue-500" size={20} />
                        <h3 className="font-semibold text-gray-900">尖峰時段分析</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={peakHoursData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="訂單量" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Performing Drivers */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Award className="text-yellow-500" size={20} />
                        <h3 className="font-semibold text-gray-900">本月優質司機</h3>
                    </div>
                    <div className="space-y-4">
                        {driverPerformanceData.map((driver, index) => (
                            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <span>⭐ {driver.rating}</span>
                                            <span>• {driver.orders} 單</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-900">
                                    ${(driver.revenue / 1000).toFixed(1)}k
                                </span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                        查看完整排名
                    </button>
                </div>
            </div>
        </div>
    );
}
