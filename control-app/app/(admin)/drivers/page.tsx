"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, MoreHorizontal, Download, Plus, X, Save, Check, Trash2, RefreshCcw, Calendar, User, FileText, Car, DollarSign, Briefcase, MapPin, Clock, ArrowRight, Ban, CheckCircle, Smartphone, Globe, ShieldCheck, ClipboardList, Power, ChevronLeft, ChevronRight, Eye, Mail, Phone, Edit } from "lucide-react";
import Link from "next/link";
import { useSystemActivity } from "../context/SystemActivityContext";

type Driver = {
    id: string;
    name: string;
    phone: string;
    status: string;
    totalOrders: number;
    completionRate: string;
    email: string;
    vehicle: string;
    plate: string;
    location: string;
    rating: number;
    joinDate: string;
    totalEarnings: number;
    // Extended Details
    account: string;
    nationalId: string; // Login ID
    password?: string; // Optional for security display
    address: string;
    dob: string;
    bankAccount: string;
    licenseImg?: string;
    vehicleRegImg?: string;
    insuranceImg?: string;
    goodCitizenImg?: string;
};

function DriverStatusBadge({ status }: { status: string }) {
    const styles = {
        "正常": "bg-emerald-50 text-emerald-700 border-emerald-200",
        "審核中": "bg-purple-50 text-purple-700 border-purple-200",
        "待補件": "bg-purple-50 text-purple-700 border-purple-200",
        "停權": "bg-red-50 text-red-700 border-red-200",
        "審核不通過": "bg-red-50 text-red-700 border-red-200",
    };
    const style = styles[status as keyof typeof styles] || "bg-gray-50 text-gray-700 border-gray-200";

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
            {status}
        </span>
    );
}

export default function DriversPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DriversContent />
        </Suspense>
    );
}

function DriversContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentStatus = searchParams.get("status") || "all";
    const { addLog } = useSystemActivity();

    const [drivers, setDrivers] = useState<Driver[]>([
        {
            id: "1", name: "劉曉明", phone: "0909882192", status: "正常", totalOrders: 95, completionRate: "100%", email: "xiaoming0908@gmail.com", vehicle: "Benz", plate: "9276MG", location: "台北市", rating: 4.8, joinDate: "2024-12-31", totalEarnings: 120000,
            account: "liuxiaoming", nationalId: "A123456789", password: "xiaoming123", address: "10617台北市大安區羅斯福路四段1號", dob: "2000-01-01", bankAccount: "郵局700-0102031 7218621"
        },
        {
            id: "2", name: "陳大華", phone: "0912345678", status: "正常", totalOrders: 150, completionRate: "98%", email: "chen@example.com", vehicle: "Honda CR-V", plate: "XYZ-9876", location: "新北市", rating: 4.9, joinDate: "2023-11-20", totalEarnings: 85000,
            account: "chendahua", nationalId: "F123456789", password: "0912345678", address: "新北市板橋區文化路一段100號", dob: "1985-05-20", bankAccount: "中國信託822-123456789012"
        },
        {
            id: "3", name: "林志豪", phone: "0923456789", status: "審核中", totalOrders: 0, completionRate: "-", email: "lin@example.com", vehicle: "Toyota Altis", plate: "DEF-5678", location: "桃園市", rating: 0, joinDate: "2025-12-01", totalEarnings: 0,
            account: "linzhihao", nationalId: "H123456789", password: "0923456789", address: "桃園市中壢區中正路50號", dob: "1990-10-10", bankAccount: "國泰世華013-987654321098"
        },
        {
            id: "4", name: "吳雅婷", phone: "0934567890", status: "停權", totalOrders: 45, completionRate: "92%", email: "wu@example.com", vehicle: "Tesla Model 3", plate: "EAG-8888", location: "台北市", rating: 4.5, joinDate: "2024-05-10", totalEarnings: 45000,
            account: "wuyating", nationalId: "A223456789", password: "0934567890", address: "台北市信義區信義路五段7號", dob: "1995-03-15", bankAccount: "台新銀行812-288812345678"
        },
        {
            id: "5", name: "張建國", phone: "0945678901", status: "正常", totalOrders: 320, completionRate: "99%", email: "zhang@example.com", vehicle: "Nissan Sentra", plate: "GHI-9012", location: "台中市", rating: 4.7, joinDate: "2023-08-05", totalEarnings: 210000,
            account: "zhangjianguo", nationalId: "B123456789", password: "0945678901", address: "台中市西屯區台灣大道三段251號", dob: "1980-08-08", bankAccount: "玉山銀行808-123123123123"
        },
        {
            id: "6", name: "陳小美", phone: "0956789012", status: "待補件", totalOrders: 0, completionRate: "-", email: "may@example.com", vehicle: "Toyota Camry", plate: "JKL-3456", location: "高雄市", rating: 0, joinDate: "2025-12-02", totalEarnings: 0,
            account: "chenxiaomei", nationalId: "S223456789", password: "0956789012", address: "高雄市前金區中正四路200號", dob: "1992-02-02", bankAccount: "台新銀行812-987654321"
        },
        {
            id: "7", name: "孫小美", phone: "0987654321", status: "審核中", totalOrders: 0, completionRate: "-", email: "sun@example.com", vehicle: "Honda Fit", plate: "XYZ-1234", location: "台北市", rating: 0, joinDate: "2025-12-08", totalEarnings: 0,
            account: "sunxiaomei", nationalId: "C123456789", password: "0987654321", address: "台北市大安區", dob: "1995-05-05", bankAccount: "國泰世華013-123456789"
        },
    ]);

    // Load from localStorage on mount
    useEffect(() => {
        const storedDrivers: Driver[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith("driver_")) {
                try {
                    const raw = localStorage.getItem(key);
                    if (raw) {
                        const d = JSON.parse(raw);
                        // Map local storage format to Control App Driver type if needed
                        // Assuming the register app saves "status" strings matching what we expect (e.g. "審核中")
                        // If "pending" is saved, we map it to "審核中"
                        let status = d.status;
                        if (status === 'pending') status = '審核中';

                        storedDrivers.push({
                            id: d.idno, // Use specific ID for key
                            name: d.name,
                            phone: d.phone,
                            status: status,
                            totalOrders: d.totalOrders || 0,
                            completionRate: d.completionRate || "-",
                            email: d.email || "-",
                            vehicle: d.vehicle || "-",
                            plate: d.plate || "-",
                            location: d.addr?.substring(0, 3) || "-",
                            rating: d.rating || 0,
                            joinDate: new Date().toISOString().split('T')[0], // Default to today if missing
                            totalEarnings: d.totalEarnings || 0,
                            account: d.idno,
                            nationalId: d.idno,
                            password: d.password,
                            address: d.addr || "",
                            dob: d.birth || "",
                            bankAccount: d.bankAccount || ""
                        });
                    }
                } catch (e) {
                    console.error("Failed to parse driver", key);
                }
            }
        }

        // Remove duplicates if necessary (though React state init usually happens once, useEffect runs after)
        // Here we just append specifically found local drivers that aren't already hardcoded?
        // For simpler demo, let's just prepend them.
        if (storedDrivers.length > 0) {
            setDrivers(prev => {
                // simple de-dupe by id (nationalId)
                const existingIds = new Set(prev.map(p => p.nationalId));
                const newOnes = storedDrivers.filter(d => !existingIds.has(d.nationalId));
                return [...newOnes, ...prev];
            });
        }
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);

    // Search States
    const [inputName, setInputName] = useState("");
    const [inputStatus, setInputStatus] = useState("");

    const [activeSearch, setActiveSearch] = useState({
        name: "",
        status: ""
    });

    const handleSearch = () => {
        setActiveSearch({
            name: inputName,
            status: inputStatus
        });
    };

    const handleOpenModal = (driver: Driver) => {
        setCurrentDriver(driver);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentDriver(null);
    };

    const handleUpdateDriver = (updatedDriver: Driver) => {
        setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? updatedDriver : d));
        setCurrentDriver(updatedDriver); // Update the modal view as well
    };

    const filteredDrivers = drivers.filter(d => {
        if (currentStatus === 'audit') {
            if (d.status !== '審核中' && d.status !== '待補件') return false;
        } else if (currentStatus === 'rejected') {
            if (d.status !== '審核不通過') return false;
        } else {
            if (d.status === '審核中' || d.status === '審核不通過' || d.status === '待補件') return false;
        }

        const nameMatch = d.name.toLowerCase().includes(activeSearch.name.toLowerCase());
        const statusMatch = d.status.includes(activeSearch.status);

        return nameMatch && statusMatch;
    });

    const tabs = [
        { id: "all", label: "司機名單" },
        { id: "audit", label: "審核名單" },
        { id: "rejected", label: "審核不通過" },
    ];

    const handleAddDriver = (newDriver: Driver) => {
        setDrivers([newDriver, ...drivers]);
        setIsAddModalOpen(false);
        addLog(`新增司機 ${newDriver.name}`, "info");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">司機管理</h1>
                    <p className="text-sm text-gray-500 mt-1">管理所有已註冊的司機資訊與審核狀態。</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
                        <Download size={16} />
                        匯出名單
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm shadow-blue-200"
                    >
                        <Plus size={16} />
                        新增司機
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-6">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.id}
                            href={`/drivers?status=${tab.id}`}
                            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${currentStatus === tab.id
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            {tab.label}
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${currentStatus === tab.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                                }`}>
                                {tab.id === 'audit'
                                    ? drivers.filter(d => d.status === '審核中').length
                                    : tab.id === 'rejected'
                                        ? drivers.filter(d => d.status === '審核不通過').length
                                        : drivers.filter(d => d.status !== '審核中' && d.status !== '審核不通過').length}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Advanced Search */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">司機姓名</label>
                        <div className="relative">
                            <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-all overflow-hidden">
                                <div className="flex-shrink-0 pl-3 pr-2 text-gray-400 flex items-center justify-center">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={inputName}
                                    onChange={(e) => setInputName(e.target.value)}
                                    placeholder="輸入姓名"
                                    className="w-full h-full text-sm outline-none border-none bg-transparent text-gray-900 placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">司機狀態</label>
                        <div className="relative">
                            <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-all overflow-hidden">
                                <div className="flex-shrink-0 pl-3 pr-2 text-gray-400 flex items-center justify-center">
                                    <ShieldCheck size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={inputStatus}
                                    onChange={(e) => setInputStatus(e.target.value)}
                                    placeholder="輸入狀態"
                                    className="w-full h-full text-sm outline-none border-none bg-transparent text-gray-900 placeholder-gray-400"
                                />
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
                            <th className="px-6 py-4">用戶姓名</th>
                            <th className="px-6 py-4">聯絡資訊</th>
                            <th className="px-6 py-4">加入時間</th>
                            <th className="px-6 py-4">累積消費</th>
                            <th className="px-6 py-4">狀態</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredDrivers.length > 0 ? (
                            filteredDrivers.map((driver) => (
                                <tr
                                    key={driver.id}
                                    onClick={() => driver.status !== '審核不通過' && handleOpenModal(driver)}
                                    className={`hover:bg-blue-50/30 transition-colors group ${driver.status !== '審核不通過' ? 'cursor-pointer' : ''}`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
                                                {driver.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{driver.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail size={14} className="text-gray-400" />
                                                {driver.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone size={14} className="text-gray-400" />
                                                {driver.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            {driver.joinDate}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                        NT$ {driver.totalEarnings.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <DriverStatusBadge status={driver.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    目前沒有{tabs.find(t => t.id === currentStatus)?.label}資料
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Enhanced Modal */}
            {isModalOpen && currentDriver && (
                <DriverDetailModal
                    driver={currentDriver}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdateDriver}
                />
            )}

            {/* Add Driver Modal */}
            {isAddModalOpen && (
                <AddDriverModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddDriver}
                />
            )}

            {/* Report Download Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">匯出司機名單</h3>
                            <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-600">請選擇匯出格式：</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors group">
                                    <FileText size={32} className="text-gray-400 group-hover:text-blue-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Excel (.xlsx)</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-200 transition-colors group">
                                    <FileText size={32} className="text-gray-400 group-hover:text-green-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">CSV (.csv)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DriverDetailModal({ driver, onClose, onUpdate }: { driver: Driver; onClose: () => void; onUpdate: (d: Driver) => void }) {
    const [activeTab, setActiveTab] = useState<"info" | "orders" | "limits">("info");
    const [isSuspended, setIsSuspended] = useState(driver.status === "停權");
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(driver);
    const { addLog } = useSystemActivity();

    const isAudit = driver.status === "審核中";

    const menuItems = [
        { id: "info", label: "基本信息", icon: User },
        // Hide orders tab for audit drivers
        ...(isAudit ? [] : [{ id: "orders", label: "派單紀錄", icon: ClipboardList }]),
        // Hide limits tab for audit drivers
        ...(isAudit ? [] : [{ id: "limits", label: "帳號權限", icon: Power }]),
    ];

    // Mock Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 1;

    const handleToggleSuspend = () => {
        const newStatus = !isSuspended;
        setIsSuspended(newStatus);

        // Update parent state
        // If suspending, status becomes "停權"
        // If unsuspending, status becomes "正常" (assuming they were normal before)
        const updatedDriver = {
            ...driver,
            status: newStatus ? "停權" : "正常"
        };
        onUpdate(updatedDriver);
    };

    const handleApprove = () => {
        if (confirm("確定要通過此司機的審核嗎？")) {
            onUpdate({ ...driver, status: "正常" });
            onClose();
        }
    };

    const handleReject = (reasons: string[]) => {
        onUpdate({ ...driver, status: "審核不通過" });
        setShowRejectModal(false);
        onClose();
    };

    const handleRequestResubmit = (reasons: string[]) => {
        onUpdate({ ...driver, status: "待補件" });
        setShowRejectModal(false);
        onClose();
    };

    const handleSave = () => {
        onUpdate(editForm);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm(driver);
        setIsEditing(false);
    };

    const handleResetPassword = () => {
        const newPass = Math.floor(100000 + Math.random() * 900000).toString();
        if (confirm(`確定要將密碼重置為臨時密碼 "${newPass}" 嗎？\n此操作將立即生效。`)) {
            const updated = { ...driver, password: newPass };
            onUpdate(updated);
            setEditForm(updated);
        }
    };



    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200 flex relative">

                {/* Sidebar */}
                <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">
                    <div className="p-8 flex flex-col items-center border-b border-gray-100">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 shadow-inner">
                            <User size={48} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 text-center">{driver.name}</h3>
                        <p className="text-sm text-gray-500">{driver.phone}</p>
                        <div className="mt-2">
                            <DriverStatusBadge status={driver.status} />
                        </div>
                    </div>
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id as any); setSelectedOrder(null); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.id
                                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-white relative">
                    {/* Header */}
                    <div className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white flex-shrink-0">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            {selectedOrder ? (
                                <>
                                    <button onClick={() => setSelectedOrder(null)} className="hover:bg-gray-100 p-1 rounded-full transition-colors">
                                        <ChevronLeft size={20} />
                                    </button>
                                    訂單詳情 #{selectedOrder.id}
                                </>
                            ) : (
                                menuItems.find(i => i.id === activeTab)?.label
                            )}
                        </h2>
                        <div className="flex gap-2">
                            {isAudit && activeTab === 'info' && (
                                <>
                                    <button
                                        onClick={() => setShowRejectModal(true)}
                                        className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors shadow-sm text-sm"
                                    >
                                        拒絕申請
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors shadow-sm shadow-emerald-200 text-sm"
                                    >
                                        通過審核
                                    </button>
                                    <div className="w-px h-8 bg-gray-200 mx-1"></div>
                                </>
                            )}

                            {!isAudit && activeTab === 'info' && (
                                isEditing ? (
                                    <>
                                        <button onClick={handleCancel} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm text-sm">
                                            取消
                                        </button>
                                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm text-sm flex items-center gap-2">
                                            <Save size={16} />
                                            儲存
                                        </button>
                                        <div className="w-px h-8 bg-gray-200 mx-1"></div>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm text-sm flex items-center gap-2">
                                            <Edit size={16} />
                                            編輯
                                        </button>
                                        <div className="w-px h-8 bg-gray-200 mx-1"></div>
                                    </>
                                )
                            )}

                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        {activeTab === "info" && (
                            <div className="space-y-8 max-w-3xl mx-auto">
                                <div className="grid grid-cols-2 gap-x-12 gap-y-6">

                                    <DetailRow label="帳戶" value={editForm.account} />
                                    <DetailRow label="身分證號" value={editForm.nationalId} isEditing={isEditing} onChange={(val) => setEditForm({ ...editForm, nationalId: val })} />
                                    <DetailRow
                                        label="密碼"
                                        value={editForm.password || "********"}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditForm({ ...editForm, password: val })}
                                        extra={
                                            !isEditing && (
                                                <button onClick={handleResetPassword} className="ml-2 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="重置密碼">
                                                    <RefreshCcw size={14} />
                                                </button>
                                            )
                                        }
                                    />
                                    <DetailRow label="姓名" value={editForm.name} isEditing={isEditing} onChange={(val) => setEditForm({ ...editForm, name: val })} />
                                    <DetailRow label="電話" value={editForm.phone} isEditing={isEditing} onChange={(val) => setEditForm({ ...editForm, phone: val })} />
                                    <DetailRow label="Email" value={editForm.email} isEditing={isEditing} onChange={(val) => setEditForm({ ...editForm, email: val })} />
                                    <DetailRow label="地址" value={editForm.address} isEditing={isEditing} onChange={(val) => setEditForm({ ...editForm, address: val })} />
                                    <DetailRow label="生日" value={editForm.dob} isEditing={isEditing} onChange={(val) => setEditForm({ ...editForm, dob: val })} />
                                    <DetailRow label="車型" value={editForm.vehicle} isEditing={isEditing} onChange={(val) => setEditForm({ ...editForm, vehicle: val })} />
                                    <DetailRow label="車牌" value={editForm.plate} isEditing={isEditing} onChange={(val) => setEditForm({ ...editForm, plate: val })} />
                                    <DetailRow label="銀行帳號" value={editForm.bankAccount} isEditing={isEditing} onChange={(val) => setEditForm({ ...editForm, bankAccount: val })} />
                                    <DetailRow label="註冊日期" value={editForm.joinDate} />
                                    <DetailRow label="司機狀態" value={editForm.status} isBadge />
                                </div>

                                <hr className="border-gray-100" />

                                <div className="grid grid-cols-2 gap-8">
                                    <ImagePreview label="駕照" onPreview={() => setViewingImage("駕照")} />
                                    <ImagePreview label="行照" onPreview={() => setViewingImage("行照")} />
                                    <ImagePreview label="保險" onPreview={() => setViewingImage("保險")} />
                                    <ImagePreview label="良民證" onPreview={() => setViewingImage("良民證")} />
                                </div>
                            </div>
                        )}

                        {activeTab === "orders" && !isAudit && (
                            selectedOrder ? (
                                <OrderDetailView order={selectedOrder} />
                            ) : (
                                <div className="space-y-6 h-full flex flex-col">
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 flex flex-col">
                                        <div className="overflow-x-auto flex-1">
                                            <table className="w-full text-left text-sm whitespace-nowrap">
                                                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                                                    <tr>
                                                        <th className="px-6 py-4">訂單編號</th>
                                                        <th className="px-6 py-4">訂單類型</th>
                                                        <th className="px-6 py-4">接送日期</th>
                                                        <th className="px-6 py-4">訂單狀態</th>
                                                        <th className="px-6 py-4">接送地點</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {[...Array(4)].map((_, i) => (
                                                        <tr
                                                            key={i}
                                                            onClick={() => setSelectedOrder({ id: `CH20251016000${i + 1}`, type: i % 2 === 0 ? "接機" : "送機", status: "completed" })}
                                                            className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                                                        >
                                                            <td className="px-6 py-4 font-medium text-blue-600">CH20251016000{i + 1}</td>
                                                            <td className="px-6 py-4 text-gray-600">{i % 2 === 0 ? "接機" : "送機"}</td>
                                                            <td className="px-6 py-4 text-gray-500">2023-01-01</td>
                                                            <td className="px-6 py-4"><span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-medium border border-green-100">已完成</span></td>
                                                            <td className="px-6 py-4 text-gray-600">台中</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Pagination - Only show if needed */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-2 pt-2 pb-4">
                                            <button
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                                className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            {[...Array(totalPages)].map((_, i) => {
                                                const page = i + 1;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                            <button
                                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage === totalPages}
                                                className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        )}

                        {activeTab === "limits" && (
                            <div className="max-w-2xl mx-auto space-y-8 pt-8">
                                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${isSuspended ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                                            <Power size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">帳號狀態管理</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                                {isSuspended
                                                    ? "此帳號目前處於停權狀態，無法接單。解除停權後將恢復所有功能。"
                                                    : "此帳號目前狀態正常。若進行停權，司機將無法登入與接單，且系統會保留紀錄。"
                                                }
                                            </p>

                                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">停權開關</span>
                                                    <span className="text-xs text-gray-500">{isSuspended ? "目前狀態：已停權" : "目前狀態：正常運作中"}</span>
                                                </div>
                                                <button
                                                    onClick={handleToggleSuspend}
                                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSuspended ? 'bg-red-500' : 'bg-gray-200'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isSuspended ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4 items-start">
                                    <ShieldCheck className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-900 mb-1">系統安全提示</h4>
                                        <p className="text-xs text-blue-700 leading-relaxed">
                                            所有的帳號狀態變更都會被系統記錄。若發現異常操作，請立即通知管理員。
                                            停權操作通常用於違規處理或司機主動申請暫停服務。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <RejectModal
                    onClose={() => setShowRejectModal(false)}
                    onConfirm={handleReject}
                    onRequestResubmit={handleRequestResubmit}
                />
            )}

            {/* Image Preview Modal */}
            {viewingImage && (
                <ImageModal
                    title={viewingImage}
                    onClose={() => setViewingImage(null)}
                />
            )}
        </div>
    );
}

function ImageModal({ title, onClose }: { title: string; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] backdrop-blur-sm p-4" onClick={onClose}>
            <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
                >
                    <X size={32} />
                </button>
                <div className="bg-white rounded-lg p-2 shadow-2xl">
                    {/* Placeholder for actual image */}
                    <div className="w-full h-[600px] bg-gray-100 rounded flex items-center justify-center">
                        <div className="text-center text-gray-400">
                            <FileText size={64} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">{title} 預覽</p>
                            <p className="text-sm">（此處為圖片預覽區域）</p>
                        </div>
                    </div>
                </div>
                <h3 className="text-white text-xl font-medium mt-4">{title}</h3>
            </div>
        </div>
    );
}

function RejectModal({ onClose, onConfirm, onRequestResubmit }: { onClose: () => void; onConfirm: (reasons: string[]) => void; onRequestResubmit: (reasons: string[]) => void }) {
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const documents = ["駕照", "行照", "保險", "良民證"];

    const toggleDoc = (doc: string) => {
        if (selectedDocs.includes(doc)) {
            setSelectedDocs(selectedDocs.filter(d => d !== doc));
        } else {
            setSelectedDocs([...selectedDocs, doc]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">審核未通過處理</h3>
                    <p className="text-sm text-gray-500 mt-1">請選擇需要補齊或重新上傳的證件</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        {documents.map(doc => (
                            <button
                                key={doc}
                                onClick={() => toggleDoc(doc)}
                                className={`flex items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${selectedDocs.includes(doc)
                                    ? "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500"
                                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                                    }`}
                            >
                                {selectedDocs.includes(doc) && <Check size={14} className="mr-2" />}
                                {doc}
                            </button>
                        ))}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">其他備註</label>
                        <textarea
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            rows={3}
                            placeholder="請輸入原因或補充說明..."
                        ></textarea>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={() => onRequestResubmit(selectedDocs)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors shadow-sm shadow-purple-200"
                    >
                        通知補件
                    </button>
                    <button
                        onClick={() => onConfirm(selectedDocs)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm shadow-red-200"
                    >
                        確認拒絕
                    </button>
                </div>
            </div>
        </div>
    );
}

function OrderDetailView({ order }: { order: any }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Section 1: Order Details */}
            <section>
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ClipboardList size={20} className="text-blue-600" />
                    訂單明細
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <DetailRow label="訂單編號" value={order.id} />
                    <DetailRow label="接案平台" value="馳航網站" />
                    <DetailRow label="乘客姓名" value="王小明" />
                    <DetailRow label="手機號碼" value="0912-345-678" />
                    <DetailRow label="電子信箱" value="xiaoming@example.com" />
                    <DetailRow label="接送司機" value="林志豪" />
                    <DetailRow label="服務類型" value={order.type} />
                    <DetailRow label="接送起點" value="台北市信義區信義路五段7號" fullWidth />
                    <DetailRow label="接送終點" value="桃園國際機場 第二航廈" fullWidth />
                    <DetailRow label="航班/船班" value="-" />
                    <DetailRow label="起飛時間" value="-" />
                    <DetailRow label="抵達時間" value="-" />
                    <DetailRow label="訂單成立時間" value="2023-01-01 09:00" />
                    <DetailRow label="接送日期" value="2023-01-01" />
                    <DetailRow label="接送時間" value="10:00" />
                </div>
            </section>

            <hr className="border-gray-100" />

            {/* Section 2: Payment Amount */}
            <section>
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign size={20} className="text-blue-600" />
                    付款金額
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <PriceRow label="基本服務" value={1200} />
                    <PriceRow label="車型加價" value={0} />
                    <PriceRow label="夜間加價" value={0} />
                    <PriceRow label="假期加價" value={0} />
                    <PriceRow label="安全座椅" value={0} />
                    <PriceRow label="舉牌加價" value={0} />
                    <PriceRow label="特定地區" value={0} />
                    <PriceRow label="跨區加價" value={0} />
                    <PriceRow label="加點加價" value={0} />
                    <PriceRow label="離峰優惠" value={0} />
                    <PriceRow label="優惠卷折抵" value={0} />
                    <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-100 mt-2">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">總金額</span>
                            <span className="text-2xl font-bold text-blue-600">NT$ 1,200</span>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-gray-100" />

            {/* Section 3: Ride Info */}
            <section>
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Car size={20} className="text-blue-600" />
                    乘車資訊
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <DetailRow label="乘客人數" value="3人" />
                    <DetailRow label="行李件數" value="2件" fullWidth />
                </div>
            </section>

            <hr className="border-gray-100" />

            {/* Section 4: Special Requests */}
            <section>
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase size={20} className="text-blue-600" />
                    特別需求
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <DetailRow label="安全座椅" value="-" fullWidth />
                    <DetailRow label="增高座墊" value="-" />
                    <DetailRow label="選擇車型" value="一般轎車" />
                    <DetailRow label="舉牌服務" value="-" />
                    <DetailRow label="備註" value="-" fullWidth />
                </div>
            </section>
        </div>
    );
}

function DetailRow({ label, value, fullWidth = false, isBadge = false, isEditing = false, onChange, extra }: { label: string; value: string; fullWidth?: boolean; isBadge?: boolean; isEditing?: boolean; onChange?: (val: string) => void; extra?: React.ReactNode }) {
    return (
        <div className={`${fullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'} flex flex-col gap-1`}>
            <span className="text-sm font-medium text-blue-900/60">{label}</span>
            {isEditing && onChange ? (
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white shadow-sm"
                />
            ) : (
                isBadge ? (
                    <div>
                        <DriverStatusBadge status={value as any} />
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-base font-medium text-gray-900">{value}</span>
                        {extra}
                    </div>
                )
            )}
        </div>
    );
}

function PriceRow({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-gray-900">NT$ {value}</span>
        </div>
    );
}

function ImagePreview({ label, onPreview }: { label: string; onPreview: () => void }) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <div
                onClick={onPreview}
                className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors group relative overflow-hidden"
            >
                <FileText className="text-gray-400 group-hover:scale-110 transition-transform duration-300" size={32} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 font-medium text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm transition-opacity">
                        點擊預覽
                    </span>
                </div>
            </div>
        </div>
    );
}



function AddDriverModal({ onClose, onAdd }: { onClose: () => void; onAdd: (driver: Driver) => void }) {
    const [formData, setFormData] = useState<Partial<Driver>>({
        name: "",
        phone: "",
        email: "",
        vehicle: "",
        plate: "",
        location: "",
        address: "",
        dob: "",
        bankAccount: "",
        account: "",
        nationalId: "",
        status: "審核中",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newDriver: Driver = {
            id: (Math.floor(Math.random() * 1000) + 1).toString(),
            name: formData.name || "",
            phone: formData.phone || "",
            email: formData.email || "",
            vehicle: formData.vehicle || "",
            plate: formData.plate || "",
            location: formData.location || "",
            rating: 0,
            joinDate: new Date().toISOString().split('T')[0],
            status: "審核中",
            totalOrders: 0,
            completionRate: "-",
            totalEarnings: 0,

            account: formData.account || "",
            nationalId: formData.nationalId || "",
            password: formData.phone || "",
            address: formData.address || "",
            dob: formData.dob || "",
            bankAccount: formData.bankAccount || "",
        };
        onAdd(newDriver);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-200">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                    <h3 className="text-xl font-bold text-gray-900">新增司機</h3>
                    <button onClick={onClose} className="p-2 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">基本資料</h4>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">姓名 <span className="text-red-500">*</span></label>
                                <input required name="name" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="請輸入真實姓名" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">電話 <span className="text-red-500">*</span></label>
                                <input required name="phone" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="09xx-xxx-xxx" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="example@email.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">出生日期</label>
                                <input type="date" name="dob" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-700">通訊地址</label>
                                <input name="address" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="請輸入完整地址" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">車輛與帳戶資訊</h4>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">車型</label>
                                <input name="vehicle" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="例如：Toyota Camry" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">車牌號碼</label>
                                <input name="plate" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="ABC-1234" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">帳號</label>
                                <input name="account" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="請設定帳號" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">身分證號 <span className="text-red-500">*</span></label>
                                <input required name="nationalId" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="請輸入身分證號" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">服務地區</label>
                                <input name="location" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="例如：台北市" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">銀行帳號</label>
                                <input name="bankAccount" onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="銀行代碼-帳號" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">證件上傳 (預覽)</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                                <FileText size={24} className="mb-2" />
                                <span className="text-sm">上傳駕照</span>
                            </div>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                                <FileText size={24} className="mb-2" />
                                <span className="text-sm">上傳行照</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium transition-colors shadow-sm">
                            取消
                        </button>
                        <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-200">
                            確認新增
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

