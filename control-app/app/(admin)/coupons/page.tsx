"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Truck, Ticket, Search, Plus, Edit, Trash2, X, Save, MoreHorizontal, Calendar, Tag, User, Layers } from "lucide-react";

// Define Coupon Type based on requirements
interface Coupon {
    id: number;
    code: string;
    discountType: string; // e.g., "折扣 50 元"
    validityStart: string;
    validityEnd: string;
    usageLimit: number;
    stackable: boolean;
    status: boolean; // Replaces creator
    createdAt: string;
}

export default function CouponsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CouponsContent />
        </Suspense>
    );
}

function CouponsContent() {
    // Mock Data
    const [coupons, setCoupons] = useState<Coupon[]>([
        {
            id: 1,
            code: "CHIHANG50",
            discountType: "折扣 50 元",
            validityStart: "2025/01/01",
            validityEnd: "2025/12/31",
            usageLimit: 1,
            stackable: true,
            status: true,
            createdAt: "2025-08-29 21:00:36"
        },
        {
            id: 2,
            code: "GOAIRPORT100",
            discountType: "機場接送折 100 元",
            validityStart: "2025/01/01",
            validityEnd: "2025/12/31",
            usageLimit: 1,
            stackable: true,
            status: true,
            createdAt: "2025-08-10 10:10:51"
        },
        {
            id: 3,
            code: "CHIHANGNEW",
            discountType: "新客首搭優惠",
            validityStart: "2025/01/01",
            validityEnd: "2025/12/31",
            usageLimit: 1,
            stackable: true,
            status: true,
            createdAt: "2025-07-15 08:11:09"
        },
        {
            id: 4,
            code: "VIPCHIHANG",
            discountType: "VIP 專屬優惠",
            validityStart: "2025/01/01",
            validityEnd: "2025/12/31",
            usageLimit: 1,
            stackable: true,
            status: true,
            createdAt: "2025-01-20 07:11:20"
        },
        {
            id: 5,
            code: "PORTRIDE88",
            discountType: "港口接送 88 折",
            validityStart: "2025/01/01",
            validityEnd: "2025/12/31",
            usageLimit: 1,
            stackable: true,
            status: true,
            createdAt: "2025-03-01 18:41:09"
        }
    ]);

    // Search States
    const [inputKeyword, setInputKeyword] = useState("");
    const [inputDateStart, setInputDateStart] = useState("");
    const [inputDateEnd, setInputDateEnd] = useState("");

    const [activeSearch, setActiveSearch] = useState({
        keyword: "",
        dateStart: "",
        dateEnd: ""
    });

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    // Form State
    const initialFormState: Omit<Coupon, 'id' | 'createdAt'> = {
        code: "",
        discountType: "",
        validityStart: "",
        validityEnd: "",
        usageLimit: 1,
        stackable: false,
        status: true
    };

    const [formData, setFormData] = useState<any>(initialFormState);

    const handleOpenModal = (coupon?: Coupon) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData(coupon);
        } else {
            setEditingCoupon(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCoupon(null);
    };

    const handleSave = () => {
        if (editingCoupon) {
            // Update existing
            setCoupons(coupons.map(c => c.id === editingCoupon.id ? { ...formData, id: c.id, createdAt: c.createdAt } : c));
        } else {
            // Add new
            const newId = Math.max(...coupons.map(c => c.id)) + 1;
            setCoupons([...coupons, {
                ...formData,
                id: newId,
                createdAt: new Date().toLocaleString('zh-TW', { hour12: false }).replace(/\//g, '-'),
            }]);
        }
        handleCloseModal();
    };

    const handleToggleStackable = (id: number) => {
        setCoupons(coupons.map(c => c.id === id ? { ...c, stackable: !c.stackable } : c));
    };

    const handleToggleStatus = (id: number) => {
        setCoupons(coupons.map(c => c.id === id ? { ...c, status: !c.status } : c));
    };

    const handleSearch = () => {
        setActiveSearch({
            keyword: inputKeyword,
            dateStart: inputDateStart,
            dateEnd: inputDateEnd
        });
    };

    // Filter Logic
    const filteredCoupons = coupons.filter(c => {
        const matchTerm = c.code.toLowerCase().includes(activeSearch.keyword.toLowerCase()) ||
            c.discountType.toLowerCase().includes(activeSearch.keyword.toLowerCase());
        return matchTerm;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">前台管理</h1>
                    <p className="text-sm text-gray-500 mt-1">管理車輛資訊與優惠卷設定。</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm shadow-blue-200"
                    >
                        <Plus size={16} />
                        新增優惠卷
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-6">
                    <Link
                        href="/vehicles"
                        className="pb-4 text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-2"
                    >
                        <Truck size={16} />
                        車輛管理
                    </Link>
                    <Link
                        href="/coupons"
                        className="pb-4 text-sm font-medium border-b-2 transition-colors border-blue-600 text-blue-600 flex items-center gap-2"
                    >
                        <Ticket size={16} />
                        優惠卷管理
                    </Link>
                </nav>
            </div>

            {/* Advanced Search */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">關鍵字搜尋</label>
                        <div className="relative">
                            <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-all overflow-hidden">
                                <div className="flex-shrink-0 pl-3 pr-2 text-gray-400 flex items-center justify-center">
                                    <Search size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={inputKeyword}
                                    onChange={(e) => setInputKeyword(e.target.value)}
                                    placeholder="優惠卷編號 / 折扣類型"
                                    className="w-full h-full text-sm outline-none border-none bg-transparent text-gray-900 placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-medium text-gray-500">使用期限範圍</label>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-all overflow-hidden">
                                    <div className="flex-shrink-0 pl-3 pr-2 text-gray-400 flex items-center justify-center">
                                        <Calendar size={18} />
                                    </div>
                                    <input
                                        type="date"
                                        value={inputDateStart}
                                        onChange={(e) => setInputDateStart(e.target.value)}
                                        className="w-full h-full text-sm outline-none border-none bg-transparent text-gray-900 placeholder-gray-400"
                                    />
                                </div>
                            </div>
                            <span className="text-gray-400">-</span>
                            <div className="relative flex-1">
                                <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-all overflow-hidden">
                                    <div className="flex-shrink-0 pl-3 pr-2 text-gray-400 flex items-center justify-center">
                                        <Calendar size={18} />
                                    </div>
                                    <input
                                        type="date"
                                        value={inputDateEnd}
                                        onChange={(e) => setInputDateEnd(e.target.value)}
                                        className="w-full h-full text-sm outline-none border-none bg-transparent text-gray-900 placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <button
                        onClick={handleSearch}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium shadow-sm">
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
                            <th className="px-6 py-4 w-16">編號</th>
                            <th className="px-6 py-4">優惠卷編號</th>
                            <th className="px-6 py-4">折扣類型</th>
                            <th className="px-6 py-4">使用期限</th>
                            <th className="px-6 py-4">用戶使用次數限制</th>
                            <th className="px-6 py-4">可疊加</th>
                            <th className="px-6 py-4">狀態</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCoupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-6 py-4 text-gray-500">{coupon.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{coupon.code}</td>
                                <td className="px-6 py-4 text-gray-600">{coupon.discountType}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {coupon.validityStart}-{coupon.validityEnd}
                                </td>
                                <td className="px-6 py-4 text-gray-600 pl-12">
                                    {coupon.usageLimit}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleStackable(coupon.id)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${coupon.stackable ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${coupon.stackable ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleStatus(coupon.id)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${coupon.status ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${coupon.status ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleOpenModal(coupon)}
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
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                            <h3 className="text-xl font-bold text-gray-900">{editingCoupon ? "編輯優惠卷" : "新增優惠卷"}</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Tag size={20} className="text-blue-600" />
                                        基本資訊
                                    </h3>
                                    <div className="space-y-4">
                                        <InputField label="優惠卷編號 (Code)" required value={formData.code} onChange={(v) => setFormData({ ...formData, code: v })} />
                                        <InputField label="折扣類型描述" required value={formData.discountType} onChange={(v) => setFormData({ ...formData, discountType: v })} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="開始日期" type="date" required value={formData.validityStart} onChange={(v) => setFormData({ ...formData, validityStart: v })} />
                                            <InputField label="結束日期" type="date" required value={formData.validityEnd} onChange={(v) => setFormData({ ...formData, validityEnd: v })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Layers size={20} className="text-blue-600" />
                                        使用限制
                                    </h3>
                                    <div className="space-y-4">
                                        <InputField label="用戶使用次數限制" type="number" required value={formData.usageLimit} onChange={(v) => setFormData({ ...formData, usageLimit: parseInt(v) || 0 })} />
                                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                            <label className="text-sm font-medium text-gray-700">是否可疊加使用</label>
                                            <button
                                                onClick={() => setFormData({ ...formData, stackable: !formData.stackable })}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${formData.stackable ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.stackable ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3">
                            <button
                                onClick={handleCloseModal}
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

function InputField({ label, type = "text", required = false, suffix, value, onChange }: { label: string; type?: string; required?: boolean; suffix?: string; value: any; onChange: (val: string) => void }) {
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
