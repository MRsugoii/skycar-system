"use client";

import { useState } from "react";
import { Search, Plus, MoreHorizontal, Edit, X, Save, User, Shield, Mail, Phone, Lock, ClipboardList, Users, Layout, CreditCard, Bell, CheckCircle2, Truck } from "lucide-react";

interface Permissions {
    orders: { unconfirmed: boolean; confirmed: boolean; completed: boolean; refund: boolean; trash: boolean; };
    drivers: { list: boolean; audit: boolean; failed: boolean; };
    users: boolean;
    frontend: { pricing: boolean; coupons: boolean; driverBonus: boolean; };
    finance: boolean;
    notifications: boolean;
}

type AdminUser = {
    id: number;
    name: string;
    account: string;
    role: string; // Now dynamic string
    phone: string;
    email: string;
    status: "Active" | "Inactive";
    permissions: Permissions;
    password?: string;
};

const INITIAL_PERMISSIONS: Permissions = {
    orders: { unconfirmed: true, confirmed: true, completed: true, refund: true, trash: true },
    drivers: { list: true, audit: true, failed: true },
    users: true,
    frontend: { pricing: true, coupons: true, driverBonus: true },
    finance: true,
    notifications: true
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
        permissions: INITIAL_PERMISSIONS,
    },
    {
        id: 2,
        name: "Finance User",
        account: "finance_01",
        role: "財務行政",
        phone: "0922-333-444",
        email: "finance@skycar.com",
        status: "Active",
        permissions: {
            ...INITIAL_PERMISSIONS,
            drivers: { list: false, audit: false, failed: false },
            users: false,
            notifications: false
        },
    },
    {
        id: 3,
        name: "Dispatch Mgr",
        account: "dispatch_01",
        role: "派車管理",
        phone: "0988-777-666",
        email: "dispatch@skycar.com",
        status: "Active",
        permissions: {
            ...INITIAL_PERMISSIONS,
            finance: false,
            frontend: { pricing: false, coupons: false, driverBonus: false }
        },
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
        role: "新進人員",
        phone: "",
        email: "",
        status: "Active",
        permissions: {
            orders: { unconfirmed: false, confirmed: false, completed: false, refund: false, trash: false },
            drivers: { list: false, audit: false, failed: false },
            users: false,
            frontend: { pricing: false, coupons: false, driverBonus: false },
            finance: false,
            notifications: false
        },
        password: "",
    });

    const handleToggleStatus = (id: number) => {
        // Prevent disabling the master admin
        if (id === 1) return;
        setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
    };

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
                role: "新進人員",
                phone: "",
                email: "",
                status: "Active",
                permissions: {
                    orders: { unconfirmed: false, confirmed: false, completed: false, refund: false, trash: false },
                    drivers: { list: false, audit: false, failed: false },
                    users: false,
                    frontend: { pricing: false, coupons: false, driverBonus: false },
                    finance: false,
                    notifications: false
                },
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
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm ring-4 ring-blue-50">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-mono">{user.account}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><Phone size={12} /> {user.phone}</span>
                                        <span className="flex items-center gap-1"><Mail size={12} /> {user.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {user.id !== 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleStatus(user.id);
                                                    }}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none ${user.status === "Active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-gray-300"
                                                        } cursor-pointer active:scale-95`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${user.status === "Active" ? "translate-x-6" : "translate-x-1"
                                                            }`}
                                                    />
                                                </button>
                                                <span className={`text-xs font-bold ${user.status === "Active" ? "text-emerald-600" : "text-gray-400"}`}>
                                                    {user.status === "Active" ? "" : "已停用"}
                                                </span>
                                            </>
                                        )}
                                    </div>
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
                                        帳號權限與角色
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">自定義角色名稱 <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                placeholder="例如：區域管理員、客服組長"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
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
                                        </div>
                                    </div>

                                    {/* Permission Checkboxes */}
                                    <div className="pt-4 space-y-6">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">模組權限點選</h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Order Management */}
                                            <PermissionGroup
                                                title="訂單管理"
                                                icon={<ClipboardList size={16} className="text-blue-500" />}
                                                disabled={formData.id === 1}
                                                options={[
                                                    { label: "未確認訂單", value: formData.permissions.orders.unconfirmed, onChange: (v) => setFormData({ ...formData, permissions: { ...formData.permissions, orders: { ...formData.permissions.orders, unconfirmed: v } } }) },
                                                    { label: "已確認訂單", value: formData.permissions.orders.confirmed, onChange: (v) => setFormData({ ...formData, permissions: { ...formData.permissions, orders: { ...formData.permissions.orders, confirmed: v } } }) },
                                                    { label: "已完成訂單", value: formData.permissions.orders.completed, onChange: (v) => setFormData({ ...formData, permissions: { ...formData.permissions, orders: { ...formData.permissions.orders, completed: v } } }) },
                                                    { label: "退費訂單審核", value: formData.permissions.orders.refund, onChange: (v) => setFormData({ ...formData, permissions: { ...formData.permissions, orders: { ...formData.permissions.orders, refund: v } } }) },
                                                    { label: "垃圾桶", value: formData.permissions.orders.trash, onChange: (v) => setFormData({ ...formData, permissions: { ...formData.permissions, orders: { ...formData.permissions.orders, trash: v } } }) },
                                                ]}
                                            />

                                            {/* Driver Management */}
                                            <PermissionGroup
                                                title="司機管理"
                                                icon={<Truck size={16} className="text-emerald-500" />}
                                                disabled={formData.id === 1}
                                                options={[
                                                    { label: "司機名單", value: formData.permissions.drivers.list, onChange: (v) => setFormData({ ...formData, permissions: { ...formData.permissions, drivers: { ...formData.permissions.drivers, list: v } } }) },
                                                    { label: "審核名單", value: formData.permissions.drivers.audit, onChange: (v) => setFormData({ ...formData, permissions: { ...formData.permissions, drivers: { ...formData.permissions.drivers, audit: v } } }) },
                                                    { label: "審核不通過", value: formData.permissions.drivers.failed, onChange: (v) => setFormData({ ...formData, permissions: { ...formData.permissions, drivers: { ...formData.permissions.drivers, failed: v } } }) },
                                                ]}
                                            />

                                            {/* Front-end Management */}
                                            <PermissionGroup
                                                title="前台管理"
                                                icon={<Layout size={16} className="text-purple-500" />}
                                                disabled={formData.id === 1}
                                                options={[
                                                    { label: "價格管理", value: formData.permissions.frontend.pricing, onChange: (v) => setFormData({ ...formData, permissions: { ...formData.permissions, frontend: { ...formData.permissions.frontend, pricing: v } } }) },
                                                    { label: "優惠券管理", value: formData.permissions.frontend.coupons, onChange: (v) => setFormData({ ...formData, permissions: { ...formData.permissions, frontend: { ...formData.permissions.frontend, coupons: v } } }) },
                                                    { label: "司機加成", value: formData.permissions.frontend.driverBonus, onChange: (v) => setFormData({ ...formData, permissions: { ...formData.permissions, frontend: { ...formData.permissions.frontend, driverBonus: v } } }) },
                                                ]}
                                            />

                                            {/* Simple Booleans */}
                                            <div className="space-y-4">
                                                <PermissionRow
                                                    label="用戶管理"
                                                    icon={<Users size={16} className="text-orange-500" />}
                                                    value={formData.permissions.users}
                                                    disabled={formData.id === 1}
                                                    onChange={(v) => setFormData({ ...formData, permissions: { ...formData.permissions, users: v } })}
                                                />
                                                <PermissionRow
                                                    label="財務管理"
                                                    icon={<CreditCard size={16} className="text-yellow-500" />}
                                                    value={formData.permissions.finance}
                                                    disabled={formData.id === 1}
                                                    onChange={(v) => setFormData({ ...formData, permissions: { ...formData.permissions, finance: v } })}
                                                />
                                                <PermissionRow
                                                    label="通知中心"
                                                    icon={<Bell size={16} className="text-red-500" />}
                                                    value={formData.permissions.notifications}
                                                    disabled={formData.id === 1}
                                                    onChange={(v) => setFormData({ ...formData, permissions: { ...formData.permissions, notifications: v } })}
                                                />
                                            </div>

                                            {formData.id === 1 && (
                                                <div className="md:col-span-2 p-4 bg-purple-50 border border-purple-100 rounded-xl flex items-start gap-3 mt-4">
                                                    <Shield size={20} className="text-purple-600 shrink-0 mt-0.5" />
                                                    <div className="text-xs text-purple-900 leading-relaxed">
                                                        <p className="font-bold mb-1">總管理員帳號權限提示</p>
                                                        <p>總管理員帳號擁有系統所有最高權限，無法在此處手動修改其權限設定，以確保系統維運安全性。</p>
                                                    </div>
                                                </div>
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

function PermissionGroup({ title, icon, options, disabled = false }: { title: string; icon: React.ReactNode; options: { label: string; value: boolean; onChange: (v: boolean) => void }[]; disabled?: boolean }) {
    return (
        <div className={`bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-3 ${disabled ? "opacity-60 grayscale-[0.5]" : ""}`}>
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-sm font-bold text-gray-700">{title}</span>
            </div>
            <div className="space-y-2">
                {options.map((opt, i) => (
                    <label key={i} className={`flex items-center gap-2 ${disabled ? "cursor-not-allowed" : "cursor-pointer group"}`}>
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={opt.value}
                                disabled={disabled}
                                onChange={(e) => opt.onChange(e.target.checked)}
                                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 transition-all focus:ring-2 focus:ring-blue-500 disabled:checked:bg-gray-400 disabled:checked:border-gray-400"
                            />
                            <CheckCircle2 className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none transition-opacity" />
                        </div>
                        <span className={`text-xs text-gray-600 transition-colors ${!disabled && "group-hover:text-gray-900"}`}>{opt.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

function PermissionRow({ label, icon, value, onChange, disabled = false }: { label: string; icon: React.ReactNode; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
    return (
        <label className={`flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 transition-all shadow-sm ${disabled ? "opacity-60 grayscale-[0.5] cursor-not-allowed" : "hover:border-blue-200 cursor-pointer group"}`}>
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-xs font-bold text-gray-700">{label}</span>
            </div>
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    checked={value}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 transition-all focus:ring-2 focus:ring-blue-500 disabled:checked:bg-gray-400 disabled:checked:border-gray-400"
                />
                <CheckCircle2 className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none transition-opacity" />
            </div>
        </label>
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
                    <div className="absolute left-3 inset-y-0 flex items-center justify-center pointer-events-none">
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
