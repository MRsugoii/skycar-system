"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp, CheckCircle2, User, Ticket, LogOut, X } from "lucide-react";
import { VEHICLES } from "../ride-info/data";
import { supabase } from "../../../lib/supabase";

export default function PaymentPage() {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);

    // Data from Session
    const [basicInfo, setBasicInfo] = useState<any>(null);
    const [rideInfo, setRideInfo] = useState<any>(null);
    const [contactInfo, setContactInfo] = useState<any>(null);
    const [prices, setPrices] = useState<any>(null);

    // Page State
    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(true); // Open by default for review
    const [isPriceDetailsOpen, setIsPriceDetailsOpen] = useState(false);

    // Modals
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Login Inputs
    const [loginId, setLoginId] = useState("");
    const [loginPwd, setLoginPwd] = useState("");

    // Form State
    const [invoiceType, setInvoiceType] = useState("electronic"); // electronic, mobile, taxId, donation
    const [invoiceValue, setInvoiceValue] = useState(""); // taxId or mobile code
    const [paymentMethod, setPaymentMethod] = useState(""); // creditcard, cash

    // Auth State
    const [memberAccount, setMemberAccount] = useState<string | null>(null);
    const [couponCode, setCouponCode] = useState("");

    useEffect(() => {
        // Load data
        const basicStr = sessionStorage.getItem('booking_basic_info');
        const rideStr = sessionStorage.getItem('booking_ride_info');
        const contactStr = sessionStorage.getItem('booking_contact_info');
        const priceStr = sessionStorage.getItem('booking_price_info');
        const account = sessionStorage.getItem('memberAccount');

        if (basicStr && rideStr && contactStr && priceStr) {
            setBasicInfo(JSON.parse(basicStr));
            setRideInfo(JSON.parse(rideStr));
            setContactInfo(JSON.parse(contactStr));
            setPrices(JSON.parse(priceStr));
            setMemberAccount(account);
            setIsLoaded(true);
        } else {
            // Missing data, redirect
            router.push('/booking');
        }
    }, [router]);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock Login Check
        if (loginId && loginPwd) {
            sessionStorage.setItem('memberAccount', loginId);
            setMemberAccount(loginId);
            setShowLoginModal(false);
            setLoginId("");
            setLoginPwd("");
        } else {
            alert("請輸入帳號與密碼");
        }
    };

    const handleLogoutMock = () => {
        sessionStorage.removeItem('memberAccount');
        setMemberAccount(null);
    };

    const handleRegisterClick = () => {
        router.push('/register?returnTo=/booking/payment');
    };

    const handleSubmit = async () => {
        if (!paymentMethod) {
            alert("請選擇付款方式");
            return;
        }

        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const nextSerial = String(Math.floor(Math.random() * 10000)).padStart(4, '0'); // 4 digits
        const orderId = `CH${y}${m}${d}${nextSerial}`;

        const isPickup = basicInfo.type === 'pickup';
        const pickupAddr = isPickup
            ? `${basicInfo.flightInfo?.airport} ${basicInfo.flightInfo?.flightNumber || ''}`
            : `${basicInfo.locations[0].city}${basicInfo.locations[0].district}${basicInfo.locations[0].address}`;
        const dropoffAddr = isPickup
            ? `${basicInfo.locations[0].city}${basicInfo.locations[0].district}${basicInfo.locations[0].address}`
            : `${basicInfo.flightInfo?.airport} ${basicInfo.flightInfo?.flightNumber || ''}`;

        // Determine correct date/time to use
        const dateStr = basicInfo.pickupTime?.date || basicInfo.flightInfo?.date;
        const timeStr = basicInfo.pickupTime?.time || basicInfo.flightInfo?.time;
        const pickupTime = new Date(`${dateStr}T${timeStr}:00`).toISOString();

        const passengerCount = (rideInfo.passengers?.adults || 0) + (rideInfo.passengers?.children || 0);
        const luggageCount = (rideInfo.luggage?.s || 0) + (rideInfo.luggage?.m || 0) + (rideInfo.luggage?.l || 0);
        const vehicleName = VEHICLES.find(v => v.id === rideInfo.vehicleId)?.name || 'Unknown';

        try {
            const { error } = await supabase.from('orders').insert({
                user_id: memberAccount || contactInfo.name,
                contact_name: contactInfo.name,
                contact_phone: contactInfo.phone,
                pickup_address: pickupAddr,
                dropoff_address: dropoffAddr,
                pickup_time: pickupTime,
                passenger_count: passengerCount,
                luggage_count: luggageCount,
                vehicle_type: vehicleName,
                price: prices.total,
                status: 'pending',
                note: rideInfo.notes
            });

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            // Also keep local storage for Result page display if needed, or just rely on URL params
            // We'll keep the minimal local storage just in case the result page needs it, but mostly we rely on Supabase now.
            // keeping this for legacy demo compatibility if result page reads it:
            const newOrder = {
                orderId: orderId,
                status: 'pending',
                total: prices.total,
                // ... other fields if needed by Result page
            };
            const account = memberAccount;
            if (account) {
                const key = `orders_${account}`;
                const existingOrders = JSON.parse(localStorage.getItem(key) || '[]');
                localStorage.setItem(key, JSON.stringify([newOrder, ...existingOrders]));
            } else {
                const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));
            }

            alert("付款成功！訂單已成立。");
            router.push(`/booking/result?status=success&orderId=${orderId}`);

        } catch (err) {
            console.error(err);
            alert("訂單建立失敗，請稍後再試。");
        }
    };

    if (!isLoaded) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

    const isPickup = basicInfo.type === 'pickup';
    const locationStr = `${basicInfo.locations[0].city}${basicInfo.locations[0].district}${basicInfo.locations[0].address}`;
    const extraLocations = basicInfo.locations.slice(1).length;
    const vehicleName = VEHICLES.find(v => v.id === rideInfo.vehicleId)?.name;

    return (
        <div className="min-h-screen bg-gray-50 pb-36 text-gray-900 max-w-[420px] mx-auto relative overflow-hidden flex flex-col">

            {/* Header */}
            <div className="bg-blue-600 px-4 pt-8 pb-10 text-white rounded-b-[40px] shadow-lg relative z-0 mb-[-40px]">
                <button
                    onClick={() => router.push('/booking/confirmation')}
                    className="absolute left-6 top-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>
                <h1 className="text-lg font-bold text-center mt-2">付款頁面</h1>
            </div>

            <div className="px-4 relative z-10 pt-4 space-y-4">

                {/* 1. Collapsible Order Details */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => setIsOrderDetailsOpen(!isOrderDetailsOpen)}
                        className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center gap-3">
                            <div className="font-bold text-gray-900 text-lg">訂單明細</div>
                        </div>
                        {isOrderDetailsOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </button>

                    {isOrderDetailsOpen && (
                        <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                            <div className="py-4 space-y-1">
                                <div className="divide-y divide-gray-100">
                                    <SummaryRowSimple label="乘客姓名" value={contactInfo.name} />
                                    <SummaryRowSimple label="手機號碼" value={contactInfo.phone} />
                                    <SummaryRowSimple label="Email" value={contactInfo.email} />
                                </div>

                                <div className="my-2 border-t border-dashed border-gray-200"></div>

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

                                <div className="my-2 border-t border-dashed border-gray-200"></div>

                                <div className="divide-y divide-gray-100">
                                    <SummaryRowSimple label="乘客人數" value={`${(rideInfo?.passengers?.adults || 0) + (rideInfo?.passengers?.children || 0)} 人`} />
                                    <SummaryRowSimple label="成人 / 小孩" value={`${rideInfo?.passengers?.adults || 0} 位 / ${rideInfo?.passengers?.children || 0} 位`} />
                                    <SummaryRowSimple label="行李件數" value={`20吋以下 ${rideInfo?.luggage?.s || 0} 件 ; 21-25吋 ${rideInfo?.luggage?.m || 0} 件 ; 26-28吋 ${rideInfo?.luggage?.l || 0} 件`} />
                                    <SummaryRowSimple label="安全座椅" value={`後向式 ${rideInfo?.seats?.infant || 0} 張 ; 前向式 ${rideInfo?.seats?.child || 0} 張 ; 增高墊 ${rideInfo?.seats?.booster || 0} 張`} />
                                    <SummaryRowSimple label="選擇車型" value={vehicleName || '-'} />
                                    <SummaryRowSimple label="舉牌服務" value={rideInfo?.signboard?.needed ? `需要 (${rideInfo?.signboard?.title})` : "不需要"} />
                                    <SummaryRowSimple label="備註" value={rideInfo?.notes || "-"} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Collapsible Price Details */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => setIsPriceDetailsOpen(!isPriceDetailsOpen)}
                        className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center gap-3">
                            <div className="font-bold text-gray-900 text-lg">金額詳情</div>
                            <div className="text-blue-600 font-bold text-lg ml-auto mr-2">
                                ${prices.total.toLocaleString()}
                            </div>
                        </div>
                        {isPriceDetailsOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </button>

                    {isPriceDetailsOpen && (
                        <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                            <div className="py-4 space-y-1">
                                <div className="divide-y divide-gray-100">
                                    <PriceRow label="基本服務" price={prices.base} isShowZero />
                                    <PriceRow label="車型加價" price={prices.modelSurcharge} isShowZero />
                                    <PriceRow label="夜間加價" price={prices.nightSurcharge} isShowZero />
                                    <PriceRow label="連續假期加價" price={prices.holidaySurcharge} isShowZero />
                                    <PriceRow label="特定地區加價" price={prices.remoteSurcharge} isShowZero />
                                    <PriceRow label="跨區自費加價" price={prices.stopSurcharge} isShowZero />
                                    <PriceRow label="加點加價" price={0} isShowZero />

                                    <PriceRow label="安全座椅加價" price={prices.safetySeats} isShowZero />
                                    <PriceRow label="舉牌加價" price={prices.signboard} isShowZero />
                                </div>
                                <div className="border-t border-dashed border-gray-200 my-2"></div>
                                <div className="divide-y divide-gray-100">
                                    <PriceRow label="離峰優惠" price={-prices.discount} isDiscount isShowZero />
                                    <PriceRow label="優惠券折抵" price={0} isDiscount isShowZero />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Invoice Info */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">發票資訊</h2>
                    <div className="relative">
                        <select
                            value={invoiceType}
                            onChange={(e) => {
                                setInvoiceType(e.target.value);
                                setInvoiceValue("");
                            }}
                            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 appearance-none font-bold text-gray-700 outline-none focus:border-blue-500"
                        >
                            <option value="electronic">電子發票</option>
                            <option value="mobile">手機載具</option>
                            <option value="taxId">統編電子發票</option>
                            <option value="donation">捐贈 (創世基金會)</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                    {invoiceType === 'taxId' && (
                        <input
                            type="text"
                            placeholder="請輸入統一編號"
                            value={invoiceValue}
                            onChange={(e) => setInvoiceValue(e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-medium"
                        />
                    )}
                    {invoiceType === 'mobile' && (
                        <input
                            type="text"
                            placeholder="請輸入手機載具 (例如 /ABC1234)"
                            value={invoiceValue}
                            onChange={(e) => setInvoiceValue(e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-medium"
                        />
                    )}
                </div>

                {/* 4. Payment Method */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">付款方式</h2>
                    <div className="space-y-3">
                        <PaymentOption
                            id="creditcard"
                            label="信用卡 / 簽帳卡"
                            selected={paymentMethod === 'creditcard'}
                            onSelect={() => setPaymentMethod('creditcard')}
                        />
                        <PaymentOption
                            id="cash"
                            label="現金"
                            selected={paymentMethod === 'cash'}
                            onSelect={() => setPaymentMethod('cash')}
                        />
                    </div>
                </div>

                {/* 5. Member / Guest Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
                    {!memberAccount ? (
                        <>
                            <div className="text-center text-gray-500 text-sm mb-2">付款前請先登入或註冊，以便套用優惠與查詢訂單。</div>
                            <button
                                onClick={() => setShowLoginModal(true)}
                                className="w-full py-3 bg-blue-600 rounded-xl text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition"
                            >
                                會員登入
                            </button>
                            <button
                                onClick={handleRegisterClick}
                                className="w-full py-3 bg-white border border-blue-600 rounded-xl text-blue-600 font-bold text-lg hover:bg-blue-50 transition"
                            >
                                用戶註冊
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-2">
                                <div className="bg-blue-50 px-4 py-2 rounded-full text-blue-800 font-bold text-sm flex items-center gap-2">
                                    <User size={16} />
                                    會員：{memberAccount}
                                </div>
                                <button
                                    onClick={handleLogoutMock}
                                    className="text-blue-600 font-bold text-sm px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 flex items-center gap-1"
                                >
                                    <LogOut size={14} />
                                    登出
                                </button>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mt-2">優惠券</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="輸入折抵碼 (如 WELCOME200)"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="flex-1 p-3 border border-gray-300 rounded-xl text-base outline-none focus:border-blue-500 uppercase"
                                />
                            </div>
                            <button className="w-full py-3 bg-blue-600 rounded-xl text-white font-bold text-lg hover:bg-blue-700 transition shadow-md">
                                套用
                            </button>
                            <p className="text-xs text-gray-400">示範可用：WELCOME200、VIP500；或輸入數字（例：300）。</p>
                        </>
                    )}
                </div>

            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 z-20 flex gap-3 justify-center">
                <div className="w-full max-w-[420px]">
                    <button
                        onClick={handleSubmit}
                        className={`w-full py-3.5 rounded-xl font-bold text-lg text-white shadow-lg transition flex items-center justify-center gap-2 ${paymentMethod
                            ? 'bg-blue-600 shadow-blue-200 hover:bg-blue-700 active:scale-95'
                            : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        disabled={!paymentMethod}
                    >
                        確認付款
                    </button>
                </div>
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-sm p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">會員登入</h2>
                        </div>
                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            <div className="space-y-2 text-left">
                                <label className="font-bold text-gray-700">帳號</label>
                                <input
                                    type="text"
                                    placeholder="身分證字號"
                                    value={loginId}
                                    onChange={(e) => setLoginId(e.target.value)}
                                    className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-blue-500 bg-gray-50 text-lg"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="font-bold text-gray-700">密碼</label>
                                <input
                                    type="password"
                                    placeholder="請輸入密碼"
                                    value={loginPwd}
                                    onChange={(e) => setLoginPwd(e.target.value)}
                                    className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-blue-500 bg-gray-50 text-lg"
                                />
                            </div>
                            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold text-xl rounded-xl shadow-lg hover:bg-blue-700 transition">
                                登入
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

function SummaryRowSimple({ label, value }: { label: string, value: string }) {
    if (!value || value === '-' || value === '0 件' || value === '0 張' || value === '0 位 / 0 位') return null;
    return (
        <div className="flex justify-between py-2 items-start">
            <div className="text-sm text-gray-700 shrink-0 w-24">{label}</div>
            <div className="text-sm font-bold text-gray-900 text-right flex-1 break-words">{value}</div>
        </div>
    );
}

function PriceRow({ label, price, isDiscount = false, isShowZero = false }: any) {
    if (price === 0 && !isDiscount && !isShowZero) return null;
    return (
        <div className="flex justify-between py-2 items-center">
            <div className="text-sm text-gray-700">{label}</div>
            <div className={`text-sm font-bold ${isDiscount ? 'text-red-500' : 'text-gray-900'}`}>
                {isDiscount ? '- ' : ''} {Math.abs(price).toLocaleString()} 元
            </div>
        </div>
    );
}

function PaymentOption({ id, label, selected, onSelect }: any) {
    return (
        <div
            onClick={onSelect}
            className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all ${selected
                ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500'
                : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
        >
            <span className={`font-bold text-lg ${selected ? 'text-blue-900' : 'text-gray-700'}`}>{label}</span>
            {selected && <CheckCircle2 className="text-blue-600" size={20} />}
        </div>
    )
}
