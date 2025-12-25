
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '../../components/PageHeader';
import { FileButton } from '../../components/FileButton';
import { User, FileText, ChevronRight, LogOut, CheckCircle, Smartphone, Globe, ShieldCheck, ClipboardList, AlertCircle, X, Camera, AlertTriangle, Upload } from "lucide-react";
import { supabase } from '../../lib/supabase';

export default function DriverDashboard() {
    const router = useRouter();
    const [driver, setDriver] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

    // Alert States based on driver status
    const [statusAlert, setStatusAlert] = useState<"none" | "pending" | "denied" | "docs_error">("none");
    const [greeting, setGreeting] = useState("早安");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 11) setGreeting("早安");
        else if (hour >= 11 && hour < 18) setGreeting("午安");
        else setGreeting("晚安");
    }, []);

    const refreshDriver = () => {
        const idno = sessionStorage.getItem("driverIdno");
        if (!idno) {
            router.push("/login");
            return;
        }
        const driverDataStr = localStorage.getItem("driver_" + idno);
        if (driverDataStr) {
            const d = JSON.parse(driverDataStr);
            setDriver(d);

            if (d.status === 'pending') setStatusAlert("pending");
            else if (d.status === 'denied') setStatusAlert("denied");
            else setStatusAlert("none");
        }
    };

    useEffect(() => {
        refreshDriver();
    }, [router]);

    // Fetch Orders from Supabase
    useEffect(() => {
        if (!driver?.name) return;

        let channel: any;

        const fetchOrders = async () => {
            // 1. Get Driver UUID
            // We use simple name matching for this demo bridge
            const { data: driverData, error: driverError } = await supabase
                .from('drivers')
                .select('id')
                .eq('name', driver.name)
                .single();

            // If driver doesn't exist in Supabase yet (e.g. login allowed via mock headers), we might fail.
            // But the seed script ensures '王小明' exists.
            if (driverError || !driverData) {
                console.error("Could not find Supabase driver ID for", driver.name);
                return;
            }

            const driverId = driverData.id;

            // 2. Fetch Orders using UUID
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('driver_id', driverId)
                .in('status', ['confirmed', 'pickedUp', 'completed', 'assigned'])
                .order('pickup_time', { ascending: true });

            if (error) {
                console.error('Error fetching driver orders:', error);
            } else {
                const mappedOrders = (data || []).map((row: any) => ({
                    id: row.id,
                    status: row.status,
                    price: row.price,
                    from: row.pickup_address,
                    to: row.dropoff_address,
                    date: row.pickup_time ? new Date(row.pickup_time).toLocaleDateString() : 'N/A',
                    time: row.pickup_time ? new Date(row.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
                    detail: {
                        contact: { name: row.contact_name, phone: row.contact_phone },
                        pax: { adult: row.passenger_count || 1, child: 0 },
                        vehicle: { plate: "RAB-1234" }
                    },
                    driverName: driver.name
                }));
                setOrders(mappedOrders);
            }

            // 3. Setup Subscription with correct UUID
            if (!channel) {
                channel = supabase
                    .channel('driver_orders')
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `driver_id=eq.${driverId}` }, () => {
                        fetchOrders();
                    })
                    .subscribe();
            }
        };

        fetchOrders();

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [driver]);

    const handleLogout = () => {
        sessionStorage.clear();
        router.push("/login");
    };

    const handleSaveProfile = (updatedDriver: any) => {
        const idno = sessionStorage.getItem("driverIdno");
        if (idno) {
            localStorage.setItem("driver_" + idno, JSON.stringify(updatedDriver));
            refreshDriver();
            setIsEditModalOpen(false);
            alert('已儲存資料（檔案將送審）。');
        }
    };

    const handleSubmitDocs = (updatedDocs: any) => {
        const idno = sessionStorage.getItem("driverIdno");
        if (idno && driver) {
            const updatedDriver = {
                ...driver,
                status: 'pending', // Re-submit triggers pending
                docs: { ...driver.docs, ...updatedDocs }
            };
            localStorage.setItem("driver_" + idno, JSON.stringify(updatedDriver));
            refreshDriver();
            setIsDocsModalOpen(false);

            // Toast simulation
            const toast = document.createElement('div');
            toast.textContent = '文件已送出，待審中';
            Object.assign(toast.style, {
                position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                background: '#00B881', color: '#fff', padding: '12px 20px',
                borderRadius: '50px', fontWeight: '900', fontSize: '15px',
                zIndex: '9999', opacity: '0', transition: 'opacity .3s'
            });
            document.body.appendChild(toast);
            setTimeout(() => toast.style.opacity = '1', 50);
            setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400) }, 2000);
        }
    };

    // Find active order
    const ongoingOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'pickedUp');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-20 relative overflow-hidden font-sans">
            {/* Immersive Branding Header (Curve Bottom) */}
            <div className="absolute top-0 left-0 right-0 h-[280px] bg-blue-600 rounded-b-[40px] shadow-lg z-0"></div>

            <div className="w-full max-w-[390px] relative z-20 h-full flex flex-col">
                <PageHeader title="司機帳戶" variant="ghost" showBack={false} />

                {/* Welcome Section */}
                {driver && (
                    <div className="px-6 pb-6 pt-1 text-white animate-in fade-in slide-in-from-bottom-3 duration-700">
                        <h2 className="text-3xl font-bold tracking-tight">{greeting}，{driver.name}</h2>
                        <p className="text-blue-100 font-medium mt-1 text-base">今天也要行車平安！</p>
                    </div>
                )}

                <div className="px-4 space-y-5 pb-10 flex-1 overflow-y-auto no-scrollbar">



                    {/* 1. Alerts Section */}
                    {statusAlert === 'pending' && (
                        <div className="bg-red-50 rounded-xl p-6 text-center shadow-sm border border-red-100 animate-in zoom-in-95 duration-500">
                            <div className="text-red-800 font-black text-lg mb-1">司機權限</div>
                            <div className="text-red-600 font-bold">審查中，無法使用該權限。</div>
                        </div>
                    )}

                    {(statusAlert === 'docs_error' || statusAlert === 'denied') && (
                        <div className="bg-white rounded-xl p-5 shadow-lg shadow-red-50/50 border border-red-100 border-l-4 border-l-red-500 animate-in slide-in-from-bottom-5 duration-500 flex flex-col gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-red-50 rounded-full text-red-600 shrink-0">
                                    <AlertTriangle size={24} strokeWidth={2.5} />
                                </div>
                                <div className="flex-1 pt-0.5">
                                    <h3 className="text-gray-900 font-bold text-lg leading-tight mb-1">需補交文件</h3>
                                    <p className="text-red-600/90 text-sm font-medium leading-relaxed">您的文件審核未通過，請依指示重新上傳以啟用帳號。</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsDocsModalOpen(true)}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-red-200 flex items-center justify-center gap-2"
                            >
                                <Upload size={18} strokeWidth={2.5} />
                                立即補件
                            </button>
                        </div>
                    )}

                    {/* 2. Profile Card */}
                    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 text-lg">個人資料</h3>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">ID: {driver?.idno || driver?.account || "—"}</span>
                        </div>
                        <div className="space-y-3.5">
                            <KV label="姓名" value={driver?.name || "—"} />
                            <KV label="電話" value={driver?.phone || "—"} />
                            <KV label="Email" value={driver?.email || "—"} />
                            <KV label="地址" value={driver?.addr || "—"} />
                            <KV label="駕照到期" value={driver?.licenseExpire || driver?.docs?.license?.expire || "—"} />
                            <KV label="保險到期" value={driver?.insuranceExpire || driver?.docs?.insurance?.expire || "—"} />
                        </div>
                        <div className="mt-6">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full bg-gray-50 text-blue-600 border border-blue-100 py-3 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors"
                            >
                                編輯資料
                            </button>
                        </div>
                    </div>

                    {/* 3. Assigned Orders - Only show if verified (statusAlert === 'none') */}
                    {statusAlert === 'none' && (
                        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 text-lg">指派訂單</h3>
                                {ongoingOrders.length > 0 && <span className="flex h-2.5 w-2.5 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                                </span>}
                            </div>

                            {ongoingOrders.length > 0 ? (
                                <div className="space-y-3">
                                    {ongoingOrders.map(order => (
                                        <div
                                            key={order.id}
                                            onClick={() => router.push(`/order/${order.id}`)}
                                            className="bg-gray-50 border border-gray-100 rounded-xl p-4 grid grid-cols-[1fr_auto] gap-y-1 gap-x-3 cursor-pointer hover:bg-blue-50/50 hover:border-blue-100 transition-all group"
                                        >
                                            <div className="font-black text-gray-900 text-lg group-hover:text-blue-700 transition-colors">{order.id.substring(0, 8)}...</div>
                                            <div className="text-right font-black text-gray-900 text-lg">${order.price?.toLocaleString()}</div>

                                            <div className="text-sm font-bold text-gray-500 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                {order.from}
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                                                    進行中
                                                </span>
                                            </div>
                                            <div className="text-xs font-bold text-gray-400 col-span-2 mt-2 pt-2 border-t border-gray-200/50 flex justify-between">
                                                <span>預約時間</span>
                                                <span>{order.date} {order.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Sample Order for Demo Purposes */}
                                    <div
                                        onClick={() => {
                                            const demoOrder = {
                                                id: "CH20251208999",
                                                status: "confirmed",
                                                price: 1200,
                                                from: "台北市信義區信義路五段7號 (台北101)",
                                                to: "桃園國際機場 (TTE)",
                                                date: "2025/12/08",
                                                time: "14:00",
                                                flow: "idle",
                                                detail: {
                                                    pax: { adult: 2, child: 0 },
                                                    luggage: { s20: 0, s25: 1, s28: 1 },
                                                    contact: { name: "王小明", phone: "0912-345-678" }
                                                }
                                            };
                                            const current = JSON.parse(localStorage.getItem("orders") || "[]");
                                            // Remove old active demo or old formats if exists to reset state
                                            const clean = current.filter((o: any) =>
                                                o.id !== "CH20251208999" &&
                                                !o.id.startsWith("HIST-")
                                            );
                                            clean.push(demoOrder);
                                            localStorage.setItem("orders", JSON.stringify(clean));

                                            router.push("/order/CH20251208999");
                                        }}
                                        className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-4 grid grid-cols-[1fr_auto] gap-y-1 gap-x-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group opacity-70 hover:opacity-100"
                                    >
                                        <div className="font-black text-gray-400 text-lg group-hover:text-blue-600 transition-colors">範例訂單 #CH2025...</div>
                                        <div className="text-right font-black text-gray-400 text-lg">$1,200</div>

                                        <div className="text-sm font-bold text-gray-400 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                            台北市信義區...
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-400 rounded-lg text-xs font-bold">
                                                範例
                                            </span>
                                        </div>
                                        <div className="text-xs font-bold text-gray-300 col-span-2 mt-2 pt-2 border-t border-gray-100 flex justify-between">
                                            <span>預約時間</span>
                                            <span>2025/12/08 14:00</span>
                                        </div>
                                    </div>
                                    <p className="text-center text-xs text-gray-400 mt-2 font-bold">（目前尚無指派訂單，以上為範例）</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 4. Actions */}
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        <button
                            onClick={() => router.push("/history")}
                            className="w-full bg-white text-gray-900 py-4 rounded-xl font-bold text-lg shadow-xl border border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-between px-6 group"
                        >
                            <span>歷史帳單</span>
                            <span className="text-gray-300 group-hover:text-blue-600 transition-colors">→</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full py-4 text-center text-gray-500 font-bold text-base hover:text-gray-700 transition-colors"
                        >
                            登出帳戶
                        </button>
                    </div>

                    <div className="h-4"></div>

                </div>

                {/* Modals */}
                {isEditModalOpen && driver && (
                    <EditProfileModal
                        driver={driver}
                        onClose={() => setIsEditModalOpen(false)}
                        onSave={handleSaveProfile}
                    />
                )}

                {isDocsModalOpen && driver && (
                    <ResubmitDocsModal
                        driver={driver}
                        onClose={() => setIsDocsModalOpen(false)}
                        onSubmit={handleSubmitDocs}
                    />
                )}
            </div>
        </div>
    );
}

function KV({ label, value }: { label: string, value: string }) {
    return (
        <div className="grid grid-cols-[100px_1fr] gap-2 text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0">
            <span className="font-bold text-gray-900">{label}</span>
            <span className="text-gray-600 break-all">{value}</span>
        </div>
    );
}

// --- Modals ---

function EditProfileModal({ driver, onClose, onSave }: any) {
    const [formData, setFormData] = useState({
        name: driver.name || '',
        phone: driver.phone || '',
        email: driver.email || '',
        addr: driver.addr || '',
        line: driver.line || '',
        birth: driver.birth || '',
        licenseExpire: driver.docs?.license?.expire || driver.licenseExpire || '',
        insuranceExpire: driver.docs?.insurance?.expire || driver.insuranceExpire || '',
        pwd_cur: '',
        pwd_new: '',
        pwd_new2: ''
    });

    const [files, setFiles] = useState<any>({});

    const handleFile = (field: string, name: string) => {
        setFiles((prev: any) => ({ ...prev, [field]: name }));
    }

    const handleSave = () => {
        if (formData.pwd_new) {
            if (formData.pwd_cur !== (driver.password || driver.phone)) {
                alert("目前密碼錯誤");
                return;
            }
            if (formData.pwd_new !== formData.pwd_new2) {
                alert("兩次新密碼不一致");
                return;
            }
            if (formData.pwd_new.length < 6) {
                alert("密碼至少 6 碼");
                return;
            }
        }

        const updated = {
            ...driver,
            ...formData,
            password: formData.pwd_new || driver.password, // Update password if set
            docs: {
                ...driver.docs,
                license: { ...driver.docs?.license, expire: formData.licenseExpire },
                insurance: { ...driver.docs?.insurance, expire: formData.insuranceExpire },
                ...files
            }
        };
        onSave(updated);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-[390px] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-lg font-black text-gray-900">編輯司機資料</h2>
                    <button onClick={onClose}><X className="text-gray-400" /></button>
                </div>

                <div className="p-5 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-3">
                        <Input label="帳戶（身分證，不可更改）" value={driver.idno || driver.account} disabled />
                        <Input label="姓名" value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} />
                        <Input label="生日" type="date" value={formData.birth} onChange={(v: string) => setFormData({ ...formData, birth: v })} />
                        <Input label="電話" type="tel" value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} />
                        <Input label="Email" type="email" value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })} />
                        <Input label="Line ID" value={formData.line} onChange={(v: string) => setFormData({ ...formData, line: v })} />
                        <Input label="地址" value={formData.addr} onChange={(v: string) => setFormData({ ...formData, addr: v })} />
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* License */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-900">駕照（正面／反面）</label>
                        <div className="grid grid-cols-2 gap-3">
                            <FileUploader label="正面" field="licenseFront" onFile={handleFile} />
                            <FileUploader label="反面" field="licenseBack" onFile={handleFile} />
                        </div>
                        <Input label="到期日" type="date" value={formData.licenseExpire} onChange={(v: string) => setFormData({ ...formData, licenseExpire: v })} />
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Insurance */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-900">保險（正面／反面）</label>
                        <div className="grid grid-cols-2 gap-3">
                            <FileUploader label="正面" field="insFront" onFile={handleFile} />
                            <FileUploader label="反面" field="insBack" onFile={handleFile} />
                        </div>
                        <Input label="到期日" type="date" value={formData.insuranceExpire} onChange={(v: string) => setFormData({ ...formData, insuranceExpire: v })} />
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Password */}
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                        <Input label="目前密碼" type="password" placeholder="若未改過，預設為手機號" value={formData.pwd_cur} onChange={(v: string) => setFormData({ ...formData, pwd_cur: v })} />
                        <Input label="新密碼" type="password" placeholder="至少 6 碼" value={formData.pwd_new} onChange={(v: string) => setFormData({ ...formData, pwd_new: v })} />
                        <Input label="確認新密碼" type="password" placeholder="再次輸入新密碼" value={formData.pwd_new2} onChange={(v: string) => setFormData({ ...formData, pwd_new2: v })} />
                        <div className="flex justify-end">
                            <button onClick={() => alert("請點擊下方儲存資料以生效")} className="text-blue-600 text-sm font-bold">修改密碼需一併儲存</button>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-10">
                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 text-white py-3 rounded-full font-bold text-base shadow-sm hover:bg-blue-700 transition-colors"
                    >
                        儲存資料
                    </button>
                    <p className="text-xs text-right text-gray-400 mt-2">檔案更新將送審（約 1–2 天）。</p>
                </div>
            </div>
        </div>
    )
}

function ResubmitDocsModal({ driver, onClose, onSubmit }: any) {
    const [files, setFiles] = useState<any>({});
    const [dates, setDates] = useState({
        licenseExpire: driver.docs?.license?.expire || '',
        insuranceExpire: driver.docs?.insurance?.expire || ''
    });

    const handleFile = (field: string, name: string) => {
        setFiles((prev: any) => ({ ...prev, [field]: name }));
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-[390px] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-lg font-black text-gray-900">補交文件</h2>
                    <button onClick={onClose}><X className="text-gray-400" /></button>
                </div>

                <div className="p-5 space-y-6">
                    {/* License */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-900">駕照上傳</label>
                        <div className="grid grid-cols-2 gap-3">
                            <FileUploader label="正面" field="licenseFront" onFile={handleFile} />
                            <FileUploader label="反面" field="licenseBack" onFile={handleFile} />
                        </div>
                        <Input label="到期日" type="date" value={dates.licenseExpire} onChange={(v: string) => setDates({ ...dates, licenseExpire: v })} />
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Vehicle */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-900">行照上傳</label>
                        <FileUploader label="上傳行照" field="vehicle" onFile={handleFile} />
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Insurance */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-900">保險上傳</label>
                        <div className="grid grid-cols-2 gap-3">
                            <FileUploader label="正面" field="insFront" onFile={handleFile} />
                            <FileUploader label="反面" field="insBack" onFile={handleFile} />
                        </div>
                        <Input label="到期日" type="date" value={dates.insuranceExpire} onChange={(v: string) => setDates({ ...dates, insuranceExpire: v })} />
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Police & Photo */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-900">其他文件</label>
                        <div className="grid grid-cols-1 gap-3">
                            <FileUploader label="良民證" field="police" onFile={handleFile} />
                            <FileUploader label="個人照 (自拍)" field="idPhoto" onFile={handleFile} />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-10">
                    <button
                        onClick={() => onSubmit({ ...files, license: { expire: dates.licenseExpire }, insurance: { expire: dates.insuranceExpire } })}
                        className="w-full bg-blue-600 text-white py-3 rounded-full font-bold text-base shadow-sm hover:bg-blue-700 transition-colors"
                    >
                        送出文件
                    </button>
                    <p className="text-xs text-right text-gray-400 mt-2">文件更新將送審（約 1–2 天）。</p>
                </div>
            </div>
        </div>
    )
}

function Input({ label, type = "text", value, onChange, disabled, placeholder }: any) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                disabled={disabled}
                placeholder={placeholder}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all disabled:bg-gray-100 disabled:text-gray-400"
            />
        </div>
    )
}

// Wrapper for the external FileButton to adapt to simple onFile callback
function FileUploader({ label, field, onFile }: any) {
    const [fileName, setFileName] = useState("");

    const handleChange = (e: any) => {
        if (e.target.files?.[0]) {
            const name = e.target.files[0].name;
            setFileName(name);
            onFile(field, name);
        }
    };

    // We use the imported FileButton UI but standard html input for simplicity here to match usage in Modals
    // Or we could try to instantiate the component. 
    // Actually the easiest way given the import issue is just to copy the UI logic here since it's small.
    // The previous FileButton component has its own inputRef etc. 
    // We will just invoke it.

    return (
        <FileButton
            label={label}
            fileName={fileName}
            onChange={handleChange}
        />
    )
}
