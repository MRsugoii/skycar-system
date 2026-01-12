"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle2, AlertTriangle, ShieldCheck, Car, Ticket, Loader2 } from "lucide-react";
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
    const [contactName, setContactName] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactType, setContactType] = useState("mobile"); // mobile | line | whatsapp
    const [contactEmail, setContactEmail] = useState("");

    // Terms
    const [term1, setTerm1] = useState(false);
    const [term2, setTerm2] = useState(false);

    // Pricing Breakdown
    const [prices, setPrices] = useState({
        base: 0,
        modelSurcharge: 0,
        nightSurcharge: 0,
        holidayMatrixSurcharge: 0,
        remoteSurcharge: 0,
        extraStopSurcharge: 0,
        routeSurcharge: 0,
        safetySeats: 0,
        signboard: 0,
        discount: 0,
        couponDiscount: 0, // [NEW] Coupon
        total: 0,
        category: 'weekday'
    });

    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [couponMessage, setCouponMessage] = useState({ type: "", text: "" }); // type: 'success' | 'error'


    useEffect(() => {
        const loadAndCalculate = async () => {
            setIsCalculating(true);
            const basicStr = sessionStorage.getItem('booking_basic_info');
            const rideStr = sessionStorage.getItem('booking_ride_info');

            if (basicStr && rideStr) {
                const bInfo = JSON.parse(basicStr);
                const rInfo = JSON.parse(rideStr);
                setBasicInfo(bInfo);
                setRideInfo(rInfo);

                // 1. Fetch Vehicle & Extra Settings
                const { data: vData } = await supabase.from("vehicle_types").select("*").eq("id", rInfo.vehicleId).single();
                const { data: eData } = await supabase.from("extra_settings").select("*").single();
                setVehicle(vData);

                if (vData && eData) {
                    await calculateFinalPrice(bInfo, rInfo, vData, eData);
                }
                setIsLoaded(true);
            }
            setIsCalculating(false);
        };
        loadAndCalculate();
    }, []);

    const calculateFinalPrice = async (bInfo: any, rInfo: any, vehicle: any, settings: any) => {
        const bookingDate = bInfo.flightInfo?.date || bInfo.pickupTime?.date;
        const bookingTime = bInfo.pickupTime?.time || bInfo.flightInfo?.time;

        // --- Step 1: Determine Price Category ---
        let category = 'weekday';
        const { data: holiday } = await supabase
            .from("holidays")
            .select("price_category")
            .lte("start_date", bookingDate)
            .gte("end_date", bookingDate)
            .eq("status", true)
            .maybeSingle(); // Use maybeSingle to avoid errors if no holiday found

        if (holiday) {
            category = holiday.price_category;
        } else {
            const day = new Date(bookingDate).getDay();
            if (day === 0 || day === 6) category = 'holiday'; // Weekend default
        }

        // Map UI value to Database value
        const uiAirport = bInfo.flightInfo?.airport;
        let dbAirport = uiAirport;
        if (uiAirport?.startsWith('tpe')) dbAirport = '桃園機場';
        else if (uiAirport === 'tsa') dbAirport = '松山機場';
        else if (uiAirport === 'rmq') dbAirport = '台中清泉崗機場';
        else if (uiAirport === 'khh') dbAirport = '高雄小港機場';

        // --- Step 2: Fetch Matrix Base Price ---
        const mainLoc = bInfo.locations[0];
        const { data: matrix } = await supabase
            .from("airport_prices")
            .select("*")
            .eq("airport", dbAirport)
            .eq("region", mainLoc.district)
            .eq("category", category)
            .eq("status", true)
            .maybeSingle();

        const basePrice = matrix?.prices?.[vehicle.id] || 1000; // Fallback
        const remotePrice = Number(matrix?.remote_surcharge || 0);

        // --- Step 3: Extra Services ---
        const safetySeatCost =
            ((rInfo.seats?.infant || 0) * Number(settings.safety_seat_infant_price)) +
            ((rInfo.seats?.child || 0) * Number(settings.safety_seat_child_price)) +
            ((rInfo.seats?.booster || 0) * Number(settings.safety_seat_booster_price));

        const signboardCost = rInfo.signboard?.needed ? Number(settings.signboard_price) : 0;

        // --- Step 4: Time-based Adjustments ---
        let nightSurcharge = 0;
        let offPeakDiscount = 0;

        if (bookingTime && vehicle.night_surcharge > 0) {
            if (bookingTime >= (vehicle.night_surcharge_start || "23:00") || bookingTime <= (vehicle.night_surcharge_end || "06:00")) {
                nightSurcharge = Number(vehicle.night_surcharge);
            }
        }

        if (bookingTime && vehicle.off_peak_discount > 0) {
            if (bookingTime >= (vehicle.off_peak_discount_start || "10:00") && bookingTime <= (vehicle.off_peak_discount_end || "16:00")) {
                offPeakDiscount = Number(vehicle.off_peak_discount);
            }
        }

        // --- Step 5: Route & Multi-stop Surcharges ---
        let routeSurcharge = 0;
        const { data: routes } = await supabase.from("route_prices").select("*").eq("status", true);
        if (routes) {
            const locationStr = `${mainLoc.city}${mainLoc.district}${mainLoc.address}`;
            const matchedRoute = routes.find(r =>
                locationStr.includes(r.start_location || '$$$') ||
                locationStr.includes(r.end_location || '$$$') ||
                locationStr.includes(r.name) // Allow matching by Route Name (Keyword)
            );
            if (matchedRoute) {
                routeSurcharge = Number(matchedRoute.price || matchedRoute.fixed_price);
            }
        }

        const extraLocations = bInfo.locations.length - 1;
        const extraStopSurcharge = extraLocations * Number(vehicle.extra_stop_price || 0);

        const modelSurcharge = Number(vehicle.model_surcharge || 0);

        const totalPriceBeforeDiscount = basePrice + modelSurcharge + nightSurcharge + remotePrice + extraStopSurcharge + routeSurcharge + safetySeatCost + signboardCost;
        const finalPrice = Math.max(0, totalPriceBeforeDiscount - (offPeakDiscount || 0));

        setPrices({
            base: Number(basePrice || 0),
            modelSurcharge: modelSurcharge,
            nightSurcharge: nightSurcharge,
            holidayMatrixSurcharge: 0, // Integrated in base
            remoteSurcharge: remotePrice,
            extraStopSurcharge: extraStopSurcharge,
            routeSurcharge: routeSurcharge,
            safetySeats: safetySeatCost,
            signboard: signboardCost,
            discount: offPeakDiscount,
            couponDiscount: 0, // Reset coupon on re-calc
            total: finalPrice,
            category: category
        });

        // Reset Coupon when price recalculates (optional, but safer)
        setCouponCode("");
        setCouponMessage({ type: "", text: "" });

        setIsCalculating(false);
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponMessage({ type: "", text: "" });

        try {
            const { data: coupon, error } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', couponCode)
                .eq('status', true)
                .single();

            if (error || !coupon) {
                setCouponMessage({ type: 'error', text: "無效的優惠碼" });
                return;
            }

            // Date Validation
            const today = new Date().toISOString().split('T')[0];
            if (today < coupon.start_date || today > coupon.end_date) {
                setCouponMessage({ type: 'error', text: "優惠碼不在使用期限內" });
                return;
            }

            // Apply Discount
            const discountVal = coupon.discount_value || 0;
            const newTotal = Math.max(0, prices.total - discountVal); // Apply on top of existing total

            setPrices(prev => ({
                ...prev,
                couponDiscount: discountVal,
                total: newTotal
            }));

            setCouponMessage({ type: 'success', text: `優惠碼適用成功！折抵 $${discountVal}` });

        } catch (e) {
            console.error(e);
            setCouponMessage({ type: 'error', text: "驗證失敗，請稍後再試" });
        }
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

        sessionStorage.setItem('booking_contact_info', JSON.stringify({
            name: contactName,
            phone: contactPhone,
            type: contactType,
            email: contactEmail
        }));
        sessionStorage.setItem('booking_price_info', JSON.stringify(prices));

        router.push('/booking/payment');
    };

    if (!isLoaded || isCalculating) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold animate-pulse">正在精算您的旅程金額...</p>
        </div>
    );

    const isPickup = basicInfo.type === 'pickup';
    const mainLocation = basicInfo.locations[0];
    const locationStr = `${mainLocation.city}${mainLocation.district}${mainLocation.address}`;
    const extraLocationsCount = basicInfo.locations.length - 1;

    const categoryLabels: Record<string, string> = {
        'weekday': '平日價格',
        'holiday': '假日/週末價格',
        'special': '特殊節日價格'
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32 text-gray-900 max-w-[420px] mx-auto relative overflow-hidden flex flex-col">

            {/* Header */}
            <div className="bg-blue-600 px-4 pt-8 pb-10 text-white rounded-b-[40px] shadow-lg relative z-0 mb-[-40px]">
                <button
                    onClick={() => router.push('/booking/ride-info')}
                    className="absolute left-6 top-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition shadow-inner"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>
                <h1 className="text-lg font-bold text-center mt-2">訂單確認</h1>
            </div>

            <div className="px-4 relative z-10 pt-4 space-y-4">

                {/* 2. Contact Info */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">聯絡資訊</h2>
                        <p className="text-xs text-gray-500 mt-1">司機將聯繫此資訊</p>
                    </div>

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
                                className="w-1/3 p-4 border border-gray-100 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
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
                </div>

                {/* 3. Order Summary */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
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
                </div>

                {/* 4. Pricing Details */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">金額結算</h2>
                            <p className="text-xs text-gray-500 mt-1">根據後台設定精確計算</p>
                        </div>
                        <ShieldCheck className="text-blue-500" size={24} />
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                        <PriceDetailRow
                            label="車輛價格"
                            value={prices.base + prices.modelSurcharge}
                            subLabel={categoryLabels[prices.category]}
                        />
                        <PriceDetailRow label="偏遠地區加價" value={prices.remoteSurcharge} />
                        <PriceDetailRow label="特定路段加價" value={prices.routeSurcharge} />
                        <PriceDetailRow label="多點計費" value={prices.extraStopSurcharge} />
                        <PriceDetailRow label="夜間加成" value={prices.nightSurcharge} />
                        <PriceDetailRow label="離峰優惠" value={-prices.discount} isDiscount />
                        <PriceDetailRow label="安全座椅" value={prices.safetySeats} />
                        <PriceDetailRow label="舉牌服務" value={prices.signboard} />


                        {prices.couponDiscount > 0 && (
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm text-green-600 font-bold flex items-center gap-1">
                                    <Ticket size={14} /> 優惠券
                                </span>
                                <span className="text-sm text-green-700 font-black">- NT$ {prices.couponDiscount}</span>
                            </div>
                        )}

                        {/* Coupon Input */}
                        <div className="pt-2 pb-1">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="輸入優惠碼"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    disabled={prices.couponDiscount > 0}
                                    className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 uppercase placeholder:text-gray-400 disabled:bg-gray-100 disabled:text-gray-400"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={!couponCode || prices.couponDiscount > 0}
                                    className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                                >
                                    兌換
                                </button>
                            </div>
                            {couponMessage.text && (
                                <p className={`text-[10px] mt-1.5 font-bold ${couponMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                                    {couponMessage.text}
                                </p>
                            )}
                        </div>


                        <div className="pt-3 border-t border-gray-200 mt-2 flex justify-between items-end">
                            <span className="font-black text-gray-900">應付總額</span>
                            <div className="text-right">
                                <span className="text-3xl font-black text-blue-600">NT$ {prices.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Terms */}
                <div className="space-y-3 px-2 pt-2">
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
                </div>

            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 p-4 pb-8 z-30 flex justify-center">
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
            </div>

        </div>
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

function PriceDetailRow({ label, value, subLabel, isDiscount = false }: any) {
    if (value === 0) return null;
    return (
        <div className="flex justify-between items-start py-1">
            <div>
                <span className={`text-sm font-medium ${isDiscount ? 'text-red-500' : 'text-gray-600'}`}>{label}</span>
                {subLabel && <p className="text-[10px] text-blue-500 font-bold">{subLabel}</p>}
            </div>
            <span className={`text-sm font-bold ${isDiscount ? 'text-red-500' : 'text-gray-900'}`}>
                {isDiscount ? '- ' : ''}NT$ {Math.abs(value).toLocaleString()}
            </span>
        </div>
    );
}
