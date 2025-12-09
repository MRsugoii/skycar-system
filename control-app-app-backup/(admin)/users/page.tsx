import { MoreVertical, Mail, Phone, Calendar } from "lucide-react";

export default function UsersPage() {
    const users = [
        { id: 1, name: "王小明", email: "wang@example.com", phone: "0912-345-678", joinDate: "2023-01-15", status: "Active" },
        { id: 2, name: "李美玲", email: "lee@example.com", phone: "0923-456-789", joinDate: "2023-02-20", status: "Active" },
        { id: 3, name: "張建國", email: "chang@example.com", phone: "0934-567-890", joinDate: "2023-03-10", status: "Suspended" },
        { id: 4, name: "陳怡君", email: "chen@example.com", phone: "0945-678-901", joinDate: "2023-04-05", status: "Active" },
        { id: 5, name: "劉志明", email: "liu@example.com", phone: "0956-789-012", joinDate: "2023-05-12", status: "Active" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">用戶管理</h1>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        匯出名單
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                        新增用戶
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">用戶姓名</th>
                            <th className="px-6 py-4">聯絡資訊</th>
                            <th className="px-6 py-4">加入時間</th>
                            <th className="px-6 py-4">狀態</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            {user.name[0]}
                                        </div>
                                        <span className="font-medium text-gray-900">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail size={14} className="text-gray-400" />
                                            {user.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone size={14} className="text-gray-400" />
                                            {user.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400" />
                                        {user.joinDate}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                                        <MoreVertical size={18} />
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
