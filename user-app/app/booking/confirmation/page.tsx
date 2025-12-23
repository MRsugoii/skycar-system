"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { VEHICLES } from "../ride-info/data";

export default function BookingConfirmationPage() {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);

    // Data from Session
    const [basicInfo, setBasicInfo] = useState<any>(null);
    const [rideInfo, setRideInfo] = useState<any>(null);

    // User Input State
    const [contactName, setContactName] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactEmail, setContactEmail] = useState("");

    // Terms
    const [term1, setTerm1] = useState(false);
    const [term2, setTerm2] = useState(false);

    // Pricing
    const [prices, setPrices] = useState({
        base: 0,
        modelSurcharge: 0,
        nightSurcharge: 0,
        holidaySurcharge: 0,
        remoteSurcharge: 0,
        stopSurcharge: 0,
        safetySeats: 0,
        signboard: 0,
        discount: 0,
        total: 0
    });

    useEffect(() => {
        // Load data
        const basicStr = sessionStorage.getItem('booking_basic_info');
        const rideStr = sessionStorage.getItem('booking_ride_info');

        if (basicStr && rideStr) {
            const bInfo = JSON.parse(basicStr);
            const rInfo = JSON.parse(rideStr);
            setBasicInfo(bInfo);
            setRideInfo(rInfo);

            // Calculate Price
            calculatePrice(bInfo, rInfo);

            setIsLoaded(true);
        } else {
            // Redirect if execution missing
            // router.push('/booking');
        }
    }, []);

    const calculatePrice = (bInfo: any, rInfo: any) => {
        const vehicle = VEHICLES.find(v => v.id === rInfo.vehicleId);
        if (!vehicle) return;

        const base = vehicle.dispatchPrice;
        const modelSurcharge = vehicle.modelSurcharge;

        // Safety Seats
        const seatCost =
            ((rInfo.seats?.infant || 0) * vehicle.safetySeatInfantPrice) +
            ((rInfo.seats?.child || 0) * vehicle.safetySeatChildPrice) +
            ((rInfo.seats?.booster || 0) * vehicle.safetySeatBoosterPrice);

        // Signboard
        const signboardCost = rInfo.signboard?.needed ? vehicle.signboardPrice : 0;

        // Mock Surcharges (TODO: Real logic)
        const night = 0;
        const holiday = 0;
        const remote = 0; // rInfo.locations logic ??
        const stop = 0;   // rInfo.locations.length ...

        // Discount (Mock)
        const discount = 0;

        const total = base + modelSurcharge + seatCost + signboardCost + night + holiday + remote + stop - discount;

        setPrices({
            base,
            modelSurcharge,
            nightSurcharge: night,
            holidaySurcharge: holiday,
            remoteSurcharge: remote,
            stopSurcharge: stop,
            safetySeats: seatCost,
            signboard: signboardCost,
            discount,
            total
        });
    };

    const handleSubmit = () => {
        if (!contactName || !contactPhone || !contactEmail) {
            alert("請填寫完整聯絡資訊");
            return;
        }
        if (!term1 || !term2) {
            alert("請同意服務條款");
            return;
        }

        // Save Contact & Price info to session for Payment Page
        sessionStorage.setItem('booking_contact_info', JSON.stringify({
            name: contactName,
            phone: contactPhone,
            email: contactEmail
        }));
        sessionStorage.setItem('booking_price_info', JSON.stringify(prices));

        router.push('/booking/payment');
    };

    if (!isLoaded) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

    const isPickup = basicInfo.type === 'pickup';
    const vehicle = VEHICLES.find(v => v.id === rideInfo.vehicleId);

    // Address formatter
    const mainLocation = basicInfo.locations[0];
    const locationStr = `${mainLocation.city}${mainLocation.district}${mainLocation.address}`;
    const extraLocations = basicInfo.locations.slice(1).length;

    return (
        <div className="min-h-screen bg-gray-50 pb-32 text-gray-900 max-w-[420px] mx-auto relative overflow-hidden flex flex-col">

            {/* Header */}
            <div className="bg-blue-600 px-4 pt-8 pb-10 text-white rounded-b-[40px] shadow-lg relative z-0 mb-[-40px]">
                <button
                    onClick={() => router.push('/booking/ride-info')}
                    className="absolute left-6 top-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>
                <h1 className="text-lg font-bold text-center mt-2">訂單資訊</h1>
            </div>

            <div className="px-4 relative z-10 pt-4 space-y-4">

                {/* 1. Contact Info */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">聯絡資訊</h2>
                        <p className="text-xs text-gray-500 mt-1">請留下可聯絡的姓名、手機與 Email (避免 Hotmail)</p>
                    </div>

                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="姓名"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full p-3.5 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                        />
                        <input
                            type="tel"
                            placeholder="手機號碼 (例如 0912345678)"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="w-full p-3.5 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full p-3.5 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* 2. Order Summary */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">訂單明細</h2>
                        <p className="text-xs text-gray-500 mt-1">請再次確認服務類型、上下車地點、時間與乘車需求</p>
                    </div>

                    <div>
                        {/* Personal Info Mirror */}
                        <div className="divide-y divide-gray-100">
                            <SummaryRowSimple label="乘客姓名" value={contactName || "-"} />
                            <SummaryRowSimple label="手機號碼" value={contactPhone || "-"} />
                            <SummaryRowSimple label="Email" value={contactEmail || "-"} />
                        </div>

                        <div className="my-4 border-t border-dashed border-gray-200"></div>

                        {/* Service Info */}
                        <div className="divide-y divide-gray-100">
                            <SummaryRowSimple label="服務類型" value={isPickup ? "回國接機 / 港口接送" : "出國送機 / 送到港口"} />
                            <SummaryRowSimple
                                label="起點"
                                value={isPickup
                                    ? `${basicInfo?.flightInfo?.airport} ${basicInfo?.flightInfo?.flightNumber ? `(${basicInfo?.flightInfo?.flightNumber})` : ''}`
                                    : locationStr + (extraLocations > 0 ? ` (+${extraLocations}點)` : '')
                                }
                            />
                            <SummaryRowSimple
                                label="終點"
                                value={!isPickup
                                    ? `${basicInfo?.flightInfo?.airport} ${basicInfo?.flightInfo?.flightNumber ? `(${basicInfo?.flightInfo?.flightNumber})` : ''}`
                                    : locationStr + (extraLocations > 0 ? ` (+${extraLocations}點)` : '')
                                }
                            />
                            {!isPickup && (
                                <SummaryRowSimple label="指定乘車時間" value={`${basicInfo?.pickupTime?.date} ${basicInfo?.pickupTime?.time}`} />
                            )}
                            <SummaryRowSimple
                                label={isPickup ? "航班抵達" : "航班起飛"}
                                value={`${basicInfo?.flightInfo?.date} ${basicInfo?.flightInfo?.time}`}
                            />
                            <SummaryRowSimple label="航班 / 船班" value={basicInfo?.flightInfo?.flightNumber} />
                        </div>

                        <div className="my-4 border-t border-dashed border-gray-200"></div>

                        {/* Ride Requirements (Text Removed as requested) */}

                        <div className="divide-y divide-gray-100">
                            <SummaryRowSimple label="乘客人數" value={`${(rideInfo?.passengers?.adults || 0) + (rideInfo?.passengers?.children || 0)} 人`} />
                            <SummaryRowSimple label="成人 / 小孩" value={`${rideInfo?.passengers?.adults || 0} 位 / ${rideInfo?.passengers?.children || 0} 位`} />
                            <SummaryRowSimple label="行李件數" value={`20吋以下 ${rideInfo?.luggage?.s || 0} 件 ; 21-25吋 ${rideInfo?.luggage?.m || 0} 件 ; 26-28吋 ${rideInfo?.luggage?.l || 0} 件`} />
                            <SummaryRowSimple label="安全座椅" value={`後向式 ${rideInfo?.seats?.infant || 0} 張 ; 前向式 ${rideInfo?.seats?.child || 0} 張 ; 增高墊 ${rideInfo?.seats?.booster || 0} 張`} />
                            <SummaryRowSimple label="選擇車型" value={vehicle?.name || '-'} />
                            <SummaryRowSimple label="舉牌服務" value={rideInfo?.signboard?.needed ? `需要 (${rideInfo?.signboard?.title})` : "不需要"} />
                            <SummaryRowSimple label="備註" value={rideInfo?.notes || "-"} />
                        </div>
                    </div>
                </div>

                {/* 3. Pricing */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">金額</h2>
                        <p className="text-xs text-gray-500 mt-1">請再次確認應付金額</p>
                    </div>

                    <div>
                        {/* Items */}
                        <div className="divide-y divide-gray-100">
                            <PriceRow label="基本服務" price={prices.base} isShowZero />
                            <PriceRow label="車型加價" price={prices.modelSurcharge} isShowZero />
                            <PriceRow label="夜間加價" price={prices.nightSurcharge} isShowZero />
                            <PriceRow label="連續假期加價" price={prices.holidaySurcharge} isShowZero />
                            <PriceRow label="特定地區加價" price={prices.remoteSurcharge} isShowZero />
                            <PriceRow label="跨區自費加價" price={prices.stopSurcharge} isShowZero />
                            <PriceRow label="加點加價" price={prices.stopSurcharge} isShowZero />

                            <PriceRow label="安全座椅加價" price={prices.safetySeats} isShowZero />
                            <PriceRow label="舉牌加價" price={prices.signboard} isShowZero />
                        </div>

                        <div className="my-2 border-t border-dashed border-gray-200"></div>

                        <div className="divide-y divide-gray-100">
                            <PriceRow label="離峰優惠" price={-prices.discount} isDiscount isShowZero />
                            <PriceRow label="優惠券折抵" price={0} isDiscount isShowZero />
                        </div>

                        {/* Total */}
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                            <div className="font-bold text-gray-900 text-lg">總金額</div>
                            <div className="font-bold text-2xl text-blue-600">
                                {prices.total.toLocaleString()} <span className="text-sm text-gray-500 font-medium">元</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Terms */}

                <div className="space-y-3 px-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${term1 ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white'}`}>
                            {term1 && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={term1} onChange={e => setTerm1(e.target.checked)} />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">我已了解預約條款與隱私政策。</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${term2 ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white'}`}>
                            {term2 && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={term2} onChange={e => setTerm2(e.target.checked)} />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">同意馳航團隊代為處理金額與收據相關事宜。</span>
                    </label>
                </div>

            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 z-20 flex gap-3 justify-center">
                <div className="w-full max-w-[420px]">
                    <button
                        onClick={handleSubmit}
                        className={`w-full py-3.5 rounded-xl font-bold text-lg text-white shadow-lg transition flex items-center justify-center gap-2 ${(contactName && contactPhone && contactEmail && term1 && term2)
                            ? 'bg-blue-600 shadow-blue-200 hover:bg-blue-700 active:scale-95'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        disabled={!contactName || !contactPhone || !contactEmail || !term1 || !term2}
                    >
                        送出訂單
                    </button>
                </div>
            </div>

        </div>
    );
}

function SummaryRowSimple({ label, value }: { label: string, value: string | undefined | null }) {
    if (!value || value === '-' || value === '0 件' || value === '0 張' || value === '0 位 / 0 位') return null;
    return (
        <div className="flex justify-between py-2 items-start">
            <div className="text-sm text-gray-700 shrink-0 w-24">
                {label}
            </div>
            <div className="text-sm font-bold text-gray-900 text-right flex-1 break-words">
                {value}
            </div>
        </div>
    )
}

function PriceRow({ label, price, isBold = false, isDiscount = false, isShowZero = false }: any) {
    if (price === 0 && !isDiscount && !isShowZero) return null; // Hide 0 cost items unless flag is set
    // Screenshots show 0 value items, so we should often show them
    return (
        <div className="flex justify-between py-2 items-center">
            <div className={`text-sm text-gray-700 ${isBold ? 'font-bold' : ''}`}>
                {label}
            </div>
            <div className={`text-sm font-bold ${isDiscount ? 'text-red-500' : 'text-gray-900'}`}>
                {isDiscount ? '- ' : ''} {Math.abs(price).toLocaleString()} 元
            </div>
        </div>
    )
}
