"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Car, Users, Briefcase, Armchair, AlertCircle } from "lucide-react";
import { VEHICLES } from "./data";

export default function RideInfoPage() {
    const router = useRouter();

    // -- State --
    const [selectedVehicleId, setSelectedVehicleId] = useState<number>(VEHICLES[0].id);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    // Safety Seats
    const [infantSeats, setInfantSeats] = useState(0); // 0-1 yo / <10kg
    const [childSeats, setChildSeats] = useState(0);   // 1-4 yo / <18kg
    const [boosters, setBoosters] = useState(0);       // 4-12 yo

    // Luggage
    const [luggageS, setLuggageS] = useState(0); // 20 inch below
    const [luggageM, setLuggageM] = useState(0); // 21-25 inch
    const [luggageL, setLuggageL] = useState(0); // 26-28 inch

    // Other
    const [notes, setNotes] = useState("");
    const [isSignboard, setIsSignboard] = useState(false);
    const [signboardTitle, setSignboardTitle] = useState("");

    const selectedVehicle = VEHICLES.find(v => v.id === selectedVehicleId) || VEHICLES[0];
    const totalPassengers = adults + children;
    const maxPax = selectedVehicle.maxPassengers;

    useEffect(() => {
        const saved = sessionStorage.getItem('booking_ride_info');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setSelectedVehicleId(data.vehicleId || VEHICLES[0].id);
                setAdults(data.passengers?.adults || 1);
                setChildren(data.passengers?.children || 0);
                setInfantSeats(data.seats?.infant || 0);
                setChildSeats(data.seats?.child || 0);
                setBoosters(data.seats?.booster || 0);
                setLuggageS(data.luggage?.s || 0);
                setLuggageM(data.luggage?.m || 0);
                setLuggageL(data.luggage?.l || 0);
                setNotes(data.notes || "");
                if (data.signboard?.needed) {
                    setIsSignboard(true);
                    setSignboardTitle(data.signboard.title || "");
                }
            } catch (e) {
                console.error("Failed to restore ride info", e);
            }
        }
    }, []);

    // -- Handlers --

    const handleNext = () => {
        // Validation
        if (totalPassengers > maxPax) {
            alert(`選擇的車型最多只能載 ${maxPax} 位乘客`);
            return;
        }

        // Save to storage (Mock)
        const rideInfo = {
            vehicleId: selectedVehicleId,
            passengers: { adults, children },
            seats: { infant: infantSeats, child: childSeats, booster: boosters },
            luggage: { s: luggageS, m: luggageM, l: luggageL },
            notes,
            signboard: isSignboard ? { needed: true, title: signboardTitle, price: selectedVehicle.signboardPrice } : { needed: false }
        };
        sessionStorage.setItem('booking_ride_info', JSON.stringify(rideInfo));

        router.push('/booking/confirmation');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32 text-gray-900 max-w-[420px] mx-auto relative overflow-hidden flex flex-col">

            {/* Header */}
            <div className="bg-blue-600 px-4 pt-8 pb-10 text-white rounded-b-[40px] shadow-lg relative z-0 mb-[-40px]">
                <button
                    onClick={() => router.push('/booking/form')}
                    className="absolute left-6 top-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition"
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
                    <p className="text-xs text-blue-600 font-medium ml-4">豪華/商務 + NT${selectedVehicle.modelSurcharge || 400}</p>

                    <div className="space-y-3">
                        {VEHICLES.map(v => (
                            <div
                                key={v.id}
                                onClick={() => setSelectedVehicleId(v.id)}
                                className={`rounded-2xl p-4 border-2 cursor-pointer transition-all flex items-center gap-4 ${selectedVehicleId === v.id
                                    ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500'
                                    : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Car size={24} className={selectedVehicleId === v.id ? 'text-blue-600' : 'text-gray-400'} />
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-bold text-base ${selectedVehicleId === v.id ? 'text-blue-700' : 'text-gray-900'}`}>
                                        {v.name} {selectedVehicleId === v.id && ' (已選)'}
                                    </h3>
                                    <p className="text-xs text-gray-500">最多 {v.maxPassengers} 人 | {v.model}</p>
                                    <p className="text-sm font-bold text-blue-600 mt-1">
                                        {v.modelSurcharge > 0 ? `+ NT$ ${v.modelSurcharge}` : '含基本價'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Passenger Count */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">乘客人數</h2>
                    </div>

                    {/* Adult */}
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                            <div className="font-bold text-gray-900">成人人數</div>
                            <div className="text-xs text-gray-400">12 歲以上</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                className="w-20 p-2 text-center border border-gray-300 rounded-xl font-medium text-sm outline-none focus:border-blue-500"
                                value={adults}
                                onChange={(e) => {
                                    const val = Math.max(1, parseInt(e.target.value) || 0);
                                    if (val + children <= maxPax) {
                                        setAdults(val);
                                    } else {
                                        // Best UX: prevent exceeding max.
                                        setAdults(Math.min(val, maxPax - children));
                                    }
                                }}
                                min={1}
                                max={maxPax - children}
                            />
                            <span className="text-sm font-bold text-gray-600">位</span>
                        </div>
                    </div>

                    {/* Child */}
                    <div className="flex justify-between items-center py-2">
                        <div>
                            <div className="font-bold text-gray-900">小孩人數</div>
                            <div className="text-xs text-gray-400 max-w-[150px]">12 歲以下 (依車型容量自動調整上限)</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                className="w-20 p-2 text-center border border-gray-300 rounded-xl font-medium text-sm outline-none focus:border-blue-500"
                                value={children}
                                onChange={(e) => {
                                    const val = Math.max(0, parseInt(e.target.value) || 0);
                                    if (val + adults <= maxPax) {
                                        setChildren(val);
                                    } else {
                                        setChildren(Math.min(val, maxPax - adults));
                                    }
                                }}
                                min={0}
                                max={maxPax - adults}
                            />
                            <span className="text-sm font-bold text-gray-600">位</span>
                        </div>
                    </div>
                </div>

                {/* 3. Safety Seats */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">安全座椅</h2>
                        <p className="text-xs text-blue-600 font-bold mt-1">依規定 4 歲或體重未達 18 公斤需使用安全座椅</p>
                    </div>

                    {/* Infant */}
                    <CounterRow
                        label="後向式安全座椅"
                        subLabel="0-4 歲或 ≤18kg"
                        value={infantSeats}
                        onChange={setInfantSeats}
                        price={selectedVehicle.safetySeatInfantPrice}
                    />

                    {/* Child */}
                    <CounterRow
                        label="前向式安全座椅"
                        subLabel="0-4 歲且 ≤18kg"
                        value={childSeats}
                        onChange={setChildSeats}
                        price={selectedVehicle.safetySeatChildPrice}
                    />

                    {/* Booster */}
                    <CounterRow
                        label="增高座墊"
                        subLabel="4-12 歲或 18-36kg"
                        value={boosters}
                        onChange={setBoosters}
                        price={selectedVehicle.safetySeatBoosterPrice}
                    />
                </div>

                {/* 4. Luggage */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">行李件數</h2>
                        <p className="text-xs text-blue-600 font-medium mt-1">所有行李需置於後車廂</p>
                    </div>

                    <LuggageRow label="20 吋以下" value={luggageS} onChange={setLuggageS} />
                    <LuggageRow label="21–25 吋" value={luggageM} onChange={setLuggageM} />
                    <LuggageRow label="26–28 吋" value={luggageL} onChange={setLuggageL} />
                </div>

                {/* 5. Other Requests */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-2">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">其他需求</h2>
                    </div>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-xl font-medium text-sm outline-none focus:border-blue-500 min-h-[100px]"
                        placeholder="例如：有一個輪椅、嬰兒推車、高爾夫球具..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                {/* 6. Signboard Service */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">舉牌服務</h2>
                        <p className="text-xs text-gray-500 mt-1">※ 需加價 NT$ {selectedVehicle.signboardPrice} / 張</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="signboard"
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={isSignboard}
                                onChange={(e) => setIsSignboard(e.target.checked)}
                            />
                            <label htmlFor="signboard" className="font-bold text-gray-700">需要舉牌</label>
                        </div>
                    </div>

                    {isSignboard && (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-xl font-medium text-sm outline-none focus:border-blue-500"
                                placeholder="請輸入舉牌內容（例如：王小明 先生）"
                                value={signboardTitle}
                                onChange={(e) => setSignboardTitle(e.target.value)}
                            />
                        </div>
                    )}
                </div>

            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 z-20 flex gap-3 justify-center">
                <div className="w-full max-w-[420px]">
                    <button
                        onClick={handleNext}
                        className="w-full py-3.5 rounded-xl font-bold text-lg bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition flex items-center justify-center gap-2"
                    >
                        訂單資訊
                    </button>
                </div>
            </div>

        </div>
    );
}

function CounterRow({ label, subLabel, value, onChange, price }: any) {
    return (
        <div className="flex justify-between items-center py-2 border-b last:border-0 border-gray-50">
            <div>
                <div className="font-bold text-gray-900">{label}</div>
                {subLabel && <div className="text-xs text-gray-400">{subLabel}</div>}
                {price > 0 && <div className="text-xs text-blue-600 font-bold mt-0.5">+${price}/張</div>}
            </div>
            <div className="flex items-center gap-3">
                <input
                    type="number"
                    className="w-20 p-2 text-center border border-gray-300 rounded-xl font-medium text-sm outline-none focus:border-blue-500"
                    value={value}
                    onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
                    min={0}
                />
                <span className="text-sm font-bold text-gray-600 w-8 text-right">張</span>
            </div>
        </div>
    )
}

function LuggageRow({ label, value, onChange }: any) {
    return (
        <div className="flex justify-between items-center py-2">
            <div className="font-bold text-gray-900">{label}</div>
            <div className="flex items-center gap-3">
                <input
                    type="number"
                    className="w-20 p-2 text-center border border-gray-300 rounded-xl font-medium text-sm outline-none focus:border-blue-500"
                    value={value}
                    onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
                    min={0}
                    placeholder="0"
                />
                <span className="text-sm font-bold text-gray-600 w-8 text-right">件</span>
            </div>
        </div>
    )
}
