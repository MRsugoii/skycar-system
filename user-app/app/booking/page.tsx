"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BookingPage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<'pickup_airport' | 'pickup_port' | 'dropoff_airport' | 'dropoff_port' | null>(null);

    const handleStart = () => {
        if (!selectedType) {
            alert('請先選擇服務類型');
            return;
        }
        if (selectedType.startsWith('pickup')) {
            router.push('/booking/form?type=pickup');
        } else {
            router.push('/booking/form?type=dropoff');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10 text-gray-900 max-w-[420px] mx-auto relative overflow-hidden flex flex-col">

            {/* Custom Header with Blue Background */}
            <div className="bg-blue-600 px-4 pt-8 pb-10 text-white rounded-b-[40px] shadow-lg relative z-0 mb-[-40px]">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="absolute left-6 top-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>
                <h1 className="text-lg font-bold text-center mt-2">機場 / 港口接送</h1>
            </div>

            <div className="px-4 relative z-10 pt-4">
                <div className="bg-white rounded-3xl shadow-xl p-6 min-h-[500px] flex flex-col">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">請選擇服務類型</h2>

                    <div className="space-y-3 flex-1">
                        {/* Option 1: Airport Pickup */}
                        <div
                            onClick={() => setSelectedType('pickup_airport')}
                            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 flex items-center gap-4 ${selectedType === 'pickup_airport'
                                ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500'
                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedType === 'pickup_airport' ? 'border-blue-500' : 'border-gray-300'
                                }`}>
                                {selectedType === 'pickup_airport' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                            </div>
                            <div>
                                <div className={`text-base font-bold mb-0.5 ${selectedType === 'pickup_airport' ? 'text-blue-700' : 'text-gray-900'}`}>
                                    回國接機
                                </div>
                                <div className="text-xs text-gray-500">機場 → 目的地</div>
                            </div>
                        </div>

                        {/* Option 2: Port Pickup */}
                        <div
                            onClick={() => setSelectedType('pickup_port')}
                            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 flex items-center gap-4 ${selectedType === 'pickup_port'
                                ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500'
                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedType === 'pickup_port' ? 'border-blue-500' : 'border-gray-300'
                                }`}>
                                {selectedType === 'pickup_port' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                            </div>
                            <div>
                                <div className={`text-base font-bold mb-0.5 ${selectedType === 'pickup_port' ? 'text-blue-700' : 'text-gray-900'}`}>
                                    港口出發
                                </div>
                                <div className="text-xs text-gray-500">港口 → 目的地</div>
                            </div>
                        </div>

                        {/* Option 3: Airport Dropoff */}
                        <div
                            onClick={() => setSelectedType('dropoff_airport')}
                            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 flex items-center gap-4 ${selectedType === 'dropoff_airport'
                                ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500'
                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedType === 'dropoff_airport' ? 'border-blue-500' : 'border-gray-300'
                                }`}>
                                {selectedType === 'dropoff_airport' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                            </div>
                            <div>
                                <div className={`text-base font-bold mb-0.5 ${selectedType === 'dropoff_airport' ? 'text-blue-700' : 'text-gray-900'}`}>
                                    出國送機
                                </div>
                                <div className="text-xs text-gray-500">集合地 → 機場</div>
                            </div>
                        </div>

                        {/* Option 4: Port Dropoff */}
                        <div
                            onClick={() => setSelectedType('dropoff_port')}
                            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 flex items-center gap-4 ${selectedType === 'dropoff_port'
                                ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500'
                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedType === 'dropoff_port' ? 'border-blue-500' : 'border-gray-300'
                                }`}>
                                {selectedType === 'dropoff_port' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                            </div>
                            <div>
                                <div className={`text-base font-bold mb-0.5 ${selectedType === 'dropoff_port' ? 'text-blue-700' : 'text-gray-900'}`}>
                                    送到港口
                                </div>
                                <div className="text-xs text-gray-500">集合地 → 港口</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <p className="text-gray-400 text-sm mb-4 text-center">選擇完成後，點「開始預約」前往對應頁面。</p>
                        <div className="mt-8">
                            <button
                                onClick={handleStart}
                                disabled={!selectedType}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${selectedType
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 active:scale-95'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                開始預約
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
