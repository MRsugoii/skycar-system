"use client";

import { useState } from "react";
import { Search, Plus, MoreHorizontal, Edit, X, Save } from "lucide-react";

type NotificationRule = {
    id: number;
    name: string;
    type: "Email" | "SMS";
    triggerTiming: string;
    condition: string;
    isActive: boolean;
    // Extended fields for detail view/edit
    recipient?: string;
    subject?: string;
    content?: string;
};

const MOCK_DATA: NotificationRule[] = [
    {
        id: 1,
        name: "訂單下訂立即通知",
        type: "Email",
        condition: "下單後",
        triggerTiming: "立即發送",
        isActive: true,
    },
    {
        id: 2,
        name: "訂單開始前24小時通知",
        type: "Email",
        condition: "接機前",
        triggerTiming: "24小時前",
        isActive: true,
    },
    {
        id: 3,
        name: "訂單開始前6小時通知",
        type: "Email",
        condition: "接機前",
        triggerTiming: "6小時前",
        isActive: true,
    },
    {
        id: 4,
        name: "訂單下訂立即通知",
        type: "SMS",
        condition: "下單後",
        triggerTiming: "立即發送",
        isActive: true,
    },
    {
        id: 5,
        name: "訂單開始前24小時通知",
        type: "SMS",
        condition: "接機前",
        triggerTiming: "24小時前",
        isActive: true,
    },
    {
        id: 6,
        name: "訂單開始前6小時通知",
        type: "SMS",
        condition: "接機前",
        triggerTiming: "6小時前",
        isActive: true,
    },
];

export default function NotificationsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [notifications, setNotifications] = useState(MOCK_DATA);

    const filteredNotifications = notifications.filter((notification) =>
        notification.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleStatus = (id: number) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, isActive: !n.isActive } : n
        ));
    };

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<NotificationRule>({
        id: 0, // Temporary ID, will be replaced for new items
        name: "",
        type: "Email",
        triggerTiming: "",
        recipient: "",
        subject: "",
        condition: "下單後",
        content: "",
        isActive: true, // Default for new notifications
    });

    const handleOpenModal = (notification?: NotificationRule) => {
        if (notification) {
            setEditingId(notification.id);
            setFormData({
                ...notification,
                // Mocking missing fields for demo if they are undefined in existing data
                recipient: notification.recipient || "客戶",
                subject: notification.subject || "訂單通知",
                condition: notification.condition || "下單後",
                content: notification.content || "您好，您的訂單已確認。",
            });
        } else {
            setEditingId(null);
            setFormData({
                id: 0, // Will be replaced
                name: "",
                type: "Email",
                triggerTiming: "立即發送", // Default to immediate
                recipient: "客戶",
                subject: "訂單通知",
                condition: "下單後",
                content: "",
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (editingId) {
            setNotifications(notifications.map(n => n.id === editingId ? { ...n, ...formData } : n));
        } else {
            setNotifications([...notifications, { ...formData, id: Date.now() }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">通知中心</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        設定系統自動發送的通知規則與觸發條件。
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm shadow-blue-200 flex items-center gap-2"
                >
                    <Plus size={16} />
                    新增通知
                </button>
            </div>

            {/* Search Bar - Standardized Layout */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">信息類型</label>
                        <div className="relative">
                            <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-all overflow-hidden">
                                <div className="flex-shrink-0 pl-3 pr-2 text-gray-400 flex items-center justify-center">
                                    <Search size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="輸入信息類型 (例如: Email, SMS)"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-full text-sm outline-none border-none bg-transparent text-gray-900 placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium shadow-sm"
                    >
                        <Search size={16} />
                        搜尋
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-200 text-xs text-gray-900 font-bold whitespace-nowrap">
                            <th className="px-6 py-4">名稱</th>
                            <th className="px-6 py-4">信息類型</th>
                            <th className="px-6 py-4">條件設置</th>
                            <th className="px-6 py-4">觸發時段</th>
                            <th className="px-6 py-4">通知狀態</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredNotifications.map((notification) => (
                            <tr key={notification.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{notification.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{notification.type}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{notification.condition}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{notification.triggerTiming}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleStatus(notification.id)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${notification.isActive ? 'bg-emerald-500' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notification.isActive ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleOpenModal(notification)}
                                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredNotifications.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    沒有找到符合「{searchTerm}」的通知規則
                                </td>
                            </tr>
                        )}
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
                                {editingId ? "編輯通知規則" : "新增通知規則"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <InputField label="通知名稱" required value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="例如：訂單確認通知" />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">通知類型 <span className="text-red-500">*</span></label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value as "Email" | "SMS" })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="Email">Email</option>
                                                <option value="SMS">SMS</option>
                                            </select>
                                        </div>
                                        <InputField label="發送對象" required value={formData.recipient || ""} onChange={(v) => setFormData({ ...formData, recipient: v })} placeholder="例如：客戶、司機、管理員" />
                                    </div>

                                    <InputField label="主旨" required value={formData.subject || ""} onChange={(v) => setFormData({ ...formData, subject: v })} placeholder="郵件或簡訊的主標題" />
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">觸發條件設定</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">條件設置 <span className="text-red-500">*</span></label>
                                            <select
                                                value={formData.condition}
                                                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="下單後">下單後</option>
                                                <option value="接機前">接機前</option>
                                                <option value="接機後">接機後</option>
                                                <option value="送機前">送機前</option>
                                                <option value="送機後">送機後</option>
                                                <option value="接港前">接港前</option>
                                                <option value="接港後">接港後</option>
                                                <option value="離港前">離港前</option>
                                                <option value="離港後">離港後</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">觸發時段 <span className="text-red-500">*</span></label>
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex-1">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={formData.triggerTiming === "立即發送" ? "0" : formData.triggerTiming.replace(/[^0-9]/g, '')}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val === "0" || val === "") {
                                                                setFormData({ ...formData, triggerTiming: "立即發送" });
                                                            } else {
                                                                const direction = formData.triggerTiming.includes("後") ? "後" : "前";
                                                                setFormData({ ...formData, triggerTiming: `${val}小時${direction}` });
                                                            }
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="小時"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                                                        小時
                                                    </span>
                                                </div>
                                                <select
                                                    value={formData.triggerTiming.includes("後") ? "後" : "前"}
                                                    onChange={(e) => {
                                                        const val = formData.triggerTiming === "立即發送" ? "0" : (formData.triggerTiming.replace(/[^0-9]/g, '') || "0");
                                                        if (val === "0") {
                                                            setFormData({ ...formData, triggerTiming: "立即發送" });
                                                        } else {
                                                            setFormData({ ...formData, triggerTiming: `${val}小時${e.target.value}` });
                                                        }
                                                    }}
                                                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                >
                                                    <option value="前">前</option>
                                                    <option value="後">後</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700">訊息內容 <span className="text-red-500">*</span></label>
                                        <textarea
                                            value={formData.content || ""}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            rows={5}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                            placeholder="請輸入通知內容..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-2xl">
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

function InputField({ label, type = "text", required = false, suffix, value, onChange, placeholder }: { label: string; type?: string; required?: boolean; suffix?: string; value: string; onChange: (val: string) => void; placeholder?: string }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                        {suffix}
                    </span>
                )}
            </div>
        </div>
    );
}
