"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "../../../components/PageHeader";
import { Phone, Clock, MapPin, Navigation } from "lucide-react";

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams(); // params.id
    const orderId = params?.id;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch
        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const found = allOrders.find((o: any) => o.id === orderId);

        if (found) {
            // --- Self-Healing Logic for Demo ---
            // If state is inconsistent (e.g., completed but no timestamps), reset to idle.
            const hasAudit = found.audit && (found.audit.enRouteAt || found.audit.pickedAt || found.audit.completedAt);
            if (!hasAudit && (found.status === 'completed' || found.flow === 'completed')) {
                found.flow = 'idle';
                found.status = 'confirmed';
                found.audit = {};
            }

            // Ensure flow exists
            if (!found.flow) found.flow = found.status === 'completed' ? 'completed' : 'idle';
            if (!found.audit) found.audit = {};

            setOrder(found);
        }
        setLoading(false);
    }, [orderId]);

    const updateFlow = (newFlow: string) => {
        const now = new Date().toISOString();
        const updated = { ...order, flow: newFlow };
        if (!updated.audit) updated.audit = {};

        // Update timestamps & status based on flow
        if (newFlow === 'enRoute') {
            updated.status = 'confirmed';
            updated.audit.enRouteAt = now;
        }
        if (newFlow === 'picked') {
            updated.status = 'pickedUp';
            updated.audit.pickedAt = now;
        }
        if (newFlow === 'completed') {
            updated.status = 'completed';
            updated.audit.completedAt = now;
        }

        setOrder(updated);

        // Sync to localStorage
        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const idx = allOrders.findIndex((o: any) => o.id === orderId);
        if (idx >= 0) {
            allOrders[idx] = updated;
            localStorage.setItem("orders", JSON.stringify(allOrders));
        }

        if (newFlow === 'completed') {
            // Stay on page to show filled timeline, maybe alert
            alert('訂單已完成！');
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">載入中...</div>;
    if (!order) return <div className="p-10 text-center text-gray-500">訂單不存在</div>;

    // Derived States
    const flow = order.flow || 'idle';
    const d = order.detail || {};
    const pax = d.pax || {};
    const lug = d.luggage || {};
    const cs = d.childSeat || {};
    const bs = d.boardSign || {};

    const statusText = flow === 'completed' ? '已完成' : '進行中';
    const flowTextMap: any = { idle: '尚未開始', enRoute: '前往接客', picked: '已接到客戶', completed: '訂單已完成' };
    const flowText = flowTextMap[flow] || '—';

    // Helpers
    const paxStr = d.headcount ?? (pax.adult != null ? `${pax.adult}大 ${pax.child || 0}小` : `${order.pax || 0} 人`);
    const lugStr = (lug.s20 != null || lug.s25 != null || lug.s28 != null)
        ? `20"(${lug.s20 || 0}), 25"(${lug.s25 || 0}), 28"(${lug.s28 || 0})`
        : (order.luggage ? `${order.luggage} 件` : '—');
    const csStr = (cs.rear != null || cs.front != null || cs.booster != null)
        ? `後${cs.rear || 0} / 前${cs.front || 0} / 增${cs.booster || 0}`
        : '—';

    // Time Format Helper
    const formatTime = (iso: string) => iso ? new Date(iso).toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '—';

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans max-w-[420px] mx-auto relative overflow-hidden flex flex-col">

            {/* Top Background */}
            <div className="absolute top-0 left-0 right-0 h-[220px] bg-blue-600 rounded-b-[40px] shadow-lg z-0"></div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <PageHeader title="訂單詳情" variant="ghost" />

                <div className="px-4 pb-40"> {/* pb-40 ensures space for footer */}

                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Header Row */}
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                                    <Clock size={20} />
                                </span>
                                <div>
                                    <div className="font-black text-lg text-gray-900">{order.orderId || order.id}</div>
                                    <div className="text-xs text-gray-500 font-bold">{order.date} {order.time}</div>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${flow === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                {statusText}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <KV label="目前狀態" value={flowText} highlight />
                            <KV label="服務類型" value={order.type || (order.flight ? '接機' : '市區接送')} />
                        </div>
                        <div className="h-px bg-gray-100 my-4"></div>

                        <div className="space-y-3">
                            <KV label="車型" value={d.vehicle || order.carType || "一般轎車"} />
                            <KV label="上車地點" value={d.pickup || order.from} icon={<MapPin size={14} className="text-gray-400 mt-0.5" />} />
                            <KV label="下車地點" value={d.dropoff || order.to} icon={<Navigation size={14} className="text-gray-400 mt-0.5" />} />
                            <KV label="航班/船班" value={d.flight || order.flight || "—"} />
                            <KV label="乘客人數" value={paxStr} />
                            <KV label="兒童座椅" value={csStr} />
                            <KV label="行李件數" value={lugStr} />
                            <KV label="舉牌服務" value={bs.need ? `需要 (${bs.text || ''})` : '不需要'} />
                            <KV label="備註" value={order.note || "—"} />
                        </div>
                        <div className="h-px bg-gray-100 my-4"></div>

                        <div className="space-y-3">
                            <KV label="應收金額" value={`$${(order.total || order.price || 0).toLocaleString()}`} highlight />
                            <KV label="付款方式" value={d.pay || "現金"} />
                        </div>

                        {/* Trip Log Card - Integrated (Hide for Completed/History Orders) */}
                        {flow !== 'completed' && order.status !== 'completed' && (
                            <div className="bg-gray-50 rounded-xl p-4 mt-6 space-y-3 border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">行程記錄</h4>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-gray-600">開始行程</span>
                                    <span className={`font-mono font-medium ${order.audit?.enRouteAt ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {formatTime(order.audit?.enRouteAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-gray-600">接到客戶</span>
                                    <span className={`font-mono font-medium ${order.audit?.pickedAt ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {formatTime(order.audit?.pickedAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-gray-600">完成訂單</span>
                                    <span className={`font-mono font-medium ${order.audit?.completedAt ? 'text-green-600' : 'text-gray-400'}`}>
                                        {formatTime(order.audit?.completedAt)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Actions - Only show if NOT completed */}
            {flow !== 'completed' && order.status !== 'completed' && (
                <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-100 p-4 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)] max-w-[420px] mx-auto">
                    <div className="grid grid-cols-2 gap-3">
                        <ActionButton
                            label="開始行程"
                            onClick={() => { if (confirm("確定開始行程？")) updateFlow('enRoute'); }}
                            variant="blue"
                        />
                        <ActionButton
                            label="接到客人"
                            onClick={() => updateFlow('picked')}
                            disabled={flow !== 'enRoute'}
                            variant="blue"
                        />
                        <ActionButton
                            label="完成訂單"
                            onClick={() => { if (confirm("確認完成本訂單？")) updateFlow('completed'); }}
                            disabled={flow !== 'picked'}
                            variant="blue"
                        />
                        <ActionButton
                            label="異常回報"
                            onClick={() => window.location.href = 'tel:0912345678'}
                            variant="red"
                        />
                    </div>
                    <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">請依序點擊按鈕以更新行程狀態</p>
                </div>
            )}

        </div>
    );
}

function KV({ label, value, highlight, icon }: any) {
    return (
        <div className="grid grid-cols-[90px_1fr] gap-2 text-sm items-start">
            <span className="font-bold text-gray-500 flex items-center gap-1.5">
                {icon}
                {label}
            </span>
            <span className={`font-medium ${highlight ? 'text-blue-600 font-bold' : 'text-gray-900'} break-words leading-relaxed`}>{value}</span>
        </div>
    );
}

function ActionButton({ label, onClick, disabled, variant }: any) {
    let bgClass = "bg-gray-100 text-gray-400 cursor-not-allowed";

    if (!disabled) {
        if (variant === 'blue') bgClass = "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-blue-200 shadow-md transform transition-all";
        if (variant === 'red') bgClass = "bg-red-500 text-white hover:bg-red-600 active:scale-[0.98] shadow-red-200 shadow-md transform transition-all";
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all focus:outline-none ${bgClass}`}
        >
            {label}
        </button>
    )
}
