"use client";

import { useState, useEffect, Suspense, Fragment } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Truck, Ticket, Search, Plus, Edit, Trash2, X, Save, Camera, Image as ImageIcon, MoreHorizontal, AlertCircle, Download, Calendar, FileText, DollarSign, Armchair, Users, Briefcase, Car, Plane, MapPin, Route, ChevronRight, ChevronDown, Check, Settings, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

// Taiwan Districts Data (Global Scope)
const TAIWAN_LOCATIONS: Record<string, { name: string; districts: string[] }> = {
  keelung: { name: '基隆市', districts: ['仁愛區', '信義區', '中正區', '中山區', '安樂區', '暖暖區', '七堵區'] },
  taipei: { name: '台北市', districts: ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'] },
  new_taipei: { name: '新北市', districts: ['板橋區', '新莊區', '中和區', '永和區', '土城區', '樹林區', '三峽區', '鶯歌區', '三重區', '蘆洲區', '五股區', '泰山區', '林口區', '八里區', '淡水區', '三芝區', '石門區', '金山區', '萬里區', '汐止區', '瑞芳區', '貢寮區', '平溪區', '雙溪區', '新店區', '深坑區', '石碇區', '坪林區', '烏來區'] },
  taoyuan: { name: '桃園市', districts: ['桃園區', '中壢區', '大溪區', '楊梅區', '蘆竹區', '大園區', '龜山區', '八德區', '龍潭區', '平鎮區', '新屋區', '觀音區', '復興區'] },
  hsinchu_city: { name: '新竹市', districts: ['東區', '北區', '香山區'] },
  hsinchu_county: { name: '新竹縣', districts: ['竹北市', '竹東鎮', '新埔鎮', '關西鎮', '湖口鄉', '新豐鄉', '芎林鄉', '橫山鄉', '北埔鄉', '寶山鄉', '峨眉鄉', '尖石鄉', '五峰鄉'] },
  miaoli: { name: '苗栗縣', districts: ['苗栗市', '頭份市', '苑裡鎮', '通霄鎮', '竹南鎮', '後龍鎮', '卓蘭鎮', '大湖鄉', '公館鄉', '銅鑼鄉', '南庄鄉', '頭屋鄉', '三義鄉', '西湖鄉', '造橋鄉', '三灣鄉', '獅潭鄉', '泰安鄉'] },
  taichung: { name: '台中市', districts: ['中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區', '豐原區', '后里區', '石岡區', '東勢區', '新社區', '潭子區', '大雅區', '神岡區', '大肚區', '沙鹿區', '龍井區', '梧棲區', '清水區', '大甲區', '外埔區', '大安區', '和平區'] },
  changhua: { name: '彰化縣', districts: ['彰化市', '員林市', '和美鎮', '鹿港鎮', '溪湖鎮', '二林鎮', '田中鎮', '北斗鎮', '花壇鄉', '芬園鄉', '大村鄉', '永靖鄉', '伸港鄉', '線西鄉', '福興鄉', '秀水鄉', '埔心鄉', '埔鹽鄉', '大城鄉', '芳苑鄉', '竹塘鄉', '社頭鄉', '二水鄉', '田尾鄉', '埤頭鄉', '溪州鄉'] },
  nantou: { name: '南投縣', districts: ['南投市', '埔里鎮', '草屯鎮', '竹山鎮', '集集鎮', '名間鄉', '鹿谷鄉', '中寮鄉', '魚池鄉', '國姓鄉', '水里鄉', '信義鄉', '仁愛鄉'] },
  yunlin: { name: '雲林縣', districts: ['斗六市', '虎尾鎮', '斗南鎮', '西螺鎮', '土庫鎮', '北港鎮', '古坑鄉', '大埤鄉', '莿桐鄉', '林內鄉', '二崙鄉', '崙背鄉', '麥寮鄉', '東勢鄉', '褒忠鄉', '臺西鄉', '元長鄉', '四湖鄉', '口湖鄉', '水林鄉'] },
  chiayi_city: { name: '嘉義市', districts: ['東區', '西區'] },
  chiayi_county: { name: '嘉義縣', districts: ['太保市', '朴子市', '布袋鎮', '大林鎮', '民雄鄉', '溪口鄉', '新港鄉', '六腳鄉', '東石鄉', '義竹鄉', '鹿草鄉', '水上鄉', '中埔鄉', '竹崎鄉', '梅山鄉', '番路鄉', '大埔鄉', '阿里山鄉'] },
  tainan: { name: '台南市', districts: ['東區', '南區', '北區', '安南區', '安平區', '中西區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '北門區', '新營區', '後壁區', '白河區', '東山區', '六甲區', '下營區', '柳營區', '鹽水區', '善化區', '大內區', '山上區', '新市區', '安定區'] },
  kaohsiung: { name: '高雄市', districts: ['鹽埕區', '鼓山區', '左營區', '楠梓區', '三民區', '新興區', '前金區', '苓雅區', '前鎮區', '旗津區', '小港區', '鳳山區', '林園區', '大寮區', '大樹區', '大社區', '仁武區', '鳥松區', '岡山區', '橋頭區', '燕巢區', '田寮區', '阿蓮區', '路竹區', '湖內區', '茄萣區', '永安區', '彌陀區', '梓官區', '旗山區', '美濃區', '六龜區', '甲仙區', '杉林區', '內門區', '茂林區', '桃源區', '那瑪夏區'] },
  pingtung: { name: '屏東縣', districts: ['屏東市', '潮州鎮', '東港鎮', '恆春鎮', '萬丹鄉', '長治鄉', '麟洛鄉', '九如鄉', '里港鄉', '鹽埔鄉', '高樹鄉', '萬巒鄉', '內埔鄉', '竹田鄉', '新埤鄉', '枋寮鄉', '新園鄉', '崁頂鄉', '林邊鄉', '南州鄉', '佳冬鄉', '琉球鄉', '車城鄉', '滿州鄉', '枋山鄉', '三地門鄉', '霧臺鄉', '瑪家鄉', '泰武鄉', '來義鄉', '春日鄉', '獅子鄉', '牡丹鄉'] },
  yilan: { name: '宜蘭縣', districts: ['宜蘭市', '羅東鎮', '蘇澳鎮', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '冬山鄉', '五結鄉', '三星鄉', '大同鄉', '南澳鄉'] },
  hualien: { name: '花蓮縣', districts: ['花蓮市', '鳳林鎮', '玉里鎮', '新城鄉', '吉安鄉', '壽豐鄉', '光復鄉', '豐濱鄉', '瑞穗鄉', '富里鄉', '秀林鄉', '萬榮鄉', '卓溪鄉'] },
  taitung: { name: '台東縣', districts: ['台東市', '成功鎮', '關山鎮', '卑南鄉', '大武鄉', '太麻里鄉', '東河鄉', '長濱鄉', '鹿野鄉', '池上鄉', '綠島鄉', '延平鄉', '海端鄉', '達仁鄉', '金峰鄉', '蘭嶼鄉'] },
  penghu: { name: '澎湖縣', districts: ['馬公市', '湖西鄉', '白沙鄉', '西嶼鄉', '望安鄉', '七美鄉'] },
  kinmen: { name: '金門縣', districts: ['金城鎮', '金湖鎮', '金沙鎮', '金寧鄉', '烈嶼鄉', '烏坵鄉'] },
  lienchiang: { name: '連江縣', districts: ['南竿鄉', '北竿鄉', '莒光鄉', '東引鄉'] }
};

// Define Vehicle Type based on requirements
interface VehicleType {
  id: number;
  name: string;
  model: string;
  quantity: number; // Number of cars of this type owned by the company
  seats: number;
  maxPassengers: number;
  maxLuggage: number;
  dispatchPrice: number;
  holidaySurcharge: number;
  nightSurcharge: number;
  nightSurchargeStart: string;
  nightSurchargeEnd: string;
  // Distance Pricing
  baseDistance: number;
  basePrice: number;
  overDistancePrice: number;
  holidaySurchargeUnder1k: number;
  holidaySurchargePer1k: number;
  // Extra Services Pricing
  modelSurcharge: number;
  offPeakDiscount: number;
  offPeakDiscountStart: string;
  offPeakDiscountEnd: string;
  safetySeatInfantPrice: number;
  safetySeatInfantMax: number;
  safetySeatChildPrice: number;
  safetySeatChildMax: number;
  safetySeatBoosterPrice: number;
  safetySeatBoosterMax: number;
  signboardPrice: number;
  extraStopPrice: number;
  remoteAreaPrice: number;
  crossDistrictPrice: number;
  // System
  status: boolean;
  lastModified: string;
  modifier: string;
  image?: string;
}

// Define Holiday Type
interface HolidayType {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: boolean;
}

// Define Airport Price Matrix Type
interface AirportMatrixType {
  id: number;
  airport: string; // Start point (Green dot)
  region: string; // End point (Red dot)
  prices: Record<number, number>; // vehicleTypeId -> price
  remoteSurcharge: number;
  holidaySurcharges?: Record<number, number>; // holidayId -> price
  category?: 'weekday' | 'holiday' | 'special';
  status: boolean;
}


// Define Route Type
interface RouteType {
  id: number;
  name: string;
  price: number;
  status: boolean;
}

// Define Extra Settings Type
interface ExtraSettingsType {
  id: number;
  safety_seat_infant_price: number;
  safety_seat_child_price: number;
  safety_seat_booster_price: number;
  signboard_price: number;
}

function VehiclesContent() {

  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'vehicle'; // Default to vehicle management

  // --- 1. Vehicle Management Data & State ---
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Vehicles from Supabase
  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("vehicle_types")
          .select("*")
          .order("id", { ascending: true });

        if (error) {
          console.error("Error fetching vehicles:", error);
          // Optional: Add toast error here
        } else {
          // Map Supabase data to local interface if needed, or assume direct match
          // Ideally, the DB schema should match VehicleType. 
          // For now, we assume a direct match or close enough to render.
          // Adjust mapping as needed based on actual DB schema.
          const mappedVehicles: VehicleType[] = (data || []).map((v: any) => ({
            id: v.id,
            name: v.name,
            model: v.model,
            quantity: v.quantity || 0,
            seats: v.seats || 4,
            maxPassengers: v.max_passengers || v.seats - 1,
            maxLuggage: v.max_luggage || 2,
            dispatchPrice: v.dispatch_price || 0,
            holidaySurcharge: v.holiday_surcharge || 0,
            nightSurcharge: v.night_surcharge || 0,
            nightSurchargeStart: v.night_surcharge_start || "23:00",
            nightSurchargeEnd: v.night_surcharge_end || "06:00",
            baseDistance: v.base_distance || 0,
            basePrice: v.base_price || 0,
            overDistancePrice: v.over_distance_price || 0,
            holidaySurchargeUnder1k: v.holiday_surcharge_under_1k || 0,
            holidaySurchargePer1k: v.holiday_surcharge_per_1k || 0,
            modelSurcharge: v.model_surcharge || 0,
            offPeakDiscount: v.off_peak_discount || 0,
            offPeakDiscountStart: v.off_peak_discount_start || "10:00",
            offPeakDiscountEnd: v.off_peak_discount_end || "16:00",
            safetySeatInfantPrice: v.safety_seat_infant_price || 0,
            safetySeatInfantMax: v.safety_seat_infant_max || 0,
            safetySeatChildPrice: v.safety_seat_child_price || 0,
            safetySeatChildMax: v.safety_seat_child_max || 0,
            safetySeatBoosterPrice: v.safety_seat_booster_price || 0,
            safetySeatBoosterMax: v.safety_seat_booster_max || 0,
            signboardPrice: v.signboard_price || 0,
            extraStopPrice: v.extra_stop_price || 0,
            remoteAreaPrice: v.remote_area_price || 0,
            crossDistrictPrice: v.cross_district_price || 0,
            status: v.status !== false, // Default to true if not defined
            lastModified: v.updated_at ? new Date(v.updated_at).toLocaleDateString() : "",
            modifier: v.last_modifier || "System",
            image: v.image_url || "/placeholder-car.jpg"
          }));
          setVehicles(mappedVehicles);
        }
      } catch (err) {
        console.error("Unexpected error fetching vehicles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();

    // Real-time subscription
    const channel = supabase
      .channel('vehicle_types_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicle_types' }, () => {
        fetchVehicles();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- Mock Data for Fallback ---
  const MOCK_HOLIDAYS: HolidayType[] = [
    { id: 1, name: "2024 春節", startDate: "2024-02-08", endDate: "2024-02-14", status: true, price_category: 'holiday' },
    { id: 2, name: "228 紀念日", startDate: "2024-02-28", endDate: "2024-02-28", status: true, price_category: 'holiday' },
    { id: 3, name: "清明節", startDate: "2024-04-04", endDate: "2024-04-07", status: true, price_category: 'holiday' },
    { id: 4, name: "勞動節", startDate: "2024-05-01", endDate: "2024-05-01", status: false, price_category: 'weekday' },
    { id: 5, name: "端午節", startDate: "2024-06-08", endDate: "2024-06-10", status: true, price_category: 'holiday' }
  ];

  const MOCK_ROUTES: RouteType[] = [
    { id: 1, name: "忠孝東路一段", price: 100, status: true },
    { id: 2, name: "中山北路", price: 150, status: true },
    { id: 3, name: "建國高架", price: 200, status: true },
    { id: 4, name: "市民大道", price: 200, status: false }
  ];

  const MOCK_AIRPORT_PRICES: AirportMatrixType[] = [
    // Weekday Prices
    { id: 1, airport: "桃園機場", region: "中正區", category: "weekday", prices: { 1: 1000, 2: 1400, 3: 1600, 4: 2000 }, remoteSurcharge: 0, holidaySurcharges: {}, status: true },
    { id: 2, airport: "松山機場", region: "中正區", category: "weekday", prices: { 1: 800, 2: 1100, 3: 1300, 4: 1500 }, remoteSurcharge: 0, holidaySurcharges: {}, status: true },
    { id: 3, airport: "台中清泉崗機場", region: "中區", category: "weekday", prices: { 1: 2000, 2: 2400, 3: 2600, 4: 3000 }, remoteSurcharge: 0, holidaySurcharges: {}, status: true },
    { id: 4, airport: "高雄小港機場", region: "新興區", category: "weekday", prices: { 1: 3500, 2: 4000, 3: 4500, 4: 5000 }, remoteSurcharge: 0, holidaySurcharges: {}, status: true },

    // Holiday Prices (Higher)
    { id: 5, airport: "桃園機場", region: "中正區", category: "holiday", prices: { 1: 1200, 2: 1600, 3: 1800, 4: 2200 }, remoteSurcharge: 0, holidaySurcharges: {}, status: true },
    { id: 6, airport: "松山機場", region: "中正區", category: "holiday", prices: { 1: 900, 2: 1200, 3: 1400, 4: 1600 }, remoteSurcharge: 0, holidaySurcharges: {}, status: true },
    { id: 7, airport: "台中清泉崗機場", region: "中區", category: "holiday", prices: { 1: 2200, 2: 2600, 3: 2800, 4: 3200 }, remoteSurcharge: 0, holidaySurcharges: {}, status: true },
    { id: 8, airport: "高雄小港機場", region: "新興區", category: "holiday", prices: { 1: 3700, 2: 4200, 3: 4700, 4: 5200 }, remoteSurcharge: 0, holidaySurcharges: {}, status: true },

    // Special Prices (Discounted/Special)
    { id: 9, airport: "桃園機場", region: "中正區", category: "special", prices: { 1: 900, 2: 1300, 3: 1500, 4: 1900 }, remoteSurcharge: 0, holidaySurcharges: {}, status: true },
    { id: 10, airport: "松山機場", region: "中正區", category: "special", prices: { 1: 750, 2: 1050, 3: 1250, 4: 1450 }, remoteSurcharge: 0, holidaySurcharges: {}, status: true },
    { id: 11, airport: "台中清泉崗機場", region: "中區", category: "special", prices: { 1: 1900, 2: 2300, 3: 2500, 4: 2900 }, remoteSurcharge: 0, holidaySurcharges: {}, status: true },
    { id: 12, airport: "高雄小港機場", region: "新興區", category: "special", prices: { 1: 3400, 2: 3900, 3: 4400, 4: 9000 }, remoteSurcharge: 0, holidaySurcharges: {}, status: true },
  ];

  // --- 2. Holiday Settings Data ---
  const [holidays, setHolidays] = useState<HolidayType[]>([]);

  // Fetch Holidays
  useEffect(() => {
    const fetchHolidays = async () => {
      const { data, error } = await supabase.from('holidays').select('*').order('id', { ascending: true });

      if (data && data.length > 0) {
        setHolidays(data.map((h: any) => ({
          id: h.id,
          name: h.name,
          startDate: h.start_date,
          endDate: h.end_date,
          status: h.status,
          price_category: h.price_category || 'holiday' // Default to holiday if not set
        })));
      } else {
        // Fallback Mock
        console.log("Using Mock Holidays");
        setHolidays(MOCK_HOLIDAYS);
      }
    };
    fetchHolidays();

    // Subscribe
    const channel = supabase.channel('holidays_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'holidays' }, () => fetchHolidays())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // ... (Airport Data)

  // (Helper)
  const toDbHoliday = (h: any) => ({
    name: h.name,
    start_date: h.startDate,
    end_date: h.endDate,
    status: h.status
  });

  // ...

  const handleSaveHoliday = async () => {
    try {
      const holidayData = {
        name: holidayFormData.name,
        start_date: holidayFormData.startDate,
        end_date: holidayFormData.endDate,
        status: holidayFormData.status,
        price_category: holidayFormData.price_category
      };

      if (editingHoliday) {
        const { error } = await supabase.from('holidays').update(holidayData).eq('id', editingHoliday.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('holidays').insert(holidayData);
        if (error) throw error;
      }

      handleCloseHolidayModal();
    } catch (e) {
      console.error(e);
      alert("儲存失敗");
    }
  };

  const handleDeleteHoliday = async () => {
    if (editingHoliday) {
      if (confirm("確定刪除此假期？")) {
        const { error } = await supabase.from('holidays').delete().eq('id', editingHoliday.id);
        if (!error) handleCloseHolidayModal();
        else alert("刪除失敗");
      }
    }
  };

  const handleToggleHolidayStatus = async (id: number) => {
    const h = holidays.find(x => x.id === id);
    if (h) {
      await supabase.from('holidays').update({ status: !h.status }).eq('id', id);
    }
  };

  // --- 3. Airport/Port Settings Data ---
  const [airportPrices, setAirportPrices] = useState<AirportMatrixType[]>([]);

  // Fetch Airport Prices
  const fetchAirportPrices = async () => {
    const { data, error } = await supabase.from('airport_prices').select('*').order('id', { ascending: true });

    let finalData: AirportMatrixType[] = [];

    if (data && data.length > 0) {
      finalData = data.map((p: any) => ({
        id: p.id,
        airport: p.airport,
        region: p.region,
        prices: p.prices || {},
        remoteSurcharge: p.remote_surcharge,
        holidaySurcharges: p.holiday_surcharges || {},
        category: p.category,
        status: p.status
      }));
    } else {
      // Fallback to Mock Data
      console.log("Using Mock Airport Prices Data");
      finalData = MOCK_AIRPORT_PRICES;
    }

    setAirportPrices(finalData);

    // Update master lists based on fetched data
    const airports = Array.from(new Set(finalData.map((p: any) => p.airport))) as string[];
    const regions = Array.from(new Set(finalData.map((p: any) => p.region))) as string[];
    setAvailableAirports(airports);
    setAvailableRegions(regions);
  };

  useEffect(() => {
    fetchAirportPrices();

    const channel = supabase.channel('airport_prices_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'airport_prices' }, () => fetchAirportPrices())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<'weekday' | 'holiday' | 'special'>('weekday');

  // --- 4. Route Settings Data ---
  const [routePrices, setRoutePrices] = useState<RouteType[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      const { data, error } = await supabase.from('route_prices').select('*').order('id', { ascending: true });

      if (data && data.length > 0) {
        setRoutePrices(data.map((r: any) => ({
          id: r.id,
          name: r.name,
          start: r.start_location,
          end: r.end_location,
          price: r.price,
          status: r.status
        })));
      } else {
        // Fallback Mock
        console.log("Using Mock Routes Data");
        setRoutePrices(MOCK_ROUTES);
      }
    };
    fetchRoutes();
    const channel = supabase.channel('route_prices_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'route_prices' }, () => fetchRoutes())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteType | null>(null);
  const initialRouteFormState: Omit<RouteType, 'id'> = {
    name: "",
    price: 0,
    status: true
  };
  const [routeFormData, setRouteFormData] = useState(initialRouteFormState);

  // Helper
  const toDbRoute = (r: any) => ({
    name: r.name,
    start_location: r.start,
    end_location: r.end,
    price: r.price,
    status: r.status
  });

  // --- 5. Extra Settings Data ---
  const [extraSettings, setExtraSettings] = useState<ExtraSettingsType>({
    id: 0,
    safety_seat_infant_price: 0,
    safety_seat_child_price: 0,
    safety_seat_booster_price: 0,
    signboard_price: 0
  });

  const fetchExtraSettings = async () => {
    const { data, error } = await supabase.from('extra_settings').select('*').single();
    if (data) {
      setExtraSettings(data);
    } else {
      // Create default if not exists (should be handled by seed, but safe fallback)
      console.log("No extra settings found, using default");
    }
  };

  useEffect(() => {
    fetchExtraSettings();
    const channel = supabase.channel('extra_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'extra_settings' }, () => fetchExtraSettings())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSaveExtraSettings = async () => {
    try {
      if (extraSettings.id === 0) {
        // Create new row
        const { error } = await supabase.from('extra_settings').insert([extraSettings]);
        if (error) throw error;
      } else {
        // Update
        const { error } = await supabase.from('extra_settings').update(extraSettings).eq('id', extraSettings.id);
        if (error) throw error;
      }
      alert("額外設定儲存成功");
    } catch (e) {
      console.error(e);
      alert("儲存失敗");
    }
  };





  const handleSaveRoute = async () => {
    try {
      if (editingRoute) {
        const { error } = await supabase.from('route_prices').update(toDbRoute(routeFormData)).eq('id', editingRoute.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('route_prices').insert(toDbRoute(routeFormData));
        if (error) throw error;
      }
      setIsRouteModalOpen(false);
      setEditingRoute(null);
    } catch (e) {
      console.error(e);
      alert("儲存路線失敗");
    }
  };

  const handleDeleteRoute = async () => {
    if (editingRoute) {
      if (confirm("確定刪除此路線？")) {
        try {
          const { error } = await supabase.from('route_prices').delete().eq('id', editingRoute.id);
          if (error) throw error;
          setIsRouteModalOpen(false);
          setEditingRoute(null);
        } catch (e) {
          console.error(e);
          alert("刪除失敗");
        }
      }
    }
  };

  const [inputKeyword, setInputKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleType | null>(null);

  // Form State (Initial empty state)
  const initialFormState: Omit<VehicleType, 'id' | 'lastModified' | 'modifier'> = {
    name: "",
    model: "",
    quantity: 1,
    seats: 4,
    maxPassengers: 4,
    maxLuggage: 2,
    dispatchPrice: 0,
    holidaySurcharge: 0,
    nightSurcharge: 0,
    nightSurchargeStart: "23:00",
    nightSurchargeEnd: "06:00",
    baseDistance: 0,
    basePrice: 0,
    overDistancePrice: 0,
    holidaySurchargeUnder1k: 0,
    holidaySurchargePer1k: 0,
    modelSurcharge: 0,
    offPeakDiscount: 0,
    offPeakDiscountStart: "10:00",
    offPeakDiscountEnd: "16:00",
    safetySeatInfantPrice: 0,
    safetySeatInfantMax: 0,
    safetySeatChildPrice: 0,
    safetySeatChildMax: 0,
    safetySeatBoosterPrice: 0,
    safetySeatBoosterMax: 0,
    signboardPrice: 0,
    extraStopPrice: 0,
    remoteAreaPrice: 0,
    crossDistrictPrice: 0,
    status: true,
    image: ""
  };

  const [formData, setFormData] = useState<any>(initialFormState);

  // Define Holiday Type
  interface HolidayType {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: boolean;
    price_category: string; // 'weekday' | 'holiday' | 'special'
  }

  // ...

  // Manage Holidays State
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<HolidayType | null>(null);
  const initialHolidayFormState: Omit<HolidayType, 'id'> = {
    name: "",
    startDate: "",
    endDate: "",
    status: true,
    price_category: "holiday"
  };
  const [holidayFormData, setHolidayFormData] = useState<Omit<HolidayType, 'id'>>(initialHolidayFormState);


  // Manage Vehicle Types State
  const [isManageVehicleTypesModalOpen, setIsManageVehicleTypesModalOpen] = useState(false);
  const [newVehicleTypeName, setNewVehicleTypeName] = useState("");

  // --- Helper: Convert to DB Format ---
  const toDbVehicle = (v: any) => ({
    name: v.name,
    model: v.model,
    quantity: v.quantity,
    seats: v.seats,
    max_passengers: v.maxPassengers,
    max_luggage: v.maxLuggage,
    dispatch_price: v.dispatchPrice,
    holiday_surcharge: v.holidaySurcharge,
    night_surcharge: v.nightSurcharge,
    night_surcharge_start: v.nightSurchargeStart,
    night_surcharge_end: v.nightSurchargeEnd,
    base_distance: v.baseDistance,
    base_price: v.basePrice,
    over_distance_price: v.overDistancePrice,
    holiday_surcharge_under_1k: v.holidaySurchargeUnder1k,
    holiday_surcharge_per_1k: v.holidaySurchargePer1k,
    model_surcharge: v.modelSurcharge,
    off_peak_discount: v.offPeakDiscount,
    off_peak_discount_start: v.offPeakDiscountStart,
    off_peak_discount_end: v.offPeakDiscountEnd,
    safety_seat_infant_price: v.safetySeatInfantPrice,
    safety_seat_infant_max: v.safetySeatInfantMax,
    safety_seat_child_price: v.safetySeatChildPrice,
    safety_seat_child_max: v.safetySeatChildMax,
    safety_seat_booster_price: v.safetySeatBoosterPrice,
    safety_seat_booster_max: v.safetySeatBoosterMax,
    signboard_price: v.signboardPrice,
    extra_stop_price: v.extraStopPrice,
    remote_area_price: v.remoteAreaPrice,
    cross_district_price: v.crossDistrictPrice,
    status: v.status,
    image_url: v.image,
    updated_at: new Date().toISOString(),
    last_modifier: "Admin" // TODO: Get actual user
  });

  const handleAddVehicleType = async () => {
    if (!newVehicleTypeName.trim()) return;
    try {
      const newVehiclePartial = {
        ...initialFormState,
        name: newVehicleTypeName,
        status: true,
      };
      const { error } = await supabase.from('vehicle_types').insert(toDbVehicle(newVehiclePartial));
      if (error) throw error;
      setNewVehicleTypeName("");
      // Real-time subscription will update list, but we can refetch to be sure
      // fetchVehicles is defined inside useEffect, so we might need to hoist it or rely on subscription.
      // Since fetchVehicles is inside useEffect, we can't call it here easily without refactoring.
      // But we have subscription!
    } catch (err) {
      console.error("Error adding vehicle type:", err);
      alert("新增失敗，請稍後再試");
    }
  };

  const handleDeleteVehicleType = async (id: number) => {
    if (confirm("確定要刪除此車種嗎？相關的價格設定也會一併移除。")) {
      try {
        const { error } = await supabase.from('vehicle_types').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error("Error deleting vehicle:", err);
        alert("刪除失敗");
      }
    }
  };






  // Ensure all airports have entries for all available regions
  useEffect(() => {
    const allRegions = Array.from(new Set(airportPrices.map(p => p.region)));
    const allAirports = Array.from(new Set(airportPrices.map(p => p.airport)));

    let nextId = Math.max(0, ...airportPrices.map(p => p.id)) + 1;
    const missingPrices: AirportMatrixType[] = [];

    allAirports.forEach(airport => {
      allRegions.forEach(region => {
        const exists = airportPrices.find(p => p.airport === airport && p.region === region);
        if (!exists) {
          missingPrices.push({
            id: nextId++,
            airport,
            region,
            prices: {},
            remoteSurcharge: 0,
            status: true
          });
        }
      });
    });

    if (missingPrices.length > 0) {
      setAirportPrices(prev => [...prev, ...missingPrices]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount to fix initial data inconsistencies

  // Manage Locations Master Lists State
  const [availableAirports, setAvailableAirports] = useState<string[]>(Array.from(new Set(airportPrices.map(p => p.airport))));
  const [availableRegions, setAvailableRegions] = useState<string[]>(() => {
    const allDistricts = Object.values(TAIWAN_LOCATIONS).flatMap(c => c.districts);
    const dbRegions = Array.from(new Set(airportPrices.map(p => p.region)));
    return Array.from(new Set([...allDistricts, ...dbRegions]));
  });

  // Force update availableRegions on mount/change to ensure all districts are present (Fix for HMR stale state)
  useEffect(() => {
    const allDistricts = Object.values(TAIWAN_LOCATIONS).flatMap(c => c.districts);
    setAvailableRegions(prev => {
      const dbRegions = Array.from(new Set(airportPrices.map(p => p.region)));
      return Array.from(new Set([...allDistricts, ...dbRegions, ...prev]));
    });
  }, [airportPrices]);

  // Manage Locations State
  const [isManageLocationsModalOpen, setIsManageLocationsModalOpen] = useState(false);
  const [newMasterAirport, setNewMasterAirport] = useState("");
  const [newMasterRegion, setNewMasterRegion] = useState("");

  // --- Helper: Convert Airport Price to DB ---
  const toDbAirportPrice = (p: AirportMatrixType) => ({
    airport: p.airport,
    region: p.region,
    category: p.category, // Ensure category is saved
    prices: p.prices,
    remote_surcharge: p.remoteSurcharge,
    holiday_surcharges: p.holidaySurcharges,
    status: p.status
  });

  const handleAddMasterAirport = async () => {
    const airportName = newMasterAirport.trim();
    if (airportName && !availableAirports.includes(airportName)) {
      try {
        const categories = ['weekday', 'holiday', 'special'];
        const newRows = [];
        for (const cat of categories) {
          for (const region of availableRegions) {
            newRows.push({
              airport: airportName,
              region,
              category: cat,
              prices: {},
              remote_surcharge: 0,
              holiday_surcharges: {},
              status: true
            });
          }
        }
        const { error } = await supabase.from('airport_prices').insert(newRows);
        if (error) throw error;
        setNewMasterAirport("");
        fetchAirportPrices();
      } catch (e) {
        console.error(e);
        alert("新增機場失敗");
      }
    }
  };

  const handleDeleteMasterAirport = async (airport: string) => {
    if (confirm(`確定要刪除「${airport}」嗎？這將會一併刪除所有屬於此機場的價格設定！`)) {
      try {
        const { error } = await supabase.from('airport_prices').delete().eq('airport', airport);
        if (error) throw error;
        fetchAirportPrices();
      } catch (e) {
        console.error(e);
        alert("刪除失敗");
      }
    }
  };

  const handleAddMasterRegion = async () => {
    if (!newMasterRegion.trim()) return;

    // To add a new region, we conceptually just add it to the 'regions' list
    // In our DB model, regions only exist within 'airport_prices' records.
    // So we create a "placeholder" record for the first available airport with this region.
    if (availableAirports.length > 0) {
      try {
        const newRecord = {
          airport: availableAirports[0],
          region: newMasterRegion.trim(),
          category: 'weekday',
          prices: {},
          remote_surcharge: 0,
          status: true
        };
        const { error } = await supabase.from('airport_prices').insert(newRecord);
        if (error) throw error;

        setAvailableRegions(prev => Array.from(new Set([...prev, newMasterRegion.trim()])));
        setNewMasterRegion("");
        fetchAirportPrices();
      } catch (e) {
        console.error(e);
        alert("新增接送地失敗");
      }
    } else {
      alert("請先新增至少一個機場");
    }
  };



  const handleDeleteMasterRegion = async (region: string) => {
    if (confirm(`確定要刪除「${region}」嗎？這將會一併刪除所有屬於此地區的價格設定！`)) {
      try {
        const { error } = await supabase.from('airport_prices').delete().eq('region', region);
        if (error) throw error;
        fetchAirportPrices();
      } catch (e) {
        console.error(e);
        alert("刪除失敗");
      }
    }
  };



  // Holiday Handlers
  const [holidayAirportSurcharges, setHolidayAirportSurcharges] = useState<Record<string, number>>({});

  const handleOpenHolidayModal = (holiday?: HolidayType) => {
    if (holiday) {
      setEditingHoliday(holiday);
      setHolidayFormData(holiday);

      // Populate surcharges from airportPrices
      // Note: We use the first matching entry for 'holiday' category? Or just 'weekday'? 
      // Theoretically surcharges apply to a Holiday entity regardless of 'category', 
      // but our data structure attaches them to the price row (which has a category).
      // If surcharges are uniform across categories for the same airport/holiday, we just pick one.
      const surcharges: Record<string, number> = {};
      availableAirports.forEach(airport => {
        const pricesForAirport = airportPrices.find(p => p.airport === airport && p.category === 'weekday');
        // Fallback to any if weekday missing
        const anyPrice = pricesForAirport || airportPrices.find(p => p.airport === airport);

        if (anyPrice && anyPrice.holidaySurcharges && anyPrice.holidaySurcharges[holiday.id]) {
          surcharges[airport] = anyPrice.holidaySurcharges[holiday.id];
        } else {
          surcharges[airport] = 0;
        }
      });
      setHolidayAirportSurcharges(surcharges);
    } else {
      setEditingHoliday(null);
      setHolidayFormData(initialHolidayFormState);

      const surcharges: Record<string, number> = {};
      availableAirports.forEach(a => surcharges[a] = 0);
      setHolidayAirportSurcharges(surcharges);
    }
    setIsHolidayModalOpen(true);
  };

  const handleCloseHolidayModal = () => {
    setIsHolidayModalOpen(false);
    setEditingHoliday(null);
  };



  // Airport Modal State
  const [expandedAirports, setExpandedAirports] = useState<string[]>(["桃園國際機場", "臺北松山機場"]);
  const [isAirportModalOpen, setIsAirportModalOpen] = useState(false);
  const [editingAirport, setEditingAirport] = useState<AirportMatrixType | null>(null);
  const initialAirportFormState: Omit<AirportMatrixType, 'id'> = {
    airport: "",
    region: "",
    prices: {},
    remoteSurcharge: 0,
    holidaySurcharges: {},
    status: true
  };
  const [airportFormData, setAirportFormData] = useState<any>(initialAirportFormState);

  // Airport Handlers
  const handleOpenAirportModal = (airport?: AirportMatrixType) => {
    if (airport) {
      setEditingAirport(airport);
      // Ensure holidaySurcharges is initialized if it's undefined
      setAirportFormData({ ...airport, holidaySurcharges: airport.holidaySurcharges || {} });
    } else {
      setEditingAirport(null);
      // Initialize prices with explicit vehicle IDs keys to ensure reactivity
      const initialPrices: Record<number, number> = {};
      vehicles.forEach(v => initialPrices[v.id] = 0);
      setAirportFormData({ ...initialAirportFormState, prices: initialPrices, holidaySurcharges: {}, category: selectedCategory });
    }
    setIsAirportModalOpen(true);
  };

  const handleCloseAirportModal = () => {
    setIsAirportModalOpen(false);
    setEditingAirport(null);
  };

  const handleSaveAirport = async () => {
    try {
      if (editingAirport) {
        const { error } = await supabase.from('airport_prices').update(toDbAirportPrice(airportFormData)).eq('id', editingAirport.id);
        if (error) throw error;
      } else {
        // Creating single row? Usually done via Master Add.
        // But if specific add:
        const { error } = await supabase.from('airport_prices').insert(toDbAirportPrice(airportFormData));
        if (error) throw error;
      }
      handleCloseAirportModal();
    } catch (e) {
      console.error(e);
      alert("儲存失敗");
    }
  };

  const handleDeleteAirport = async () => {
    if (editingAirport) {
      try {
        const { error } = await supabase.from('airport_prices').delete().eq('id', editingAirport.id);
        if (error) throw error;
        handleCloseAirportModal();
      } catch (e) {
        console.error(e);
        alert("刪除失敗");
      }
    }
  };

  // Bulk Holiday States
  const [isBulkHolidayModalOpen, setIsBulkHolidayModalOpen] = useState(false);
  const [activeBulkAirport, setActiveBulkAirport] = useState<string | null>(null);
  const [bulkHolidayFormData, setBulkHolidayFormData] = useState<Record<number, number>>({});

  const handleOpenBulkHolidayModal = (airport: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveBulkAirport(airport);
    // Get existing values from the first item in the group as a template
    const groupItems = airportPrices.filter(p => p.airport === airport && p.category === selectedCategory);
    if (groupItems.length > 0) {
      setBulkHolidayFormData(groupItems[0].holidaySurcharges || {});
    } else {
      setBulkHolidayFormData({});
    }
    setIsBulkHolidayModalOpen(true);
  };

  const handleSaveBulkHoliday = async () => {
    if (activeBulkAirport) {
      try {
        // Update ALL rows for this airport + category to have these surcharges
        // We assume merging logic: apply these surcharges to whatever exists.
        // But here we probably overwrite the whole surcharge object for that airport?
        // The UI form editing 'bulkHolidayFormData' represents the SET of surcharges for holidays.
        // So overwriting is probably correct for "Bulk Edit".

        const { error } = await supabase.from('airport_prices')
          .update({ holiday_surcharges: bulkHolidayFormData })
          .eq('airport', activeBulkAirport)
          .eq('category', selectedCategory);

        if (error) throw error;
      } catch (e) {
        console.error(e);
        alert("儲存假期加價失敗");
      }
    }
    setIsBulkHolidayModalOpen(false);
    setActiveBulkAirport(null);
  };

  const handleOpenModal = (vehicle?: VehicleType) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData(vehicle);
    } else {
      setEditingVehicle(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  const handleSave = async () => {
    try {
      const dbData = toDbVehicle(formData);
      if (editingVehicle) {
        // Update existing
        const { error } = await supabase
          .from("vehicle_types")
          .update(dbData)
          .eq("id", editingVehicle.id);
        if (error) throw error;
      } else {
        // Add new
        const { error } = await supabase
          .from("vehicle_types")
          .insert([dbData]);
        if (error) throw error;
      }
      handleCloseModal();
    } catch (e) {
      console.error(e);
      alert("儲存車型失敗");
    }
  };

  const handleToggleStatus = async (id: number) => {
    const v = vehicles.find(x => x.id === id);
    if (v) {
      try {
        const { error } = await supabase
          .from("vehicle_types")
          .update({ status: !v.status })
          .eq("id", id);
        if (error) throw error;
      } catch (e) {
        console.error(e);
        alert("更新狀態失敗");
      }
    }
  };



  const handleToggleAirportStatus = (id: number) => {
    setAirportPrices(airportPrices.map(p => p.id === id ? { ...p, status: !p.status } : p));
  };





  const handleOpenRouteModal = (route?: RouteType) => {
    if (route) {
      setEditingRoute(route);
      setRouteFormData(route);
    } else {
      setEditingRoute(null);
      setRouteFormData(initialRouteFormState);
    }
    setIsRouteModalOpen(true);
  };

  const handleCloseRouteModal = () => {
    setIsRouteModalOpen(false);
    setEditingRoute(null);
  };

  const handleToggleRouteStatus = async (id: number) => {
    // Optimistic Update
    const currentRoute = routePrices.find(r => r.id === id);
    if (!currentRoute) return;

    setRoutePrices(prev => prev.map(r => r.id === id ? { ...r, status: !r.status } : r));

    try {
      const { error } = await supabase
        .from('route_prices')
        .update({ status: !currentRoute.status })
        .eq('id', id);

      if (error) {
        // Suppress error if table is missing (Mock Data Mode)
        // Check both Postgres 42P01 and PostgREST schema cache error messages
        if (error.code === '42P01' || error.message?.includes('Could not find the table')) {
          console.warn("Route Table missing, operating in Mock Mode");
          return;
        }
        throw error;
      }
    } catch (e: any) {
      console.error(e);
      // Suppress alert for same errors if caught in catch block
      if (e.message?.includes('Could not find the table') || e.code === '42P01') {
        return;
      }

      alert("更新狀態失敗: " + (e.message || "未知錯誤"));
      // Revert local state only for real errors
      setRoutePrices(prev => prev.map(r => r.id === id ? { ...r, status: currentRoute.status } : r));
    }
  };

  const handleSearch = () => {
    // Basic search implementation
  };

  // Filter Logic
  const filteredVehicles = vehicles.filter(v => {
    const matchTerm = v.name.toLowerCase().includes(inputKeyword.toLowerCase()) ||
      v.model.toLowerCase().includes(inputKeyword.toLowerCase());
    return matchTerm;
  });

  // Render Functions for New Tabs
  const renderHolidayTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
            <tr>
              <th className="px-6 py-4">假期名稱</th>
              <th className="px-6 py-4">開始日期</th>
              <th className="px-6 py-4">結束日期</th>
              <th className="px-6 py-4">狀態</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {holidays.map(h => (
              <tr key={h.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{h.name}</td>
                <td className="px-6 py-4 text-gray-600">{h.startDate}</td>
                <td className="px-6 py-4 text-gray-600">{h.endDate}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleHolidayStatus(h.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 center ${h.status ? 'bg-emerald-500' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${h.status ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleOpenHolidayModal(h)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const toggleAirportGroup = (airport: string) => {
    const newExpanded = new Set(expandedAirports);
    if (newExpanded.has(airport)) {
      newExpanded.delete(airport);
    } else {
      newExpanded.add(airport);
    }
    setExpandedAirports(Array.from(newExpanded));
  };

  const toggleAirportGroupStatus = (airport: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = !currentStatus;

    // Find all districts for this airport to ensure comprehensive coverage
    const allDistricts: string[] = [];
    Object.values(TAIWAN_LOCATIONS).forEach(city => {
      allDistricts.push(...city.districts);
    });

    let updatedPrices = [...airportPrices];
    const existingRecords = updatedPrices.filter(p => p.airport === airport && p.category === selectedCategory);
    const existingRegions = new Set(existingRecords.map(p => p.region));

    // Update existing records
    updatedPrices = updatedPrices.map(p => (p.airport === airport && p.category === selectedCategory) ? { ...p, status: newStatus } : p);

    // If turning ON, create missing records for all districts in this airport (conceptually all Taiwan districts potentially? No, just the ones relevant?)
    // Actually the airport usually maps to ALL Taiwan districts in this specific app model (Airport -> City -> District). 
    // Yes, 'toggleAirportGroup' iterates TAIWAN_LOCATIONS. So 'airport' covers ALL districts.

    if (newStatus) {
      // iterate all Taiwan districts
      Object.values(TAIWAN_LOCATIONS).forEach(cityData => {
        cityData.districts.forEach(district => {
          if (!existingRegions.has(district)) {
            const initialPrices: Record<number, number> = {};
            vehicles.forEach(v => initialPrices[v.id] = 0);

            updatedPrices.push({
              id: Date.now() + Math.random(),
              airport,
              region: district,
              category: selectedCategory,
              prices: initialPrices,
              remoteSurcharge: 0,
              holidaySurcharges: {},
              status: true
            });
          }
        });
      });
    }

    setAirportPrices(updatedPrices);
  };

  const toggleCityGroupStatus = (airport: string, districts: string[], currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = !currentStatus;

    let updatedPrices = [...airportPrices];
    const existingRecords = updatedPrices.filter(p => p.airport === airport && districts.includes(p.region) && p.category === selectedCategory);
    const existingRegions = new Set(existingRecords.map(p => p.region));

    // Update existing
    updatedPrices = updatedPrices.map(p => (p.airport === airport && districts.includes(p.region) && p.category === selectedCategory) ? { ...p, status: newStatus } : p);

    // If turning ON, create missing
    if (newStatus) {
      districts.forEach(district => {
        if (!existingRegions.has(district)) {
          const initialPrices: Record<number, number> = {};
          vehicles.forEach(v => initialPrices[v.id] = 0);

          updatedPrices.push({
            id: Date.now() + Math.random(),
            airport,
            region: district,
            category: selectedCategory,
            prices: initialPrices,
            remoteSurcharge: 0,
            holidaySurcharges: {},
            status: true
          });
        }
      });
    }
    setAirportPrices(updatedPrices);
  };

  const toggleSingleStatus = (p: AirportMatrixType, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = !p.status;
    setAirportPrices(airportPrices.map(item => (item.id === p.id) ? { ...item, status: newStatus } : item));

    // If turning ON, force Parent (City) and Grandparent (Airport) to ON visual state
    if (newStatus) {
      // Find city for this region
      let foundCityKey = '';
      Object.entries(TAIWAN_LOCATIONS).forEach(([k, v]) => {
        if (v.districts.includes(p.region)) foundCityKey = k;
      });

      const airportKey = `airport-${p.airport}-${selectedCategory}`;
      const cityKey = `city-${p.airport}-${foundCityKey}-${selectedCategory}`;

      setGroupStatus(prev => ({
        ...prev,
        [airportKey]: true,
        [cityKey]: true
      }));
    }
  };

  // Expanded Cities State
  const [expandedCities, setExpandedCities] = useState<string[]>([]);
  // Independent Visual Status State (to support "Master Switch" behavior)
  const [groupStatus, setGroupStatus] = useState<{ [key: string]: boolean }>({});

  // Sync initial visual status from data (only if not set yet, or on category change)
  useEffect(() => {
    const newStatus: { [key: string]: boolean } = { ...groupStatus };

    // Check Airports
    availableAirports.forEach(airport => {
      const airportItems = airportPrices.filter(p => p.airport === airport && p.category === selectedCategory);
      // Default to "some active" if no manual override exists? 
      // Actually we want to sync with data initially.
      const isAnyActive = airportItems.some(p => p.status);
      const airportKey = `airport-${airport}-${selectedCategory}`;
      if (groupStatus[airportKey] === undefined) {
        newStatus[airportKey] = isAnyActive;
      }

      // Check Cities
      Object.entries(TAIWAN_LOCATIONS).forEach(([cityKey, cityData]) => {
        const cityItems = airportPrices.filter(p => p.airport === airport && cityData.districts.includes(p.region) && p.category === selectedCategory);
        const isCityAnyActive = cityItems.some(p => p.status);
        const cityUniqueKey = `city-${airport}-${cityKey}-${selectedCategory}`;
        if (groupStatus[cityUniqueKey] === undefined) {
          newStatus[cityUniqueKey] = isCityAnyActive;
        }
      });
    });
    setGroupStatus(newStatus);
  }, [airportPrices, selectedCategory]);

  const toggleCityGroup = (airport: string, cityKey: string) => {
    const key = `${airport}-${cityKey}`;
    const newExpanded = new Set(expandedCities);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedCities(Array.from(newExpanded));
  };




  const handleDownloadTemplate = () => {
    // 1. Prepare Headers: Airport, Region, Category, Remote Surcharge, [Vehicle Names...]
    const headers = ["機場/港口", "區域", "價格類別(weekday/holiday/special)", "偏遠地區加價"];
    vehicles.forEach(v => {
      headers.push(v.name);
    });

    // 2. Prepare Sample Data
    const sampleData = [
      ["桃園機場", "中正區", "weekday", 0, ...vehicles.map(() => 1000)],
      ["桃園機場", "中正區", "holiday", 0, ...vehicles.map(() => 1200)],
      ["松山機場", "松山區", "weekday", 0, ...vehicles.map(() => 800)],
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "運價模板");

    XLSX.writeFile(wb, "dispatch_pricing_template.xlsx");
  };

  const [isImporting, setIsImporting] = useState(false);

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

        if (data.length < 2) {
          alert("檔案內容不足");
          return;
        }

        const headers = data[0];
        const rows = data.slice(1);

        // Map column index to vehicle ID
        const vehicleMap: Record<number, number> = {};
        headers.forEach((h, idx) => {
          const vehicle = vehicles.find(v => v.name === h);
          if (vehicle) vehicleMap[idx] = vehicle.id;
        });

        const upsertData: any[] = [];

        for (const row of rows) {
          if (!row[0] || !row[1]) continue; // Skip empty rows

          const airport = String(row[0]);
          const region = String(row[1]);
          const category = String(row[2] || 'weekday');
          const remoteSurcharge = Number(row[3] || 0);

          const prices: Record<number, number> = {};
          Object.entries(vehicleMap).forEach(([colIdx, vehicleId]) => {
            prices[vehicleId] = Number(row[Number(colIdx)] || 0);
          });

          upsertData.push({
            airport,
            region,
            category,
            remote_surcharge: remoteSurcharge,
            prices,
            status: true
          });
        }

        if (upsertData.length > 0) {
          // Supabase upsert using (airport, region, category) as unique constraint
          // In real production, you'd need a unique index on these 3 columns in Supabase
          const { error } = await supabase
            .from("airport_prices")
            .upsert(upsertData, { onConflict: 'airport,region,category' });

          if (error) {
            console.error("Import Error:", error);
            alert("匯入失敗: " + error.message);
          } else {
            alert(`成功匯入 ${upsertData.length} 筆資料`);
            fetchAirportPrices(); // Refresh data
          }
        }
      } catch (err) {
        console.error("Parse Error:", err);
        alert("檔案解析失敗");
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const renderAirportTab = () => {
    // Filter by category within the airport grouping
    const filteredAirportPrices = airportPrices.filter(p => p.category === selectedCategory);

    return (
      <div className="space-y-6">
        {/* Category Selector */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">價格類別：</label>
            <div className="flex gap-2">
              {[
                { id: 'weekday', label: '平日價' },
                { id: 'holiday', label: '假日價' },
                { id: 'special', label: '特價' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Airport Groups */}
        <div className="space-y-4">
          {availableAirports.map(airport => (
            <div key={airport} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Airport Header */}
              <div
                className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleAirportGroup(airport)}
              >
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    {expandedAirports.includes(airport) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    {airport}
                  </h3>
                </div>

                {/* Airport Controls (Status Only) */}
                <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                  {/* Airport Status Toggle */}
                  <button
                    onClick={(e) => {
                      const key = `airport-${airport}-${selectedCategory}`;
                      const currentVisualStatus = groupStatus[key] ?? false;
                      const newVisualStatus = !currentVisualStatus;

                      // Prepare new group status object
                      const nextGroupStatus = { ...groupStatus, [key]: newVisualStatus };

                      // Propagate to all cities under this airport
                      Object.keys(TAIWAN_LOCATIONS).forEach(cityKey => {
                        const cityStatusKey = `city-${airport}-${cityKey}-${selectedCategory}`;
                        nextGroupStatus[cityStatusKey] = newVisualStatus;
                      });

                      // Update Visual Status
                      setGroupStatus(nextGroupStatus);

                      // Execute Data Logic
                      toggleAirportGroupStatus(airport, currentVisualStatus, e);
                    }}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 center ${groupStatus[`airport-${airport}-${selectedCategory}`]
                      ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    title="切換此機場所有區域狀態"
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${groupStatus[`airport-${airport}-${selectedCategory}`]
                      ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                  </button>
                </div>
              </div>

              {/* City/District Content */}
              {expandedAirports.includes(airport) && (
                <div className="divide-y divide-gray-100">
                  {Object.entries(TAIWAN_LOCATIONS).map(([cityKey, cityData]) => {
                    // Check if we have any districts to show (expandable city)
                    const uniqueCityKey = `${airport}-${cityKey}`;
                    const isCityExpanded = expandedCities.includes(uniqueCityKey);

                    return (
                      <div key={cityKey} className="group">
                        {/* City Header */}
                        <div
                          className="px-6 py-3 bg-gray-50/50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => toggleCityGroup(airport, cityKey)}
                        >
                          <div className="flex items-center gap-2 font-medium text-gray-800">
                            {isCityExpanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                            <MapPin size={16} className="text-blue-500" />
                            {cityData.name}
                            <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">{cityData.districts.length} 區</span>
                          </div>

                          {/* City Controls (Status Only) */}
                          <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                            {/* City Status Toggle */}
                            <button
                              onClick={(e) => {
                                const key = `city-${airport}-${cityKey}-${selectedCategory}`;
                                const currentVisualStatus = groupStatus[key] ?? false;
                                const newVisualStatus = !currentVisualStatus;

                                setGroupStatus({ ...groupStatus, [key]: newVisualStatus });
                                toggleCityGroupStatus(airport, cityData.districts, currentVisualStatus, e);
                              }}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 center ${groupStatus[`city-${airport}-${cityKey}-${selectedCategory}`]
                                ? 'bg-emerald-500' : 'bg-gray-300'
                                }`}
                              title="切換此縣市所有區域狀態"
                            >
                              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${groupStatus[`city-${airport}-${cityKey}-${selectedCategory}`]
                                ? 'translate-x-5' : 'translate-x-1'
                                }`} />
                            </button>
                          </div>
                        </div>

                        {/* Districts Table */}
                        {isCityExpanded && (
                          <div className="overflow-x-auto animate-in slide-in-from-top-2 duration-200">
                            <table className="w-full text-left whitespace-nowrap">
                              <thead className="bg-white text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
                                <tr>
                                  <th className="px-6 py-2 min-w-[150px]">行政區</th>
                                  {vehicles.map(v => (
                                    <th key={v.id} className="px-4 py-2 text-center min-w-[100px]">{v.name}</th>
                                  ))}
                                  <th className="px-4 py-2 text-center">偏遠加價</th>
                                  <th className="px-4 py-2 text-center">狀態</th>
                                  <th className="px-4 py-2 text-right">操作</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {cityData.districts.map(district => {
                                  // Find existing price row
                                  // Note: We match by `region` which currently stores "DistrictName". 
                                  // Using filteredAirportPrices which supports category
                                  const p = filteredAirportPrices.find(p => p.airport === airport && p.region === district);

                                  // If p exists, show it. If not, show "Add" placeholder logic?
                                  // For "371 regions", we prefer showing ALL rows. 
                                  // If DB misses it, we show empty/button to add.

                                  return (
                                    <tr key={district} className="hover:bg-blue-50/30 transition-colors">
                                      <td className="px-6 py-3 font-medium text-gray-700 pl-10 border-l-4 border-transparent hover:border-blue-500 transition-all">
                                        {district}
                                      </td>
                                      {vehicles.map(v => (
                                        <td key={v.id} className="px-4 py-3 text-center text-gray-600">
                                          {p && p.prices[v.id] ? `$${p.prices[v.id]}` : <span className="text-gray-300">-</span>}
                                        </td>
                                      ))}
                                      <td className="px-4 py-3 text-center text-gray-600">
                                        {p && p.remoteSurcharge > 0 ? `+$${p.remoteSurcharge}` : <span className="text-gray-300">-</span>}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <button
                                          onClick={(e) => {
                                            if (p) {
                                              toggleSingleStatus(p, e);
                                            } else {
                                              // If no data exists, clicking toggle opens Add Modal (active status)
                                              setEditingAirport(null);
                                              const initialPrices: Record<number, number> = {};
                                              vehicles.forEach(v => initialPrices[v.id] = 0);
                                              setAirportFormData({
                                                airport: airport,
                                                region: district,
                                                category: selectedCategory,
                                                prices: initialPrices,
                                                remoteSurcharge: 0,
                                                holidaySurcharges: {},
                                                status: true // Default to true
                                              });
                                              setIsAirportModalOpen(true);
                                            }
                                          }}
                                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 center ${p && p.status ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                        >
                                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${p && p.status ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </button>
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        <button
                                          onClick={() => {
                                            if (p) {
                                              handleOpenAirportModal(p);
                                            } else {
                                              // Add New Logic
                                              setEditingAirport(null);
                                              const initialPrices: Record<number, number> = {};
                                              vehicles.forEach(v => initialPrices[v.id] = 0);
                                              setAirportFormData({
                                                airport: airport,
                                                region: district,
                                                category: selectedCategory,
                                                prices: initialPrices,
                                                remoteSurcharge: 0,
                                                holidaySurcharges: {},
                                                status: true
                                              });
                                              setIsAirportModalOpen(true);
                                            }
                                          }}
                                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                                        >
                                          <MoreHorizontal size={18} />
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };


  const renderExtraSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 max-w-4xl mx-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
          <Settings size={20} className="text-blue-600" />
          額外服務設定
        </h3>

        <div className="space-y-8">
          {/* Safety Seats */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100 flex items-center gap-2">
              <Armchair size={16} />
              安全座椅設定
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Infant */}
              <div className="p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 transition-colors space-y-3">
                <h5 className="text-sm font-bold text-gray-900">嬰兒座椅 (0-1歲)</h5>
                <InputField
                  label="加價"
                  type="number"
                  required
                  suffix="元"
                  value={extraSettings.safety_seat_infant_price}
                  onChange={(v) => setExtraSettings({ ...extraSettings, safety_seat_infant_price: Math.max(0, Number(v) || 0) })}
                />
              </div>
              {/* Child */}
              <div className="p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 transition-colors space-y-3">
                <h5 className="text-sm font-bold text-gray-900">幼童座椅 (1-4歲)</h5>
                <InputField
                  label="加價"
                  type="number"
                  required
                  suffix="元"
                  value={extraSettings.safety_seat_child_price}
                  onChange={(v) => setExtraSettings({ ...extraSettings, safety_seat_child_price: Math.max(0, Number(v) || 0) })}
                />
              </div>
              {/* Booster */}
              <div className="p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 transition-colors space-y-3">
                <h5 className="text-sm font-bold text-gray-900">學童座椅 (4-7歲)</h5>
                <InputField
                  label="加價"
                  type="number"
                  required
                  suffix="元"
                  value={extraSettings.safety_seat_booster_price}
                  onChange={(v) => setExtraSettings({ ...extraSettings, safety_seat_booster_price: Math.max(0, Number(v) || 0) })}
                />
              </div>
            </div>
          </div>

          {/* Other Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100 flex items-center gap-2">
              <Plus size={16} />
              其他服務加價
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 transition-colors space-y-3">
                <h5 className="text-sm font-bold text-gray-900">舉牌服務</h5>
                <InputField
                  label="加價"
                  type="number"
                  required
                  suffix="元"
                  value={extraSettings.signboard_price}
                  onChange={(v) => setExtraSettings({ ...extraSettings, signboard_price: Math.max(0, Number(v) || 0) })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              onClick={handleSaveExtraSettings}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              <Save size={18} />
              儲存設定
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRouteTab = () => (
    <div className="space-y-6">

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
            <tr>
              <th className="px-6 py-4">道路名稱</th>
              <th className="px-6 py-4">固定價格</th>
              <th className="px-6 py-4">狀態</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {routePrices.map(r => (
              <tr key={r.id}>
                <td className="px-6 py-4 font-bold text-lg text-gray-900">{r.name}</td>
                <td className="px-6 py-4 text-blue-600 font-bold">${r.price}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleRouteStatus(r.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 center ${r.status ? 'bg-emerald-500' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${r.status ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleOpenRouteModal(r)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );



  const renderVehicleTab = () => (
    <>
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        {/* Existing Search Bar Content kept as is for Vehicle Tab */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-500">車輛類型</label>
            <div className="relative">
              <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-all overflow-hidden">
                <div className="flex-shrink-0 w-10 h-10 text-gray-400 flex items-center justify-center">
                  <Car size={18} />
                </div>
                <input
                  type="text"
                  value={inputKeyword}
                  onChange={(e) => setInputKeyword(e.target.value)}
                  placeholder="輸入車型名稱"
                  className="w-full h-full text-sm outline-none border-none bg-transparent text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium shadow-sm"
          >
            <Search size={16} />
            搜尋
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold whitespace-nowrap">
              <th className="px-6 py-4">車輛資訊</th>
              <th className="px-6 py-4 text-center">車輛數量</th>
              <th className="px-6 py-4 text-center">配置</th>
              <th className="px-6 py-4 text-center">派遣金額</th>
              <th className="px-6 py-4 text-center">狀態</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-900">{vehicle.name}</span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded">{vehicle.model}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <Car size={16} />
                    {vehicle.quantity} 輛
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex flex-col items-center gap-0.5" title="座位數">
                      <Armchair size={16} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-700">{vehicle.seats}</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5" title="乘客數">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-700">{vehicle.maxPassengers}</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5" title="行李數">
                      <Briefcase size={16} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-700">{vehicle.maxLuggage}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 text-center">
                  ${vehicle.dispatchPrice.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleToggleStatus(vehicle.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 center ${vehicle.status ? 'bg-emerald-500' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${vehicle.status ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleOpenModal(vehicle)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">前台管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理車隊車型、車輛數量與複合價格設定。</p>
        </div>
        <div className="flex gap-3">
          {/* Show 'Add Vehicle' button only on vehicle tab */}
          {(!currentTab || currentTab === 'vehicle') && (
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm shadow-blue-200"
            >
              <Plus size={16} />
              新增車型
            </button>
          )}
          {currentTab === 'holiday' && (
            <button
              onClick={() => handleOpenHolidayModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm shadow-blue-200"
            >
              <Plus size={16} />
              新增假期
            </button>
          )}
          {currentTab === 'airport' && (
            <div className="flex gap-3">
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-100 transition shadow-sm"
              >
                <Download size={16} />
                下載模板
              </button>
              <div className="relative">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleImportExcel}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isImporting}
                />
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm border ${isImporting
                    ? 'bg-gray-100 text-gray-400 border-gray-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  <Upload size={16} />
                  {isImporting ? '處理中...' : '匯入 Excel'}
                </button>
              </div>
              <button
                onClick={() => setIsManageVehicleTypesModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
              >
                <Edit size={16} />
                編輯車種
              </button>
              <button
                onClick={() => setIsManageLocationsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
              >
                <MapPin size={16} />
                編輯地點
              </button>
            </div>
          )}
          {currentTab === 'route' && (
            <button
              onClick={() => handleOpenRouteModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm shadow-blue-200"
            >
              <Plus size={16} />
              新增路線
            </button>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex gap-8 mb-4">
          <Link
            href="/vehicles"
            className="pb-3 text-base font-bold border-b-2 transition-colors border-blue-600 text-blue-600 flex items-center gap-2"
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
        </nav>
      </div>

      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-2 inline-flex items-center gap-2 border border-gray-200 overflow-x-auto max-w-full">
          <Link
            href="/vehicles"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${(!currentTab || currentTab === 'vehicle') ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'}`}
          >
            <Car size={16} />
            1. 車輛管理
          </Link>
          <div className="text-gray-300"><ChevronRight size={16} /></div>

          <Link
            href="/vehicles?tab=extra"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${currentTab === 'extra' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'}`}
          >
            <Settings size={16} />
            2. 額外設定
          </Link>
          <div className="text-gray-300"><ChevronRight size={16} /></div>

          <Link
            href="/vehicles?tab=holiday"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${currentTab === 'holiday' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'}`}
          >
            <Calendar size={16} />
            3. 假期特價
          </Link>
          <div className="text-gray-300"><ChevronRight size={16} /></div>
          <Link
            href="/vehicles?tab=airport"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${currentTab === 'airport' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'}`}
          >
            <Plane size={16} />
            4. 機場/港口
          </Link>
          <div className="text-gray-300"><ChevronRight size={16} /></div>

          <Link
            href="/vehicles?tab=route"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${currentTab === 'route' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'}`}
          >
            <MapPin size={16} />
            5. 特定路段
          </Link>
        </div>
      </div>

      {/* Conditional Rendering Content */}
      <div className="min-h-[400px]">
        {currentTab === 'holiday' && renderHolidayTab()}
        {currentTab === 'airport' && renderAirportTab()}
        {currentTab === 'route' && renderRouteTab()}

        {(!currentTab || currentTab === 'vehicle') && renderVehicleTab()}
        {currentTab === 'extra' && renderExtraSettingsTab()}
      </div>


      {/* Manage Vehicle Types Modal */}
      {
        isManageVehicleTypesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900">
                  編輯車種
                </h3>
                <button onClick={() => setIsManageVehicleTypesModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">現有車種列表</label>
                  <div className="space-y-2">
                    {vehicles.map(vehicle => (
                      <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="font-medium text-gray-900">{vehicle.name}</span>
                        <button
                          onClick={() => handleDeleteVehicleType(vehicle.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                          title="刪除"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">新增車種</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newVehicleTypeName}
                      onChange={(e) => setNewVehicleTypeName(e.target.value)}
                      placeholder="輸入新車種名稱"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddVehicleType()}
                    />
                    <button
                      onClick={handleAddVehicleType}
                      disabled={!newVehicleTypeName.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Plus size={16} />
                      新增
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3">
                <button
                  onClick={() => setIsManageVehicleTypesModalOpen(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-200"
                >
                  完成
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Holiday Settings Modal */}
      {
        isHolidayModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingHoliday ? '編輯假期' : '新增假期'}
                </h3>
                <button onClick={handleCloseHolidayModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">假期名稱</label>
                  <input
                    type="text"
                    value={holidayFormData.name}
                    onChange={(e) => setHolidayFormData({ ...holidayFormData, name: e.target.value })}
                    placeholder="例如：春節連假"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">開始日期</label>
                    <input
                      type="date"
                      value={holidayFormData.startDate}
                      onChange={(e) => setHolidayFormData({ ...holidayFormData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">結束日期</label>
                    <input
                      type="date"
                      value={holidayFormData.endDate}
                      onChange={(e) => setHolidayFormData({ ...holidayFormData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign size={16} className="text-blue-600" />
                    適用價格表設定
                  </h4>
                  <div className="space-y-3 border border-gray-100 rounded-lg p-4 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-2">請選擇此假期時段應適用的價格表：</p>
                    <div className="flex flex-col gap-2">
                      {[
                        { value: 'weekday', label: '使用平日價' },
                        { value: 'holiday', label: '使用假日價' },
                        { value: 'special', label: '使用特價' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <input
                            type="radio"
                            name="priceCategory"
                            value={option.value}
                            checked={holidayFormData.price_category === option.value}
                            onChange={(e) => setHolidayFormData({ ...holidayFormData, price_category: e.target.value })}
                            className="hidden"
                          />
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${holidayFormData.price_category === option.value
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300 bg-white'
                            }`}>
                            {holidayFormData.price_category === option.value && (
                              <Check size={14} className="text-white" strokeWidth={3} />
                            )}
                          </div>
                          <span className={`text-sm font-medium ${holidayFormData.price_category === option.value ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
                    <input
                      type="checkbox"
                      id="holidayStatus"
                      checked={holidayFormData.status}
                      onChange={(e) => setHolidayFormData({ ...holidayFormData, status: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="holidayStatus" className="text-sm text-gray-700 select-none cursor-pointer">啟用此假期設定</label>
                  </div>
                </div>
              </div>

              <div className={`px-6 py-4 border-t border-gray-100 bg-white flex ${editingHoliday ? 'justify-between' : 'justify-end'} gap-3`}>
                {editingHoliday && (
                  <button
                    onClick={handleDeleteHoliday}
                    className="px-6 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    刪除
                  </button>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseHolidayModal}
                    className="px-6 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveHoliday}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
                  >
                    <Save size={18} />
                    儲存
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Airport Settings Modal */}
      {
        isAirportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingAirport ? '編輯機場/港口定價' : '新增機場/港口定價'}
                </h3>
                <button onClick={handleCloseAirportModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      機場/港口
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={airportFormData.airport}
                      onChange={(e) => setAirportFormData({ ...airportFormData, airport: e.target.value })}
                      disabled={!!editingAirport}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none ${editingAirport ? 'bg-gray-100 text-gray-500 cursor-not-allowed appearance-none' : ''}`}
                    >
                      <option value="" disabled>請選擇機場/港口</option>
                      {availableAirports.map(airport => (
                        <option key={airport} value={airport}>{airport}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      接送地
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={airportFormData.region}
                      onChange={(e) => setAirportFormData({ ...airportFormData, region: e.target.value })}
                      disabled={!!editingAirport}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none ${editingAirport ? 'bg-gray-100 text-gray-500 cursor-not-allowed appearance-none' : ''}`}
                    >
                      <option value="" disabled>請選擇接送地</option>
                      {availableRegions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  <InputField
                    label="偏遠地區加價 (Remote Surcharge)"
                    type="number"
                    value={airportFormData.remoteSurcharge}
                    onChange={(v) => setAirportFormData({ ...airportFormData, remoteSurcharge: Math.max(0, Number(v) || 0) })}
                    placeholder="0"
                    suffix="元"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Car size={16} className="text-blue-600" />
                    各車種定價設定
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehicles.map(vehicle => (
                      <div key={vehicle.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="text-sm font-medium text-gray-700 block mb-2">{vehicle.name}</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={airportFormData.prices[vehicle.id] || 0}
                            onChange={(e) => setAirportFormData({
                              ...airportFormData,
                              prices: { ...airportFormData.prices, [vehicle.id]: Math.max(0, Number(e.target.value) || 0) }
                            })}
                            className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-sm">$</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Holiday Surcharges Section Removed as per new requirement (Global Price Category) */}

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="airportStatus"
                    checked={airportFormData.status}
                    onChange={(e) => setAirportFormData({ ...airportFormData, status: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="airportStatus" className="text-sm text-gray-700 select-none cursor-pointer">啟用此定價設定</label>
                </div>
              </div>

              <div className={`px-6 py-4 border-t border-gray-100 bg-white flex ${editingAirport ? 'justify-between' : 'justify-end'} gap-3 flex-shrink-0`}>
                {editingAirport && (
                  <button
                    onClick={handleDeleteAirport}
                    className="px-6 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    刪除
                  </button>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseAirportModal}
                    className="px-6 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveAirport}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
                  >
                    <Save size={18} />
                    儲存
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Manage Locations Modal */}
      {
        isManageLocationsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                <h3 className="text-xl font-bold text-gray-900">
                  編輯地點
                </h3>
                <button onClick={() => setIsManageLocationsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* Airports Section */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 border-l-4 border-blue-500 pl-3">機場/港口列表</h4>
                  <p className="text-xs text-gray-500">刪除機場將會一併刪除該機場下的所有定價資料。</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableAirports.map(airport => (
                      <div key={airport} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                        <span className="text-sm font-medium text-gray-700">{airport}</span>
                        <button
                          onClick={() => handleDeleteMasterAirport(airport)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                          title="刪除"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newMasterAirport}
                      onChange={(e) => setNewMasterAirport(e.target.value)}
                      placeholder="輸入新機場/港口名稱"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={handleAddMasterAirport}
                      disabled={!newMasterAirport.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                    >
                      <Plus size={16} />
                      新增
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Regions Section */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 border-l-4 border-green-500 pl-3">接送地列表</h4>
                  <p className="text-xs text-gray-500">刪除接送地將會一併刪除該地點在所有機場的定價資料。</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableRegions.map(region => (
                      <div key={region} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                        <span className="text-sm font-medium text-gray-700">{region}</span>
                        <button
                          onClick={() => handleDeleteMasterRegion(region)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                          title="刪除"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newMasterRegion}
                      onChange={(e) => setNewMasterRegion(e.target.value)}
                      placeholder="輸入新接送地名稱"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <button
                      onClick={handleAddMasterRegion}
                      disabled={!newMasterRegion.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                    >
                      <Plus size={16} />
                      新增
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end items-center flex-shrink-0">
                <button
                  onClick={() => setIsManageLocationsModalOpen(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-100 shrink-0">
              <div className="px-8 py-5 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {editingVehicle ? <Edit className="text-blue-600" size={24} /> : <Plus className="text-blue-600" size={24} />}
                  {editingVehicle ? "編輯車型" : "新增車型"}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500 transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50">
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Vehicle Details & Config */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Truck size={20} className="text-blue-600" />
                      基本資料
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="車種名稱" type="text" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="例如：豪華轎車" required />
                        <InputField label="顯示型號" type="text" value={formData.model} onChange={(v) => setFormData({ ...formData, model: v })} placeholder="例如：Toyota Camry" required />
                      </div>
                      <InputField label="車輛數量 (庫存)" type="number" required value={formData.quantity} onChange={(v) => setFormData({ ...formData, quantity: Math.max(0, parseInt(v) || 0) })} />
                    </div>
                  </div>

                  {/* Space Config */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Armchair size={20} className="text-blue-600" />
                      空間配置
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="座位數" type="number" required suffix="人" value={formData.seats} onChange={(v) => setFormData({ ...formData, seats: Math.max(0, parseInt(v) || 0) })} />
                        <InputField label="建議乘客數" type="number" required suffix="人" value={formData.maxPassengers} onChange={(v) => setFormData({ ...formData, maxPassengers: Math.max(0, parseInt(v) || 0) })} />
                      </div>
                      <InputField label="大行李上限" type="number" required suffix="件 (28-29吋)" value={formData.maxLuggage} onChange={(v) => setFormData({ ...formData, maxLuggage: Math.max(0, parseInt(v) || 0) })} />
                    </div>
                  </div>

                  {/* Safety Seats */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertCircle size={20} className="text-blue-600" />
                      安全座椅數量限制
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">嬰兒座椅 (0-1歲)</label>
                        <InputField label="最大數量" type="number" required suffix="個" value={formData.safetySeatInfantMax} onChange={(v) => setFormData({ ...formData, safetySeatInfantMax: Math.max(0, parseInt(v) || 0) })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">兒童座椅 (1-4歲)</label>
                        <InputField label="最大數量" type="number" required suffix="個" value={formData.safetySeatChildMax} onChange={(v) => setFormData({ ...formData, safetySeatChildMax: Math.max(0, parseInt(v) || 0) })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">學童座椅 (4-7歲)</label>
                        <InputField label="最大數量" type="number" required suffix="個" value={formData.safetySeatBoosterMax} onChange={(v) => setFormData({ ...formData, safetySeatBoosterMax: Math.max(0, parseInt(v) || 0) })} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Pricing & Photo */}
                <div className="space-y-6">
                  {/* Pricing Settings */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <DollarSign size={20} className="text-blue-600" />
                      計費設定
                    </h3>
                    <div className="space-y-6">
                      {/* Multi-stop */}
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-4">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <AlertCircle size={16} />
                          多點下車距離計費 (加點)
                        </h4>
                        <InputField label="每公里費用" type="number" required suffix="元" value={formData.overDistancePrice} onChange={(v) => setFormData({ ...formData, overDistancePrice: Math.max(0, parseInt(v) || 0) })} />
                      </div>

                      {/* Surcharges */}
                      <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100 space-y-4">
                        <h4 className="text-sm font-bold text-purple-800 flex items-center gap-2">
                          <Ticket size={16} />
                          加價與優惠
                        </h4>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <InputField label="夜間加成" type="number" required suffix="元" value={formData.nightSurcharge} onChange={(v) => setFormData({ ...formData, nightSurcharge: Math.max(0, parseInt(v) || 0) })} />
                            <div className="flex items-center gap-2 mt-2 bg-white/50 p-2 rounded-lg border border-purple-100">
                              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">時段設定：</span>
                              <input
                                type="time"
                                value={formData.nightSurchargeStart}
                                onChange={(e) => setFormData({ ...formData, nightSurchargeStart: e.target.value })}
                                className="flex-1 min-w-0 border border-purple-200 rounded px-2 py-1.5 text-sm bg-white focus:ring-1 focus:ring-purple-500 outline-none text-center"
                              />
                              <span className="text-gray-400">→</span>
                              <input
                                type="time"
                                value={formData.nightSurchargeEnd}
                                onChange={(e) => setFormData({ ...formData, nightSurchargeEnd: e.target.value })}
                                className="flex-1 min-w-0 border border-purple-200 rounded px-2 py-1.5 text-sm bg-white focus:ring-1 focus:ring-purple-500 outline-none text-center"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <InputField label="離峰優惠 (扣除)" type="number" required suffix="元" value={formData.offPeakDiscount} onChange={(v) => setFormData({ ...formData, offPeakDiscount: Math.max(0, parseInt(v) || 0) })} />
                            <div className="flex items-center gap-2 mt-2 bg-white/50 p-2 rounded-lg border border-purple-100">
                              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">時段設定：</span>
                              <input
                                type="time"
                                value={formData.offPeakDiscountStart}
                                onChange={(e) => setFormData({ ...formData, offPeakDiscountStart: e.target.value })}
                                className="flex-1 min-w-0 border border-purple-200 rounded px-2 py-1.5 text-sm bg-white focus:ring-1 focus:ring-purple-500 outline-none text-center"
                              />
                              <span className="text-gray-400">→</span>
                              <input
                                type="time"
                                value={formData.offPeakDiscountEnd}
                                onChange={(e) => setFormData({ ...formData, offPeakDiscountEnd: e.target.value })}
                                className="flex-1 min-w-0 border border-purple-200 rounded px-2 py-1.5 text-sm bg-white focus:ring-1 focus:ring-purple-500 outline-none text-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Photo */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Camera size={20} className="text-blue-600" />
                      車輛照片
                    </h3>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group relative overflow-hidden">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => {
                            console.log(e.target.files)
                          }}
                        />
                        {formData.image ? (
                          <div className="relative h-48 w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={formData.image} alt="Preview" className="h-full w-full object-contain" />
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setFormData({ ...formData, image: "" });
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-20"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2 pointer-events-none">
                            <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                              <ImageIcon className="text-blue-600" size={24} />
                            </div>
                            <p className="text-sm font-medium text-gray-700">點擊或拖放上傳圖片</p>
                            <p className="text-xs text-gray-400">支援 JPG, PNG 格式</p>
                          </div>
                        )}
                      </div>
                      <InputField label="或輸入圖片 URL" type="text" value={formData.image} onChange={(v) => setFormData({ ...formData, image: v })} placeholder="https://..." />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
              >
                <Save size={18} />
                儲存設定
              </button>
            </div>
          </div>
        </div>
      )}





      {/* Route Settings Modal */}
      {
        isRouteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingRoute ? '編輯路線' : '新增路線'}
                </h3>
                <button onClick={handleCloseRouteModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">道路名稱</label>
                      <input
                        type="text"
                        value={routeFormData.name}
                        onChange={(e) => setRouteFormData({ ...routeFormData, name: e.target.value })}
                        placeholder="例如：忠孝東路一段"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <InputField
                    label="固定價格"
                    type="number"
                    value={routeFormData.price}
                    onChange={(v) => setRouteFormData({ ...routeFormData, price: Math.max(0, Number(v) || 0) })}
                    suffix="元"
                    required
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-between items-center">
                <div>
                  {editingRoute && (
                    <button
                      onClick={handleDeleteRoute}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      刪除道路
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseRouteModal}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveRoute}
                    disabled={!routeFormData.name}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    儲存
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Bulk Holiday Settings Modal */}
      {
        isBulkHolidayModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-lg text-red-600">
                    <Settings size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    批次設定：{activeBulkAirport}
                  </h3>
                </div>
                <button onClick={() => setIsBulkHolidayModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                  ⚠️ 此操作將會更新「{activeBulkAirport}」下所有的接送地區定價。
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Calendar size={16} className="text-red-600" />
                    假期加價設定 (僅列出啟用中假期)
                  </h4>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-500 text-sm">
                    假期加價功能已移至「假期設定」統一管理，請至該頁面設定假期對應的價格表 (平日/假日/特價)。
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3">
                <button
                  onClick={() => setIsBulkHolidayModalOpen(false)}
                  className="px-6 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveBulkHoliday}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors shadow-lg shadow-red-200 flex items-center gap-2"
                >
                  <Save size={18} />
                  更新全部地區
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}

function InputField({ label, type = "text", required = false, suffix, value, onChange, placeholder }: { label: string; type?: string; required?: boolean; suffix?: string; value: any; onChange: (val: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-sm text-gray-500">
              {suffix}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">正在載入價格管理系統...</div>}>
      <VehiclesContent />
    </Suspense>
  );
}
