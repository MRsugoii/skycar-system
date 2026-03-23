"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DollarSign, Ticket, Briefcase, Save, Percent, Moon, Plane, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DriverBonusPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Default Settings
    const [settings, setSettings] = useState({
        global_commission_rate: 80, // percentage (0-100)
        night_bonus: 0, // fixed amount
        airport_bonus: 0, // fixed amount
        holiday_bonus: 0 // fixed amount
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('admin_settings')
                    .select('*')
                    .eq('key', 'driver_bonus')
                    .single();

                if (error && error.code !== 'PGRST116') {
                    // Ignore not found error as we will create it on save
                    console.error("Error fetching driver bonus settings:", error);
                }

                if (data && data.value) {
                    setSettings({
                        global_commission_rate: data.value.global_commission_rate ?? 80,
                        night_bonus: data.value.night_bonus ?? 0,
                        airport_bonus: data.value.airport_bonus ?? 0,
                        holiday_bonus: data.value.holiday_bonus ?? 0
                    });
                }
            } catch (err) {
                console.error("Fetch setting failed:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('admin_settings')
                .upsert({ 
                    key: 'driver_bonus', 
                    value: settings 
                });

            if (error) throw error;
            alert("司機加成設定已成功儲存！");
        } catch (err: any) {
            console.error(err);
            alert("儲存失敗：" + (err.message || "未知錯誤"));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">前台管理</h1>
                    <p className="text-sm text-gray-500 mt-1">管理車輛資訊、優惠卷與司機加成設定。</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-8 mb-4">
                    <Link
                        href="/vehicles"
                        className="pb-3 text-base font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-2"
                    >
                        <DollarSign size={18} />
                        價格管理
                    </Link>
                    <Link
                        href="/coupons"
                        className="pb-3 text-base font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-2"
                    >
                        <Ticket size={18} />
                        優惠卷管理
                    </Link>
                    <Link
                        href="/driver-bonus"
                        className="pb-3 text-base font-bold border-b-2 transition-colors border-blue-600 text-blue-600 flex items-center gap-2"
                    >
                        <Briefcase size={18} />
                        司機加成
                    </Link>
                </nav>
            </div>
            
            <div className="pt-2 max-w-4xl">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">載入設定中...</div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Briefcase size={20} className="text-blue-600" />
                                司機派單抽成與加給設定
                            </h2>
                        </div>
                        
                        <div className="p-6 space-y-8">
                            {/* Commission Rate */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                                    <Percent size={16} className="text-emerald-500" />
                                    平台基礎抽成比例
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700">司機抽成比例 (%)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={settings.global_commission_rate}
                                                onChange={(e) => setSettings({...settings, global_commission_rate: Number(e.target.value)})}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-lg font-bold text-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-8"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                            預設 80%。即：訂單總額 $1,000 元，司機可獲得 $800 元，平台抽取 $200 元。
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Extra Fixed Bonuses */}
                            <div className="space-y-4 pt-2">
                                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                                    <Plus size={16} className="text-orange-500" />
                                    特定條件司機額外加成 (固定金額)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            <Moon size={14} className="text-gray-400" /> 
                                            夜間時段加給
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                            <input
                                                type="number"
                                                value={settings.night_bonus}
                                                onChange={(e) => setSettings({...settings, night_bonus: Number(e.target.value)})}
                                                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            <Plane size={14} className="text-gray-400" /> 
                                            機場單額外加給
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                            <input
                                                type="number"
                                                value={settings.airport_bonus}
                                                onChange={(e) => setSettings({...settings, airport_bonus: Number(e.target.value)})}
                                                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            <Plus size={14} className="text-gray-400" /> 
                                            國定假日加給
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                            <input
                                                type="number"
                                                value={settings.holiday_bonus}
                                                onChange={(e) => setSettings({...settings, holiday_bonus: Number(e.target.value)})}
                                                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 bg-gray-50 p-3 rounded border border-gray-100">
                                    註：額外加給會直接疊加在計算過比例的「司機實收金額」中，不會與平台分享。例如：抽成 80%，夜間加給 100 元，訂單總額 1,000 元的情況下，司機可獲得 (1000 * 0.8) + 100 = 900 元。若無特別加給請設為 0。
                                </p>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {isSaving ? "儲存中..." : "儲存設定"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
