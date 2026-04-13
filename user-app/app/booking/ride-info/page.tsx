"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Car, Users, Briefcase, Armchair, AlertCircle, Plus, Minus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RideInfoPage() {
    const router = useRouter();

    // -- Dynamic Data --
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [extraSettings, setExtraSettings] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // -- State --
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    // Safety Seats
    const [infantSeats, setInfantSeats] = useState(0); // 0-1 yo / <10kg
    const [childSeats, setChildSeats] = useState(0);   // 1-4 yo / <18kg
    const [boosters, setBoosters] = useState(0);       // 4-12 yo

    // Luggage
    const [luggageCount, setLuggageCount] = useState(0);
    const [strollers, setStrollers] = useState(0);

    // Other
    const [notes, setNotes] = useState("");
    const [isSignboard, setIsSignboard] = useState(false);
    const [signboardTitle, setSignboardTitle] = useState("");
    const [isPetFriendly, setIsPetFriendly] = useState(false);

    // -- Fetch Data --
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch Vehicles
                const { data: vData } = await supabase.from("vehicle_types").select("*").eq("status", true).order("id");

                // Fetch Extra Settings
                const { data: eData } = await supabase.from("extra_settings").select("*").single();

                if (vData) setVehicles(vData);
                if (eData) setExtraSettings(eData);

                // Restore from session
                const saved = sessionStorage.getItem('booking_ride_info');
                if (saved) {
                    const data = JSON.parse(saved);
                    setSelectedVehicleId(data.vehicleId || vData?.[0]?.id || null);
                    setAdults(data.passengers?.adults || 1);
                    setChildren(data.passengers?.children || 0);
                    setInfantSeats(data.seats?.infant || 0);
                    setChildSeats(data.seats?.child || 0);
                    setBoosters(data.seats?.booster || 0);
                    setLuggageCount(data.luggage?.total || 0);
                    setStrollers(data.luggage?.strollers || 0);
                    setNotes(data.notes || "");
                    if (data.signboard?.needed) {
                        setIsSignboard(true);
                        setSignboardTitle(data.signboard.title || "");
                    }
                    if (data.petFriendly?.needed) {
                        setIsPetFriendly(true);
                    }
                } else if (vData?.[0]) {
                    setSelectedVehicleId(vData[0].id);
                }
            } catch (e) {
                console.error("Failed to fetch data", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // ... (Price Check Logic omitted for brevity, unchanged) ...
    // NOTE: In a real Replace, I would keep the surrounding unchanged code or use MultiReplace if it was far apart?
    // Actually, I am replacing a chunk. I need to be careful not to delete the useEffect inside.
    // Wait, the previous block I selected "Luggage" down to "fetchData" covers lines 26 to 74.
    // But I can't skip the "Price Check Logic" block if I use ReplaceFileContent with a huge block.
    // I should use MultiReplace to insert the state and update the effect.
    // HOWEVER, I am currently using ReplaceFileContent. I should probably switch to MultiReplace or keep the range smaller.
    // Let's look at the TargetContent again. Ah, I see I can't easily reference "..." in the ReplacementContent.
    // I will Cancel this tool call and use MultiReplaceFileContent instead.


    // -- Price Check Logic --
    const [priceMap, setPriceMap] = useState<Record<string, number>>({});
    const [isPriceLoading, setIsPriceLoading] = useState(true);

    useEffect(() => {
        const fetchPrices = async () => {
            // Basic Info from Session
            const basicStr = sessionStorage.getItem('booking_basic_info');
            if (!basicStr) return;

            const bInfo = JSON.parse(basicStr);
            const bookingDate = bInfo.flightInfo?.date || bInfo.pickupTime?.date;

            // 1. Determine Category
            let category = 'weekday';
            const { data: holiday } = await supabase
                .from("holidays")
                .select("price_category")
                .lte("start_date", bookingDate)
                .gte("end_date", bookingDate)
                .eq("status", true)
                .maybeSingle();

            if (holiday) {
                category = holiday.price_category;
            } else {
                const day = new Date(bookingDate).getDay();
                if (day === 0 || day === 6) category = 'holiday';
            }

            // 2. Determine Route (Airport & Region)
            const uiAirport = bInfo.flightInfo?.airport;
            let dbAirport = uiAirport;
            if (uiAirport?.startsWith('tpe')) dbAirport = '桃園機場';
            else if (uiAirport === 'tsa') dbAirport = '松山機場';
            else if (uiAirport === 'rmq') dbAirport = '台中清泉崗機場';
            else if (uiAirport === 'khh') dbAirport = '高雄小港機場';
            else if (uiAirport === 'kel') dbAirport = '基隆港';

            const mainLoc = bInfo.locations[0];
            // Use district logic that matches confirmation page

            // 3. Fetch Price Matrix
            const { data: matrix } = await supabase
                .from("airport_prices")
                .select("prices")
                .eq("airport", dbAirport)
                .eq("region", mainLoc.district)
                .eq("category", category)
                .eq("status", true)
                .maybeSingle();

            if (matrix && matrix.prices) {
                setPriceMap(matrix.prices);
            } else {
                setPriceMap({}); // No prices found for this route
            }
            setIsPriceLoading(false);
        };

        fetchPrices();
    }, []);

    // Effect to auto-switch if selected vehicle becomes unavailable
    useEffect(() => {
        if (!isPriceLoading && vehicles.length > 0) {
            const currentPrice = priceMap[selectedVehicleId || 0];
            // If current selected is invalid (no price or 0), try to find one that is valid
            if (!currentPrice) {
                const firstValid = vehicles.find(v => priceMap[v.id] && priceMap[v.id] > 0);
                if (firstValid) {
                    setSelectedVehicleId(firstValid.id);
                } else {
                    // All invalid? Keep as is or null. 
                    // Consider setting to null to force user to see no selection?
                    // setSelectedVehicleId(null); 
                }
            }
        }
    }, [isPriceLoading, priceMap, vehicles, selectedVehicleId]);


    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
    const totalPassengers = adults + children;

    // -- Calculated Limits --
    const maxPax = selectedVehicle?.max_passengers || 4;
    const baseLuggageLimit = selectedVehicle?.max_luggage || 2;
    const vehicleSeatLimit = selectedVehicle?.safety_seat_limit || 2;

    // Custom Luggage Rules
    // Group A: 經濟四人座, 豪華轎車, 電動專車 ({4:3, 3:3, 2:4, 1:5})
    // Group B: 商務七人座 ({6:0, 5:2, 4:4, 3:4, 2:5, 1:6})
    const LUGGAGE_RULES: Record<string, Record<number, number>> = {
        "經濟四人座": { 4: 3, 3: 3, 2: 4, 1: 5 },
        "豪華轎車": { 4: 3, 3: 3, 2: 4, 1: 5 },
        "電動專車": { 4: 3, 3: 3, 2: 4, 1: 5 },
        "商務七人座": { 7: 0, 6: 0, 5: 2, 4: 4, 3: 4, 2: 5, 1: 6 }
    };

    let dynamicLuggageLimit = baseLuggageLimit;
    let isCustomRule = false;

    if (selectedVehicle && LUGGAGE_RULES[selectedVehicle.name]) {
        const rule = LUGGAGE_RULES[selectedVehicle.name];
        if (rule[totalPassengers] !== undefined) {
            dynamicLuggageLimit = rule[totalPassengers];
            isCustomRule = true;
        } else {
            const emptySeats = Math.max(0, maxPax - totalPassengers);
            dynamicLuggageLimit = baseLuggageLimit + emptySeats;
        }
    } else {
        const emptySeats = Math.max(0, maxPax - totalPassengers);
        dynamicLuggageLimit = baseLuggageLimit + emptySeats;
    }

    // Auto-clamp luggage count if it exceeds limit when conditions change (e.g. passengers inc)
    // NOTE: Srollers count as luggage (1:1)
    useEffect(() => {
        const currentTotal = luggageCount + strollers;
        if (currentTotal > dynamicLuggageLimit) {
            // Priority: keep strollers if possible? Or just reduce luggage?
            // Strategy: Reduce luggage first.
            const overflow = currentTotal - dynamicLuggageLimit;
            if (luggageCount >= overflow) {
                setLuggageCount(luggageCount - overflow);
            } else {
                setLuggageCount(0);
                const remainingOverflow = overflow - luggageCount;
                setStrollers(Math.max(0, strollers - remainingOverflow));
            }
        }
    }, [dynamicLuggageLimit, luggageCount, strollers]);

    const totalSafetySeats = infantSeats + childSeats + boosters;

    // ... (Validation & Handlers - UNCHANGED)
    // ...

    // -- Handlers --

    const handleNext = () => {
        // Validation: Price Check
        const currentPrice = priceMap[selectedVehicleId || 0];
        if (!currentPrice || currentPrice <= 0) {
            alert("抱歉，此車型目前在此路線無提供報價，請選擇其他車型或聯繫客服。");
            return;
        }

        // Validation: Passenger Count
        if (totalPassengers > maxPax) {
            alert(`選擇的車型最多只能載 ${maxPax} 位乘客`);
            return;
        }


        // Validation: Adult Requirement (Min 1 adult if safety seats are used)
        if (totalSafetySeats > 0 && adults < 1) {
            alert("安全座椅需有成人陪同，請至少選擇 1 位成人乘客");
            return;
        }

        // Validation: Safety Seats cannot exceed total passengers - 1 (Adult rule)
        if (totalSafetySeats >= totalPassengers) {
            alert(`安全座椅總量不能超過總人數減一（需保留一位成人座位）`);
            return;
        }

        if (totalSafetySeats > vehicleSeatLimit) {
            alert(`${selectedVehicle.name} 受限於車內空間，最多僅能安裝 ${vehicleSeatLimit} 張安全座椅`);
            return;
        }

        // Validation: Individual Safety Seat limits per vehicle
        if (infantSeats > (selectedVehicle.safety_seat_infant_max || 0)) {
            alert(`${selectedVehicle.name} 最多僅能提供 ${selectedVehicle.safety_seat_infant_max} 個嬰兒座椅`);
            return;
        }
        if (childSeats > (selectedVehicle.safety_seat_child_max || 0)) {
            alert(`${selectedVehicle.name} 最多僅能提供 ${selectedVehicle.safety_seat_child_max} 個兒童座椅`);
            return;
        }
        if (boosters > (selectedVehicle.safety_seat_booster_max || 0)) {
            alert(`${selectedVehicle.name} 最多僅能提供 ${selectedVehicle.safety_seat_booster_max} 個增高座墊`);
            return;
        }

        // Validation: Luggage + Stroller Limit
        if ((luggageCount + strollers) > dynamicLuggageLimit) {
            alert(`目前人數 (${totalPassengers}人) 下，"行李 + 嬰兒車" 總上限為 ${dynamicLuggageLimit} 件`);
            return;
        }

        // Save to storage
        const rideInfo = {
            vehicleId: selectedVehicleId,
            passengers: { adults, children },
            seats: { infant: infantSeats, child: childSeats, booster: boosters },
            luggage: { total: luggageCount, strollers: strollers },
            notes,
            signboard: isSignboard ? {
                needed: true,
                title: signboardTitle,
                price: extraSettings?.signboard_price || 0
            } : { needed: false },
            petFriendly: isPetFriendly ? {
                needed: true,
                price: extraSettings?.pet_friendly_price || 0
            } : { needed: false }
        };
        sessionStorage.setItem('booking_ride_info', JSON.stringify(rideInfo));

        router.push('/booking/confirmation');
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">載入中...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-32 text-gray-900 max-w-[420px] mx-auto relative overflow-hidden flex flex-col">

            {/* Header */}
            <div className="bg-blue-600 px-4 pt-8 pb-10 text-white rounded-b-[40px] shadow-lg relative z-0 mb-[-40px]">
                <button
                    onClick={() => router.push('/booking/form')}
                    className="absolute left-6 top-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition shadow-inner"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>
                <h1 className="text-lg font-bold text-center mt-2">乘車資訊</h1>
            </div>

            <div className="px-4 relative z-10 pt-4 space-y-4">

                {/* 1. Vehicle Selection */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">車型選擇</h2>
                    </div>

                    <div className="space-y-3">
                        {vehicles.map(v => {
                            const hasPrice = priceMap[v.id] && priceMap[v.id] > 0;
                            const isAvailable = !isPriceLoading && hasPrice;

                            return (
                                <div
                                    key={v.id}
                                    onClick={() => isAvailable && setSelectedVehicleId(v.id)}
                                    className={`rounded-2xl p-4 border-2 transition-all flex items-center gap-4 relative overflow-hidden ${!isAvailable
                                        ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed grayscale'
                                        : selectedVehicleId === v.id
                                            ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500 cursor-pointer'
                                            : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50 cursor-pointer'
                                        }`}
                                >
                                    {/* Unavailable Overlay Label */}
                                    {!isAvailable && !isPriceLoading && (
                                        <div className="absolute top-2 right-2 bg-gray-200 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold z-10">
                                            暫無報價
                                        </div>
                                    )}

                                    <div className="w-16 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                        {v.image_url ? (
                                            <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Car size={24} className={selectedVehicleId === v.id ? 'text-blue-600' : 'text-gray-400'} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold text-base ${selectedVehicleId === v.id ? 'text-blue-700' : 'text-gray-900'}`}>
                                            {v.name}
                                        </h3>
                                        <p className="text-xs text-gray-500">最多 {v.max_passengers} 人 | {v.model}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                                                載物 {v.max_luggage} 件
                                            </span>
                                            {v.model_surcharge > 0 && (
                                                <span className="text-[10px] bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 border border-amber-100 font-bold">
                                                    加價 NT$ {v.model_surcharge}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 2. Passenger Count */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">乘客人數</h2>
                    </div>

                    {/* Adult */}
                    <CounterInput
                        label="成人人數"
                        subLabel="12 歲以上"
                        value={adults}
                        onChange={setAdults}
                        min={1}
                        max={maxPax - children}
                    />

                    {/* Child */}
                    <CounterInput
                        label="小孩人數"
                        subLabel="12 歲以下 (依容量) "
                        value={children}
                        onChange={setChildren}
                        min={0}
                        max={maxPax - adults}
                    />
                </div>

                {/* 3. Luggage */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3 flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">行李與嬰兒車</h2>
                            <p className="text-[10px] text-gray-400 mt-1">※ 嬰兒車視同 1 件大行李</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-blue-600 block">目前剩餘額度</span>
                            <span className="text-lg font-black text-blue-700">{Math.max(0, dynamicLuggageLimit - luggageCount - strollers)} </span>
                            <span className="text-xs text-blue-600">件</span>
                        </div>
                    </div>
                    {isCustomRule ? (
                        <div className="bg-blue-50 p-3 rounded-2xl flex items-start gap-2 border border-blue-100 animate-in fade-in duration-300">
                            <AlertCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                                依照此車型配置，<span className="font-bold">{totalPassengers} 人</span> 最多可攜帶 <span className="font-bold text-blue-800 underline">{dynamicLuggageLimit} 件</span> (含行李+嬰兒車)。
                            </p>
                        </div>
                    ) : (
                        (maxPax - totalPassengers) > 0 && (
                            <div className="bg-blue-50 p-3 rounded-2xl flex items-start gap-2 border border-blue-100 animate-in fade-in duration-300">
                                <AlertCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
                                <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                                    偵測到有空位！已為您自動增加 <span className="underline font-bold text-blue-800">{Math.max(0, maxPax - totalPassengers)} 件</span> 額度 (可放置於座位區)。
                                </p>
                            </div>
                        )
                    )}

                    {/* Strollers Input */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                        <div>
                            <div className="font-bold text-gray-900">嬰兒車</div>
                            <div className="text-[10px] text-gray-400 font-medium">需折疊 (扣除 1 件行李額度)</div>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                            <button
                                onClick={() => setStrollers(Math.max(0, strollers - 1))}
                                disabled={strollers <= 0}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${strollers <= 0 ? 'text-gray-300 cursor-not-allowed' : 'bg-white text-gray-700 shadow-sm hover:scale-105'}`}
                            >
                                <Minus size={18} strokeWidth={3} />
                            </button>
                            <span className="w-6 text-center font-black text-lg text-gray-900">{strollers}</span>
                            <button
                                onClick={() => setStrollers(strollers + 1)}
                                disabled={(luggageCount + strollers) >= dynamicLuggageLimit}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${(luggageCount + strollers) >= dynamicLuggageLimit ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:scale-105'}`}
                            >
                                <Plus size={18} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {/* Unified Luggage Input */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                        <div>
                            <div className="font-bold text-gray-900">大行李</div>
                            <div className="text-[10px] text-gray-400 font-medium">26-29 吋</div>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                            <button
                                onClick={() => setLuggageCount(Math.max(0, luggageCount - 1))}
                                disabled={luggageCount <= 0}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${luggageCount <= 0 ? 'text-gray-300 cursor-not-allowed' : 'bg-white text-gray-700 shadow-sm hover:scale-105'}`}
                            >
                                <Minus size={18} strokeWidth={3} />
                            </button>
                            <span className="w-6 text-center font-black text-lg text-gray-900">{luggageCount}</span>
                            <button
                                onClick={() => setLuggageCount(luggageCount + 1)}
                                disabled={(luggageCount + strollers) >= dynamicLuggageLimit}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${(luggageCount + strollers) >= dynamicLuggageLimit ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:scale-105'}`}
                            >
                                <Plus size={18} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4. Safety Seats */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">安全座椅</h2>
                        <p className="text-xs text-blue-600 font-bold mt-1">
                            依規定 4 歲或體重未達 18 公斤需使用
                            <span className="text-gray-400 font-normal ml-2 list-none">
                                (本車型最多可裝 {vehicleSeatLimit} 張)
                            </span>
                        </p>
                    </div>

                    <IconCounterRow
                        label="嬰兒座椅 (0-1歲)"
                        subLabel={`需加價 $${extraSettings?.safety_seat_infant_price || 0}`}
                        value={infantSeats}
                        onChange={setInfantSeats}
                        icon={<Armchair size={18} className="text-blue-500" />}
                        limit={Math.min(selectedVehicle?.safety_seat_infant_max || 0, infantSeats + (vehicleSeatLimit - totalSafetySeats))}
                    />

                    <IconCounterRow
                        label="幼童座椅 (1-4歲)"
                        subLabel={`需加價 $${extraSettings?.safety_seat_child_price || 0}`}
                        value={childSeats}
                        onChange={setChildSeats}
                        icon={<Armchair size={18} className="text-blue-600" />}
                        limit={Math.min(selectedVehicle?.safety_seat_child_max || 0, childSeats + (vehicleSeatLimit - totalSafetySeats))}
                    />

                    <IconCounterRow
                        label="增高座墊 (4-7歲)"
                        subLabel={`需加價 $${extraSettings?.safety_seat_booster_price || 0}`}
                        value={boosters}
                        onChange={setBoosters}
                        icon={<Armchair size={18} className="text-indigo-600" />}
                        limit={Math.min(selectedVehicle?.safety_seat_booster_max || 0, boosters + (vehicleSeatLimit - totalSafetySeats))}
                    />
                </div>

                {/* 5. Other Requests */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-2">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">其他需求</h2>
                    </div>
                    <textarea
                        className="w-full p-4 border border-gray-100 bg-gray-50 rounded-2xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] transition-all"
                        placeholder="例如：有一個輪椅、嬰兒推車、高爾夫球具..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                {/* 6. Signboard Service */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">舉牌服務</h2>
                        <p className="text-xs text-gray-500 mt-1">※ 需加價 NT$ {extraSettings?.signboard_price || 0} / 張</p>
                    </div>

                    <label className="flex items-center gap-4 cursor-pointer group">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSignboard ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 group-hover:border-blue-400'}`}>
                            {isSignboard && <Plus size={16} strokeWidth={4} />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={isSignboard}
                            onChange={(e) => setIsSignboard(e.target.checked)}
                        />
                        <span className="font-bold text-gray-700">需要舉牌服務</span>
                    </label>

                    {isSignboard && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                            <input
                                type="text"
                                className="w-full p-4 border border-gray-100 bg-blue-50/30 rounded-2xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="請輸入舉牌內容（例如：王小明 先生）"
                                value={signboardTitle}
                                onChange={(e) => setSignboardTitle(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* 7. Pet Friendly Service */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">寵物友善</h2>
                        <p className="text-xs text-gray-500 mt-1">※ 需加價 NT$ {extraSettings?.pet_friendly_price || 0} / 趟</p>
                    </div>

                    <label className="flex items-center gap-4 cursor-pointer group">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isPetFriendly ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 group-hover:border-blue-400'}`}>
                            {isPetFriendly && <Plus size={16} strokeWidth={4} />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={isPetFriendly}
                            onChange={(e) => setIsPetFriendly(e.target.checked)}
                        />
                        <span className="font-bold text-gray-700">攜帶寵物同行 (需自備提籠)</span>
                    </label>
                </div>

            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 p-4 pb-8 z-30 flex justify-center">
                <div className="w-full max-w-[420px] flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xs text-blue-600 font-bold">$</span>
                            <span className="text-2xl font-black text-gray-900">----</span>
                            <span className="text-[10px] text-gray-400 font-medium">下一步預覽預估價</span>
                        </div>
                    </div>
                    <button
                        onClick={handleNext}
                        className="flex-1 py-4 rounded-2xl font-bold text-lg bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        下一步
                    </button>
                </div>
            </div>

        </div>
    );
}

function CounterInput({ label, subLabel, value, onChange, min, max }: any) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
            <div>
                <div className="font-bold text-gray-900">{label}</div>
                <div className="text-[10px] text-gray-400 font-medium">{subLabel}</div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <button
                    onClick={() => onChange(Math.max(min, value - 1))}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${value <= min ? 'text-gray-300' : 'bg-white text-gray-700 shadow-sm hover:scale-105'}`}
                >
                    <Minus size={18} strokeWidth={3} />
                </button>
                <span className="w-6 text-center font-black text-lg text-gray-900">{value}</span>
                <button
                    onClick={() => onChange(Math.min(max, value + 1))}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${value >= max ? 'text-gray-300' : 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:scale-105'}`}
                >
                    <Plus size={18} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
}

function IconCounterRow({ label, subLabel, value, onChange, icon, limit }: any) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 group">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                    {icon}
                </div>
                <div>
                    <div className="font-bold text-gray-900 text-sm whitespace-nowrap">{label}</div>
                    <div className="text-[10px] text-gray-400 font-bold">{subLabel}</div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button
                        onClick={() => onChange(Math.max(0, value - 1))}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${value === 0 ? 'text-gray-300' : 'bg-white text-gray-700 shadow-sm'}`}
                    >
                        <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="w-4 text-center font-bold text-gray-900">{value}</span>
                    <button
                        onClick={() => onChange(Math.min(limit, value + 1))}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${value >= limit ? 'text-gray-300' : 'bg-blue-600 text-white shadow-md'}`}
                    >
                        <Plus size={16} strokeWidth={3} />
                    </button>
                </div>
                <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">張 (限 {limit})</span>
            </div>
        </div>
    )
}


