"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, Ticket, Search, Plus, Edit, Trash2, X, Save, Camera, Image as ImageIcon, MoreHorizontal, AlertCircle, Download, Calendar, FileText, DollarSign, Armchair, Users, Briefcase, Car } from "lucide-react";

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
  // Distance Pricing
  baseDistance: number;
  basePrice: number;
  overDistancePrice: number;
  holidaySurchargeUnder1k: number;
  holidaySurchargePer1k: number;
  // Extra Services Pricing
  modelSurcharge: number;
  offPeakDiscount: number;
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

export default function VehiclesPage() {
  // Mock Data - Representing Vehicle Types
  const [vehicles, setVehicles] = useState<VehicleType[]>([
    {
      id: 1,
      name: "舒適四人座",
      model: "Toyota Camry / Altis",
      quantity: 15, // Company has 15 of these
      seats: 5,
      maxPassengers: 4,
      maxLuggage: 2,
      dispatchPrice: 2500,
      holidaySurcharge: 200,
      nightSurcharge: 1000,
      baseDistance: 20,
      basePrice: 2500,
      overDistancePrice: 50,
      holidaySurchargeUnder1k: 400,
      holidaySurchargePer1k: 400,
      modelSurcharge: 0,
      offPeakDiscount: 0,
      safetySeatInfantPrice: 200,
      safetySeatInfantMax: 2,
      safetySeatChildPrice: 200,
      safetySeatChildMax: 2,
      safetySeatBoosterPrice: 100,
      safetySeatBoosterMax: 2,
      signboardPrice: 100,
      extraStopPrice: 300,
      remoteAreaPrice: 500,
      crossDistrictPrice: 1000,
      status: true,
      lastModified: "2025/08/29",
      modifier: "陳明",
      image: "/placeholder-car.jpg"
    },
    {
      id: 3,
      name: "進口四人座",
      model: "Tesla Model 3 / BMW 3",
      quantity: 8,
      seats: 5,
      maxPassengers: 4,
      maxLuggage: 2,
      dispatchPrice: 3500,
      holidaySurcharge: 300,
      nightSurcharge: 1200,
      baseDistance: 20,
      basePrice: 3500,
      overDistancePrice: 70,
      holidaySurchargeUnder1k: 500,
      holidaySurchargePer1k: 500,
      modelSurcharge: 500,
      offPeakDiscount: 50,
      safetySeatInfantPrice: 300,
      safetySeatInfantMax: 2,
      safetySeatChildPrice: 300,
      safetySeatChildMax: 2,
      safetySeatBoosterPrice: 150,
      safetySeatBoosterMax: 2,
      signboardPrice: 100,
      extraStopPrice: 400,
      remoteAreaPrice: 600,
      crossDistrictPrice: 1200,
      status: true,
      lastModified: "2025/07/15",
      modifier: "陳明",
    },
    {
      id: 5,
      name: "賓士 VITO",
      model: "Mercedes-Benz Vito",
      quantity: 5,
      seats: 9,
      maxPassengers: 7,
      maxLuggage: 7,
      dispatchPrice: 5000,
      holidaySurcharge: 500,
      nightSurcharge: 1500,
      baseDistance: 20,
      basePrice: 5000,
      overDistancePrice: 100,
      holidaySurchargeUnder1k: 800,
      holidaySurchargePer1k: 800,
      modelSurcharge: 1000,
      offPeakDiscount: 0,
      safetySeatInfantPrice: 500,
      safetySeatInfantMax: 3,
      safetySeatChildPrice: 500,
      safetySeatChildMax: 3,
      safetySeatBoosterPrice: 200,
      safetySeatBoosterMax: 3,
      signboardPrice: 200,
      extraStopPrice: 500,
      remoteAreaPrice: 800,
      crossDistrictPrice: 1500,
      status: true,
      lastModified: "2025/03/01",
      modifier: "陳明",
    },
    {
      id: 8,
      name: "ALPHARD",
      model: "Toyota Alphard",
      quantity: 3,
      seats: 7,
      maxPassengers: 6,
      maxLuggage: 6,
      dispatchPrice: 6000,
      holidaySurcharge: 600,
      nightSurcharge: 1800,
      baseDistance: 20,
      basePrice: 6000,
      overDistancePrice: 120,
      holidaySurchargeUnder1k: 1000,
      holidaySurchargePer1k: 1000,
      modelSurcharge: 1500,
      offPeakDiscount: 0,
      safetySeatInfantPrice: 500,
      safetySeatInfantMax: 3,
      safetySeatChildPrice: 500,
      safetySeatChildMax: 3,
      safetySeatBoosterPrice: 200,
      safetySeatBoosterMax: 3,
      signboardPrice: 200,
      extraStopPrice: 600,
      remoteAreaPrice: 1000,
      crossDistrictPrice: 2000,
      status: true,
      lastModified: "2025/01/19",
      modifier: "陳明",
      image: "/placeholder-car.jpg"
    }
  ]);

  // Search States
  const [inputKeyword, setInputKeyword] = useState("");

  // Modal States
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
    baseDistance: 0,
    basePrice: 0,
    overDistancePrice: 0,
    holidaySurchargeUnder1k: 0,
    holidaySurchargePer1k: 0,
    modelSurcharge: 0,
    offPeakDiscount: 0,
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

  const handleSave = () => {
    if (editingVehicle) {
      // Update existing
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...formData, id: v.id, lastModified: new Date().toLocaleDateString(), modifier: "Admin" } : v));
    } else {
      // Add new
      const newId = Math.max(...vehicles.map(v => v.id)) + 1;
      setVehicles([...vehicles, { ...formData, id: newId, lastModified: new Date().toLocaleDateString(), modifier: "Admin" }]);
    }
    handleCloseModal();
  };

  const handleToggleStatus = (id: number) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, status: !v.status } : v));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">車輛管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理車隊車型、車輛數量與計費規則。</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm shadow-blue-200"
          >
            <Plus size={16} />
            新增車型
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          <Link
            href="/vehicles"
            className="pb-4 text-sm font-medium border-b-2 transition-colors border-blue-600 text-blue-600 flex items-center gap-2"
          >
            <Truck size={16} />
            車輛管理
          </Link>
          <Link
            href="/coupons"
            className="pb-4 text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-2"
          >
            <Ticket size={16} />
            優惠卷管理
          </Link>
        </nav>
      </div>

      {/* Search Bar - Standardized Layout */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">車輛類型</label>
            <div className="relative">
              <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-all overflow-hidden">
                <div className="flex-shrink-0 pl-3 pr-2 text-gray-400 flex items-center justify-center">
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
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">狀態</label>
            <div className="relative">
              <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-all overflow-hidden">
                <div className="flex-shrink-0 pl-3 pr-2 text-gray-400 flex items-center justify-center">
                  <AlertCircle size={18} />
                </div>
                <select
                  className="w-full h-full text-sm outline-none border-none bg-transparent appearance-none text-gray-700 placeholder-gray-400"
                  defaultValue=""
                >
                  <option value="" disabled>選擇狀態</option>
                  <option value="active">啟用中</option>
                  <option value="inactive">停用中</option>
                </select>
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

      {/* Table */}
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {editingVehicle ? <Edit className="text-blue-600" size={24} /> : <Plus className="text-blue-600" size={24} />}
                {editingVehicle ? "編輯車型" : "新增車型"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Vehicle Info */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Truck size={20} className="text-blue-600" />
                      基本資料
                    </h3>
                    <div className="space-y-4">
                      <InputField label="車型名稱" required value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="例如：舒適四人座" />
                      <InputField label="參考型號" required value={formData.model} onChange={(v) => setFormData({ ...formData, model: v })} placeholder="例如：Toyota Camry" />
                      <InputField label="公司擁有數量" type="number" required value={formData.quantity} onChange={(v) => setFormData({ ...formData, quantity: parseInt(v) || 0 })} suffix="輛" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Armchair size={20} className="text-blue-600" />
                      空間配置
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <InputField label="總座位" type="number" required value={formData.seats} onChange={(v) => setFormData({ ...formData, seats: parseInt(v) || 0 })} />
                      <InputField label="最大乘客" type="number" required value={formData.maxPassengers} onChange={(v) => setFormData({ ...formData, maxPassengers: parseInt(v) || 0 })} />
                      <InputField label="最大行李" type="number" required value={formData.maxLuggage} onChange={(v) => setFormData({ ...formData, maxLuggage: parseInt(v) || 0 })} />
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Camera size={20} className="text-blue-600" />
                      車型照片
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer group">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                        <ImageIcon size={32} className="text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">點擊上傳或拖曳照片至此</p>
                    </div>
                  </div>
                </div>

                {/* Column 2: Pricing Structure (Base & Surcharges) */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Ticket size={20} className="text-blue-600" />
                      計費設定
                    </h3>
                    <div className="space-y-4">
                      {/* Base Fares */}
                      <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 space-y-3">
                        <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                          <DollarSign size={16} />
                          基本費率
                        </h4>
                        <InputField label="派遣金額" type="number" required suffix="元" value={formData.dispatchPrice} onChange={(v) => setFormData({ ...formData, dispatchPrice: parseInt(v) || 0 })} />
                        <InputField label="基本費用 (起步價)" type="number" required suffix="元" value={formData.basePrice} onChange={(v) => setFormData({ ...formData, basePrice: parseInt(v) || 0 })} />
                      </div>

                      {/* Distance Rules */}
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <AlertCircle size={16} />
                          距離計費 (A點&gt;B點)
                        </h4>
                        <InputField label="基本距離限制" type="number" required suffix="公里內" value={formData.baseDistance} onChange={(v) => setFormData({ ...formData, baseDistance: parseInt(v) || 0 })} />
                        <InputField label="超過每公里加收" type="number" required suffix="元" value={formData.overDistancePrice} onChange={(v) => setFormData({ ...formData, overDistancePrice: parseInt(v) || 0 })} />
                      </div>

                      {/* Surcharges */}
                      <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100 space-y-3">
                        <h4 className="text-sm font-bold text-purple-800 flex items-center gap-2">
                          <DollarSign size={16} />
                          加價與優惠
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          <InputField label="車型加價" type="number" required suffix="元" value={formData.modelSurcharge} onChange={(v) => setFormData({ ...formData, modelSurcharge: parseInt(v) || 0 })} />
                          <InputField label="夜間加成" type="number" required suffix="元" value={formData.nightSurcharge} onChange={(v) => setFormData({ ...formData, nightSurcharge: parseInt(v) || 0 })} />
                          <InputField label="額外再加價 (假日)" type="number" required suffix="元" value={formData.holidaySurcharge} onChange={(v) => setFormData({ ...formData, holidaySurcharge: parseInt(v) || 0 })} />
                          <InputField label="離峰優惠 (扣除)" type="number" required suffix="元" value={formData.offPeakDiscount} onChange={(v) => setFormData({ ...formData, offPeakDiscount: parseInt(v) || 0 })} />
                        </div>
                        <div className="pt-2 border-t border-purple-200 mt-2">
                          <p className="text-xs font-medium text-purple-700 mb-2">假日加價規則細項</p>
                          <div className="grid grid-cols-2 gap-2">
                            <InputField label="千元以下" type="number" required suffix="元" value={formData.holidaySurchargeUnder1k} onChange={(v) => setFormData({ ...formData, holidaySurchargeUnder1k: parseInt(v) || 0 })} />
                            <InputField label="每千元" type="number" required suffix="元" value={formData.holidaySurchargePer1k} onChange={(v) => setFormData({ ...formData, holidaySurchargePer1k: parseInt(v) || 0 })} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Extra Services */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <DollarSign size={20} className="text-blue-600" />
                      額外服務設定
                    </h3>
                    <div className="space-y-4">
                      {/* Safety Seats */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-2">安全座椅設定</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <h5 className="text-xs font-bold text-gray-600 mb-2">嬰兒座椅 (0-1歲)</h5>
                            <div className="grid grid-cols-2 gap-2">
                              <InputField label="加價" type="number" required suffix="元" value={formData.safetySeatInfantPrice} onChange={(v) => setFormData({ ...formData, safetySeatInfantPrice: parseInt(v) || 0 })} />
                              <InputField label="最大數量" type="number" required suffix="個" value={formData.safetySeatInfantMax} onChange={(v) => setFormData({ ...formData, safetySeatInfantMax: parseInt(v) || 0 })} />
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <h5 className="text-xs font-bold text-gray-600 mb-2">幼童座椅 (1-4歲)</h5>
                            <div className="grid grid-cols-2 gap-2">
                              <InputField label="加價" type="number" required suffix="元" value={formData.safetySeatChildPrice} onChange={(v) => setFormData({ ...formData, safetySeatChildPrice: parseInt(v) || 0 })} />
                              <InputField label="最大數量" type="number" required suffix="個" value={formData.safetySeatChildMax} onChange={(v) => setFormData({ ...formData, safetySeatChildMax: parseInt(v) || 0 })} />
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <h5 className="text-xs font-bold text-gray-600 mb-2">學童座椅 (4-7歲)</h5>
                            <div className="grid grid-cols-2 gap-2">
                              <InputField label="加價" type="number" required suffix="元" value={formData.safetySeatBoosterPrice} onChange={(v) => setFormData({ ...formData, safetySeatBoosterPrice: parseInt(v) || 0 })} />
                              <InputField label="最大數量" type="number" required suffix="個" value={formData.safetySeatBoosterMax} onChange={(v) => setFormData({ ...formData, safetySeatBoosterMax: parseInt(v) || 0 })} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Other Services */}
                      <div className="space-y-3 pt-2">
                        <h4 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-2">其他服務加價</h4>
                        <div className="grid grid-cols-1 gap-3">
                          <InputField label="舉牌服務" type="number" required suffix="元" value={formData.signboardPrice} onChange={(v) => setFormData({ ...formData, signboardPrice: parseInt(v) || 0 })} />
                          <InputField label="加點服務" type="number" required suffix="元" value={formData.extraStopPrice} onChange={(v) => setFormData({ ...formData, extraStopPrice: parseInt(v) || 0 })} />
                          <InputField label="特定地區" type="number" required suffix="元" value={formData.remoteAreaPrice} onChange={(v) => setFormData({ ...formData, remoteAreaPrice: parseInt(v) || 0 })} />
                          <InputField label="跨區服務" type="number" required suffix="元" value={formData.crossDistrictPrice} onChange={(v) => setFormData({ ...formData, crossDistrictPrice: parseInt(v) || 0 })} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3">
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
        </div >
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
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
