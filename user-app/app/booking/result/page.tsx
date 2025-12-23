"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, X, Home, FileText, Phone, ArrowLeft } from "lucide-react";

function BookingResult() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'success' | 'failure'>('success');

    // Order Data
    const [orderId, setOrderId] = useState("");
    const [amount, setAmount] = useState(0);
    const [passengers, setPassengers] = useState(0);

    useEffect(() => {
        // Read params
        const s = searchParams.get('status');
        const oid = searchParams.get('orderId');

        if (s === 'failure') {
            setStatus('failure');
        } else {
            setStatus('success');
        }

        if (oid) {
            setOrderId(oid);
            // Try to load order details from localStorage to simulate real data
            // In a real app, this might come from an API
            const account = sessionStorage.getItem('memberAccount');
            // Try specific user first, then global
            let orders = [];
            if (account) {
                orders = JSON.parse(localStorage.getItem(`orders_${account}`) || '[]');
            }
            if (orders.length === 0) {
                orders = JSON.parse(localStorage.getItem('orders') || '[]');
            }

            const order = orders.find((o: any) => o.id === oid);
            if (order) {
                setAmount(order.totalAmount || 0);
                // Calculate passengers
                const p = (order.passengers?.adults || 0) + (order.passengers?.children || 0);
                setPassengers(p);
            }
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 max-w-[420px] mx-auto relative overflow-hidden flex flex-col">

            {/* Header (No Back Button on result page usually, or back to home) */}
            <div className="bg-transparent px-4 py-6 text-gray-900 relative z-0">
                <h1 className="text-2xl font-bold text-center">付款結果</h1>
            </div>

            <div className="px-4 space-y-4 flex-1">

                <div className="space-y-8">
                    {/* Success Card */}
                    <div className="bg-white rounded-[32px] p-8 shadow-lg border border-blue-100 text-center space-y-6 relative overflow-hidden">

                        {/* Status Badge */}
                        <div className="absolute top-8 right-8 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full">
                            本次狀態
                        </div>

                        {/* Icon */}
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                            <Check className="text-blue-600" size={40} strokeWidth={3} />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900">付款成功</h2>
                            <div className="text-sm text-gray-500 space-y-1">
                                <p>訂單編號：</p>
                                <p className="font-bold text-gray-700 text-lg tracking-wider">{orderId || "CH202512110001"}</p>
                            </div>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                            <p>實付金額：<span className="font-bold text-gray-900">{amount.toLocaleString()} 元</span></p>
                            <p>乘客人數：<span className="font-bold text-gray-900">{passengers} 人</span></p>
                        </div>

                        <p className="text-sm text-gray-500 text-left bg-gray-50 p-4 rounded-xl leading-relaxed">
                            我們會在啟程前一天透過Email與簡訊提供乘車提醒與司機資訊。
                        </p>

                        <div className="pt-2">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
                            >
                                查看訂單
                            </button>
                        </div>
                    </div>

                    {/* Failure Card (Demo Display) */}
                    <div className="bg-white rounded-[32px] p-8 shadow-lg border border-gray-100 text-center space-y-6">
                        {/* Icon */}
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <X className="text-gray-500" size={40} strokeWidth={3} />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900">付款未完成</h2>
                        </div>

                        <div className="text-left text-sm text-gray-500 space-y-4 bg-gray-50 p-5 rounded-2xl">
                            <p>可能原因：驗證逾時、餘額不足或 3D 驗證未通過。</p>
                            <p>可稍後再試或更換付款方式，如需協助請聯絡客服。</p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => router.push('/booking/payment')}
                                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
                            >
                                回到付款
                            </button>
                            <button
                                onClick={() => window.location.href = 'tel:0800000000'}
                                className="flex-1 py-3 bg-white text-blue-600 border border-blue-200 font-bold rounded-xl hover:bg-blue-50 transition"
                            >
                                聯絡客服
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function BookingResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <BookingResult />
        </Suspense>
    );
}
