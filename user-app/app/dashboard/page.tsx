'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronDown, Flag, Edit2, LogOut, X, Phone, User, Ticket, Clock, History, Calendar, MapPin, Plane, Users, Briefcase, Navigation } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface OrderDetail {
    pickup?: string;
    dropoff?: string;
    flight?: string;
    passengers?: number;
    items?: { name: string; qty: number; unitPrice: number }[];
    discount?: number;
    pay?: string;
    note?: string;
    seats?: { rear: number; front: number; booster: number };
    luggage?: { s20: number; s25: number; s28: number };
    signage?: boolean;
    signageText?: string;
    carName?: string;
    car?: string; // fallback
}

interface Order {
    orderId: string;
    status: 'ing' | 'done' | 'refund' | 'notapproved' | 'cancelled' | 'refund_pending';
    type: string;
    date: string;
    total: number;
    ride?: any; // Fallback for old structure if needed
    detail: OrderDetail;
}

interface Coupon {
    code: string;
    title: string;
    terms: string;
    expireAt: number;
    used: boolean;
}

interface UserProfile {
    account: string;
    password?: string;
    displayName: string;
    birthday?: string;
    phone: string;
    address?: string;
    email?: string;
    lineId?: string;
    whatsappId?: string;
    totalSpent?: number;
    totalTrips?: number;
    level?: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);

    // Navigation State
    const [currentView, setCurrentView] = useState<'main' | 'coupons' | 'ongoing' | 'history'>('main');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [greeting, setGreeting] = useState("早安");

    // Edit form states...
    const [editForm, setEditForm] = useState<UserProfile | null>(null);
    const [pwdCurrent, setPwdCurrent] = useState('');
    const [pwdNew, setPwdNew] = useState('');
    const [pwdNew2, setPwdNew2] = useState('');

    // History Filters
    const [filterYear, setFilterYear] = useState('2025');
    const [filterMonth, setFilterMonth] = useState('12');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 11) setGreeting("早安");
        else if (hour >= 11 && hour < 18) setGreeting("午安");
        else setGreeting("晚安");
    }, []);

    useEffect(() => {
        // 1. Check Login
        const acc = sessionStorage.getItem('memberAccount');
        const sbUserId = sessionStorage.getItem('supabaseUserId');

        if (!acc) {
            router.replace('/login');
            return;
        }

        // 2. Load User Data
        const uStr = localStorage.getItem(`user_${acc}`);
        if (uStr) {
            setUser(JSON.parse(uStr));
            setEditForm(JSON.parse(uStr));
        } else {
            setUser({ account: acc, displayName: acc, phone: '' });
        }

        // 3. Load Orders (Hybrid: Local + Supabase)
        const loadOrders = async () => {
            let list: Order[] = [];

            // A. Fetch from Supabase if linked
            if (sbUserId) {
                const { data: sbOrders, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', sbUserId)
                    .order('created_at', { ascending: false });

                if (sbOrders) {
                    const mapped: Order[] = sbOrders.map((o: any) => {
                        // Map Status
                        let st: any = 'ing';
                        if (o.status === 'completed') st = 'done';
                        else if (o.status === 'cancelled') st = 'cancelled';
                        else if (o.status === 'refund_pending') st = 'refund_pending';
                        else st = 'ing'; // confirmed, assigned, pickedUp

                        return {
                            orderId: o.id, // Use UUID or substring? UUID is long. maybe formatting later.
                            status: st,
                            type: o.vehicle_type || '接送',
                            date: new Date(o.pickup_time).toLocaleString('zh-TW', { hour12: false }).replace(/\//g, '-').slice(0, 16),
                            total: Number(o.price),
                            detail: {
                                pickup: o.pickup_address,
                                dropoff: o.dropoff_address,
                                carName: o.vehicle_type,
                                passengers: o.passenger_count,
                                note: o.note,
                                pay: '現金',
                                flight: o.flight_number,
                                luggage: o.luggage_count ? { s20: 0, s25: o.luggage_count, s28: 0 } : undefined
                            }
                        };
                    });
                    list = mapped;
                }
            } else {
                // Fallback to local storage if no Supabase link
                const oStr = localStorage.getItem(`orders_${acc}`);
                list = oStr ? JSON.parse(oStr) : [];
            }

            // If list is empty, falling back to demo logic for visual population if strictly needed?
            // The prompt asks for "Demo orders visible".
            // If Supabase has the 5 orders (which it does for Demo User), list won't be empty.
            setOrders(list);

            // Realtime subscription for User
            if (sbUserId) {
                supabase
                    .channel('user_orders')
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${sbUserId}` }, () => {
                        loadOrders(); // re-fetch
                    })
                    .subscribe();
            }
        };

        loadOrders();

        // 4. Load Coupons
        const cStr = localStorage.getItem(`coupons_${acc}`);
        if (cStr) {
            setCoupons(JSON.parse(cStr));
        } else {
            const now = Date.now();
            const day = 86400000;
            const demos = [
                { code: 'WELCOME200', title: '新戶折抵 200', terms: '單筆滿 2000 可用', expireAt: now + 30 * day, used: false },
                { code: 'VIP500', title: '會員回饋 500', terms: '單筆滿 3500 可用', expireAt: now + 10 * day, used: false }
            ];
            localStorage.setItem(`coupons_${acc}`, JSON.stringify(demos));
            setCoupons(demos);
        }
    }, [router]);

    const handleLogout = () => {
        sessionStorage.clear();
        alert('您已登出');
        router.push('/login');
    };

    const handleCopyCoupon = (code: string) => {
        navigator.clipboard.writeText(code).then(() => alert(`已複製：${code}`));
    };

    const handleUpdateProfile = () => {
        if (!editForm || !user) return;
        const phoneClean = editForm.phone.replace(/\D/g, '');
        if (phoneClean && !/^09\d{8}$/.test(phoneClean)) { alert('手機格式須為 09xxxxxxxx'); return; }
        let finalPwd = user.password;
        if (pwdCurrent || pwdNew || pwdNew2) {
            if (!pwdCurrent || !pwdNew || !pwdNew2) { alert('請完整填寫密碼欄位'); return; }
            if (user.password !== pwdCurrent) { alert('目前密碼不正確'); return; }
            if (pwdNew.length < 6) { alert('新密碼至少 6 碼'); return; }
            if (pwdNew !== pwdNew2) { alert('兩次輸入的新密碼不一致'); return; }
            finalPwd = pwdNew;
        }
        const updatedUser = { ...editForm, phone: phoneClean, password: finalPwd };
        localStorage.setItem(`user_${user.account}`, JSON.stringify(updatedUser));
        setUser(updatedUser);
        setShowEditModal(false);
        setPwdCurrent(''); setPwdNew(''); setPwdNew2('');
        alert('會員資料已更新');
    };

    // Derived state
    const ongoingOrders = orders.filter(o => o.status === 'ing');
    const historyOrders = orders.filter(o => o.status !== 'ing');
    const activeCoupons = coupons.filter(c => !c.used && c.expireAt > Date.now());

    // Determine Level
    const totalSpent = Number(user?.totalSpent || 0);
    let level = 'C';
    if (totalSpent >= 100000) level = 'A';
    else if (totalSpent >= 10000) level = 'B';

    // Sub-View Header Component
    const SubHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
        <div className="bg-blue-600 px-4 pt-6 pb-6 text-white rounded-b-[30px] shadow-md relative mb-6">
            <button onClick={onBack} className="absolute left-6 top-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition">
                <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-center mt-1">{title}</h2>
        </div>
    );

    // MAIN VIEW
    if (currentView === 'main') {
        return (
            <div className="min-h-screen bg-gray-50 pb-24 relative overflow-hidden">
                {/* Top Header Background */}
                <div className="bg-blue-600 h-[320px] rounded-b-[40px] shadow-lg pt-8 px-6 text-white relative z-0">
                    <div className="flex justify-center mb-6">
                        <h1 className="text-xl font-bold tracking-wide">會員帳戶</h1>
                    </div>
                    <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
                        <h2 className="text-3xl font-bold tracking-tight">{greeting}，{user?.displayName || '會員'}</h2>
                        <p className="text-blue-100 font-medium mt-1 text-base">今天想去哪裡呢？</p>
                    </div>
                </div>

                <div className="relative z-10 px-4 -mt-32 max-w-[420px] mx-auto space-y-6">

                    {/* Profile Card */}
                    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3 border-4 border-white shadow-sm">
                                <User size={40} />
                            </div>
                            <div className="text-xl font-bold text-gray-900">{user?.displayName || '載入中...'}</div>
                            <div className="text-sm text-gray-500 font-bold mt-1">
                                會員等級 <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold align-middle ml-1">{level}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
                                <div className="text-xs text-gray-400 font-bold mb-1">累積消費</div>
                                <div className="text-base font-bold text-gray-800">NT$ {totalSpent.toLocaleString()}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
                                <div className="text-xs text-gray-400 font-bold mb-1">累積趟數</div>
                                <div className="text-base font-bold text-gray-800">{user?.totalTrips || 0} <span className="text-xs text-gray-500">趟</span></div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowEditModal(true)}
                            className="w-full py-2.5 rounded-xl border border-blue-200 text-blue-600 font-bold hover:bg-blue-50 transition flex items-center justify-center gap-2 text-sm"
                        >
                            <Edit2 size={16} /> 編輯會員資料
                        </button>
                    </div>

                    {/* Coupons Section (Inline) */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 pl-1">
                            <Ticket size={18} className="text-blue-600" />
                            可用優惠券
                        </h2>
                        <div className="flex flex-col gap-3">
                            {activeCoupons.length > 0 ? activeCoupons.map(c => (
                                <div key={c.code} className="bg-white p-4 rounded-xl shadow-sm border border-dashed border-blue-300 relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-lg font-bold text-blue-600 tracking-wide">{c.code}</div>
                                            <div className="font-medium text-gray-700">{c.title}</div>
                                        </div>
                                        <button
                                            onClick={() => handleCopyCoupon(c.code)}
                                            className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full hover:bg-blue-100 transition"
                                        >
                                            複製
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                                        <span>{c.terms}</span>
                                        <span>有效至 {new Date(c.expireAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-gray-400 py-4 text-sm bg-white rounded-xl border border-gray-100">目前沒有可用的優惠券</div>
                            )}
                        </div>
                    </div>

                    {/* Ongoing Orders Section (Inline) */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 pl-1">
                            <Clock size={18} className="text-blue-600" />
                            進行中的訂單
                        </h2>
                        <div className="space-y-3">
                            {ongoingOrders.length > 0 ? ongoingOrders.slice(0, 1).map(o => (
                                <div key={o.orderId} onClick={() => setSelectedOrder(o)} className="bg-white p-5 rounded-xl shadow-md border border-blue-100 cursor-pointer hover:shadow-lg transition">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-gray-900">{o.orderId.substring(0, 8)}...</span>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">進行中</span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Calendar size={16} className="text-blue-500" /> {o.date}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <MapPin size={16} className="text-blue-500" /> {o.type}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-gray-50 pt-3">
                                        <span className="text-xs text-gray-400 font-medium">查看詳情</span>
                                        <span className="font-bold text-lg text-blue-600">NT$ {o.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-gray-400 py-6 bg-white rounded-xl border border-gray-100 text-sm">目前沒有進行中的訂單</div>
                            )}

                            {/* Emergency Button (Inline) */}
                            <button
                                onClick={() => window.location.href = 'tel:0800000000'}
                                className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-md shadow-red-200 transition flex items-center justify-center gap-2"
                            >
                                <Phone size={18} /> 緊急聯絡客服
                            </button>
                        </div>
                    </div>

                    {/* History Orders (Nav Link) */}
                    <div>
                        <MenuRow
                            label="歷史訂單"
                            onClick={() => setCurrentView('history')}
                        />
                    </div>

                    {/* Logout Button (Bottom) */}
                    <div className="pt-4 pb-4">
                        <button
                            onClick={handleLogout}
                            className="w-full text-gray-500 font-bold text-base hover:text-gray-700 transition"
                        >
                            登出帳戶
                        </button>
                    </div>

                    {/* FAB for Booking */}
                    <div className="fixed bottom-6 left-0 right-0 px-6 pointer-events-none z-20">
                        <div className="max-w-[420px] mx-auto pointer-events-auto">
                            <button
                                onClick={() => router.push('/booking')}
                                className="w-full py-3 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Flag size={20} /> 預約服務
                            </button>
                        </div>
                    </div>

                </div>

                {/* --- Edit Modal --- */}
                {showEditModal && <EditProfileModal user={user} editForm={editForm} setEditForm={setEditForm} onClose={() => setShowEditModal(false)} onSave={handleUpdateProfile} pwdCurrent={pwdCurrent} setPwdCurrent={setPwdCurrent} pwdNew={pwdNew} setPwdNew={setPwdNew} pwdNew2={pwdNew2} setPwdNew2={setPwdNew2} />}

                {/* --- Order Detail Modal (Global) --- */}
                {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} router={router} />}
            </div>
        );
    }

    // HISTORY ORDERS VIEW
    if (currentView === 'history') {
        // Derived Logic for History Filters
        const years = ['2025', '2024']; // Simplified for demo

        const filteredHistory = historyOrders.filter(o => {
            if (!o.date) return false; // Safety check
            // Parse date "YYYY-MM-DD HH:MM" or "YYYY/MM/DD"
            const dateStr = o.date.replace(/-/g, '/');
            const [y, m] = dateStr.split(' ')[0].split('/');

            // Note: date format from Supabase mapping is "2025-12-25 10:00"
            // So split by - or / work.
            if (filterYear && y !== filterYear) return false;
            // if (filterMonth && m !== filterMonth) return false; // Remove month filter strictness for demo visibility if needed

            return true;
        });

        return (
            <div className="min-h-screen bg-gray-50 pb-10">
                <HistorySubHeader title="歷史訂單" onBack={() => setCurrentView('main')} />
                <div className="px-4 max-w-[420px] mx-auto space-y-3">

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 mb-4">
                        <div className="flex gap-3 justify-center mb-6">
                            <div className="relative">
                                <select
                                    value={filterYear} onChange={e => setFilterYear(e.target.value)}
                                    className="appearance-none bg-white border border-blue-200 text-blue-900 font-bold rounded-full pl-6 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                >
                                    {years.map(y => <option key={y} value={y}>{y} 年</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={16} />
                            </div>
                            <div className="relative">
                                <select
                                    value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
                                    className="appearance-none bg-white border border-blue-200 text-blue-900 font-bold rounded-full pl-6 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                        <option key={m} value={m.toString().padStart(2, '0')}>{m} 月</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>

                    {filteredHistory.length > 0 ? filteredHistory.map(o => (
                        <div key={o.orderId} onClick={() => setSelectedOrder(o)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-black text-gray-900 text-lg tracking-tight">{o.orderId.substring(0, 8)}...</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${o.status === 'done' ? 'bg-green-50 text-green-700 border-green-200' :
                                        o.status === 'cancelled' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                                            o.status === 'refund_pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                        {o.status === 'done' ? '已完成' :
                                            o.status === 'cancelled' ? '已取消' :
                                                o.status === 'refund_pending' ? '退款申請中' :
                                                    o.type}
                                    </span>
                                </div>
                                <div className="text-gray-500 text-xs font-bold flex justify-between pr-4 mt-2">
                                    <span>時間</span>
                                    <span className="text-gray-900">{o.date ? o.date : '-'}</span>
                                </div>
                                <div className="text-gray-500 text-xs font-bold flex justify-between pr-4 mt-1">
                                    <span>金額</span>
                                    <span className="text-blue-600 font-bold text-base">
                                        ${o.total.toLocaleString()} 元
                                    </span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-gray-400 py-10 bg-white rounded-xl border border-gray-100">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
                                <span className="text-3xl grayscale opacity-50">📝</span>
                            </div>
                            <p className="font-bold text-sm">此區間無相關訂單</p>
                        </div>
                    )}
                </div>
                {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} router={router} />}
            </div>
        );
    }

    return null; // Should not reach
}

// --- Components ---

function MenuRow({ label, onClick, badge, highlight }: { label: string, onClick: () => void, badge?: number, highlight?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`w-full bg-white p-5 rounded-2xl shadow-sm border flex justify-between items-center transition active:scale-[0.98] ${highlight ? 'border-blue-200 shadow-blue-100' : 'border-gray-100'
                }`}
        >
            <span className="font-bold text-gray-800 text-lg">{label}</span>
            <div className="flex items-center gap-3">
                {badge !== undefined && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {badge}
                    </span>
                )}
                <div className="text-gray-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </div>
            </div>
        </button>
    );
}

function OrderDetailModal({ order, onClose, router }: { order: Order, onClose: () => void, router: any }) {
    // Helper to format KV rows like Driver App
    const KV = ({ label, value, icon, highlight }: any) => (
        <div className="grid grid-cols-[90px_1fr] gap-2 text-sm items-start mb-3 last:mb-0">
            <span className="font-bold text-gray-500 flex items-center gap-1.5">
                {icon}
                {label}
            </span>
            <span className={`font-medium ${highlight ? 'text-blue-600 font-bold' : 'text-gray-900'} break-words leading-relaxed`}>{value}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in">
            <div className="bg-white w-full max-w-[420px] h-[85vh] sm:h-auto sm:max-h-[85vh] sm:rounded-2xl rounded-t-2xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 duration-300">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h3 className="text-lg font-bold text-gray-800">訂單詳情</h3>
                    <button onClick={onClose}><X className="text-gray-400" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Header Row similar to Driver App */}
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 p-2.5 rounded-xl">
                                <Clock size={20} />
                            </span>
                            <div>
                                <div className="font-black text-lg text-gray-900">{order.orderId.substring(0, 8)}...</div>
                                <div className="text-xs text-gray-500 font-bold">{order.date}</div>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.status === 'ing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            order.status === 'done' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>
                            {order.status === 'ing' ? '進行中' : order.status === 'done' ? '已完成' : '已取消'}
                        </span>
                    </div>

                    <div className="space-y-1 pt-2">
                        <KV label="服務類型" value={order.type} />
                    </div>

                    <div className="h-px bg-gray-100 my-2"></div>

                    <div className="space-y-1">
                        <KV label="車型" value={order.detail.carName || "—"} />
                        <KV label="上車地點" value={order.detail.pickup} icon={<MapPin size={16} className="text-gray-400 mt-0.5" />} />
                        <KV label="下車地點" value={order.detail.dropoff} icon={<Navigation size={16} className="text-gray-400 mt-0.5" />} /> {/* Using Note icon as requested */}
                        <KV label="航班/船班" value={order.detail.flight || "—"} />
                        <KV label="乘客人數" value={`${order.detail.passengers || 0} 人`} />
                        <KV label="兒童座椅" value={order.detail.seats ? `後${order.detail.seats.rear || 0} / 前${order.detail.seats.front || 0} / 增${order.detail.seats.booster || 0}` : '—'} />
                        <KV label="行李件數" value={order.detail.luggage ? `20"(${order.detail.luggage.s20}), 25"(${order.detail.luggage.s25}), 28"(${order.detail.luggage.s28})` : '—'} />
                        <KV label="舉牌服務" value={order.detail.signage ? `需要 (${order.detail.signageText || ''})` : '不需要'} />
                        <KV label="備註" value={order.detail.note || "—"} />
                    </div>

                    <div className="h-px bg-gray-100 my-2"></div>

                    <div className="space-y-1">
                        <KV label="總金額" value={`NT$ ${order.total.toLocaleString()}`} highlight />
                        <KV label="付款方式" value={order.detail.pay || "—"} />
                    </div>

                    {order.status === 'ing' && (
                        <div className="pt-4">
                            <button
                                onClick={() => router.push(`/refund/${order.orderId}`)}
                                className="w-full py-3.5 border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition flex items-center justify-center gap-2"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                申請退款 / 取消訂單
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-2">若是因為行程變更，請直接聯繫客服。</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EditProfileModal({ user, editForm, setEditForm, onClose, onSave, pwdCurrent, setPwdCurrent, pwdNew, setPwdNew, pwdNew2, setPwdNew2 }: any) {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in">
            <div className="bg-white w-full max-w-[420px] h-[90vh] sm:h-auto sm:max-h-[90vh] sm:rounded-2xl rounded-t-2xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-300">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h3 className="text-lg font-bold text-gray-800">編輯會員資料</h3>
                    <button onClick={onClose}><X className="text-gray-400" /></button>
                </div>

                <div className="p-5 flex-1 overflow-y-auto space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">帳戶 (不可更改)</label>
                        <input value={user.account} disabled className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500" />
                    </div>
                    <InputGroup label="姓名" value={editForm?.displayName || ''} onChange={v => setEditForm((prev: UserProfile | null) => prev ? { ...prev, displayName: v } : null)} />
                    <InputGroup label="生日" value={editForm?.birthday || ''} onChange={v => setEditForm((prev: UserProfile | null) => prev ? { ...prev, birthday: v } : null)} type="date" />
                    <InputGroup label="電話" value={editForm?.phone || ''} onChange={v => setEditForm((prev: UserProfile | null) => prev ? { ...prev, phone: v } : null)} placeholder="09xxxxxxxx" />
                    <InputGroup label="Email" value={editForm?.email || ''} onChange={v => setEditForm((prev: UserProfile | null) => prev ? { ...prev, email: v } : null)} type="email" />
                    <InputGroup label="Line ID" value={editForm?.lineId || ''} onChange={v => setEditForm((prev: UserProfile | null) => prev ? { ...prev, lineId: v } : null)} />
                    <InputGroup label="WhatsApp" value={editForm?.whatsappId || ''} onChange={v => setEditForm((prev: UserProfile | null) => prev ? { ...prev, whatsappId: v } : null)} />
                    <InputGroup label="地址" value={editForm?.address || ''} onChange={v => setEditForm((prev: UserProfile | null) => prev ? { ...prev, address: v } : null)} />

                    <div className="h-px bg-gray-100 my-2"></div>
                    <h4 className="font-bold text-gray-800">變更密碼 (選填)</h4>

                    <InputGroup label="目前密碼" value={pwdCurrent} onChange={setPwdCurrent} type="password" placeholder="若要更改請先輸入舊密碼" />
                    <InputGroup label="新密碼" value={pwdNew} onChange={setPwdNew} type="password" placeholder="至少 6 碼" />
                    <InputGroup label="確認新密碼" value={pwdNew2} onChange={setPwdNew2} type="password" />

                    <div className="pt-4 pb-10">
                        <button onClick={onSave} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition">儲存變更</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="text-gray-400">{icon}</div>
            <div className="text-sm font-bold text-gray-500 w-20">{label}</div>
            <div className="text-sm font-medium text-gray-900 flex-1">{value}</div>
        </div>
    );
}

function InputGroup({ label, value, onChange, type = "text", placeholder }: { label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500">{label}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition font-medium text-gray-900"
            />
        </div>
    );
}

function HistorySubHeader({ title, onBack }: { title: string, onBack: () => void }) {
    return (
        <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-100 sticky top-0 z-10 transition-all">
            <button
                onClick={onBack}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition"
            >
                <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
    );
}
