"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, MoreHorizontal, Download, Plus, X, Save, Check, Trash2, RefreshCcw, Calendar, User, FileText, Car, DollarSign, Briefcase, MapPin, Clock, ArrowRight, Ban, CheckCircle, Smartphone, Globe } from "lucide-react";
import Link from "next/link";
import { useSystemActivity } from "../context/SystemActivityContext";
import InvoicePreview from "@/components/InvoicePreview"; // Import the preview component

type Order = {
  id: string;
  platform: string;
  user: string;
  phone: string;
  email: string;
  driver: string;
  from: string;
  to: string;
  status: string;
  amount: string;
  date: string; // Pickup Date
  time: string; // Pickup Time
  createdAt: string;
  paymentMethod: string;
  serviceType: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  passengerCount: string;
  luggageCount: string;
  specialRequests: {
    carSeat: string;
    boosterSeat: string;
    vehicleType: string;
    signage: string;
    notes: string;
  };
  priceBreakdown: {
    base: number;
    vehicleType: number;
    night: number;
    holiday: number;
    carSeat: number;
    signage: number;
    area: number;
    crossDistrict: number;
    extraStop: number;
    offPeak: number;
    coupon: number;
    total: number;
  };
  isBilled?: boolean;
};

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentStatus = searchParams.get("status") || "unconfirmed";
  const currentDriver = searchParams.get("driver");
  const isFinanceMode = searchParams.get("mode") === "finance";

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "CH202511100099",
      platform: "App",
      user: "測試員",
      phone: "0900-000-000",
      email: "test@example.com",
      driver: "陳自強",
      from: "台北车站",
      to: "桃园机场",
      status: "completed",
      amount: "1200元",
      date: "2025/11/10",
      time: "14:00",
      createdAt: "2025-11-10 10:00",
      paymentMethod: "Cash",
      serviceType: "送机",
      isBilled: false,
      flightNumber: "",
      departureTime: "2025/11/10 14:00",
      arrivalTime: "2025/11/10 15:00",
      passengerCount: "1",
      luggageCount: "1",
      specialRequests: {
        carSeat: "无",
        boosterSeat: "无",
        vehicleType: "一般轿车",
        signage: "不需要",
        notes: "测试订单"
      },
      priceBreakdown: {
        base: 1200,
        vehicleType: 0,
        night: 0,
        holiday: 0,
        carSeat: 0,
        signage: 0,
        area: 0,
        crossDistrict: 0,
        extraStop: 0,
        offPeak: 0,
        coupon: 0,
        total: 1200
      }
    },
    {
      id: "CH202510160001",
      platform: "馳航網站",
      user: "王小明",
      phone: "0906-916-715",
      email: "xiaoming1126@gmail.com",
      driver: "未指派",
      from: "桃園機場第一航廈2號出口",
      to: "台北市國光一路112巷21號",
      status: "unconfirmed",
      amount: "5500元",
      date: "2025/11/10",
      time: "10:00",
      createdAt: "2025-10-16 10:00",
      paymentMethod: "Cash",
      serviceType: "接機",
      isBilled: false,
      flightNumber: "SCOOT-TR897",
      departureTime: "2025/11/10 10:00",
      arrivalTime: "2025/11/11 11:00",
      passengerCount: "4人 (2大/2小)",
      luggageCount: "20寸以下 1件, 21-25寸 1件, 26-28寸 1件",
      specialRequests: {
        carSeat: "後向式安全座椅 1張, 前向式安全座椅 1張",
        boosterSeat: "增高座墊 1張",
        vehicleType: "商務8人座",
        signage: "不需要",
        notes: "無"
      },
      priceBreakdown: {
        base: 1500,
        vehicleType: 0,
        night: 0,
        holiday: 0,
        carSeat: 0,
        signage: 0,
        area: 0,
        crossDistrict: 0,
        extraStop: 0,
        offPeak: 0,
        coupon: 0,
        total: 5500
      }
    },
    {
      id: "CH202510160002",
      platform: "馳航網站",
      user: "李美玲",
      phone: "0912-345-678",
      email: "mei@example.com",
      driver: "林志豪",
      from: "台北港",
      to: "新竹科學園區",
      status: "confirmed",
      amount: "$2,500",
      date: "2025/10/16",
      time: "15:15",
      createdAt: "2025-10-16 09:30",
      paymentMethod: "Cash",
      isBilled: true,
      serviceType: "包車",
      flightNumber: "-",
      departureTime: "2025/10/16 15:15",
      arrivalTime: "-",
      passengerCount: "1人",
      luggageCount: "無",
      specialRequests: { carSeat: "無", boosterSeat: "無", vehicleType: "一般轎車", signage: "無", notes: "無" },
      priceBreakdown: { base: 2500, vehicleType: 0, night: 0, holiday: 0, carSeat: 0, signage: 0, area: 0, crossDistrict: 0, extraStop: 0, offPeak: 0, coupon: 0, total: 2500 }
    },
    {
      id: "CH202510160003", platform: "App", user: "張建國", driver: "未指派", from: "松山機場 (TSA)", to: "內湖科學園區", status: "unconfirmed", amount: "$450", date: "2025/10/16", time: "15:45", createdAt: "2025-10-16 14:00", paymentMethod: "Line Pay", isBilled: false,
      phone: "0912-345-678", email: "zhang@example.com", serviceType: "送機", flightNumber: "BR123", departureTime: "2025/10/16 15:00", arrivalTime: "2025/10/16 15:45", passengerCount: "2人 (2大/0小)", luggageCount: "20寸以下 2件", specialRequests: { carSeat: "無", boosterSeat: "無", vehicleType: "一般轎車", signage: "無", notes: "無" }, priceBreakdown: { base: 450, vehicleType: 0, night: 0, holiday: 0, carSeat: 0, signage: 0, area: 0, crossDistrict: 0, extraStop: 0, offPeak: 0, coupon: 0, total: 450 }
    },
    {
      id: "CH202510160004-OC", platform: "電話預約", user: "陳怡君", driver: "黃國榮", from: "基隆港", to: "台北車站", status: "trash", amount: "$0", date: "2025/10/16", time: "12:00", createdAt: "2025-10-15 18:20", paymentMethod: "Cash", isBilled: false,
      phone: "0912-345-678", email: "chen@example.com", serviceType: "港口接送", flightNumber: "-", departureTime: "2025/10/16 12:00", arrivalTime: "-", passengerCount: "3人 (3大/0小)", luggageCount: "21-25寸 3件", specialRequests: { carSeat: "無", boosterSeat: "無", vehicleType: "一般轎車", signage: "無", notes: "無" }, priceBreakdown: { base: 0, vehicleType: 0, night: 0, holiday: 0, carSeat: 0, signage: 0, area: 0, crossDistrict: 0, extraStop: 0, offPeak: 0, coupon: 0, total: 0 }
    },
    {
      id: "CH202510160005", platform: "馳航網站", user: "劉志明", driver: "吳雅婷", from: "高雄小港機場 (KHH)", to: "高雄85大樓", status: "completed", amount: "$800", date: "2025/10/16", time: "11:20", createdAt: "2025-10-16 08:00", paymentMethod: "Credit Card", isBilled: true,
      phone: "0912-345-678", email: "liu@example.com", serviceType: "接機", flightNumber: "CI301", departureTime: "2025/10/16 11:00", arrivalTime: "2025/10/16 11:20", passengerCount: "1人 (1大/0小)", luggageCount: "20寸以下 1件", specialRequests: { carSeat: "無", boosterSeat: "無", vehicleType: "一般轎車", signage: "無", notes: "無" }, priceBreakdown: { base: 800, vehicleType: 0, night: 0, holiday: 0, carSeat: 0, signage: 0, area: 0, crossDistrict: 0, extraStop: 0, offPeak: 0, coupon: 0, total: 800 }
    },
    {
      id: "CH202510160006", platform: "App", user: "林怡君", driver: "張志明", from: "台中清泉崗機場 (RMQ)", to: "逢甲夜市", status: "refund", amount: "$600", date: "2025/10/16", time: "10:15", createdAt: "2025-10-16 09:00", paymentMethod: "Credit Card", isBilled: false,
      phone: "0912-345-678", email: "lin@example.com", serviceType: "接機", flightNumber: "JX701", departureTime: "2025/10/16 10:00", arrivalTime: "2025/10/16 10:15", passengerCount: "2人 (2大/0小)", luggageCount: "21-25寸 2件", specialRequests: { carSeat: "無", boosterSeat: "無", vehicleType: "一般轎車", signage: "無", notes: "無" }, priceBreakdown: { base: 600, vehicleType: 0, night: 0, holiday: 0, carSeat: 0, signage: 0, area: 0, crossDistrict: 0, extraStop: 0, offPeak: 0, coupon: 0, total: 600 }
    },
    {
      id: "CH202510160007", platform: "馳航網站", user: "王大文", driver: "未指派", from: "台北101", to: "故宮博物院", status: "unconfirmed", amount: "$500", date: "2025/10/16", time: "16:00", createdAt: "2025-10-16 15:30", paymentMethod: "Cash", isBilled: false,
      phone: "0912-345-678", email: "wang@example.com", serviceType: "包車", flightNumber: "-", departureTime: "2025/10/16 16:00", arrivalTime: "-", passengerCount: "4人 (4大/0小)", luggageCount: "無", specialRequests: { carSeat: "無", boosterSeat: "無", vehicleType: "商務8人座", signage: "無", notes: "無" }, priceBreakdown: { base: 500, vehicleType: 0, night: 0, holiday: 0, carSeat: 0, signage: 0, area: 0, crossDistrict: 0, extraStop: 0, offPeak: 0, coupon: 0, total: 500 }
    },
    // Mock Data for Driver 劉曉明 (ID: 1) to match Finance Page (45 orders, ~13 unbilled)
    ...Array.from({ length: 45 }).map((_, i) => ({
      id: `CH202501${String(i + 1).padStart(3, '0')}-LX`,
      platform: "App",
      user: `客戶${i + 1}`,
      phone: "0900-000-000",
      email: `client${i + 1}@example.com`,
      driver: "劉曉明",
      from: "台北市",
      to: "桃園機場",
      status: i < 13 ? "completed" : "completed", // All completed, but billing differs
      amount: "1300",
      date: "2025/01/01",
      time: "12:00",
      createdAt: "2025-01-01 10:00",
      paymentMethod: "Credit Card",
      isBilled: i >= 13, // First 13 are unbilled
      serviceType: "送機",
      flightNumber: "",
      departureTime: "",
      arrivalTime: "",
      passengerCount: "1",
      luggageCount: "1",
      specialRequests: { carSeat: "無", boosterSeat: "無", vehicleType: "一般轎車", signage: "無", notes: "無" },
      priceBreakdown: { base: 1300, vehicleType: 0, night: 0, holiday: 0, carSeat: 0, signage: 0, area: 0, crossDistrict: 0, extraStop: 0, offPeak: 0, coupon: 0, total: 1300 }
    })),
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewOrder, setIsNewOrder] = useState(false);
  const [editForm, setEditForm] = useState<Order | null>(null);

  // Search States
  const [inputName, setInputName] = useState("");
  const [inputId, setInputId] = useState("");
  const [inputDateStart, setInputDateStart] = useState("");
  const [inputDateEnd, setInputDateEnd] = useState("");

  const [activeSearch, setActiveSearch] = useState({
    name: "",
    id: "",
    dateStart: "",
    dateEnd: ""
  });

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      handleCreateOrder();
      router.replace("/orders");
    }
  }, [searchParams, router]);



  // Bulk Selection State
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false); // New state

  // Invoice Statement Logic
  interface InvoiceStatement {
    id: string;
    driver: string;
    date: string;
    amount: number;
    orderCount: number;
    orderIds: string[];
    // New fields
    status: 'unpaid' | 'paid';
    handler?: string;
  }

  const [invoiceStatements, setInvoiceStatements] = useState<InvoiceStatement[]>([]);
  const [selectedStatement, setSelectedStatement] = useState<InvoiceStatement | null>(null);
  const [selectedStatements, setSelectedStatements] = useState<Set<string>>(new Set());

  // Payment Confirmation Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTargetStatement, setPaymentTargetStatement] = useState<InvoiceStatement | null>(null);
  const [paymentHandlerName, setPaymentHandlerName] = useState("");

  // Reset selection when tab changes
  useEffect(() => {
    setSelectedOrders(new Set());
  }, [currentStatus, currentDriver]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(filteredOrders.map(o => o.id));
      setSelectedOrders(allIds);
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedOrders(newSelected);
  };

  const handleBulkExport = () => {
    if (selectedOrders.size === 0) return alert("請至少選擇一筆訂單");
    alert(`已匯出 ${selectedOrders.size} 筆訂單資料`);
    setSelectedOrders(new Set());
  };

  const handleOpenInvoicePreview = () => {
    if (selectedOrders.size === 0) return alert("請至少選擇一筆訂單");
    setIsInvoicePreviewOpen(true);
  };

  const handleConfirmInvoice = () => {
    // 1. Calculate total amount
    const selectedOrderList = orders.filter(o => selectedOrders.has(o.id));
    const totalAmount = selectedOrderList.reduce((sum, order) => {
      const amt = parseInt(String(order.amount).replace(/[^0-9]/g, "")) || 0;
      return sum + amt;
    }, 0);

    // 2. Create Statement Object
    const newStatement: InvoiceStatement = {
      id: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      driver: currentDriver || "Unknown",
      date: new Date().toLocaleDateString('zh-TW'),
      amount: totalAmount,
      orderCount: selectedOrderList.length,
      orderIds: Array.from(selectedOrders),
      status: 'unpaid' // Default
    };

    // 3. Update States
    setInvoiceStatements([newStatement, ...invoiceStatements]);
    setOrders(orders.map(o => selectedOrders.has(o.id) ? { ...o, isBilled: true } : o));
    addLog(`建立出帳單 ${newStatement.id} (共 ${newStatement.orderCount} 筆訂單)`, "success");

    // 4. Reset UI
    setSelectedOrders(new Set());
    setIsInvoicePreviewOpen(false);
  };

  // Confirm Payment Logic (New)
  // Confirm Payment Logic (New Modal)
  const handleOpenPaymentModal = (statement: InvoiceStatement) => {
    setPaymentTargetStatement(statement);
    setPaymentHandlerName("財務行政"); // Default
    setIsPaymentModalOpen(true);
  };

  const handleSubmitPayment = () => {
    if (!paymentTargetStatement || !paymentHandlerName) return;

    const updatedStatements = invoiceStatements.map(stm =>
      stm.id === paymentTargetStatement.id
        ? { ...stm, status: 'paid' as const, handler: paymentHandlerName }
        : stm
    );
    setInvoiceStatements(updatedStatements);
    addLog(`出帳單 ${paymentTargetStatement.id} 已確認出納 (經手人: ${paymentHandlerName})`, "success");

    setIsPaymentModalOpen(false);
    setPaymentTargetStatement(null);
  };

  const handleSelectAllStatements = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStatements(new Set(invoiceStatements.map(s => s.id)));
    } else {
      setSelectedStatements(new Set());
    }
  };

  const handleSelectStatement = (id: string) => {
    const newSet = new Set(selectedStatements);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedStatements(newSet);
  };



  const handleSearch = () => {
    setActiveSearch({
      name: inputName,
      id: inputId,
      dateStart: inputDateStart,
      dateEnd: inputDateEnd
    });
  };

  const clearSearch = () => {
    setInputName("");
    setInputId("");
    setInputDateStart("");
    setInputDateEnd("");
    setActiveSearch({
      name: "",
      id: "",
      dateStart: "",
      dateEnd: ""
    });
  };

  const { addLog } = useSystemActivity();

  const handleOpenModal = (order: Order) => {
    setCurrentOrder(order);
    setEditForm(order);
    setIsEditing(false);
    setIsNewOrder(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentOrder(null);
    setEditForm(null);
    setIsEditing(false);
    setIsNewOrder(false);
  };

  const handleCreateOrder = () => {
    const newOrder: Order = {
      id: `CH${new Date().getFullYear()}${String(orders.length + 1).padStart(6, '0')}`,
      platform: "App",
      user: "",
      phone: "",
      email: "",
      driver: "未指派",
      from: "",
      to: "",
      status: "unconfirmed",
      amount: "0",
      date: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      time: "12:00",
      createdAt: new Date().toLocaleString('zh-TW', { hour12: false }).replace(/\//g, '-'),
      paymentMethod: "Cash",
      isBilled: false,
      serviceType: "接機",
      flightNumber: "",
      departureTime: "",
      arrivalTime: "",
      passengerCount: "1人",
      luggageCount: "無",
      specialRequests: { carSeat: "無", boosterSeat: "無", vehicleType: "一般轎車", signage: "無", notes: "無" },
      priceBreakdown: { base: 0, vehicleType: 0, night: 0, holiday: 0, carSeat: 0, signage: 0, area: 0, crossDistrict: 0, extraStop: 0, offPeak: 0, coupon: 0, total: 0 }
    };
    setCurrentOrder(newOrder);
    setEditForm(newOrder);
    setIsNewOrder(true);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveOrder = () => {
    if (!editForm) return;

    if (isNewOrder) {
      setOrders([editForm, ...orders]);
      addLog(`新增訂單 #${editForm.id}`, "success");
    } else {
      setOrders(orders.map(o => o.id === editForm.id ? editForm : o));
      addLog(`更新訂單 #${editForm.id} 內容`, "info");
    }
    handleCloseModal();
  };

  const handleDeleteOrder = () => {
    if (!currentOrder) return;
    if (confirm("確定要刪除此訂單嗎？")) {
      setOrders(orders.filter(o => o.id !== currentOrder.id));
      addLog(`刪除訂單 #${currentOrder.id}`, "warning");
      handleCloseModal();
    }
  };

  const handleAssignDriver = () => {
    if (!currentOrder) return;
    const driverName = prompt("請輸入司機姓名：", "林志豪");
    if (driverName) {
      const updatedOrder = { ...currentOrder, driver: driverName, status: "confirmed" };
      setOrders(orders.map(o => o.id === currentOrder.id ? updatedOrder : o));
      addLog(`指派司機 ${driverName} 給訂單 #${currentOrder.id}`, "info");
      handleCloseModal();
    }
  };

  const handleRefundApprove = () => {
    if (!currentOrder) return;
    const updatedOrder = { ...currentOrder, status: "completed", id: currentOrder.id + "-RF" };
    setOrders(orders.map(o => o.id === currentOrder.id ? updatedOrder : o));
    addLog(`批准訂單 #${currentOrder.id} 退費申請`, "success");
    handleCloseModal();
  };

  const handleRefundReject = () => {
    if (!currentOrder) return;
    const updatedOrder = { ...currentOrder, status: "completed", id: currentOrder.id + "-NA" };
    setOrders(orders.map(o => o.id === currentOrder.id ? updatedOrder : o));
    addLog(`拒絕訂單 #${currentOrder.id} 退費申請`, "warning");
    handleCloseModal();
  };

  // TABS Configuration
  const defaultTabs = [
    { id: "all", label: "全部" },
    { id: "unconfirmed", label: "未確認訂單" },
    { id: "confirmed", label: "已確認訂單" },
    { id: "completed", label: "已完成訂單" },
    { id: "refund", label: "退費訂單審核" },
    { id: "trash", label: "垃圾桶" },
  ];

  const driverTabs = [
    { id: 'all', label: '全部' },
    { id: 'unbilled', label: '未出帳' },
    { id: 'billed', label: '已出帳' },
    { id: 'statements', label: '出帳單' }, // Added new tab
  ];

  const tabs = currentDriver ? driverTabs : defaultTabs;

  const filteredOrders = orders.filter(o => {
    // If a driver filter is active, ignore "unconfirmed" status default and show all for that driver
    // Unless specific status tabs are clicked? User said "show all orders for that driver".
    // I will prioritize driver filter over status tab if driver is present.
    // Actually, usually filters combine. But for "Finance -> Driver Orders", we probably want ALL history.
    // I'll make it so if `driver` param is present, `status` param is ignored or reset to 'all' logic (which I need to implement).
    // Or simpler: If `currentDriver` is set, we bypass status check OR we check against all statuses.
    // Let's modify logic:

    // Revised Logic:
    // 1. Check Driver Match
    const driverMatch = currentDriver ? o.driver === currentDriver : true;

    // Status / Billing Filter
    let statusMatch = true;
    if (currentDriver) {
      if (currentStatus === 'unbilled') statusMatch = !o.isBilled;
      if (currentStatus === 'billed') statusMatch = !!o.isBilled;
      if (currentStatus === 'statements') return false; // Don't show orders in statements tab
      // 'all' is true
    } else {
      statusMatch = (currentStatus === 'all' || !currentStatus) ? true : o.status === currentStatus;
    }

    const nameMatch = o.user.toLowerCase().includes(activeSearch.name.toLowerCase());
    const idMatch = o.id.toLowerCase().includes(activeSearch.id.toLowerCase());

    const orderDate = new Date(o.date.replace(/\//g, '-'));
    const startDate = activeSearch.dateStart ? new Date(activeSearch.dateStart) : null;
    const endDate = activeSearch.dateEnd ? new Date(activeSearch.dateEnd) : null;

    const dateMatch = (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);

    return driverMatch && statusMatch && nameMatch && idMatch && dateMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentDriver ? "司機訂單" : "訂單管理"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {currentDriver ? `查看 ${currentDriver} 的所有行程與帳務狀態。` : "查看所有訂單狀態、派遣車輛與詳細內容。"}
          </p>
        </div>
        {!currentDriver && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
              <Download size={16} />
              匯出報表
            </button>
            <button
              onClick={handleCreateOrder}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm shadow-blue-200"
            >
              <Plus size={16} />
              新增訂單
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex items-center justify-between overflow-x-auto">
        <nav className="flex gap-6 min-w-max">
          {tabs.map((tab) => {
            const isActive = currentStatus === tab.id || (!currentStatus && tab.id === 'all');
            return (
              <button
                key={tab.id}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('status', tab.id);
                  router.push(`/orders?${params.toString()}`);
                }}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                {tab.label}
                {/* Show badges only for standard tabs that have counts defined (and not 0 if we wanted rigorous logic, but mock data is simpler) */}
                {!currentDriver && tab.id === 'all' && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                    {orders.filter(o => currentDriver ? o.driver === currentDriver : true).length}
                  </span>
                )}
                {!currentDriver && tab.id !== 'all' && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                    {orders.filter(o => o.status === tab.id).length}
                  </span>
                )}
                {/* For driver tabs, we could calculate counts dynamically if needed, skipping for now */}
                {currentDriver && tab.id === 'unbilled' && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    {orders.filter(o => o.driver === currentDriver && !o.isBilled).length}
                  </span>
                )}
                {currentDriver && tab.id === 'billed' && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    {orders.filter(o => o.driver === currentDriver && o.isBilled).length}
                  </span>
                )}
                {currentDriver && tab.id === 'all' && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    {orders.filter(o => o.driver === currentDriver).length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bulk Actions for Driver View (Finance Mode Only) */}
        {currentDriver && isFinanceMode && (
          <div className="flex gap-3 pb-2">
            <button
              onClick={handleBulkExport}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium shadow-sm"
            >
              <Download size={14} />
              匯出選取訂單
            </button>
            {currentStatus === 'unbilled' && (
              <button
                onClick={handleOpenInvoicePreview}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs font-medium shadow-sm shadow-emerald-200"
              >
                <DollarSign size={14} />
                產生出帳單
              </button>
            )}
          </div>
        )}
      </div>

      {/* Advanced Search - Standardized Layout */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {!currentDriver && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">會員姓名</label>
                <div className="relative">
                  <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-all overflow-hidden">
                    <div className="flex-shrink-0 pl-3 pr-2 text-gray-400 flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="輸入姓名"
                      className="w-full h-full text-sm outline-none border-none bg-transparent text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">訂單編號</label>
                <div className="relative">
                  <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-all overflow-hidden">
                    <div className="flex-shrink-0 pl-3 pr-2 text-gray-400 flex items-center justify-center">
                      <FileText size={18} />
                    </div>
                    <input
                      type="text"
                      value={inputId}
                      onChange={(e) => setInputId(e.target.value)}
                      placeholder="輸入編號"
                      className="w-full h-full text-sm outline-none border-none bg-transparent text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-500">時間範圍</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-all overflow-hidden">
                  <div className="flex-shrink-0 pl-3 pr-2 text-gray-400 flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    value={inputDateStart}
                    onChange={(e) => setInputDateStart(e.target.value)}
                    className="w-full h-full text-sm outline-none border-none bg-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
              <span className="text-gray-400">-</span>
              <div className="relative flex-1">
                <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-all overflow-hidden">
                  <div className="flex-shrink-0 pl-3 pr-2 text-gray-400 flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    value={inputDateEnd}
                    onChange={(e) => setInputDateEnd(e.target.value)}
                    className="w-full h-full text-sm outline-none border-none bg-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium shadow-sm">
            <Search size={16} />
            搜尋
          </button>
        </div>
      </div>



      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {currentStatus === 'statements' ? (
          /* Statements Table */
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold whitespace-nowrap">
                <th className="px-6 py-4 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAllStatements}
                    checked={invoiceStatements.length > 0 && selectedStatements.size === invoiceStatements.length}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4">出帳單編號</th>
                <th className="px-6 py-4">出納狀態</th>
                <th className="px-6 py-4">建立日期</th>
                <th className="px-6 py-4">經手人</th>
                <th className="px-6 py-4">訂單數量</th>
                <th className="px-6 py-4 text-right">總金額</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoiceStatements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                    尚無出帳紀錄
                  </td>
                </tr>
              ) : (
                invoiceStatements.map((stm) => (
                  <tr key={stm.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedStatements.has(stm.id)}
                        onChange={() => handleSelectStatement(stm.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">{stm.id}</td>
                    <td className="px-6 py-4">
                      {stm.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                          <Check size={12} />
                          已出納
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                          <Clock size={12} />
                          未出納
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{stm.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{stm.handler || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{stm.orderCount} 筆</td>
                    <td className="px-6 py-4 text-right font-mono text-sm font-bold text-gray-900">
                      NT$ {stm.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      {stm.status === 'unpaid' && (
                        <button
                          onClick={() => handleOpenPaymentModal(stm)}
                          className="text-white hover:bg-blue-700 bg-blue-600 text-xs font-medium px-3 py-1.5 rounded transition-colors shadow-sm"
                        >
                          確認出納
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedStatement(stm);
                          setIsInvoicePreviewOpen(true);
                        }}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-xs font-medium px-3 py-1.5 rounded transition-colors border border-gray-200"
                      >
                        預覽
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold whitespace-nowrap">
                {isFinanceMode && (
                  <th className="px-6 py-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={filteredOrders.length > 0 && selectedOrders.size === filteredOrders.length}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}
                <th className="px-6 py-4">訂單資訊</th>
                {isFinanceMode && <th className="px-6 py-4">出帳狀態</th>}
                <th className="px-6 py-4">客戶資料</th>
                <th className="px-6 py-4">行程內容</th>
                <th className="px-6 py-4">起訖地點</th>
                <th className="px-6 py-4">金額</th>
                {!isFinanceMode && <th className="px-6 py-4">狀態</th>}
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={isFinanceMode ? 9 : 8} className="px-6 py-12 text-center text-gray-500 text-sm">
                    沒有找到符合條件的訂單
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={(e) => {
                      // Prevent row click when clicking checkbox or buttons
                      if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON') {
                        handleOpenModal(order);
                      }
                    }}
                    className={`hover:bg-blue-50/30 transition-colors group cursor-pointer ${selectedOrders.has(order.id) ? "bg-blue-50/40" : ""}`}
                  >          {isFinanceMode && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.has(order.id)}
                        onChange={() => handleSelectRow(order.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                          {order.id}
                        </span>
                        <span className={`text-xs mt-0.5 w-fit px-1.5 py-0.5 rounded border ${order.platform === 'App' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                          order.platform === '馳航網站' ? 'bg-cyan-50 text-cyan-600 border-cyan-100' :
                            'bg-orange-50 text-orange-600 border-orange-100'
                          }`}>
                          {order.platform}
                        </span>
                      </div>
                    </td>
                    {isFinanceMode && (
                      <td className="px-6 py-4">
                        {order.isBilled ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                            <Check size={12} />
                            已出帳
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                            <Clock size={12} />
                            未出帳
                          </span>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{order.user}</span>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                          <span>{order.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <span className="font-medium bg-gray-100 px-1.5 py-0.5 rounded text-xs">{order.serviceType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={12} />
                          {order.date}
                          <span className="w-px h-3 bg-gray-300" />
                          <Clock size={12} />
                          {order.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs truncate" title={order.from}>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                          <span className="text-gray-900 font-medium truncate">{order.from}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs truncate" title={order.to}>
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                          <span className="text-gray-500 truncate">{order.to}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{order.amount}</td>
                    {!isFinanceMode && (
                      <td className="px-6 py-4">
                        <StatusBadge order={order} />
                      </td>
                    )}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenModal(order)}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )
        }
      </div >

      {/* Detailed Modal */}
      {
        isModalOpen && currentOrder && editForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
              {/* Modal Header */}
              <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {isNewOrder ? "新增訂單" : (isEditing ? "編輯訂單內容" : "訂單詳情")}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">訂單編號 #{currentOrder.id}</p>
                </div>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500 transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">

                {/* Section 1: Order Details */}
                <section>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    訂單明細
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <DetailRow label="訂單編號" value={editForm.id} />
                    <DetailRow
                      label="接案平台"
                      value={editForm.platform}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, platform: val })}
                    />
                    <DetailRow
                      label="乘客姓名"
                      value={editForm.user}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, user: val })}
                    />
                    <DetailRow
                      label="手機號碼"
                      value={editForm.phone}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, phone: val })}
                    />
                    <DetailRow
                      label="電子信箱"
                      value={editForm.email}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, email: val })}
                    />
                    <DetailRow
                      label="接送司機"
                      value={editForm.driver}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, driver: val })}
                    />
                    <DetailRow
                      label="服務類型"
                      value={editForm.serviceType}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, serviceType: val })}
                    />
                    <DetailRow
                      label="接送起點"
                      value={editForm.from}
                      fullWidth
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, from: val })}
                    />
                    <DetailRow
                      label="接送終點"
                      value={editForm.to}
                      fullWidth
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, to: val })}
                    />
                    <DetailRow
                      label="航班/船班"
                      value={editForm.flightNumber}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, flightNumber: val })}
                    />
                    <DetailRow
                      label="起飛時間"
                      value={editForm.departureTime}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, departureTime: val })}
                    />
                    <DetailRow
                      label="抵達時間"
                      value={editForm.arrivalTime}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, arrivalTime: val })}
                    />
                    <DetailRow
                      label="訂單成立時間"
                      value={editForm.createdAt}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, createdAt: val })}
                    />
                    <DetailRow
                      label="接送日期"
                      value={editForm.date}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, date: val })}
                    />
                    <DetailRow
                      label="接送時間"
                      value={editForm.time}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, time: val })}
                    />
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* Section 2: Payment Amount */}
                <section>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign size={20} className="text-blue-600" />
                    付款金額
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <PriceRow
                      label="基本服務"
                      value={editForm.priceBreakdown.base}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, priceBreakdown: { ...editForm.priceBreakdown, base: parseInt(val) || 0 } })}
                    />
                    <PriceRow label="車型加價" value={editForm.priceBreakdown.vehicleType} />
                    <PriceRow label="夜間加價" value={editForm.priceBreakdown.night} />
                    <PriceRow label="假期加價" value={editForm.priceBreakdown.holiday} />
                    <PriceRow label="安全座椅" value={editForm.priceBreakdown.carSeat} />
                    <PriceRow label="舉牌加價" value={editForm.priceBreakdown.signage} />
                    <PriceRow label="特定地區" value={editForm.priceBreakdown.area} />
                    <PriceRow label="跨區加價" value={editForm.priceBreakdown.crossDistrict} />
                    <PriceRow label="加點加價" value={editForm.priceBreakdown.extraStop} />
                    <PriceRow label="離峰優惠" value={editForm.priceBreakdown.offPeak} />
                    <PriceRow label="優惠卷折抵" value={editForm.priceBreakdown.coupon} />
                    <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-100 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">總金額</span>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editForm.priceBreakdown.total}
                              onChange={(e) => setEditForm({ ...editForm, priceBreakdown: { ...editForm.priceBreakdown, total: parseInt(e.target.value) || 0 } })}
                              className="w-32 px-3 py-1 border border-gray-200 rounded-lg text-right font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <span className="text-blue-600 font-bold">元</span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-blue-600">{editForm.priceBreakdown.total}元</span>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* Section 3: Ride Info */}
                <section>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Car size={20} className="text-blue-600" />
                    乘車資訊
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <DetailRow
                      label="乘客人數"
                      value={editForm.passengerCount}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, passengerCount: val })}
                    />
                    <DetailRow
                      label="行李件數"
                      value={editForm.luggageCount}
                      fullWidth
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, luggageCount: val })}
                    />
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* Section 4: Special Requests */}
                <section>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase size={20} className="text-blue-600" />
                    特別需求
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <DetailRow
                      label="安全座椅"
                      value={editForm.specialRequests.carSeat}
                      fullWidth
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, specialRequests: { ...editForm.specialRequests, carSeat: val } })}
                    />
                    <DetailRow
                      label="增高座墊"
                      value={editForm.specialRequests.boosterSeat}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, specialRequests: { ...editForm.specialRequests, boosterSeat: val } })}
                    />
                    <DetailRow
                      label="選擇車型"
                      value={editForm.specialRequests.vehicleType}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, specialRequests: { ...editForm.specialRequests, vehicleType: val } })}
                    />
                    <DetailRow
                      label="舉牌服務"
                      value={editForm.specialRequests.signage}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, specialRequests: { ...editForm.specialRequests, signage: val } })}
                    />
                    <DetailRow
                      label="備註"
                      value={editForm.specialRequests.notes}
                      isEditing={isEditing}
                      onChange={(val) => setEditForm({ ...editForm, specialRequests: { ...editForm.specialRequests, notes: val } })}
                    />
                  </div>
                </section>
              </div>

              {/* New Section: Buttons */}
              <div className="pt-2 flex justify-end gap-3 sticky bottom-0 bg-white p-4 items-center z-10 border-t border-gray-100">
                {/* Delete Button */}
                {!isNewOrder && isEditing && (
                  <button
                    onClick={handleDeleteOrder}
                    className="mr-auto px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    刪除訂單
                  </button>
                )}


                {isEditing ? (
                  <button
                    onClick={handleSaveOrder}
                    className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium shadow-sm shadow-blue-200 flex items-center gap-2"
                  >
                    <Save size={16} />
                    儲存變更
                  </button>
                ) : (
                  <>
                    {currentOrder.status === 'refund' ? (
                      <>
                        <button
                          onClick={handleRefundReject}
                          className="px-6 py-2.5 bg-white border border-gray-200 text-red-600 rounded-xl hover:bg-red-50 font-medium transition-colors shadow-sm">
                          拒絕退費 (NA)
                        </button>
                        <button
                          onClick={handleRefundApprove}
                          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-200">
                          通過退費 (RF)
                        </button>
                      </>
                    ) : currentOrder.status === 'completed' ? (
                      <button
                        onClick={handleCloseModal}
                        className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium transition-colors shadow-sm">
                        關閉
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors shadow-sm">
                          修改訂單
                        </button>
                        {currentOrder.status === 'unconfirmed' && (
                          <button
                            onClick={handleAssignDriver}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-200">
                            分配司機
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* Report Download Modal */}
      {
        isReportModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                <h3 className="text-xl font-bold text-gray-900">{isNewOrder ? "新增訂單" : "編輯訂單"}</h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">選擇報表類型</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['訂單報表', '用戶名單', '司機清單', '財務營收'].map((type) => (
                      <label key={type} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">選擇時間範圍</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500">開始日期</span>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="date" className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500">結束日期</span>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="date" className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    取消
                  </button>
                  <button onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 flex items-center gap-2">
                    <FileText size={16} />
                    確認匯出
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Invoice Preview Modal */}
      {
        isInvoicePreviewOpen && (
          <InvoicePreview
            orders={selectedStatement
              ? orders.filter(o => selectedStatement.orderIds.includes(o.id))
              : orders.filter(o => selectedOrders.has(o.id))
            }
            driverName={selectedStatement ? selectedStatement.driver : (currentDriver || "")}
            invoiceNumber={selectedStatement ? selectedStatement.id : undefined}
            onCancel={() => {
              setIsInvoicePreviewOpen(false);
              setSelectedStatement(null);
            }}
            onConfirm={() => {
              if (selectedStatement) {
                // Viewing mode, just close
                setIsInvoicePreviewOpen(false);
                setSelectedStatement(null);
              } else {
                // Confirming new invoice
                handleConfirmInvoice();
              }
            }}
          />
        )
      }

      {/* Payment Confirmation Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">確認出納</h3>
            <p className="text-sm text-gray-500 mb-4">請輸入經手出納的同仁姓名：</p>
            <input
              type="text"
              value={paymentHandlerName}
              onChange={(e) => setPaymentHandlerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="例如：財務行政"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitPayment}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
}

function DetailRow({ label, value, fullWidth = false, isEditing = false, onChange }: { label: string; value: string; fullWidth?: boolean; isEditing?: boolean; onChange?: (val: string) => void }) {
  return (
    <div className={`${fullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'} flex flex-col gap-1`}>
      <span className="text-sm font-medium text-blue-900/60">{label}</span>
      {isEditing && onChange ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      ) : (
        <span className="text-base font-medium text-gray-900">{value}</span>
      )}
    </div>
  );
}

function PriceRow({ label, value, isEditing = false, onChange }: { label: string; value: number; isEditing?: boolean; onChange?: (val: string) => void }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-base text-gray-600">{label}</span>
      {isEditing && onChange ? (
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-20 px-2 py-1 border border-gray-200 rounded text-right text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <span className="text-sm text-gray-500">元</span>
        </div>
      ) : (
        <span className="text-base font-medium text-gray-900">{value}元</span>
      )}
    </div>
  );
}

function StatusBadge({ order }: { order: Order }) {
  let statusKey = order.status;

  // Custom logic for completed orders with specific ID suffixes
  if (order.status === 'completed') {
    if (order.id.endsWith('-RF')) {
      statusKey = 'refunded';
    } else if (order.id.endsWith('-NA')) {
      statusKey = 'refund_rejected';
    }
  }

  const styles: any = {
    "completed": "bg-green-100 text-green-700 border-green-200",
    "confirmed": "bg-blue-100 text-blue-700 border-blue-200",
    "unconfirmed": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "refund": "bg-purple-100 text-purple-700 border-purple-200",
    "trash": "bg-red-50 text-red-600 border-red-100",
    "refunded": "bg-gray-100 text-gray-600 border-gray-200 decoration-slice",
    "refund_rejected": "bg-red-50 text-red-700 border-red-100",
  };

  const labels: any = {
    "completed": "已完成",
    "confirmed": "已確認",
    "unconfirmed": "未確認",
    "refund": "退費審核",
    "trash": "垃圾桶",
    "refunded": "已退費",
    "refund_rejected": "不予退費",
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[statusKey] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
      {labels[statusKey] || statusKey}
    </span>
  );
}

