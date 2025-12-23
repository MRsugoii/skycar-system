"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, MapPin, Plus, Trash2, ChevronDown } from "lucide-react";

function BookingForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'pickup';
    const isPickup = type === 'pickup';

    // State
    const [date, setDate] = useState("");
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");

    // Dropoff specific state (Pickup Time)
    const [pickupDate, setPickupDate] = useState("");
    const [pickupHour, setPickupHour] = useState("");
    const [pickupMinute, setPickupMinute] = useState("");

    const [flightNumber, setFlightNumber] = useState("");
    const [airport, setAirport] = useState("");

    // Multiple Dropoff Locations
    const [locations, setLocations] = useState([
        { id: 1, city: "", district: "", address: "" }
    ]);

    // Restore state from sessionStorage on mount
    useEffect(() => {
        const savedBasic = sessionStorage.getItem('booking_basic_info');
        if (savedBasic) {
            try {
                const data = JSON.parse(savedBasic);

                if (data.flightInfo) {
                    setDate(data.flightInfo.date || "");
                    const [h, m] = (data.flightInfo.time || ":").split(':');
                    setHour(h || "");
                    setMinute(m || "");
                    setFlightNumber(data.flightInfo.flightNumber || "");
                    setAirport(data.flightInfo.airport || "");
                }

                if (data.pickupTime) {
                    setPickupDate(data.pickupTime.date || "");
                    const [ph, pm] = (data.pickupTime.time || ":").split(':');
                    setPickupHour(ph || "");
                    setPickupMinute(pm || "");
                }

                if (data.locations && Array.isArray(data.locations)) {
                    setLocations(data.locations);
                }
            } catch (e) {
                console.error("Failed to restore basic info", e);
            }
        }
    }, []);

    // Auto-calculate Pickup Time for Dropoff (5 hours before flight)
    useEffect(() => {
        if (!isPickup && date && hour && minute) {
            // Construct flight time: YYYY-MM-DDTHH:mm:00
            const flightTimeStr = `${date}T${hour}:${minute}:00`;
            const flightTime = new Date(flightTimeStr);

            if (!isNaN(flightTime.getTime())) {
                // Subtract 5 hours
                const pickupTime = new Date(flightTime.getTime() - 5 * 60 * 60 * 1000);

                // Format back to YYYY-MM-DD, HH, mm
                const pY = pickupTime.getFullYear();
                const pM = String(pickupTime.getMonth() + 1).padStart(2, '0');
                const pD = String(pickupTime.getDate()).padStart(2, '0');

                setPickupDate(`${pY}-${pM}-${pD}`);
                setPickupHour(String(pickupTime.getHours()).padStart(2, '0'));
                setPickupMinute(String(pickupTime.getMinutes()).padStart(2, '0'));
            }
        }
    }, [isPickup, date, hour, minute]);

    const addLocation = () => {
        setLocations([...locations, { id: Date.now(), city: "", district: "", address: "" }]);
    };

    const removeLocation = (id: number) => {
        if (locations.length > 1) {
            setLocations(locations.filter(l => l.id !== id));
        }
    };

    const updateLocation = (id: number, field: string, value: string) => {
        setLocations(locations.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    const handleNext = () => {
        // Validation basic
        if (!date || !hour || !minute || !flightNumber || !airport) {
            alert("請填寫完整航班資訊");
            return;
        }
        if (!isPickup && (!pickupDate || !pickupHour || !pickupMinute)) {
            alert("請填寫完整乘車時間");
            return;
        }

        for (const loc of locations) {
            if (!loc.city || !loc.district || !loc.address) {
                alert("請填寫完整地址");
                return;
            }
        }
        // Save basic info to storage
        const bookingDraft = {
            type,
            flightInfo: { date, time: `${hour}:${minute}`, flightNumber, airport },
            pickupTime: isPickup ? null : { date: pickupDate, time: `${pickupHour}:${pickupMinute}` },
            locations
        };
        sessionStorage.setItem('booking_basic_info', JSON.stringify(bookingDraft));

        // Proceed to Ride Info page
        router.push('/booking/ride-info');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32 text-gray-900 max-w-[420px] mx-auto relative overflow-hidden flex flex-col">

            {/* Custom Header */}
            <div className="bg-blue-600 px-4 pt-8 pb-10 text-white rounded-b-[40px] shadow-lg relative z-0 mb-[-40px]">
                <button
                    onClick={() => router.push('/booking')}
                    className="absolute left-6 top-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>
                <h1 className="text-lg font-bold text-center mt-2">
                    {isPickup ? '回國接機 / 港口接送' : '出國送機 / 送到港口'}
                </h1>
            </div>

            <div className="px-4 relative z-10 pt-4 space-y-4">

                {/* Flight Info Card */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            {isPickup ? '航班 / 船班抵達時間' : '航班 / 船班起飛時間'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500">日期</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full p-3 bg-white border border-gray-300 rounded-xl font-medium text-sm outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500">時</label>
                            <div className="relative">
                                <select
                                    value={hour}
                                    onChange={e => setHour(e.target.value)}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-xl font-medium text-sm appearance-none outline-none focus:border-blue-500"
                                >
                                    <option value="" disabled>時</option>
                                    {Array.from({ length: 24 }, (_, i) => i).map(h => (
                                        <option key={h} value={String(h).padStart(2, '0')}>{String(h).padStart(2, '0')}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500">分</label>
                            <div className="relative">
                                <select
                                    value={minute}
                                    onChange={e => setMinute(e.target.value)}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-xl font-medium text-sm appearance-none outline-none focus:border-blue-500"
                                >
                                    <option value="" disabled>分</option>
                                    {['00', '15', '30', '45'].map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dropoff Specific: Designated Pickup Time */}
                {!isPickup && (
                    <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                        <div className="border-l-4 border-blue-500 pl-3">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                指定乘車時間
                            </h2>
                        </div>

                        <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500">日期</label>
                                <input
                                    type="date"
                                    value={pickupDate}
                                    onChange={e => setPickupDate(e.target.value)}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-xl font-medium text-sm outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500">時</label>
                                <div className="relative">
                                    <select
                                        value={pickupHour}
                                        onChange={e => setPickupHour(e.target.value)}
                                        className="w-full p-3 bg-white border border-gray-300 rounded-xl font-medium text-sm appearance-none outline-none focus:border-blue-500"
                                    >
                                        <option value="" disabled>時</option>
                                        {Array.from({ length: 24 }, (_, i) => i).map(h => (
                                            <option key={h} value={String(h).padStart(2, '0')}>{String(h).padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500">分</label>
                                <div className="relative">
                                    <select
                                        value={pickupMinute}
                                        onChange={e => setPickupMinute(e.target.value)}
                                        className="w-full p-3 bg-white border border-gray-300 rounded-xl font-medium text-sm appearance-none outline-none focus:border-blue-500"
                                    >
                                        <option value="" disabled>分</option>
                                        {['00', '15', '30', '45'].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 text-right">※ 系統預設乘車時間為起飛 5 小時以前 (可修改)</p>
                    </div>
                )}

                {/* Flight Number Card */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-2">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">航班 / 船班編號</h2>
                    </div>
                    <input
                        type="text"
                        value={flightNumber}
                        onChange={e => setFlightNumber(e.target.value)}
                        placeholder={`例如：${isPickup ? 'TR897 / BR186' : 'BR225 / TR897'} （必填）`}
                        className="w-full p-3.5 bg-white border border-gray-300 rounded-xl font-medium text-sm outline-none focus:border-blue-500 placeholder:text-gray-400"
                    />
                </div>

                {/* Airport Card */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-2">
                    <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-lg font-bold text-gray-900">機場 / 港口</h2>
                    </div>
                    <div className="relative">
                        <select
                            value={airport}
                            onChange={e => setAirport(e.target.value)}
                            className="w-full p-3.5 bg-white border border-gray-300 rounded-xl font-medium text-sm appearance-none outline-none focus:border-blue-500 text-gray-900"
                        >
                            <option value="" disabled>請選擇航站</option>
                            <option value="tpe1">桃園機場 第一航廈</option>
                            <option value="tpe2">桃園機場 第二航廈</option>
                            <option value="tsa">松山機場</option>
                            <option value="rmq">台中清泉崗機場</option>
                            <option value="khh">高雄小港機場</option>
                            <option value="kel">基隆港</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                </div>

                {/* Locations Card (Dynamic) */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
                    <div className="border-l-4 border-blue-500 pl-3 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">
                            {isPickup ? '接送地址' : '上車地址'}
                        </h2>
                    </div>

                    {locations.map((loc, index) => (
                        <div key={loc.id} className="relative pt-2">
                            {index > 0 && <div className="h-px bg-gray-100 my-4"></div>}

                            {/* Delete Button for extra locations */}
                            {locations.length > 1 && (
                                <button
                                    onClick={() => removeLocation(loc.id)}
                                    className="absolute -right-2 -top-2 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">縣市</label>
                                    <div className="relative">
                                        <select
                                            value={loc.city}
                                            onChange={e => {
                                                // Reset district when city changes
                                                const newCity = e.target.value;
                                                const newLocations = locations.map(l =>
                                                    l.id === loc.id ? { ...l, city: newCity, district: "" } : l
                                                );
                                                setLocations(newLocations);
                                            }}
                                            className="w-full p-3 bg-white border border-gray-300 rounded-xl font-medium text-sm appearance-none outline-none focus:border-blue-500"
                                        >
                                            <option value="" disabled>選擇縣市</option>
                                            <option value="keelung">基隆市</option>
                                            <option value="taipei">台北市</option>
                                            <option value="new_taipei">新北市</option>
                                            <option value="taoyuan">桃園市</option>
                                            <option value="hsinchu_city">新竹市</option>
                                            <option value="hsinchu_county">新竹縣</option>
                                            <option value="miaoli">苗栗縣</option>
                                            <option value="taichung">台中市</option>
                                            <option value="changhua">彰化縣</option>
                                            <option value="nantou">南投縣</option>
                                            <option value="yunlin">雲林縣</option>
                                            <option value="chiayi_city">嘉義市</option>
                                            <option value="chiayi_county">嘉義縣</option>
                                            <option value="tainan">台南市</option>
                                            <option value="kaohsiung">高雄市</option>
                                            <option value="pingtung">屏東縣</option>
                                            <option value="yilan">宜蘭縣</option>
                                            <option value="hualien">花蓮縣</option>
                                            <option value="taitung">台東縣</option>
                                            <option value="penghu">澎湖縣</option>
                                            <option value="kinmen">金門縣</option>
                                            <option value="lienchiang">連江縣</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">鄉鎮市區</label>
                                    <div className="relative">
                                        <select
                                            value={loc.district}
                                            onChange={e => updateLocation(loc.id, 'district', e.target.value)}
                                            className="w-full p-3 bg-white border border-gray-300 rounded-xl font-medium text-sm appearance-none outline-none focus:border-blue-500"
                                            disabled={!loc.city}
                                        >
                                            <option value="" disabled>選擇區域</option>
                                            {loc.city && TAIWAN_DISTRICTS[loc.city as keyof typeof TAIWAN_DISTRICTS]?.map((d: any) => (
                                                <option key={d.id} value={d.name}>{d.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <textarea
                                value={loc.address}
                                onChange={e => updateLocation(loc.id, 'address', e.target.value)}
                                placeholder="詳細地址（路 / 巷 / 弄 / 號 / 樓）(必填)"
                                className="w-full p-3.5 bg-white border border-gray-300 rounded-xl font-medium text-sm outline-none focus:border-blue-500 placeholder:text-gray-400 min-h-[100px] resize-none"
                            />
                        </div>
                    ))}

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={addLocation}
                            className="flex items-center gap-1 text-blue-600 font-bold border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 px-4 py-2 rounded-xl transition"
                        >
                            <Plus size={18} /> 增加地點
                        </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-2 text-center">可新增多個接送地點</p>
                </div>
            </div>

            {/* Bottom Actions */}


            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 z-20">
                <div className="max-w-[420px] mx-auto">
                    <button
                        onClick={handleNext}
                        className="w-full py-3.5 rounded-xl font-bold text-lg bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition flex items-center justify-center gap-2"
                    >
                        下一頁
                    </button>
                </div>
            </div>

        </div>
    );
}

export default function BookingFormPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <BookingForm />
        </Suspense>
    );
}

const TAIWAN_DISTRICTS: any = {
    keelung: [
        { id: 'renai', name: '仁愛區' }, { id: 'xinyi', name: '信義區' }, { id: 'zhongzheng', name: '中正區' },
        { id: 'zhongshan', name: '中山區' }, { id: 'anle', name: '安樂區' }, { id: 'nuannuan', name: '暖暖區' },
        { id: 'qidu', name: '七堵區' }
    ],
    taipei: [
        { id: 'zhongzheng', name: '中正區' }, { id: 'datong', name: '大同區' }, { id: 'zhongshan', name: '中山區' },
        { id: 'songshan', name: '松山區' }, { id: 'daan', name: '大安區' }, { id: 'wanhua', name: '萬華區' },
        { id: 'xinyi', name: '信義區' }, { id: 'shilin', name: '士林區' }, { id: 'beitou', name: '北投區' },
        { id: 'neihu', name: '內湖區' }, { id: 'nangang', name: '南港區' }, { id: 'wenshan', name: '文山區' }
    ],
    new_taipei: [
        { id: 'banqiao', name: '板橋區' }, { id: 'xinzhuang', name: '新莊區' }, { id: 'zhonghe', name: '中和區' },
        { id: 'yonghe', name: '永和區' }, { id: 'tucheng', name: '土城區' }, { id: 'shulin', name: '樹林區' },
        { id: 'sanxia', name: '三峽區' }, { id: 'yingge', name: '鶯歌區' }, { id: 'sanchong', name: '三重區' },
        { id: 'luzhou', name: '蘆洲區' }, { id: 'wugu', name: '五股區' }, { id: 'taishan', name: '泰山區' },
        { id: 'linkou', name: '林口區' }, { id: 'bali', name: '八里區' }, { id: 'danshui', name: '淡水區' },
        { id: 'sanzhi', name: '三芝區' }, { id: 'shimen', name: '石門區' }, { id: 'jinshan', name: '金山區' },
        { id: 'wanli', name: '萬里區' }, { id: 'xizhi', name: '汐止區' }, { id: 'ruifang', name: '瑞芳區' },
        { id: 'gongliao', name: '貢寮區' }, { id: 'pingxi', name: '平溪區' }, { id: 'shuangxi', name: '雙溪區' },
        { id: 'xindian', name: '新店區' }, { id: 'shenkeng', name: '深坑區' }, { id: 'shiding', name: '石碇區' },
        { id: 'pinglin', name: '坪林區' }, { id: 'wulai', name: '烏來區' }
    ],
    taoyuan: [
        { id: 'taoyuan', name: '桃園區' }, { id: 'zhongli', name: '中壢區' }, { id: 'daxi', name: '大溪區' },
        { id: 'yangmei', name: '楊梅區' }, { id: 'luzhu', name: '蘆竹區' }, { id: 'dayuan', name: '大園區' },
        { id: 'guishan', name: '龜山區' }, { id: 'bade', name: '八德區' }, { id: 'longtan', name: '龍潭區' },
        { id: 'pingzhen', name: '平鎮區' }, { id: 'xinwu', name: '新屋區' }, { id: 'guanyin', name: '觀音區' },
        { id: 'fuxing', name: '復興區' }
    ],
    hsinchu_city: [
        { id: 'east', name: '東區' }, { id: 'north', name: '北區' }, { id: 'xiangshan', name: '香山區' }
    ],
    hsinchu_county: [
        { id: 'zhubei', name: '竹北市' }, { id: 'zhudong', name: '竹東鎮' }, { id: 'xinpu', name: '新埔鎮' },
        { id: 'guanxi', name: '關西鎮' }, { id: 'hukou', name: '湖口鄉' }, { id: 'sinfeng', name: '新豐鄉' },
        { id: 'qionglin', name: '芎林鄉' }, { id: 'hengshan', name: '橫山鄉' }, { id: 'beipu', name: '北埔鄉' },
        { id: 'baoshan', name: '寶山鄉' }, { id: 'emei', name: '峨眉鄉' }, { id: 'jianshi', name: '尖石鄉' },
        { id: 'wufeng', name: '五峰鄉' }
    ],
    miaoli: [
        { id: 'miaoli', name: '苗栗市' }, { id: 'toufen', name: '頭份市' }, { id: 'yuanli', name: '苑裡鎮' },
        { id: 'tongxiao', name: '通霄鎮' }, { id: 'zhunan', name: '竹南鎮' }, { id: 'houlong', name: '後龍鎮' },
        { id: 'zhuolan', name: '卓蘭鎮' }, { id: 'dahu', name: '大湖鄉' }, { id: 'gongguan', name: '公館鄉' },
        { id: 'tongluo', name: '銅鑼鄉' }, { id: 'nanzhuang', name: '南庄鄉' }, { id: 'touwu', name: '頭屋鄉' },
        { id: 'sanyi', name: '三義鄉' }, { id: 'xihu', name: '西湖鄉' }, { id: 'zaoqiao', name: '造橋鄉' },
        { id: 'sanwan', name: '三灣鄉' }, { id: 'shitan', name: '獅潭鄉' }, { id: 'taian', name: '泰安鄉' }
    ],
    taichung: [
        { id: 'central', name: '中區' }, { id: 'east', name: '東區' }, { id: 'south', name: '南區' },
        { id: 'west', name: '西區' }, { id: 'north', name: '北區' }, { id: 'beitun', name: '北屯區' },
        { id: 'xitun', name: '西屯區' }, { id: 'nantun', name: '南屯區' }, { id: 'taiping', name: '太平區' },
        { id: 'dali', name: '大里區' }, { id: 'wufeng', name: '霧峰區' }, { id: 'wuri', name: '烏日區' },
        { id: 'fengyuan', name: '豐原區' }, { id: 'houli', name: '后里區' }, { id: 'shigang', name: '石岡區' },
        { id: 'dongshi', name: '東勢區' }, { id: 'xinshe', name: '新社區' }, { id: 'tanzi', name: '潭子區' },
        { id: 'daya', name: '大雅區' }, { id: 'shengang', name: '神岡區' }, { id: 'dadu', name: '大肚區' },
        { id: 'shalu', name: '沙鹿區' }, { id: 'longjing', name: '龍井區' }, { id: 'wuqi', name: '梧棲區' },
        { id: 'qingshui', name: '清水區' }, { id: 'dajia', name: '大甲區' }, { id: 'waipu', name: '外埔區' },
        { id: 'daan', name: '大安區' }, { id: 'heping', name: '和平區' }
    ],
    changhua: [{ id: 'changhua', name: '彰化市' }, { id: 'yuanlin', name: '員林市' }, { id: 'hemei', name: '和美鎮' }, { id: 'lukang', name: '鹿港鎮' }, { id: 'xihu', name: '溪湖鎮' }],
    nantou: [{ id: 'nantou', name: '南投市' }, { id: 'puli', name: '埔里鎮' }, { id: 'caotun', name: '草屯鎮' }, { id: 'zhushan', name: '竹山鎮' }, { id: 'jiji', name: '集集鎮' }],
    yunlin: [{ id: 'douliu', name: '斗六市' }, { id: 'huwei', name: '虎尾鎮' }, { id: 'dou nan', name: '斗南鎮' }, { id: 'xiluo', name: '西螺鎮' }, { id: 'tuku', name: '土庫鎮' }, { id: 'beigang', name: '北港鎮' }],
    chiayi_city: [{ id: 'east', name: '東區' }, { id: 'west', name: '西區' }],
    chiayi_county: [{ id: 'taibao', name: '太保市' }, { id: 'puzi', name: '朴子市' }, { id: 'budai', name: '布袋鎮' }, { id: 'dalin', name: '大林鎮' }, { id: 'minxiong', name: '民雄鄉' }],
    tainan: [{ id: 'east', name: '東區' }, { id: 'south', name: '南區' }, { id: 'north', name: '北區' }, { id: 'ann', name: '安南區' }, { id: 'anping', name: '安平區' }, { id: 'zhongxi', name: '中西區' }, { id: 'yongkang', name: '永康區' }, { id: 'guiren', name: '歸仁區' }, { id: 'xinhua', name: '新化區' }, { id: 'zuozhen', name: '左鎮區' }, { id: 'yujing', name: '玉井區' }, { id: 'nanxi', name: '楠西區' }, { id: 'nanhua', name: '南化區' }, { id: 'rende', name: '仁德區' }, { id: 'guanmiao', name: '關廟區' }, { id: 'longqi', name: '龍崎區' }, { id: 'guantian', name: '官田區' }, { id: 'madou', name: '麻豆區' }, { id: 'jiali', name: '佳里區' }, { id: 'xigang', name: '西港區' }, { id: 'qigu', name: '七股區' }, { id: 'jiangjun', name: '將軍區' }, { id: 'beimen', name: '北門區' }, { id: 'xinying', name: '新營區' }, { id: 'houbi', name: '後壁區' }, { id: 'baihe', name: '白河區' }, { id: 'dongshan', name: '東山區' }, { id: 'liujia', name: '六甲區' }, { id: 'xiaying', name: '下營區' }, { id: 'liuying', name: '柳營區' }, { id: 'yanshui', name: '鹽水區' }, { id: 'shanhua', name: '善化區' }, { id: 'danei', name: '大內區' }, { id: 'shanshang', name: '山上區' }, { id: 'xinshi', name: '新市區' }, { id: 'anding', name: '安定區' }],
    kaohsiung: [{ id: 'yancheng', name: '鹽埕區' }, { id: 'gushan', name: '鼓山區' }, { id: 'zuoying', name: '左營區' }, { id: 'nanzi', name: '楠梓區' }, { id: 'sanmin', name: '三民區' }, { id: 'xinxing', name: '新興區' }, { id: 'qianjin', name: '前金區' }, { id: 'lingya', name: '苓雅區' }, { id: 'qianzhen', name: '前鎮區' }, { id: 'qijin', name: '旗津區' }, { id: 'xiaogang', name: '小港區' }, { id: 'fengshan', name: '鳳山區' }, { id: 'linyuan', name: '林園區' }, { id: 'daliao', name: '大寮區' }, { id: 'dashu', name: '大樹區' }, { id: 'dashe', name: '大社區' }, { id: 'renwu', name: '仁武區' }, { id: 'niaosong', name: '鳥松區' }, { id: 'gangshan', name: '岡山區' }, { id: 'qiaotou', name: '橋頭區' }, { id: 'yanchao', name: '燕巢區' }, { id: 'tianliao', name: '田寮區' }, { id: 'alian', name: '阿蓮區' }, { id: 'luzhu', name: '路竹區' }, { id: 'hunei', name: '湖內區' }, { id: 'qieding', name: '茄萣區' }, { id: 'yongan', name: '永安區' }, { id: 'mituo', name: '彌陀區' }, { id: 'ziguan', name: '梓官區' }, { id: 'qishan', name: '旗山區' }, { id: 'meinong', name: '美濃區' }, { id: 'liugui', name: '六龜區' }, { id: 'jiaxian', name: '甲仙區' }, { id: 'shanlin', name: '杉林區' }, { id: 'neimen', name: '內門區' }, { id: 'maolin', name: '茂林區' }, { id: 'taoyuan', name: '桃源區' }, { id: 'namaxia', name: '那瑪夏區' }],
    pingtung: [{ id: 'pingtung', name: '屏東市' }, { id: 'chaozhou', name: '潮州鎮' }, { id: 'donggang', name: '東港鎮' }, { id: 'hengchun', name: '恆春鎮' }],
    yilan: [{ id: 'yilan', name: '宜蘭市' }, { id: 'luodong', name: '羅東鎮' }, { id: 'suao', name: '蘇澳鎮' }, { id: 'toucheng', name: '頭城鎮' }, { id: 'jiaoxi', name: '礁溪鄉' }],
    hualien: [{ id: 'hualien', name: '花蓮市' }, { id: 'fenglin', name: '鳳林鎮' }, { id: 'yuli', name: '玉里鎮' }, { id: 'xincheng', name: '新城鄉' }, { id: 'jian', name: '吉安鄉' }],
    taitung: [{ id: 'taitung', name: '台東市' }, { id: 'chenggong', name: '成功鎮' }, { id: 'guanshan', name: '關山鎮' }, { id: 'beinan', name: '卑南鄉' }],
    penghu: [{ id: 'magong', name: '馬公市' }, { id: 'huxi', name: '湖西鄉' }, { id: 'baisha', name: '白沙鄉' }, { id: 'xiyu', name: '西嶼鄉' }, { id: 'wangan', name: '望安鄉' }, { id: 'qimei', name: '七美鄉' }],
    kinmen: [{ id: 'jincheng', name: '金城鎮' }, { id: 'jinhu', name: '金湖鎮' }, { id: 'jinsha', name: '金沙鎮' }, { id: 'jinning', name: '金寧鄉' }, { id: 'lieyu', name: '烈嶼鄉' }, { id: 'wuqiu', name: '烏坵鄉' }],
    lienchiang: [{ id: 'nangan', name: '南竿鄉' }, { id: 'beigan', name: '北竿鄉' }, { id: 'juguang', name: '莒光鄉' }, { id: 'dongyin', name: '東引鄉' }]
};
