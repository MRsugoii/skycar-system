import { ArrowUpRight, ArrowDownRight, Users, Car, ShoppingBag, DollarSign } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">儀表板概覽</h1>
                <div className="text-sm text-gray-500">最後更新: 剛剛</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="總訂單數" value="1,234" change="+12.5%" trend="up" icon={<ShoppingBag className="text-blue-600" />} />
                <StatCard title="活躍司機" value="45" change="+3.2%" trend="up" icon={<Car className="text-green-600" />} />
                <StatCard title="註冊用戶" value="892" change="+5.4%" trend="up" icon={<Users className="text-purple-600" />} />
                <StatCard title="今日營收" value="$12,450" change="-1.2%" trend="down" icon={<DollarSign className="text-orange-600" />} />
            </div>

            {/* Recent Activity & Map Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area (Placeholder) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">即時派車地圖</h3>
                    <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center text-gray-400">
                        [地圖元件整合區域]
                    </div>
                </div>

                {/* Recent Orders List */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">最新訂單</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                        #{1000 + i}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">台北市信義區 -> 中山區</p>
                                        <p className="text-xs text-gray-500">5 分鐘前</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                    進行中
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, trend, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
                <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {change}
                    {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
    );
}
