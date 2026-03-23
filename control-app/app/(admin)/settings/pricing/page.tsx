"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Plus, Trash2, Calendar, Moon, Car, MapPin, DollarSign, Settings, Loader2 } from "lucide-react";

// Types
type HolidayRule = {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    type: "FIXED" | "MULTIPLIER";
    value: number;
    priority: number;
};

type GlobalSettings = {
    night_surcharge?: { start_time: string; end_time: string; surcharge: number; type: string };
    addon_prices?: { signage: number; seat_rear: number; seat_front: number; seat_booster: number; stop_point: number; pet_friendly: number };
};

type PriceRow = {
    id: number;
    airport: string;
    region: string;
    prices: Record<string, number>; // car_type_id -> price
    remote_surcharge: number;
};

export default function PricingPage() {
    const [activeTab, setActiveTab] = useState<"general" | "holidays" | "matrix">("general");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data State
    const [settings, setSettings] = useState<GlobalSettings>({});
    const [holidays, setHolidays] = useState<HolidayRule[]>([]);
    const [matrix, setMatrix] = useState<PriceRow[]>([]);

    // Filters for Matrix
    const [filterAirport, setFilterAirport] = useState("桃園機場");
    const [filterRegion, setFilterRegion] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Settings
            const { data: setRes } = await supabase.from('admin_settings').select('*');
            const setMap = (setRes || []).reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
            setSettings(setMap);

            // 2. Holidays
            const { data: holRes } = await supabase.from('holiday_surcharges').select('*').order('start_date');
            setHolidays(holRes || []);

            // 3. Matrix (Initial load)
            const { data: matRes } = await supabase.from('airport_prices').select('*').order('id');
            setMatrix(matRes || []);

        } catch (e) {
            console.error(e);
            alert("載入資料失敗，請確認資料庫表是否已建立。");
        }
        setLoading(false);
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            // Save Night Surcharge
            if (settings.night_surcharge) {
                await supabase.from('admin_settings').upsert({ key: 'night_surcharge', value: settings.night_surcharge });
            }
            // Save Add-ons
            if (settings.addon_prices) {
                await supabase.from('admin_settings').upsert({ key: 'addon_prices', value: settings.addon_prices });
            }
            alert("設定已儲存");
        } catch (e) { console.error(e); alert("儲存失敗"); }
        setSaving(false);
    };

    const handleAddHoliday = () => {
        const newHoliday: HolidayRule = {
            id: crypto.randomUUID(), // Temp ID
            name: "新假期",
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0],
            type: "MULTIPLIER",
            value: 1.2,
            priority: 0
        };
        setHolidays([...holidays, newHoliday]);
        // Note: Real insert happens on row save or global save? 
        // Better UX: Insert immediately or track 'isNew'. For simplicity, we can Upsert on change or have a save button per row.
        // Here we'll try immediate insert for simpler state management or save all?
        // Let's do: Local state update, and a "Save Changes" button for the whole tab? Or row actions. 
        // For simplicity: Add to local, then user must click "Save" on the row.
        // Actually, let's implement "Save" button for the row.
    };

    const handleSaveHoliday = async (h: HolidayRule) => {
        const { error } = await supabase.from('holiday_surcharges').upsert({
            id: h.id.length > 30 ? undefined : h.id, // If it's a real UUID (len 36) ok, if temp maybe let DB handle? 
            // Actually supabase client handles upsert if ID matches. If it's a new randomUUID, it works.
            ...h
        });
        if (!error) alert("假期已更新");
        else alert("更新失敗");
        fetchData(); // Refresh to get real ID if needed
    };

    const handleDeleteHoliday = async (id: string) => {
        if (!confirm("確定刪除?")) return;
        await supabase.from('holiday_surcharges').delete().eq('id', id);
        setHolidays(holidays.filter(h => h.id !== id));
    };

    const handleUpdateMatrix = async (id: number, field: string, value: any) => {
        // Optimistic update
        setMatrix(matrix.map(row => row.id === id ? { ...row, [field]: value } : row));

        // Debounce or save on blur? For now direct save call for simplicity
        const row = matrix.find(r => r.id === id);
        if (!row) return;

        const updateData = { ...row, [field]: value };
        // Special handling for nested prices object updates would be tricky in one generic function
        // Need specific handler for prices
    };

    const savePriceRow = async (row: PriceRow) => {
        const { error } = await supabase.from('airport_prices').update({
            prices: row.prices,
            remote_surcharge: row.remote_surcharge
        }).eq('id', row.id);
        if (error) alert("儲存失敗");
        else alert("儲存成功");
    };

    // --- Renders ---

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">價格管理引擎</h1>
                    <p className="text-sm text-gray-500 mt-1">設定基礎費率、夜間加價與特殊假日規則。</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={<Settings size={16} />} label="通用設定" />
                <TabButton active={activeTab === 'holidays'} onClick={() => setActiveTab('holidays')} icon={<Calendar size={16} />} label="假日規則" />
                <TabButton active={activeTab === 'matrix'} onClick={() => setActiveTab('matrix')} icon={<DollarSign size={16} />} label="費率矩陣" />
            </div>

            {/* Content: General Settings */}
            {activeTab === 'general' && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    {/* Night Surcharge */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Moon className="text-blue-600" size={20} />
                            <h3 className="font-bold text-lg">夜間加價設定</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <InputGroup label="開始時間 (HH:mm)">
                                <input type="time" className="ipt" value={settings.night_surcharge?.start_time || '23:00'}
                                    onChange={e => setSettings({ ...settings, night_surcharge: { ...settings.night_surcharge!, start_time: e.target.value } })} />
                            </InputGroup>
                            <InputGroup label="結束時間 (HH:mm)">
                                <input type="time" className="ipt" value={settings.night_surcharge?.end_time || '06:00'}
                                    onChange={e => setSettings({ ...settings, night_surcharge: { ...settings.night_surcharge!, end_time: e.target.value } })} />
                            </InputGroup>
                            <InputGroup label="加價金額/倍率">
                                <input type="number" className="ipt" value={settings.night_surcharge?.surcharge || 0}
                                    onChange={e => setSettings({ ...settings, night_surcharge: { ...settings.night_surcharge!, surcharge: Number(e.target.value) } })} />
                            </InputGroup>
                            <InputGroup label="類型">
                                <select className="ipt" value={settings.night_surcharge?.type || 'FIXED'}
                                    onChange={e => setSettings({ ...settings, night_surcharge: { ...settings.night_surcharge!, type: e.target.value } })}>
                                    <option value="FIXED">固定金額 (元)</option>
                                    <option value="MULTIPLIER">倍率 (x)</option>
                                </select>
                            </InputGroup>
                        </div>
                    </div>

                    {/* Add-ons */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Car className="text-emerald-600" size={20} />
                            <h3 className="font-bold text-lg">增值服務定價</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputGroup label="舉牌服務 (元)">
                                <input type="number" className="ipt" value={settings.addon_prices?.signage || 0}
                                    onChange={e => setSettings({ ...settings, addon_prices: { ...settings.addon_prices!, signage: Number(e.target.value) } })} />
                            </InputGroup>
                            <InputGroup label="寵物友善 (元)">
                                <input type="number" className="ipt" value={settings.addon_prices?.pet_friendly || 0}
                                    onChange={e => setSettings({ ...settings, addon_prices: { ...settings.addon_prices!, pet_friendly: Number(e.target.value) } })} />
                            </InputGroup>
                            <InputGroup label="停靠點加價 (元/點)">
                                <input type="number" className="ipt" value={settings.addon_prices?.stop_point || 0}
                                    onChange={e => setSettings({ ...settings, addon_prices: { ...settings.addon_prices!, stop_point: Number(e.target.value) } })} />
                            </InputGroup>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputGroup label="後向式汽座 (元)">
                                <input type="number" className="ipt" value={settings.addon_prices?.seat_rear || 0}
                                    onChange={e => setSettings({ ...settings, addon_prices: { ...settings.addon_prices!, seat_rear: Number(e.target.value) } })} />
                            </InputGroup>
                            <InputGroup label="前向式/成長型 (元)">
                                <input type="number" className="ipt" value={settings.addon_prices?.seat_front || 0}
                                    onChange={e => setSettings({ ...settings, addon_prices: { ...settings.addon_prices!, seat_front: Number(e.target.value) } })} />
                            </InputGroup>
                            <InputGroup label="增高墊 (元)">
                                <input type="number" className="ipt" value={settings.addon_prices?.seat_booster || 0}
                                    onChange={e => setSettings({ ...settings, addon_prices: { ...settings.addon_prices!, seat_booster: Number(e.target.value) } })} />
                            </InputGroup>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button onClick={handleSaveSettings} disabled={saving} className="btn-primary flex items-center gap-2">
                            <Save size={16} /> 儲存通用設定
                        </button>
                    </div>
                </div>
            )}

            {/* Content: Holiday Rules */}
            {activeTab === 'holidays' && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">特殊假日加價規則</h3>
                        <button onClick={handleAddHoliday} className="btn-outline flex items-center gap-2"><Plus size={16} /> 新增規則</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-sm font-bold text-gray-700">
                                    <th className="p-3">規則名稱</th>
                                    <th className="p-3">開始日期</th>
                                    <th className="p-3">結束日期</th>
                                    <th className="p-3">類型</th>
                                    <th className="p-3">數值</th>
                                    <th className="p-3 text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {holidays.map((h, i) => (
                                    <tr key={h.id || i} className="hover:bg-gray-50">
                                        <td className="p-2"><input className="ipt-sm" value={h.name} onChange={e => { const n = [...holidays]; n[i].name = e.target.value; setHolidays(n); }} /></td>
                                        <td className="p-2"><input type="date" className="ipt-sm" value={h.start_date} onChange={e => { const n = [...holidays]; n[i].start_date = e.target.value; setHolidays(n); }} /></td>
                                        <td className="p-2"><input type="date" className="ipt-sm" value={h.end_date} onChange={e => { const n = [...holidays]; n[i].end_date = e.target.value; setHolidays(n); }} /></td>
                                        <td className="p-2">
                                            <select className="ipt-sm" value={h.type} onChange={e => { const n = [...holidays]; n[i].type = e.target.value as any; setHolidays(n); }}>
                                                <option value="FIXED">固定金額</option>
                                                <option value="MULTIPLIER">倍率</option>
                                            </select>
                                        </td>
                                        <td className="p-2 w-24"><input type="number" className="ipt-sm" value={h.value} onChange={e => { const n = [...holidays]; n[i].value = Number(e.target.value); setHolidays(n); }} /></td>
                                        <td className="p-2 text-right space-x-2">
                                            <button onClick={() => handleSaveHoliday(h)} className="text-blue-600 hover:text-blue-800"><Save size={16} /></button>
                                            <button onClick={() => handleDeleteHoliday(h.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {holidays.length === 0 && <div className="text-center py-8 text-gray-400">目前無設定規則</div>}
                    </div>
                </div>
            )}

            {/* Content: Matrix */}
            {activeTab === 'matrix' && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex gap-4 items-end">
                        <InputGroup label="篩選起點/機場">
                            <select className="ipt" value={filterAirport} onChange={e => setFilterAirport(e.target.value)}>
                                {Array.from(new Set(matrix.map(m => m.airport))).map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </InputGroup>
                        <InputGroup label="篩選區域 (關鍵字)">
                            <input className="ipt" placeholder="搜尋區域..." value={filterRegion} onChange={e => setFilterRegion(e.target.value)} />
                        </InputGroup>
                    </div>

                    <div className="overflow-x-auto max-h-[600px]">
                        <table className="w-full text-left border-collapse relative">
                            <thead className="sticky top-0 bg-white shadow-sm z-10">
                                <tr className="bg-gray-50 text-sm font-bold text-gray-700">
                                    <th className="p-3">機場</th>
                                    <th className="p-3">區域</th>
                                    <th className="p-3 bg-blue-50 text-blue-900 border-l border-blue-100">4人座 (1)</th>
                                    <th className="p-3 bg-indigo-50 text-indigo-900 border-l border-indigo-100">進口4人 (2)</th>
                                    <th className="p-3 bg-purple-50 text-purple-900 border-l border-purple-100">豪華6人 (3)</th>
                                    <th className="p-3 bg-orange-50 text-orange-900 border-l border-orange-100">Alphard (4)</th>
                                    <th className="p-3 border-l">偏遠加價</th>
                                    <th className="p-3 text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {matrix
                                    .filter(r => r.airport === filterAirport && r.region.includes(filterRegion))
                                    .map((row, i) => (
                                        <tr key={row.id} className="hover:bg-gray-50">
                                            <td className="p-3 font-medium text-gray-900">{row.airport}</td>
                                            <td className="p-3 font-medium text-gray-700">{row.region}</td>

                                            {['1', '2', '3', '4'].map(cid => (
                                                <td key={cid} className="p-2 border-l border-gray-100 w-24">
                                                    <input
                                                        type="number"
                                                        className="w-full bg-transparent border-b border-transparent hover:border-blue-300 focus:border-blue-500 outline-none text-right font-mono"
                                                        value={row.prices[cid] || 0}
                                                        onChange={(e) => {
                                                            const val = Number(e.target.value);
                                                            const newMatrix = [...matrix];
                                                            const idx = newMatrix.findIndex(r => r.id === row.id);
                                                            if (idx > -1) {
                                                                newMatrix[idx].prices = { ...newMatrix[idx].prices, [cid]: val };
                                                                setMatrix(newMatrix);
                                                            }
                                                        }}
                                                    />
                                                </td>
                                            ))}

                                            <td className="p-2 border-l border-gray-100 w-24">
                                                <input
                                                    type="number"
                                                    className="w-full bg-transparent border-b border-transparent hover:border-red-300 focus:border-red-500 outline-none text-right font-mono text-red-600"
                                                    value={row.remote_surcharge || 0}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        const newMatrix = [...matrix];
                                                        const idx = newMatrix.findIndex(r => r.id === row.id);
                                                        if (idx > -1) {
                                                            newMatrix[idx].remote_surcharge = val;
                                                            setMatrix(newMatrix);
                                                        }
                                                    }}
                                                />
                                            </td>

                                            <td className="p-3 text-right">
                                                <button onClick={() => savePriceRow(row)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
                                                    <Save size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// Components
function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
        >
            {icon} {label}
        </button>
    );
}

function InputGroup({ label, children }: any) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</label>
            {children}
        </div>
    );
}
