"use client";

import { useState } from "react";
import {
    MoreVertical, Mail, Phone, Calendar, Search, Filter, UserPlus,
    X, User, Clock, MapPin, DollarSign, Power, ShieldCheck,
    ChevronLeft, ChevronRight, FileText, Download, ClipboardList,
    Car, Briefcase, MoreHorizontal, Save, Edit, AlertTriangle, RefreshCcw
} from "lucide-react";
import { useSystemActivity } from "../context/SystemActivityContext";
import { read, utils } from "xlsx";

// Define the User type with expanded details
type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    joinDate: string;
    status: "Active" | "Suspended";
    dob: string;
    address: string;
    lineId: string;
    whatsapp: string;
    totalSpending: number;
    totalRides: number;

    level: string;
    nationalId: string;
    password?: string;
};

// Mock Data
const MOCK_USERS: User[] = [
    {
        id: "1001", name: "周杰倫", email: "zhoujielun0109@gmail.com", phone: "0908-112-792", joinDate: "2024-12-31", status: "Active",
        dob: "2000-01-09", address: "10617台北市大安區羅斯福路四段1號", lineId: "zhou0109", whatsapp: "0908-112-792",
        totalSpending: 120000, totalRides: 30, level: "C", nationalId: "A100000001", password: "0908-112-792"
    },
    {
        id: "1002", name: "蔡依林", email: "jolin@example.com", phone: "0912-345-678", joinDate: "2023-05-20", status: "Active",
        dob: "1980-09-15", address: "110台北市信義區信義路五段7號", lineId: "jolin_official", whatsapp: "0912-345-678",
        totalSpending: 85000, totalRides: 25, level: "B", nationalId: "F200000002", password: "0912-345-678"
    },
    {
        id: "1003", name: "林俊傑", email: "jjlin@example.com", phone: "0923-456-789", joinDate: "2023-08-10", status: "Suspended",
        dob: "1981-03-27", address: "104台北市中山區敬業三路20號", lineId: "jj_music", whatsapp: "0923-456-789",
        totalSpending: 45000, totalRides: 12, level: "A", nationalId: "H100000003", password: "0923-456-789"
    },
    {
        id: "1004", name: "張惠妹", email: "amei@example.com", phone: "0934-567-890", joinDate: "2023-11-05", status: "Active",
        dob: "1972-08-09", address: "950台東縣台東市博愛路1號", lineId: "amei_mit", whatsapp: "0934-567-890",
        totalSpending: 210000, totalRides: 55, level: "S", nationalId: "V200000004", password: "0934-567-890"
    },
    {
        id: "1005", name: "五月天阿信", email: "ashin@example.com", phone: "0956-789-012", joinDate: "2024-01-12", status: "Active",
        dob: "1975-12-06", address: "112台北市北投區光明路1號", lineId: "mayday_ashin", whatsapp: "0956-789-012",
        totalSpending: 67000, totalRides: 18, level: "B", nationalId: "A100000005", password: "0956-789-012"
    },
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    // Search States
    const [inputName, setInputName] = useState("");
    const [inputStatus, setInputStatus] = useState("");

    const [activeSearch, setActiveSearch] = useState({
        name: "",
        status: ""
    });
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const { addLog } = useSystemActivity();

    const handleImportClick = () => {
        document.getElementById("user-import-input")?.click();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const data = await file.arrayBuffer();
            const workbook = read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = utils.sheet_to_json(worksheet);

            const newUsers: User[] = jsonData.map((row: any, index: number) => ({
                id: row['ID'] || `IMP${Date.now()}${index}`,
                name: row['姓名'] || "Unknown",
                email: row['Email'] || "",
                phone: row['電話'] || "",
                joinDate: row['加入日期'] || new Date().toISOString().split('T')[0],
                status: (row['狀態'] === 'Suspended' || row['狀態'] === '停權') ? "Suspended" : "Active",
                dob: row['生日'] || "",
                address: row['地址'] || "",
                lineId: row['Line ID'] || "",
                whatsapp: row['WhatsApp'] || "",
                totalSpending: Number(row['累積消費']) || 0,
                totalRides: Number(row['搭乘次數']) || 0,
                level: row['等級'] || "C",
                nationalId: row['身分證字號'] || "",
                password: row['密碼'] || ""
            }));

            setUsers([...newUsers, ...users]);
            addLog(`成功匯入 ${newUsers.length} 位用戶`, "success");
        } catch (error) {
            console.error("Import error:", error);
            alert("匯入失敗，請確認檔案格式正確。");
        }

        // Reset input
        e.target.value = "";
    };

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleSearch = () => {
        setActiveSearch({
            name: inputName,
            status: inputStatus
        });
    };

    const filteredUsers = users.filter(user => {
        const nameMatch = user.name.toLowerCase().includes(activeSearch.name.toLowerCase());
        // Map "Active" to "正常" and "Suspended" to "停權" for searching if user types Chinese
        const statusTerm = activeSearch.status.trim();
        let statusMatch = true;

        if (statusTerm) {
            const statusMap: Record<string, string> = {
                "正常": "Active",
                "停權": "Suspended",
                "active": "Active",
                "suspended": "Suspended"
            };

            // If user types "正常" or "停權", map it to the English status
            const mappedStatus = statusMap[statusTerm] || statusTerm;

            // Check if the user status includes the search term (case insensitive)
            statusMatch = user.status.toLowerCase().includes(mappedStatus.toLowerCase()) ||
                (user.status === 'Active' && '正常'.includes(statusTerm)) ||
                (user.status === 'Suspended' && '停權'.includes(statusTerm));
        }

        return nameMatch && statusMatch;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleUpdateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        setSelectedUser(updatedUser);

        // Log status change if it happened
        const oldUser = users.find(u => u.id === updatedUser.id);
        if (oldUser && oldUser.status !== updatedUser.status) {
            addLog(`用戶 ${updatedUser.name} 狀態已更新為 ${updatedUser.status === 'Active' ? '啟用' : '停權'}`, updatedUser.status === 'Active' ? 'success' : 'warning');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">用戶管理</h1>
                    <p className="text-sm text-gray-500 mt-1">管理註冊用戶與權限。</p>
                </div>
                <div className="flex gap-3">
                    <input
                        type="file"
                        id="user-import-input"
                        className="hidden"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                    />
                    <button
                        onClick={handleImportClick}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
                    >
                        <FileText size={16} />
                        匯入用戶
                    </button>
                    <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
                        <Download size={16} />
                        匯出名單
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm shadow-blue-200">
                        <UserPlus size={16} />
                        新增用戶
                    </button>
                </div>
            </div>

            {/* Advanced Search */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">用戶姓名</label>
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
                        <label className="text-xs font-medium text-gray-500">用戶狀態</label>
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
                        <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">用戶姓名</th>
                            <th className="px-6 py-4">聯絡資訊</th>
                            <th className="px-6 py-4">加入時間</th>
                            <th className="px-6 py-4">累積消費</th>
                            <th className="px-6 py-4">狀態</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedUsers.map((user) => (
                            <tr
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                        </div>
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
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                    NT$ {user.totalSpending.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${user.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        {user.status === 'Active' ? '啟用中' : '已停權'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                    <span className="text-sm text-gray-500">顯示 {paginatedUsers.length} 筆，共 {filteredUsers.length} 筆資料</span>
                    {totalPages > 1 && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                上一頁
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                下一頁
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdate={handleUpdateUser}
                />
            )}

            {/* Report Download Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">匯出報表</h3>
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

function UserDetailModal({ user, onClose, onUpdate }: { user: User; onClose: () => void; onUpdate: (u: User) => void }) {
    const [activeTab, setActiveTab] = useState<"info" | "history" | "limits">("info");
    const [isSuspended, setIsSuspended] = useState(user.status === "Suspended");
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    // Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<User>(user);

    // Mock Pagination for History
    const [historyPage, setHistoryPage] = useState(1);
    const historyItemsPerPage = 10;
    const totalHistoryItems = 10; // Mock total items
    const totalHistoryPages = Math.ceil(totalHistoryItems / historyItemsPerPage);

    const menuItems = [
        { id: "info", label: "基本資料", icon: User },
        { id: "history", label: "叫車紀錄", icon: ClipboardList },
        { id: "limits", label: "帳號限制", icon: ShieldCheck },
    ];

    const handleToggleSuspend = () => {
        const newStatus = !isSuspended;
        setIsSuspended(newStatus);
        onUpdate({
            ...user,
            status: newStatus ? "Suspended" : "Active"
        });
    };

    const handleSave = () => {
        onUpdate(editForm);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm(user);
        setIsEditing(false);
    };

    const handleResetPassword = () => {
        const newPass = Math.floor(100000 + Math.random() * 900000).toString();
        if (confirm(`確定要將密碼重置為臨時密碼 "${newPass}" 嗎？\n此操作將立即生效。`)) {
            const updated = { ...user, password: newPass };
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
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 shadow-inner border-4 border-white">
                            <span className="text-3xl font-bold">{user.name[0]}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 text-center">{user.name}</h3>

                        <div className="mt-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {user.status === 'Active' ? '正常' : '已停權'}
                            </span>
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
                                    <button onClick={() => setSelectedOrder(null)} className="hover:bg-gray-100 p-1 rounded-full transition-colors mr-2">
                                        <ChevronLeft size={20} />
                                    </button>
                                    訂單詳情 #{selectedOrder.id}
                                </>
                            ) : (
                                activeTab === "history" ? "叫車紀錄" : menuItems.find(i => i.id === activeTab)?.label
                            )}
                        </h2>
                        <div className="flex gap-2">
                            {activeTab === 'info' && !selectedOrder && (
                                isEditing ? (
                                    <>
                                        <button onClick={handleCancel} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm text-sm">
                                            取消
                                        </button>
                                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm text-sm flex items-center gap-2">
                                            <Save size={16} />
                                            儲存
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm text-sm flex items-center gap-2">
                                        <Edit size={16} />
                                        編輯
                                    </button>
                                )
                            )}
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                        {activeTab === "info" && (
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="grid grid-cols-1 gap-y-6">


                                    <DetailRow
                                        label="身分證號"
                                        value={isEditing ? editForm.nationalId : user.nationalId}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditForm({ ...editForm, nationalId: val })}
                                    />
                                    <DetailRow
                                        label="密碼"
                                        value={isEditing ? (editForm.password || "") : (user.password || "********")}
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
                                    <DetailRow
                                        label="姓名"
                                        value={isEditing ? editForm.name : user.name}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditForm({ ...editForm, name: val })}
                                    />
                                    <DetailRow
                                        label="生日"
                                        value={isEditing ? editForm.dob : user.dob}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditForm({ ...editForm, dob: val })}
                                    />
                                    <DetailRow
                                        label="電話"
                                        value={isEditing ? editForm.phone : user.phone}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditForm({ ...editForm, phone: val })}
                                    />
                                    <DetailRow
                                        label="地址"
                                        value={isEditing ? editForm.address : user.address}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditForm({ ...editForm, address: val })}
                                    />
                                    <DetailRow
                                        label="Email"
                                        value={isEditing ? editForm.email : user.email}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditForm({ ...editForm, email: val })}
                                    />
                                    <DetailRow
                                        label="Line ID"
                                        value={isEditing ? editForm.lineId : user.lineId}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditForm({ ...editForm, lineId: val })}
                                    />
                                    <DetailRow
                                        label="WhatsApp"
                                        value={isEditing ? editForm.whatsapp : user.whatsapp}
                                        isEditing={isEditing}
                                        onChange={(val) => setEditForm({ ...editForm, whatsapp: val })}
                                    />
                                    <DetailRow label="註冊日期" value={`${user.joinDate} (可預設為當日日期或由系統填入)`} />
                                    <DetailRow label="會員狀態" value={user.status === 'Active' ? '正常' : '停權'} isBadge statusType={user.status} />
                                </div>
                                <hr className="border-gray-100 my-6" />
                                <div className="grid grid-cols-1 gap-y-6">
                                    <DetailRow label="累積消費" value={`NTD${user.totalSpending.toLocaleString()}`} />
                                    <DetailRow label="累積趟數" value={user.totalRides} />
                                    <DetailRow label="會員等級" value={user.level} />
                                </div>
                            </div>
                        )}

                        {activeTab === "history" && (
                            selectedOrder ? (
                                <OrderDetailView order={selectedOrder} userName={user.name} />
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                                                <tr>
                                                    <th className="px-6 py-4">訂單編號</th>
                                                    <th className="px-6 py-4">訂單類型</th>
                                                    <th className="px-6 py-4">接送日期</th>
                                                    <th className="px-6 py-4">訂單狀態</th>
                                                    <th className="px-6 py-4">接送地點</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {[...Array(totalHistoryItems)].map((_, i) => (
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
                                    {/* Pagination */}
                                    <div className="flex justify-center items-center gap-2 pt-2 pb-4">
                                        <button
                                            disabled
                                            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white shadow-md shadow-blue-200"
                                        >
                                            1
                                        </button>
                                        <button
                                            disabled
                                            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
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
                                                    ? "此帳號目前處於停權狀態，無法使用叫車服務。解除停權後將恢復所有功能。"
                                                    : "此帳號目前狀態正常。若進行停權，用戶將無法登入與叫車，且系統會保留紀錄。"
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
                                            停權操作通常用於違規處理或用戶主動申請暫停服務。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value, isBadge = false, statusType, fullWidth = false, isEditing = false, onChange, extra }: { label: string; value: string | number; isBadge?: boolean; statusType?: string; fullWidth?: boolean; isEditing?: boolean; onChange?: (val: string) => void; extra?: React.ReactNode }) {
    return (
        <div className={`flex flex-col gap-1 ${fullWidth ? 'col-span-1 md:col-span-2' : ''}`}>
            <span className="text-sm font-medium text-gray-500">{label}</span>
            {isEditing && onChange ? (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                />
            ) : (
                <div className="flex items-center gap-2 min-h-[40px]">
                    {isBadge ? (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusType === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            {value}
                        </span>
                    ) : (
                        <span className="text-base font-medium text-gray-900">{value}</span>
                    )}
                    {extra}
                </div>
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

function OrderDetailView({ order, userName }: { order: any; userName: string }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Section 1: Order Details */}
            <section>
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    訂單明細
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <DetailRow label="訂單編號" value={order.id} />
                    <DetailRow label="接案平台" value="馳航網站" />
                    <DetailRow label="乘客姓名" value={userName} />
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

function DriverStatusBadge({ status }: { status: string }) {
    const styles = {
        "正常": "bg-emerald-50 text-emerald-700 border-emerald-200",
        "審核中": "bg-blue-50 text-blue-700 border-blue-200",
        "停權": "bg-red-50 text-red-700 border-red-200",
        "審核不通過": "bg-gray-100 text-gray-500 border-gray-200",
    };
    const style = styles[status as keyof typeof styles] || "bg-gray-50 text-gray-700 border-gray-200";

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
            {status}
        </span>
    );
}
