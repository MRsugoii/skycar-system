"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "../../../components/PageHeader";
import { Phone, Clock, MapPin, Navigation, FileText } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams(); // params.id
    const orderId = params?.id;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isDocsOpen, setIsDocsOpen] = useState(false);

    const fetchOrder = async () => {
        if (!orderId) return;
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (data) {
            // Map Supabase data to local shape
            const mapStatusToFlow = (s: string) => {
                if (s === 'completed') return 'completed';
                if (s === 'pickedUp') return 'picked'; // Map 'pickedUp' db status to 'picked' flow
                if (s === 'en_route') return 'enRoute';
                return 'idle';
            };

            const mapped = {
                id: data.id,
                orderId: data.id,
                status: data.status,
                flow: mapStatusToFlow(data.status),
                date: new Date(data.pickup_time).toLocaleDateString(),
                time: new Date(data.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                from: data.pickup_address,
                to: data.dropoff_address,
                price: data.price,
                type: data.vehicle_type,
                note: data.note,
                detail: {
                    contact: { name: data.contact_name, phone: data.contact_phone },
                    pax: { adult: data.passenger_count },
                    luggage: { count: data.luggage_count }
                },
                audit: {
                    // StartTrip -> en_route
                    enRouteAt: data.status === 'en_route' || data.status === 'pickedUp' || data.status === 'completed' ? data.updated_at : null,
                    // PickedUp -> pickedUp
                    pickedAt: data.status === 'pickedUp' || data.status === 'completed' ? data.updated_at : null,
                    // Complete -> completed
                    completedAt: data.status === 'completed' ? data.updated_at : null
                }
            };
            setOrder(mapped);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrder();

        const channel = supabase
            .channel(`order_${orderId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, () => {
                fetchOrder();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId]);

    const updateFlow = async (newFlow: string) => {
        let newStatus = 'confirmed';
        if (newFlow === 'enRoute') newStatus = 'en_route';
        if (newFlow === 'picked') newStatus = 'pickedUp';
        if (newFlow === 'completed') newStatus = 'completed';

        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', orderId);

        if (error) {
            console.error(error);
            alert('更新失敗');
        } else {
            if (newFlow === 'completed') {
                alert('訂單已完成！');
                router.push('/dashboard');
            }
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
                            <div className="h-px bg-gray-100 my-4"></div>
                            <KV label="乘客姓名" value={d.contact?.name || "—"} />
                            <KV label="乘客電話" value={d.contact?.phone || "—"} icon={<Phone size={14} className="text-gray-400 mt-0.5" />} />
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
                            disabled={flow !== 'idle'}
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
                    <div className="mt-3">
                        <ActionButton
                            label="【 汽車出租單 】"
                            onClick={() => setIsDocsOpen(true)}
                            variant="indigo"
                            icon={<FileText size={18} className="text-indigo-100" />}
                        />
                    </div>
                    <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">請依序點擊按鈕以更新行程狀態</p>
                </div>
            )}

            {/* Rental Contract Modal */}
            {isDocsOpen && (
                <RentalContractModal
                    order={order}
                    onClose={() => setIsDocsOpen(false)}
                />
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

function ActionButton({ label, onClick, disabled, variant, icon }: any) {
    let bgClass = "bg-gray-100 text-gray-400 cursor-not-allowed";

    if (!disabled) {
        if (variant === 'blue') bgClass = "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-blue-200 shadow-md transform transition-all";
        if (variant === 'red') bgClass = "bg-red-500 text-white hover:bg-red-600 active:scale-[0.98] shadow-red-200 shadow-md transform transition-all";
        if (variant === 'indigo') bgClass = "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-200 shadow-md transform transition-all";
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all focus:outline-none flex items-center justify-center gap-2 ${bgClass}`}
        >
            {icon && icon}
            {label}
        </button>
    )
}

function RentalContractModal({ order, onClose }: any) {
    // Current date for contract
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();

    // Calculate end time (assuming similar day dropoff or based on duration)
    // For demo, just use same day + 1 hour as placeholder if no end time
    const startDate = order.date;
    const startTime = order.time;
    // Mock end
    const endDate = order.date;
    const endTime = "18:00";

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-lg shadow-2xl relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 p-2 bg-gray-100/80 hover:bg-gray-200 rounded-full z-10 print:hidden"
                >
                    <Navigation size={20} className="rotate-45" />
                </button>

                {/* Contract Content - Mimicking the Image Structure */}
                <div className="p-8 text-gray-900 font-serif text-sm leading-relaxed border-[3px] border-double border-gray-400 m-2">

                    {/* Header */}
                    <div className="text-center space-y-2 mb-6">
                        <div className="flex justify-center border-b border-black pb-2 items-baseline">
                            <span className="text-xl font-bold mr-2">公司名稱：</span>
                            <span className="text-xl border-b border-black px-4 min-w-[200px]">馳航科技股份有限公司</span>
                        </div>
                        <div className="flex justify-between items-end relative">
                            <h1 className="text-3xl font-bold tracking-[1em] mx-auto">汽車出租單</h1>
                            <div className="absolute right-0 top-0 text-red-600 text-xl font-bold tracking-widest">
                                {order.orderId ? order.orderId.substring(2) : "000451"}
                            </div>
                        </div>
                        <div className="text-right mt-1">
                            中華民國 {y - 1911} 年 {m} 月 {d} 日
                        </div>
                    </div>

                    {/* Table Grid */}
                    <div className="border-2 border-black">
                        {/* Row 1: Renter Info */}
                        <div className="grid grid-cols-[80px_1fr_40px_1fr] border-b border-black divide-x divide-black">
                            <div className="p-2 flex items-center justify-center font-bold bg-gray-50">租車人</div>
                            <div className="p-2 font-medium">{order.detail?.contact?.name}</div>
                            <div className="p-2 flex items-center justify-center font-bold bg-gray-50 text-center leading-tight text-xs">電話</div>
                            <div className="p-2 font-medium">{order.detail?.contact?.phone}</div>
                        </div>

                        {/* Row 2: Driver & Address */}
                        <div className="grid grid-cols-[30px_100px_1fr_40px_1fr] border-b border-black divide-x divide-black">
                            <div className="p-1 flex items-center justify-center font-bold bg-gray-50 writing-vertical text-center text-xs row-span-2">駕駛資料</div>
                            <div className="p-2 text-xs border-b border-black">租車人自駕姓名</div>
                            <div className="p-2 border-b border-black bg-gray-100 text-center text-xs text-gray-400">（附駕免填）</div>
                            <div className="p-2 flex items-center justify-center font-bold bg-gray-50 text-center leading-tight text-xs row-span-2">住址</div>
                            <div className="p-2 row-span-2 text-xs break-all flex items-center">
                                {/* Pickup/Dropoff could be used as address placeholder */}
                                {order.from}
                            </div>
                        </div>
                        <div className="grid grid-cols-[30px_100px_1fr_40px_1fr] border-b border-black divide-x divide-black -mt-[1px]">
                            <div className="col-span-1 border-none"></div> {/* Spacer for rowspan */}
                            <div className="p-2 text-xs">代僱司機姓名</div>
                            <div className="p-2 font-medium">{order.driverName || "在此簽名"}</div>
                            <div className="col-span-1 border-none"></div> {/* Spacer for rowspan */}
                            <div className="col-span-1 border-none"></div> {/* Spacer for rowspan */}
                        </div>

                        {/* Row 3: Vehicle Info */}
                        <div className="grid grid-cols-[80px_1fr_80px_1fr_80px_1fr] border-b border-black divide-x divide-black">
                            <div className="p-2 flex items-center justify-center font-bold bg-gray-50">車輛資料</div>
                            <div className="p-2 text-xs">
                                <span className="block text-gray-500 text-[10px]">牌照號碼</span>
                                {order.detail?.vehicle?.plate || "RAB-1234"}
                            </div>
                            <div className="p-2 text-xs">
                                <span className="block text-gray-500 text-[10px]">引擎號碼</span>
                                -
                            </div>
                            <div className="p-2 text-xs">
                                <span className="block text-gray-500 text-[10px]">廠牌型式</span>
                                {order.carType || "Toyota Camry"}
                            </div>
                        </div>

                        {/* Row 4: Date Range */}
                        <div className="border-b border-black p-2 flex items-center gap-2 bg-yellow-50/30">
                            <span className="font-bold">租賃期間</span>
                            <span className="mx-2">自民國 {y - 1911} 年 {m} 月 {d} 日 {startTime?.split(':')[0]} 時 {startTime?.split(':')[1]} 分起</span>
                            <span className="mx-2">至民國 {y - 1911} 年 {m} 月 {d} 日 {endTime.split(':')[0]} 時 {endTime.split(':')[1]} 分止</span>
                        </div>

                        {/* Row 5: Rent & Fuel */}
                        <div className="grid grid-cols-[40px_1fr_60px_1fr] border-b border-black divide-x divide-black">
                            <div className="p-2 flex items-center justify-center font-bold bg-gray-50 text-xs text-center">租金</div>
                            <div className="p-2 font-bold text-lg flex items-center">
                                NT$ {(order.price || 0).toLocaleString()}
                            </div>
                            <div className="p-2 flex flex-col justify-center font-bold bg-gray-50 text-xs text-center">
                                <span>里程</span><span>表數</span>
                            </div>
                            <div className="p-2 text-xs">
                                <div className="border-b border-black border-dashed mb-1 pb-1 flex justify-between">
                                    <span>起：</span><span>___________</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>還：</span><span>___________</span>
                                </div>
                            </div>
                        </div>

                        {/* Row 6: Accessories (Simplified) */}
                        <div className="grid grid-cols-[40px_1fr] border-b border-black divide-x divide-black">
                            <div className="p-2 flex items-center justify-center font-bold bg-gray-50 text-xs text-center">車況<br />配件</div>
                            <div className="p-2 text-[10px] grid grid-cols-4 gap-1">
                                <span>☑ 懸掛號牌兩面</span>
                                <span>☑ 行車執照乙枚</span>
                                <span>☑ 強制汽車責任保險證乙枚</span>
                                <span>☐ 故障標誌</span>
                                <span>☐ 備胎工具</span>
                                <span>☑ 音響設備</span>
                            </div>
                        </div>

                        {/* Row 7: Rules */}
                        <div className="grid grid-cols-[40px_1fr] border-b border-black divide-x divide-black relative">
                            <div className="p-2 flex items-center justify-center font-bold bg-gray-50 text-xs text-center">規定<br />事項</div>
                            <div className="p-2 text-[10px] leading-tight space-y-1">
                                <p>(一) 租賃期間車輛行駛中途發生故障時，如因使用不當或應注意未注意等人為因素，由租車人負責。若為自然因素，由出租人負責。</p>
                                <p>(二) 租賃期間駕駛車輛違反法令規定或發生失竊、毀損、肇事、罰單等責任，概由租車人負責。</p>
                                <p>(三) 租車人不得利用所租車輛從事營業或供作違法行為之工具。</p>
                                <p>(四) 租車人應隨身攜帶出租單以備查驗。</p>
                                <p>(五) 其他未盡規定事項，以租車時由雙方另行議定。</p>

                                <div className="absolute right-0 bottom-4 w-40 opacity-90 pointer-events-none rotate-[-5deg] mix-blend-multiply">
                                    <img src="/stamp.png" alt="Company Stamp" className="w-full h-auto" />
                                </div>
                            </div>
                        </div>

                        {/* Footer Signatures */}
                        <div className="grid grid-cols-[40px_1fr_40px_1fr] divide-x divide-black">
                            <div className="p-4 flex items-center justify-center font-bold bg-gray-50 text-center writing-vertical text-xs">出租車</div>
                            <div className="p-2 space-y-8">
                                <div className="text-xs">出租人簽名：<span className="font-script text-lg ml-2">柯忠儒</span></div>
                                <div className="text-xs">租車人簽名：</div>
                            </div>
                            <div className="p-4 flex items-center justify-center font-bold bg-gray-50 text-center writing-vertical text-xs">還車</div>
                            <div className="p-2 space-y-8">
                                <div className="text-xs">出租人簽名：</div>
                                <div className="text-xs">租車人簽名：</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print Action */}
                <div className="p-4 bg-gray-50 text-center print:hidden rounded-b-lg border-t border-gray-100">
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto inline-flex"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 14h12v8H6z"></path></svg>
                        列印 / 下載 PDF
                    </button>
                    <p className="text-xs text-gray-400 mt-2">請使用瀏覽器列印功能，並選擇「儲存為 PDF」或直接列印。</p>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .fixed.inset-0, .fixed.inset-0 * {
                        visibility: visible;
                    }
                    .fixed.inset-0 {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        background: white;
                        display: block;
                        padding: 0;
                        overflow: visible;
                    }
                    button {
                        display: none !important;
                    }
                }
                .writing-vertical {
                    writing-mode: vertical-rl;
                    text-orientation: upright;
                }
                .font-script {
                    font-family: 'Brush Script MT', cursive;
                }
            `}</style>
        </div>
    );
}
