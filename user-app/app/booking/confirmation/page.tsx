"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle2, AlertTriangle, ShieldCheck, Car } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BookingConfirmationPage() {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCalculating, setIsCalculating] = useState(true);

    // Data from Session
    const [basicInfo, setBasicInfo] = useState<any>(null);
    const [rideInfo, setRideInfo] = useState<any>(null);
    const [vehicle, setVehicle] = useState<any>(null);

    // User Input State
    // User Input State
    const [contactName, setContactName] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactType, setContactType] = useState("mobile"); // mobile | line | whatsapp
    const [contactEmail, setContactEmail] = useState("");

    // ... (rest of the component)

    const handleSubmit = () => {
        if (!contactName || !contactPhone || !contactEmail) {
            alert("請填寫完整聯絡資訊");
            return;
        }
        if (!term1 || !term2) {
            alert("請同意服務條款");
            return;
        }

        sessionStorage.setItem('booking_contact_info', JSON.stringify({
            name: contactName,
            phone: contactPhone,
            type: contactType,
            email: contactEmail
        }));
        sessionStorage.setItem('booking_price_info', JSON.stringify(prices));

        router.push('/booking/payment');
    };

    // ... (render part)

    <div className="space-y-3">
        <input
            type="text"
            placeholder="姓名"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full p-4 border border-gray-100 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <div className="flex gap-2">
            <select
                value={contactType}
                onChange={(e) => setContactType(e.target.value)}
                className="w-1/3 p-4 border border-gray-100 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none text-center"
                style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.5rem center",
                    backgroundSize: "1.25em 1.25em"
                }}
            >
                <option value="mobile">手機</option>
                <option value="line">LINE</option>
                <option value="whatsapp">WhatsApp</option>
            </select>
            <input
                type="tel"
                placeholder={contactType === 'mobile' ? "手機號碼 (09...)" : "請輸入 ID 或號碼"}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-2/3 p-4 border border-gray-100 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
        </div>
        <input
            type="email"
            placeholder="Email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full p-4 border border-gray-100 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
    </div>
                </div >

        {/* 3. Order Summary */ }
        < div className = "bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4" >
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">行程摘要</h2>
                    </div>

                    <div className="divide-y divide-gray-50">
                        <SummaryRow label="服務車型" value={vehicle?.name} icon={<Car size={14} />} />
                        <SummaryRow label="預約時間" value={`${basicInfo?.flightInfo?.date || basicInfo?.pickupTime?.date} ${basicInfo?.pickupTime?.time || basicInfo?.flightInfo?.time}`} />
                        <SummaryRow label="出發地點" value={isPickup ? basicInfo?.flightInfo?.airport : locationStr} />
                        <SummaryRow label="到達地點" value={!isPickup ? basicInfo?.flightInfo?.airport : locationStr} />

                        {extraLocationsCount > 0 && (
                            <SummaryRow label="額外加點" value={`共 ${extraLocationsCount} 個停靠點`} />
                        )}

                        <SummaryRow label="乘車人數" value={`${(rideInfo?.passengers?.adults || 0) + (rideInfo?.passengers?.children || 0)} 人 (含 ${rideInfo?.passengers?.adults || 0} 成 ${rideInfo?.passengers?.children || 0} 孩)`} />

                        {(rideInfo?.seats?.infant > 0 || rideInfo?.seats?.child > 0 || rideInfo?.seats?.booster > 0) && (
                            <SummaryRow label="安全座椅" value={`已選購 ${rideInfo?.seats?.infant + rideInfo?.seats?.child + rideInfo?.seats?.booster} 張`} />
                        )}

                        <SummaryRow label="舉牌服務" value={rideInfo?.signboard?.needed ? `需要` : "不需要"} />
                    </div>
                </div >

        {/* 4. Pricing Details */ }
        < div className = "bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4" >
                    <div className="border-l-4 border-blue-500 pl-3 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">金額結算</h2>
                            <p className="text-xs text-gray-500 mt-1">根據後台設定精確計算</p>
                        </div>
                        <ShieldCheck className="text-blue-500" size={24} />
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                        <PriceDetailRow label="基礎矩陣運價" value={prices.base} subLabel={categoryLabels[prices.category]} />
                        <PriceDetailRow label="高級車種加價" value={prices.modelSurcharge} />
                        <PriceDetailRow label="夜間服務加價" value={prices.nightSurcharge} />
                        <PriceDetailRow label="偏遠地區加價" value={prices.remoteSurcharge} />
                        <PriceDetailRow label="加點與停靠" value={prices.extraStopSurcharge} />
                        <PriceDetailRow label="特定路段加價" value={prices.routeSurcharge} />
                        <PriceDetailRow label="安全座椅/舉牌" value={prices.safetySeats + prices.signboard} />

                        {prices.discount > 0 && (
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm text-red-500 font-bold">離峰時段優惠</span>
                                <span className="text-sm text-red-600 font-black">- NT$ {prices.discount}</span>
                            </div>
                        )}

                        <div className="pt-3 border-t border-gray-200 mt-2 flex justify-between items-end">
                            <span className="font-black text-gray-900">應付總額</span>
                            <div className="text-right">
                                <span className="text-3xl font-black text-blue-600">NT$ {prices.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div >

        {/* 5. Terms */ }
        < div className = "space-y-3 px-2 pt-2" >
                    <label className="flex items-start gap-4 cursor-pointer group">
                        <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${term1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 bg-white group-hover:border-blue-300'}`}>
                            {term1 && <CheckCircle2 size={16} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={term1} onChange={e => setTerm1(e.target.checked)} />
                        <span className="text-xs text-gray-500 font-medium leading-relaxed">
                            我已閱覽並同意
                            <span
                                className="text-blue-600 underline px-1 hover:text-blue-800 transition-colors"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open('/legal/terms', '_blank');
                                }}
                            >
                                預約條款
                            </span>
                            與
                            <span
                                className="text-blue-600 underline px-1 hover:text-blue-800 transition-colors"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open('/legal/privacy', '_blank');
                                }}
                            >
                                隱私政策
                            </span>
                            。本人確認以上行程資訊皆正確無誤。
                        </span>
                    </label>
                    <label className="flex items-start gap-4 cursor-pointer group">
                        <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${term2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 bg-white group-hover:border-blue-300'}`}>
                            {term2 && <CheckCircle2 size={16} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={term2} onChange={e => setTerm2(e.target.checked)} />
                        <span className="text-xs text-gray-500 font-medium leading-relaxed">
                            同意由馳航派車團隊代為開立代收代付收據，並授權於完成行程後自動結算相關費用。
                        </span>
                    </label>
                </div >

            </div >

        {/* Bottom Actions */ }
        < div className = "fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 p-4 pb-8 z-30 flex justify-center" >
            <div className="w-full max-w-[420px]">
                <button
                    onClick={handleSubmit}
                    disabled={!contactName || !contactPhone || !contactEmail || !term1 || !term2}
                    className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${(contactName && contactPhone && contactEmail && term1 && term2)
                        ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 active:scale-95'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    送出訂單
                </button>
            </div>
            </div >

        </div >
    );
}

function SummaryRow({ label, value, icon }: any) {
    if (!value) return null;
    return (
        <div className="flex justify-between py-3 items-center">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                {icon}
                {label}
            </div>
            <div className="text-sm font-black text-gray-800 text-right max-w-[180px] break-words">
                {value}
            </div>
        </div>
    );
}

function PriceDetailRow({ label, value, subLabel }: any) {
    if (value === 0) return null;
    return (
        <div className="flex justify-between items-start">
            <div>
                <span className="text-sm text-gray-600 font-medium">{label}</span>
                {subLabel && <p className="text-[10px] text-blue-500 font-bold">{subLabel}</p>}
            </div>
            <span className="text-sm font-bold text-gray-900">NT$ {value.toLocaleString()}</span>
        </div>
    );
}
