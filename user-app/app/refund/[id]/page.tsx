"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, ChevronDown } from "lucide-react";

export default function RefundPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [bank, setBank] = useState("");
    const [account, setAccount] = useState("");
    const [reason, setReason] = useState("");

    // Submit State
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        // Load Order
        // Try finding in all user stores or just iterate all orders for demo (since we don't have auth context easily here without more lifting)
        // Actually, let's grab from the current user's session if possible, or just search all localStorage keys for 'orders_'

        // Simpler: Just try to find the specific order in the known demo key if simpler, 
        // OR better: search all 'orders_A123...' keys. 
        // For this demo, let's assume we are A123456789 or just look in the specific key.
        const acc = sessionStorage.getItem('memberAccount') || 'A123456789';
        const uOrders = JSON.parse(localStorage.getItem(`orders_${acc}`) || "[]");
        const found = uOrders.find((o: any) => o.orderId === id);

        if (found) {
            setOrder(found);
        } else {
            // Fallback for direct link test without login
            setOrder(null);
        }
        setLoading(false);
    }, [id]);

    const formatAccount = (val: string) => {
        // Remove non-digits
        const nums = val.replace(/\D/g, '');
        // Group by 4? typical bank account logic depends, but user asked for "Auto grouping" visual
        // Let's just do spaces every 4 for demo
        return nums.replace(/(.{4})/g, '$1 ').trim();
    };

    const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const raw = val.replace(/\s/g, '');
        if (/^\d*$/.test(raw)) {
            setAccount(raw);
        }
    };

    const handleSubmit = () => {
        if (!bank || !account || !reason) {
            alert("請填寫完整退款資訊");
            return;
        }

        if (confirm("確認送出退款申請？\n送出後訂單將被取消。")) {
            setIsSubmitting(true);

            // Update Order Status
            const acc = sessionStorage.getItem('memberAccount') || 'A123456789';
            const uOrders = JSON.parse(localStorage.getItem(`orders_${acc}`) || "[]");
            const idx = uOrders.findIndex((o: any) => o.orderId === id);

            if (idx >= 0) {
                uOrders[idx].status = 'refund_pending'; // Custom status for Control App to catch
                uOrders[idx].refundData = {
                    bank,
                    account,
                    reason,
                    appliedAt: new Date().toISOString()
                };
                localStorage.setItem(`orders_${acc}`, JSON.stringify(uOrders));

                setTimeout(() => {
                    alert("已發起退款通知，退款約需 3-5 個工作日。");
                    router.push('/dashboard');
                }, 1000);
            }
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-50 p-6 text-center text-gray-500">載入中...</div>;
    if (!order) return <div className="min-h-screen bg-gray-50 p-6 text-center text-gray-500">訂單不存在</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-10 text-gray-900 max-w-[420px] mx-auto relative overflow-hidden flex flex-col">

            {/* Header - Styled as requested */}
            <div className="bg-blue-600 px-4 pt-6 pb-6 text-white rounded-b-[30px] shadow-md relative z-10">
                <button
                    onClick={() => router.back()}
                    className="absolute left-6 top-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>
                <h1 className="text-xl font-bold text-center mt-1">申請退款</h1>
            </div>

            <div className="p-4 space-y-4">
                {/* Order Info Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-800">訂單編號</span>
                            <span className="text-gray-600 font-medium">{order.orderId}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-800">預約時間</span>
                            <span className="text-gray-600 font-medium">{order.date}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-800">應付總額</span>
                            <span className="text-blue-600 text-lg font-bold">{order.total?.toLocaleString() || 0} 元</span>
                        </div>
                    </div>
                    <div className="h-px bg-gray-100 mb-3"></div>
                    <p className="text-xs text-gray-400">請確認要取消的訂單資訊無誤。</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5">

                    {/* Bank Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">銀行名稱</label>
                        <div className="relative">
                            <select
                                value={bank}
                                onChange={e => setBank(e.target.value)}
                                className={`w-full p-3.5 bg-white border border-gray-300 rounded-2xl appearance-none font-bold text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${!bank ? 'text-gray-400' : ''}`}
                            >
                                <option value="" disabled>請選擇銀行</option>
                                <option value="004">台灣銀行 (004)</option>
                                <option value="822">中國信託商業銀行 (822)</option>
                                <option value="812">台新國際商業銀行 (812)</option>
                                <option value="013">國泰世華銀行 (013)</option>
                                <option value="808">玉山商業銀行 (808)</option>
                                <option value="807">永豐銀行 (807)</option>
                                <option value="007">第一商業銀行 (007)</option>
                                <option value="009">彰化銀行 (009)</option>
                                <option value="006">合作金庫商業銀行 (006)</option>
                                <option value="017">兆豐國際商業銀行 (017)</option>
                                <option value="008">華南商業銀行 (008)</option>
                                <option value="005">土地銀行 (005)</option>
                                <option value="052">渣打銀行 (052)</option>
                                <option value="810">星展銀行 (810)</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Bank Account */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">銀行帳號</label>
                        <input
                            type="text"
                            value={formatAccount(account)}
                            onChange={handleAccountChange}
                            placeholder="請輸入退款帳號（僅數字）"
                            className="w-full p-3.5 bg-white border border-gray-300 rounded-2xl font-bold text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">輸入時自動分組顯示，送出前會去除空白。</p>
                    </div>

                    {/* Reason */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">取消原因</label>
                        <div className="relative">
                            <select
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                className={`w-full p-3.5 bg-white border border-gray-300 rounded-2xl appearance-none font-bold text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${!reason ? 'text-gray-400' : ''}`}
                            >
                                <option value="" disabled>請選擇原因</option>
                                <option value="plan_change">行程變更 / 取消</option>
                                <option value="driver_request">司機要求取消</option>
                                <option value="other">其他原因</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? '處理中...' : '確認申請退款'}
                        </button>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-2">確認後將取消訂單，退款約需 3-5 個工作日。</p>
            </div>
        </div>
    );
}
