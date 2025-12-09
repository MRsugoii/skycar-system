import { Search, Filter, MoreHorizontal } from "lucide-react";

export default function OrdersPage() {
    const orders = [
        { id: "#1001", user: "王小明", driver: "陳大華", from: "台北 101", to: "台北車站", status: "Completed", amount: "$350", date: "2023-10-24 14:30" },
        { id: "#1002", user: "李美玲", driver: "林志豪", from: "西門町", to: "松山機場", status: "In Progress", amount: "$420", date: "2023-10-24 15:15" },
        { id: "#1003", user: "張建國", driver: "未指派", from: "大安森林公園", to: "內湖科學園區", status: "Pending", amount: "$280", date: "2023-10-24 15:45" },
        { id: "#1004", user: "陳怡君", driver: "黃國榮", from: "板橋車站", to: "新莊體育館", status: "Cancelled", amount: "$0", date: "2023-10-24 12:00" },
        { id: "#1005", user: "劉志明", driver: "吳雅婷", from: "南港展覽館", to: "信義威秀", status: "Completed", amount: "$300", date: "2023-10-24 11:20" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">訂單管理</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    匯出報表
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="搜尋訂單編號、用戶或司機..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 text-sm font-medium">
                    <Filter size={18} />
                    篩選條件
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">訂單編號</th>
                            <th className="px-6 py-4">用戶</th>
                            <th className="px-6 py-4">司機</th>
                            <th className="px-6 py-4">行程</th>
                            <th className="px-6 py-4">狀態</th>
                            <th className="px-6 py-4">金額</th>
                            <th className="px-6 py-4">時間</th>
                            <th className="px-6 py-4">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                                <td className="px-6 py-4 text-gray-600">{order.user}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {order.driver === "未指派" ? <span className="text-orange-500 italic">未指派</span> : order.driver}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <div className="text-sm">
                                        <span className="text-gray-400">From:</span> {order.from}
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-400">To:</span> {order.to}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{order.amount}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                                <td className="px-6 py-4">
                                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        "Completed": "bg-green-100 text-green-700",
        "In Progress": "bg-blue-100 text-blue-700",
        "Pending": "bg-yellow-100 text-yellow-700",
        "Cancelled": "bg-red-100 text-red-700",
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
            {status}
        </span>
    );
}
