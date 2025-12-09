"use client";

import { useState } from "react";
import { Search, Plus, MoreHorizontal, Edit, X, Save, User, Shield, Mail, Phone, Lock } from "lucide-react";

type AdminRole = "總管理員" | "財務行政" | "派車管理";

type AdminUser = {
    id: number;
    name: string;
    account: string;
    role: AdminRole;
    phone: string;
    email: string;
    status: "Active" | "Inactive";
    password?: string; // Optional for display, used in form
};

const MOCK_USERS: AdminUser[] = [
    {
        id: 1,
        name: "Admin Master",
        account: "admin_master",
        role: "總管理員",
        phone: "0912-345-678",
        email: "admin@skycar.com",
        status: "Active",
    },
    {
        id: 2,
        name: "Finance User",
        account: "finance_01",
        role: "財務行政",
        phone: "0922-333-444",
        email: "finance@skycar.com",
        status: "Active",
    },
    {
        id: 3,
        name: "Dispatch Mgr",
        account: "dispatch_01",
        role: "派車管理",
        phone: "0988-777-666",
        email: "dispatch@skycar.com",
        status: "Active",
    },
];

export default function SettingsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState<AdminUser>({
        id: 0,
        name: "",
        account: "",
        role: "派車管理",
        phone: "",
        email: "",
        status: "Active",
        password: "",
    });

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.account.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (user?: AdminUser) => {
        if (user) {
            setEditingId(user.id);
            setFormData({ ...user, password: "" }); // Clear password for security presentation
        } else {
            setEditingId(null);
            setFormData({
                id: 0,
                name: "",
                account: "",
                role: "派車管理",
                phone: "",
                email: "",
                status: "Active",
                password: "",
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (editingId) {
            setUsers(users.map(u => u.id === editingId ? { ...formData, id: u.id, password: formData.password || u.password } : u));
        } else {
            setUsers([...users, { ...formData, id: Date.now() }]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: number) => {
        if (confirm("確定要刪除此使用者嗎？")) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">系統設置</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        管理後台人員帳號與權限設定。
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm shadow-blue-200 flex items-center gap-2"
                >
                    <Plus size={16} />
                    新增人員
                </button>
            </div>

            {/* Search Bar Removed as per request */}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-200 text-xs text-gray-900 font-bold whitespace-nowrap">
                            <th className="px-6 py-4">姓名</th>
                            <th className="px-6 py-4">帳號</th>
                            <th className="px-6 py-4">角色權限</th>
                            <th className="px-6 py-4">電話 / Email</th>
                            <th className="px-6 py-4">狀態</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-mono">{user.account}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === "總管理員" ? "bg-purple-100 text-purple-800" :
                                        user.role === "財務行政" ? "bg-green-100 text-green-800" :
                                            "bg-blue-100 text-blue-800"
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><Phone size={12} /> {user.phone}</span>
                                        <span className="flex items-center gap-1"><Mail size={12} /> {user.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-gray-100 text-gray-600 border border-gray-200"
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-gray-400"}`} />
                                        {user.status === "Active" ? "啟用中" : "已停用"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleOpenModal(user)}
                                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                {editingId ? <Edit className="text-blue-600" size={24} /> : <Plus className="text-blue-600" size={24} />}
                                {editingId ? "編輯人員資料" : "新增後台人員"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                        <Shield size={16} className="text-blue-600" />
                                        帳號權限
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">後台角色 <span className="text-red-500">*</span></label>
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="總管理員">總管理員</option>
                                                <option value="財務行政">財務行政</option>
                                                <option value="派車管理">派車管理</option>
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formData.role === "總管理員" && "擁有系統所有權限"}
                                                {formData.role === "財務行政" && "僅限查看訂單與財務管理"}
                                                {formData.role === "派車管理" && "僅限查看訂單、司機、用戶管理"}
                                            </p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">帳號狀態</label>
                                            <select
                                                value={formData.id === 1 ? "Active" : formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                                                disabled={formData.id === 1}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none ${formData.id === 1 ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
                                            >
                                                <option value="Active">啟用中</option>
                                                <option value="Inactive">已停用</option>
                                            </select>
                                            {formData.id === 1 && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    總管理員帳號無法停用
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                                        <User size={16} className="text-blue-600" />
                                        基本資料
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField
                                            label="姓名"
                                            required
                                            value={formData.name}
                                            onChange={(v) => setFormData({ ...formData, name: v })}
                                            placeholder="請輸入姓名"
                                            icon={<User size={16} className="text-gray-400" />}
                                        />
                                        <InputField
                                            label="登入帳號"
                                            required
                                            value={formData.account}
                                            onChange={(v) => setFormData({ ...formData, account: v })}
                                            placeholder="請輸入帳號"
                                            icon={<Shield size={16} className="text-gray-400" />}
                                        />
                                        <InputField
                                            label="密碼"
                                            type="password"
                                            required={!editingId}
                                            value={formData.password || ""}
                                            onChange={(v) => setFormData({ ...formData, password: v })}
                                            placeholder={editingId ? "若不修改請留空" : "請設定密碼"}
                                            icon={<Lock size={16} className="text-gray-400" />}
                                        />
                                        <InputField
                                            label="聯絡電話"
                                            value={formData.phone}
                                            onChange={(v) => setFormData({ ...formData, phone: v })}
                                            placeholder="09xx-xxx-xxx"
                                            icon={<Phone size={16} className="text-gray-400" />}
                                        />
                                        <div className="col-span-2">
                                            <InputField
                                                label="電子信箱"
                                                type="email"
                                                value={formData.email}
                                                onChange={(v) => setFormData({ ...formData, email: v })}
                                                placeholder="example@skycar.com"
                                                icon={<Mail size={16} className="text-gray-400" />}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-2xl">
                            {editingId && editingId !== 1 && (
                                <button
                                    onClick={() => handleDelete(editingId)}
                                    className="mr-auto px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors text-sm"
                                >
                                    刪除人員
                                </button>
                            )}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
                            >
                                <Save size={18} />
                                儲存設定
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InputField({ label, type = "text", required = false, value, onChange, placeholder, icon }: { label: string; type?: string; required?: boolean; value: string; onChange: (val: string) => void; placeholder?: string; icon?: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${icon ? "pl-9" : ""}`}
                />
            </div>
        </div>
    );
}
