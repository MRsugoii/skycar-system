"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Truck, Ticket, Search, Plus, Edit, Trash2, X, Save, Camera, Image as ImageIcon, MoreHorizontal, AlertCircle, Download, Calendar, FileText, DollarSign, Armchair, Users, Briefcase, Car, Plane, MapPin, Route, ChevronRight, ChevronDown } from "lucide-react";

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

// Define Holiday Type
interface HolidayType {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  type: string;
  value: number;
  status: boolean;
}

// Define Airport Price Matrix Type
interface AirportMatrixType {
  id: number;
  airport: string; // Start point (Green dot)
  region: string; // End point (Red dot)
  prices: Record<number, number>; // vehicleTypeId -> price
  remoteSurcharge: number;
  status: boolean;
}

function VehiclesContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'vehicle'; // Default to vehicle management

  // --- 1. Vehicle Management Data & State ---
  const [vehicles, setVehicles] = useState<VehicleType[]>([
    {
      id: 1,
      name: "舒適四人座",
      model: "Toyota Camry / Altis",
      quantity: 15,
      seats: 5,
      maxPassengers: 4,
      maxLuggage: 2,
      dispatchPrice: 1200,
      holidaySurcharge: 200,
      nightSurcharge: 100,
      baseDistance: 20,
      basePrice: 1200,
      overDistancePrice: 40,
      holidaySurchargeUnder1k: 200,
      holidaySurchargePer1k: 200,
      modelSurcharge: 0,
      offPeakDiscount: 0,
      safetySeatInfantPrice: 200,
      safetySeatInfantMax: 2,
      safetySeatChildPrice: 200,
      safetySeatChildMax: 2,
      safetySeatBoosterPrice: 100,
      safetySeatBoosterMax: 2,
      signboardPrice: 100,
      extraStopPrice: 200,
      remoteAreaPrice: 300,
      crossDistrictPrice: 500,
      status: true,
      lastModified: "2025/08/29",
      modifier: "陳明",
      image: "/placeholder-car.jpg"
    },
    {
      id: 2,
      name: "五人座休旅",
      model: "Toyota RAV4 / CRV",
      quantity: 10,
      seats: 5,
      maxPassengers: 4,
      maxLuggage: 3,
      dispatchPrice: 1400,
      holidaySurcharge: 250,
      nightSurcharge: 150,
      baseDistance: 20,
      basePrice: 1400,
      overDistancePrice: 45,
      holidaySurchargeUnder1k: 250,
      holidaySurchargePer1k: 250,
      modelSurcharge: 200,
      offPeakDiscount: 0,
      safetySeatInfantPrice: 200,
      safetySeatInfantMax: 2,
      safetySeatChildPrice: 200,
      safetySeatChildMax: 2,
      safetySeatBoosterPrice: 100,
      safetySeatBoosterMax: 2,
      signboardPrice: 100,
      extraStopPrice: 250,
      remoteAreaPrice: 350,
      crossDistrictPrice: 600,
      status: true,
      lastModified: "2025/08/29",
      modifier: "陳明",
    },
    {
      id: 3,
      name: "進口四人座",
      model: "Tesla Model 3 / BMW 3",
      quantity: 8,
      seats: 5,
      maxPassengers: 4,
      maxLuggage: 2,
      dispatchPrice: 1600,
      holidaySurcharge: 300,
      nightSurcharge: 200,
      baseDistance: 20,
      basePrice: 1600,
      overDistancePrice: 50,
      holidaySurchargeUnder1k: 300,
      holidaySurchargePer1k: 300,
      modelSurcharge: 400,
      offPeakDiscount: 0,
      safetySeatInfantPrice: 200,
      safetySeatInfantMax: 2,
      safetySeatChildPrice: 200,
      safetySeatChildMax: 2,
      safetySeatBoosterPrice: 100,
      safetySeatBoosterMax: 2,
      signboardPrice: 100,
      extraStopPrice: 300,
      remoteAreaPrice: 400,
      crossDistrictPrice: 800,
      status: true,
      lastModified: "2025/07/15",
      modifier: "陳明",
    },
    {
      id: 4,
      name: "商務九人座",
      model: "Hyundai Staria / Ford Tourneo",
      quantity: 6,
      seats: 9,
      maxPassengers: 8,
      maxLuggage: 8,
      dispatchPrice: 2000,
      holidaySurcharge: 400,
      nightSurcharge: 300,
      baseDistance: 20,
      basePrice: 2000,
      overDistancePrice: 60,
      holidaySurchargeUnder1k: 400,
      holidaySurchargePer1k: 400,
      modelSurcharge: 600,
      offPeakDiscount: 0,
      safetySeatInfantPrice: 200,
      safetySeatInfantMax: 2,
      safetySeatChildPrice: 200,
      safetySeatChildMax: 2,
      safetySeatBoosterPrice: 100,
      safetySeatBoosterMax: 2,
      signboardPrice: 100,
      extraStopPrice: 400,
      remoteAreaPrice: 500,
      crossDistrictPrice: 1000,
      status: true,
      lastModified: "2025/06/10",
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
      dispatchPrice: 2500,
      holidaySurcharge: 500,
      nightSurcharge: 400,
      baseDistance: 20,
      basePrice: 2500,
      overDistancePrice: 70,
      holidaySurchargeUnder1k: 500,
      holidaySurchargePer1k: 500,
      modelSurcharge: 1000,
      offPeakDiscount: 0,
      safetySeatInfantPrice: 200,
      safetySeatInfantMax: 3,
      safetySeatChildPrice: 200,
      safetySeatChildMax: 3,
      safetySeatBoosterPrice: 100,
      safetySeatBoosterMax: 3,
      signboardPrice: 200,
      extraStopPrice: 500,
      remoteAreaPrice: 600,
      crossDistrictPrice: 1200,
      status: true,
      lastModified: "2025/03/01",
      modifier: "陳明",
    },
    {
      id: 6,
      name: "賓士 V250d",
      model: "Mercedes-Benz V250d",
      quantity: 4,
      seats: 8,
      maxPassengers: 7,
      maxLuggage: 6,
      dispatchPrice: 3000,
      holidaySurcharge: 600,
      nightSurcharge: 500,
      baseDistance: 20,
      basePrice: 3000,
      overDistancePrice: 80,
      holidaySurchargeUnder1k: 600,
      holidaySurchargePer1k: 600,
      modelSurcharge: 1200,
      offPeakDiscount: 0,
      safetySeatInfantPrice: 200,
      safetySeatInfantMax: 2,
      safetySeatChildPrice: 200,
      safetySeatChildMax: 2,
      safetySeatBoosterPrice: 100,
      safetySeatBoosterMax: 2,
      signboardPrice: 200,
      extraStopPrice: 600,
      remoteAreaPrice: 700,
      crossDistrictPrice: 1500,
      status: true,
      lastModified: "2025/02/20",
      modifier: "陳明",
    },
    {
      id: 7,
      name: "賓士航空椅",
      model: "Mercedes-Benz V-Class Luxury",
      quantity: 2,
      seats: 7,
      maxPassengers: 6,
      maxLuggage: 4,
      dispatchPrice: 4000,
      holidaySurcharge: 800,
      nightSurcharge: 600,
      baseDistance: 20,
      basePrice: 4000,
      overDistancePrice: 100,
      holidaySurchargeUnder1k: 800,
      holidaySurchargePer1k: 800,
      modelSurcharge: 2000,
      offPeakDiscount: 0,
      safetySeatInfantPrice: 200,
      safetySeatInfantMax: 2,
      safetySeatChildPrice: 200,
      safetySeatChildMax: 2,
      safetySeatBoosterPrice: 100,
      safetySeatBoosterMax: 2,
      signboardPrice: 200,
      extraStopPrice: 800,
      remoteAreaPrice: 900,
      crossDistrictPrice: 1800,
      status: true,
      lastModified: "2025/02/25",
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
      dispatchPrice: 5000,
      holidaySurcharge: 1000,
      nightSurcharge: 800,
      baseDistance: 20,
      basePrice: 5000,
      overDistancePrice: 120,
      holidaySurchargeUnder1k: 1000,
      holidaySurchargePer1k: 1000,
      modelSurcharge: 2500,
      offPeakDiscount: 0,
      safetySeatInfantPrice: 200,
      safetySeatInfantMax: 3,
      safetySeatChildPrice: 200,
      safetySeatChildMax: 3,
      safetySeatBoosterPrice: 100,
      safetySeatBoosterMax: 3,
      signboardPrice: 200,
      extraStopPrice: 1000,
      remoteAreaPrice: 1000,
      crossDistrictPrice: 2000,
      status: true,
      lastModified: "2025/01/19",
      modifier: "陳明",
      image: "/placeholder-car.jpg"
    }
  ]);

  // --- 2. Holiday Settings Data ---
  const [holidays, setHolidays] = useState([
    { id: 1, name: "春節連假", startDate: "2025-01-25", endDate: "2025-02-02", type: "加價", value: 500, status: true },
    { id: 2, name: "清明連假", startDate: "2025-04-03", endDate: "2025-04-06", type: "加價", value: 300, status: true },
    { id: 3, name: "端午連假", startDate: "2025-06-20", endDate: "2025-06-22", type: "加價", value: 300, status: false },
  ]);

  // --- 3. Airport/Port Settings Data ---
  const [airportPrices, setAirportPrices] = useState<AirportMatrixType[]>([
    { id: 1, airport: "桃園國際機場", region: "基隆市仁愛區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 2, airport: "桃園國際機場", region: "基隆市信義區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 3, airport: "桃園國際機場", region: "基隆市中正區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 4, airport: "桃園國際機場", region: "基隆市中山區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 200, status: true },
    { id: 5, airport: "桃園國際機場", region: "基隆市安樂區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 6, airport: "桃園國際機場", region: "基隆市暖暖區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 7, airport: "桃園國際機場", region: "基隆市七堵區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 8, airport: "桃園國際機場", region: "台北市中正區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 9, airport: "桃園國際機場", region: "台北市大同區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 10, airport: "桃園國際機場", region: "台北市中山區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 200, status: true },
    { id: 11, airport: "桃園國際機場", region: "台北市松山區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 200, status: true },
    { id: 12, airport: "桃園國際機場", region: "台北市大安區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 13, airport: "桃園國際機場", region: "台北市萬華區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 14, airport: "桃園國際機場", region: "台北市信義區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 15, airport: "桃園國際機場", region: "台北市士林區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 16, airport: "桃園國際機場", region: "台北市北投區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 17, airport: "桃園國際機場", region: "台北市內湖區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 18, airport: "桃園國際機場", region: "台北市南港區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 19, airport: "桃園國際機場", region: "台北市文山區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 200, status: true },
    { id: 20, airport: "桃園國際機場", region: "新北市萬里區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 21, airport: "桃園國際機場", region: "新北市金山區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 200, status: true },
    { id: 22, airport: "桃園國際機場", region: "新北市板橋區", prices: { 1: 900, 3: 1300, 5: 1400, 8: 1800 }, remoteSurcharge: 0, status: true },
    { id: 23, airport: "桃園國際機場", region: "新北市汐止區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 24, airport: "桃園國際機場", region: "新北市深坑區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 25, airport: "桃園國際機場", region: "新北市石碇區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 26, airport: "桃園國際機場", region: "新北市瑞芳區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 27, airport: "桃園國際機場", region: "新北市平溪區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 28, airport: "桃園國際機場", region: "新北市雙溪區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 29, airport: "桃園國際機場", region: "新北市貢寮區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 30, airport: "桃園國際機場", region: "新北市新店區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 31, airport: "桃園國際機場", region: "新北市坪林區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 32, airport: "桃園國際機場", region: "新北市烏來區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 33, airport: "桃園國際機場", region: "新北市永和區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 34, airport: "桃園國際機場", region: "新北市中和區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 35, airport: "桃園國際機場", region: "新北市土城區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 36, airport: "桃園國際機場", region: "新北市三峽區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 37, airport: "桃園國際機場", region: "新北市樹林區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 38, airport: "桃園國際機場", region: "新北市鶯歌區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 39, airport: "桃園國際機場", region: "新北市三重區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 40, airport: "桃園國際機場", region: "新北市新莊區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 41, airport: "桃園國際機場", region: "新北市泰山區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 200, status: true },
    { id: 42, airport: "桃園國際機場", region: "新北市林口區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 43, airport: "桃園國際機場", region: "新北市蘆洲區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 44, airport: "桃園國際機場", region: "新北市五股區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 45, airport: "桃園國際機場", region: "新北市八里區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 46, airport: "桃園國際機場", region: "新北市淡水區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 47, airport: "桃園國際機場", region: "新北市三芝區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 48, airport: "桃園國際機場", region: "新北市石門區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 49, airport: "桃園國際機場", region: "宜蘭縣宜蘭市", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 50, airport: "桃園國際機場", region: "宜蘭縣頭城鎮", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 51, airport: "桃園國際機場", region: "宜蘭縣礁溪鄉", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 100, status: true },
    { id: 52, airport: "桃園國際機場", region: "宜蘭縣壯圍鄉", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 100, status: true },
    { id: 53, airport: "桃園國際機場", region: "宜蘭縣員山鄉", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 100, status: true },
    { id: 54, airport: "桃園國際機場", region: "宜蘭縣羅東鎮", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 55, airport: "桃園國際機場", region: "宜蘭縣三星鄉", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 100, status: true },
    { id: 56, airport: "桃園國際機場", region: "宜蘭縣大同鄉", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 100, status: true },
    { id: 57, airport: "桃園國際機場", region: "宜蘭縣五結鄉", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 100, status: true },
    { id: 58, airport: "桃園國際機場", region: "宜蘭縣冬山鄉", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 100, status: true },
    { id: 59, airport: "桃園國際機場", region: "宜蘭縣蘇澳鎮", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 60, airport: "桃園國際機場", region: "宜蘭縣南澳鄉", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 100, status: true },
    { id: 61, airport: "桃園國際機場", region: "宜蘭縣釣魚台列嶼", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 62, airport: "桃園國際機場", region: "新竹市東區", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 0, status: true },
    { id: 63, airport: "桃園國際機場", region: "新竹市北區", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 0, status: true },
    { id: 64, airport: "桃園國際機場", region: "新竹市香山區", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 200, status: true },
    { id: 65, airport: "桃園國際機場", region: "新竹縣竹北市", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 0, status: true },
    { id: 66, airport: "桃園國際機場", region: "新竹縣湖口鄉", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 100, status: true },
    { id: 67, airport: "桃園國際機場", region: "新竹縣新豐鄉", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 100, status: true },
    { id: 68, airport: "桃園國際機場", region: "新竹縣新埔鎮", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 0, status: true },
    { id: 69, airport: "桃園國際機場", region: "新竹縣關西鎮", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 0, status: true },
    { id: 70, airport: "桃園國際機場", region: "新竹縣芎林鄉", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 100, status: true },
    { id: 71, airport: "桃園國際機場", region: "新竹縣寶山鄉", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 100, status: true },
    { id: 72, airport: "桃園國際機場", region: "新竹縣竹東鎮", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 0, status: true },
    { id: 73, airport: "桃園國際機場", region: "新竹縣五峰鄉", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 100, status: true },
    { id: 74, airport: "桃園國際機場", region: "新竹縣橫山鄉", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 100, status: true },
    { id: 75, airport: "桃園國際機場", region: "新竹縣尖石鄉", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 100, status: true },
    { id: 76, airport: "桃園國際機場", region: "新竹縣北埔鄉", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 100, status: true },
    { id: 77, airport: "桃園國際機場", region: "新竹縣峨眉鄉", prices: { 1: 1500, 3: 1900, 5: 2000, 8: 3000 }, remoteSurcharge: 100, status: true },
    { id: 78, airport: "桃園國際機場", region: "桃園市中壢區", prices: { 1: 600, 3: 1000, 5: 1100, 8: 1200 }, remoteSurcharge: 0, status: true },
    { id: 79, airport: "桃園國際機場", region: "桃園市平鎮區", prices: { 1: 600, 3: 1000, 5: 1100, 8: 1200 }, remoteSurcharge: 0, status: true },
    { id: 80, airport: "桃園國際機場", region: "桃園市龍潭區", prices: { 1: 600, 3: 1000, 5: 1100, 8: 1200 }, remoteSurcharge: 0, status: true },
    { id: 81, airport: "桃園國際機場", region: "桃園市楊梅區", prices: { 1: 600, 3: 1000, 5: 1100, 8: 1200 }, remoteSurcharge: 0, status: true },
    { id: 82, airport: "桃園國際機場", region: "桃園市新屋區", prices: { 1: 600, 3: 1000, 5: 1100, 8: 1200 }, remoteSurcharge: 0, status: true },
    { id: 83, airport: "桃園國際機場", region: "桃園市觀音區", prices: { 1: 600, 3: 1000, 5: 1100, 8: 1200 }, remoteSurcharge: 0, status: true },
    { id: 84, airport: "桃園國際機場", region: "桃園市桃園區", prices: { 1: 600, 3: 1000, 5: 1100, 8: 1200 }, remoteSurcharge: 0, status: true },
    { id: 85, airport: "桃園國際機場", region: "桃園市龜山區", prices: { 1: 600, 3: 1000, 5: 1100, 8: 1200 }, remoteSurcharge: 200, status: true },
    { id: 86, airport: "桃園國際機場", region: "桃園市八德區", prices: { 1: 600, 3: 1000, 5: 1100, 8: 1200 }, remoteSurcharge: 0, status: true },
    { id: 87, airport: "桃園國際機場", region: "桃園市大溪區", prices: { 1: 600, 3: 1000, 5: 1100, 8: 1200 }, remoteSurcharge: 0, status: true },
    { id: 88, airport: "桃園國際機場", region: "桃園市復興區", prices: { 1: 600, 3: 1000, 5: 1100, 8: 1200 }, remoteSurcharge: 0, status: true },
    { id: 89, airport: "桃園國際機場", region: "桃園市大園區", prices: { 1: 600, 3: 1000, 5: 1100, 8: 1200 }, remoteSurcharge: 0, status: true },
    { id: 90, airport: "桃園國際機場", region: "桃園市蘆竹區", prices: { 1: 600, 3: 1000, 5: 1100, 8: 1200 }, remoteSurcharge: 0, status: true },
    { id: 91, airport: "桃園國際機場", region: "苗栗縣竹南鎮", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 0, status: true },
    { id: 92, airport: "桃園國際機場", region: "苗栗縣頭份市", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 0, status: true },
    { id: 93, airport: "桃園國際機場", region: "苗栗縣三灣鄉", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 100, status: true },
    { id: 94, airport: "桃園國際機場", region: "苗栗縣南庄鄉", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 100, status: true },
    { id: 95, airport: "桃園國際機場", region: "苗栗縣獅潭鄉", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 100, status: true },
    { id: 96, airport: "桃園國際機場", region: "苗栗縣後龍鎮", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 0, status: true },
    { id: 97, airport: "桃園國際機場", region: "苗栗縣通霄鎮", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 0, status: true },
    { id: 98, airport: "桃園國際機場", region: "苗栗縣苑裡鎮", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 0, status: true },
    { id: 99, airport: "桃園國際機場", region: "苗栗縣苗栗市", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 0, status: true },
    { id: 100, airport: "桃園國際機場", region: "苗栗縣造橋鄉", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 100, status: true },
    { id: 101, airport: "桃園國際機場", region: "苗栗縣頭屋鄉", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 100, status: true },
    { id: 102, airport: "桃園國際機場", region: "苗栗縣公館鄉", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 100, status: true },
    { id: 103, airport: "桃園國際機場", region: "苗栗縣大湖鄉", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 100, status: true },
    { id: 104, airport: "桃園國際機場", region: "苗栗縣泰安鄉", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 100, status: true },
    { id: 105, airport: "桃園國際機場", region: "苗栗縣銅鑼鄉", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 100, status: true },
    { id: 106, airport: "桃園國際機場", region: "苗栗縣三義鄉", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 100, status: true },
    { id: 107, airport: "桃園國際機場", region: "苗栗縣西湖鄉", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 100, status: true },
    { id: 108, airport: "桃園國際機場", region: "苗栗縣卓蘭鎮", prices: { 1: 2000, 3: 2400, 5: 2500, 8: 4000 }, remoteSurcharge: 0, status: true },
    { id: 109, airport: "桃園國際機場", region: "台中市中區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 110, airport: "桃園國際機場", region: "台中市東區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 111, airport: "桃園國際機場", region: "台中市南區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 112, airport: "桃園國際機場", region: "台中市西區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 113, airport: "桃園國際機場", region: "台中市北區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 114, airport: "桃園國際機場", region: "台中市北屯區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 115, airport: "桃園國際機場", region: "台中市西屯區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 116, airport: "桃園國際機場", region: "台中市南屯區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 117, airport: "桃園國際機場", region: "台中市太平區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 118, airport: "桃園國際機場", region: "台中市大里區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 119, airport: "桃園國際機場", region: "台中市霧峰區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 120, airport: "桃園國際機場", region: "台中市烏日區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 121, airport: "桃園國際機場", region: "台中市豐原區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 122, airport: "桃園國際機場", region: "台中市后里區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 123, airport: "桃園國際機場", region: "台中市石岡區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 124, airport: "桃園國際機場", region: "台中市和平區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 125, airport: "桃園國際機場", region: "台中市新社區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 126, airport: "桃園國際機場", region: "台中市潭子區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 127, airport: "桃園國際機場", region: "台中市大雅區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 128, airport: "桃園國際機場", region: "台中市神岡區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 129, airport: "桃園國際機場", region: "台中市大肚區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 130, airport: "桃園國際機場", region: "台中市沙鹿區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 131, airport: "桃園國際機場", region: "台中市龍井區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 132, airport: "桃園國際機場", region: "台中市梧棲區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 133, airport: "桃園國際機場", region: "台中市清水區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 134, airport: "桃園國際機場", region: "台中市大甲區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 135, airport: "桃園國際機場", region: "台中市外埔區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 136, airport: "桃園國際機場", region: "台中市大安區", prices: { 1: 2500, 3: 2900, 5: 3000, 8: 5000 }, remoteSurcharge: 0, status: true },
    { id: 137, airport: "桃園國際機場", region: "彰化縣彰化市", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 0, status: true },
    { id: 138, airport: "桃園國際機場", region: "彰化縣芬園鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 139, airport: "桃園國際機場", region: "彰化縣花壇鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 140, airport: "桃園國際機場", region: "彰化縣秀水鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 141, airport: "桃園國際機場", region: "彰化縣鹿港鎮", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 0, status: true },
    { id: 142, airport: "桃園國際機場", region: "彰化縣福興鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 143, airport: "桃園國際機場", region: "彰化縣線西鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 144, airport: "桃園國際機場", region: "彰化縣和美鎮", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 0, status: true },
    { id: 145, airport: "桃園國際機場", region: "彰化縣伸港鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 146, airport: "桃園國際機場", region: "彰化縣員林市", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 0, status: true },
    { id: 147, airport: "桃園國際機場", region: "彰化縣社頭鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 148, airport: "桃園國際機場", region: "彰化縣永靖鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 149, airport: "桃園國際機場", region: "彰化縣埔心鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 150, airport: "桃園國際機場", region: "彰化縣溪湖鎮", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 0, status: true },
    { id: 151, airport: "桃園國際機場", region: "彰化縣大村鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 152, airport: "桃園國際機場", region: "彰化縣埔鹽鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 153, airport: "桃園國際機場", region: "彰化縣田中鎮", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 0, status: true },
    { id: 154, airport: "桃園國際機場", region: "彰化縣北斗鎮", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 0, status: true },
    { id: 155, airport: "桃園國際機場", region: "彰化縣田尾鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 156, airport: "桃園國際機場", region: "彰化縣埤頭鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 157, airport: "桃園國際機場", region: "彰化縣溪州鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 158, airport: "桃園國際機場", region: "彰化縣竹塘鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 159, airport: "桃園國際機場", region: "彰化縣二林鎮", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 0, status: true },
    { id: 160, airport: "桃園國際機場", region: "彰化縣大城鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 161, airport: "桃園國際機場", region: "彰化縣芳苑鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 162, airport: "桃園國際機場", region: "彰化縣二水鄉", prices: { 1: 3000, 3: 3400, 5: 3500, 8: 6000 }, remoteSurcharge: 100, status: true },
    { id: 163, airport: "桃園國際機場", region: "南投縣南投市", prices: { 1: 3500, 3: 3900, 5: 4000, 8: 7000 }, remoteSurcharge: 0, status: true },
    { id: 164, airport: "桃園國際機場", region: "南投縣中寮鄉", prices: { 1: 3500, 3: 3900, 5: 4000, 8: 7000 }, remoteSurcharge: 100, status: true },
    { id: 165, airport: "桃園國際機場", region: "南投縣草屯鎮", prices: { 1: 3500, 3: 3900, 5: 4000, 8: 7000 }, remoteSurcharge: 0, status: true },
    { id: 166, airport: "桃園國際機場", region: "南投縣國姓鄉", prices: { 1: 3500, 3: 3900, 5: 4000, 8: 7000 }, remoteSurcharge: 100, status: true },
    { id: 167, airport: "桃園國際機場", region: "南投縣埔里鎮", prices: { 1: 3500, 3: 3900, 5: 4000, 8: 7000 }, remoteSurcharge: 0, status: true },
    { id: 168, airport: "桃園國際機場", region: "南投縣仁愛鄉", prices: { 1: 3500, 3: 3900, 5: 4000, 8: 7000 }, remoteSurcharge: 100, status: true },
    { id: 169, airport: "桃園國際機場", region: "南投縣名間鄉", prices: { 1: 3500, 3: 3900, 5: 4000, 8: 7000 }, remoteSurcharge: 100, status: true },
    { id: 170, airport: "桃園國際機場", region: "南投縣集集鎮", prices: { 1: 3500, 3: 3900, 5: 4000, 8: 7000 }, remoteSurcharge: 0, status: true },
    { id: 171, airport: "桃園國際機場", region: "南投縣水里鄉", prices: { 1: 3500, 3: 3900, 5: 4000, 8: 7000 }, remoteSurcharge: 100, status: true },
    { id: 172, airport: "桃園國際機場", region: "南投縣魚池鄉", prices: { 1: 3500, 3: 3900, 5: 4000, 8: 7000 }, remoteSurcharge: 100, status: true },
    { id: 173, airport: "桃園國際機場", region: "南投縣信義鄉", prices: { 1: 3500, 3: 3900, 5: 4000, 8: 7000 }, remoteSurcharge: 100, status: true },
    { id: 174, airport: "桃園國際機場", region: "南投縣竹山鎮", prices: { 1: 3500, 3: 3900, 5: 4000, 8: 7000 }, remoteSurcharge: 200, status: true },
    { id: 175, airport: "桃園國際機場", region: "南投縣鹿谷鄉", prices: { 1: 3500, 3: 3900, 5: 4000, 8: 7000 }, remoteSurcharge: 100, status: true },
    { id: 176, airport: "桃園國際機場", region: "嘉義市東區", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 0, status: true },
    { id: 177, airport: "桃園國際機場", region: "嘉義市西區", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 0, status: true },
    { id: 178, airport: "桃園國際機場", region: "嘉義縣番路鄉", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 100, status: true },
    { id: 179, airport: "桃園國際機場", region: "嘉義縣梅山鄉", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 100, status: true },
    { id: 180, airport: "桃園國際機場", region: "嘉義縣竹崎鄉", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 100, status: true },
    { id: 181, airport: "桃園國際機場", region: "嘉義縣阿里山", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 200, status: true },
    { id: 182, airport: "桃園國際機場", region: "嘉義縣中埔鄉", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 100, status: true },
    { id: 183, airport: "桃園國際機場", region: "嘉義縣大埔鄉", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 100, status: true },
    { id: 184, airport: "桃園國際機場", region: "嘉義縣水上鄉", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 100, status: true },
    { id: 185, airport: "桃園國際機場", region: "嘉義縣鹿草鄉", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 100, status: true },
    { id: 186, airport: "桃園國際機場", region: "嘉義縣太保市", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 0, status: true },
    { id: 187, airport: "桃園國際機場", region: "嘉義縣朴子市", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 0, status: true },
    { id: 188, airport: "桃園國際機場", region: "嘉義縣東石鄉", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 100, status: true },
    { id: 189, airport: "桃園國際機場", region: "嘉義縣六腳鄉", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 100, status: true },
    { id: 190, airport: "桃園國際機場", region: "嘉義縣新港鄉", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 100, status: true },
    { id: 191, airport: "桃園國際機場", region: "嘉義縣民雄鄉", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 100, status: true },
    { id: 192, airport: "桃園國際機場", region: "嘉義縣大林鎮", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 0, status: true },
    { id: 193, airport: "桃園國際機場", region: "嘉義縣溪口鄉", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 100, status: true },
    { id: 194, airport: "桃園國際機場", region: "嘉義縣義竹鄉", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 100, status: true },
    { id: 195, airport: "桃園國際機場", region: "嘉義縣布袋鎮", prices: { 1: 4500, 3: 4900, 5: 5000, 8: 9000 }, remoteSurcharge: 0, status: true },
    { id: 196, airport: "桃園國際機場", region: "雲林縣斗南鎮", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 0, status: true },
    { id: 197, airport: "桃園國際機場", region: "雲林縣大埤鄉", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 100, status: true },
    { id: 198, airport: "桃園國際機場", region: "雲林縣虎尾鎮", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 0, status: true },
    { id: 199, airport: "桃園國際機場", region: "雲林縣土庫鎮", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 0, status: true },
    { id: 200, airport: "桃園國際機場", region: "雲林縣褒忠鄉", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 100, status: true },
    { id: 201, airport: "桃園國際機場", region: "雲林縣東勢鄉", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 100, status: true },
    { id: 202, airport: "桃園國際機場", region: "雲林縣台西鄉", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 100, status: true },
    { id: 203, airport: "桃園國際機場", region: "雲林縣崙背鄉", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 100, status: true },
    { id: 204, airport: "桃園國際機場", region: "雲林縣麥寮鄉", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 100, status: true },
    { id: 205, airport: "桃園國際機場", region: "雲林縣斗六市", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 0, status: true },
    { id: 206, airport: "桃園國際機場", region: "雲林縣林內鄉", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 100, status: true },
    { id: 207, airport: "桃園國際機場", region: "雲林縣古坑鄉", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 100, status: true },
    { id: 208, airport: "桃園國際機場", region: "雲林縣莿桐鄉", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 100, status: true },
    { id: 209, airport: "桃園國際機場", region: "雲林縣西螺鎮", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 0, status: true },
    { id: 210, airport: "桃園國際機場", region: "雲林縣二崙鄉", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 100, status: true },
    { id: 211, airport: "桃園國際機場", region: "雲林縣北港鎮", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 0, status: true },
    { id: 212, airport: "桃園國際機場", region: "雲林縣水林鄉", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 100, status: true },
    { id: 213, airport: "桃園國際機場", region: "雲林縣口湖鄉", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 100, status: true },
    { id: 214, airport: "桃園國際機場", region: "雲林縣四湖鄉", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 100, status: true },
    { id: 215, airport: "桃園國際機場", region: "雲林縣元長鄉", prices: { 1: 4000, 3: 4400, 5: 4500, 8: 8000 }, remoteSurcharge: 100, status: true },
    { id: 216, airport: "桃園國際機場", region: "台南市中西區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 217, airport: "桃園國際機場", region: "台南市東區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 218, airport: "桃園國際機場", region: "台南市南區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 219, airport: "桃園國際機場", region: "台南市北區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 220, airport: "桃園國際機場", region: "台南市安平區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 221, airport: "桃園國際機場", region: "台南市安南區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 222, airport: "桃園國際機場", region: "台南市永康區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 223, airport: "桃園國際機場", region: "台南市歸仁區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 224, airport: "桃園國際機場", region: "台南市新化區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 225, airport: "桃園國際機場", region: "台南市左鎮區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 226, airport: "桃園國際機場", region: "台南市玉井區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 227, airport: "桃園國際機場", region: "台南市楠西區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 228, airport: "桃園國際機場", region: "台南市南化區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 229, airport: "桃園國際機場", region: "台南市仁德區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 230, airport: "桃園國際機場", region: "台南市關廟區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 231, airport: "桃園國際機場", region: "台南市龍崎區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 232, airport: "桃園國際機場", region: "台南市官田區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 233, airport: "桃園國際機場", region: "台南市麻豆區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 234, airport: "桃園國際機場", region: "台南市佳里區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 235, airport: "桃園國際機場", region: "台南市西港區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 236, airport: "桃園國際機場", region: "台南市七股區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 237, airport: "桃園國際機場", region: "台南市將軍區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 238, airport: "桃園國際機場", region: "台南市學甲區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 239, airport: "桃園國際機場", region: "台南市北門區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 240, airport: "桃園國際機場", region: "台南市新營區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 241, airport: "桃園國際機場", region: "台南市後壁區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 242, airport: "桃園國際機場", region: "台南市白河區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 243, airport: "桃園國際機場", region: "台南市東山區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 200, status: true },
    { id: 244, airport: "桃園國際機場", region: "台南市六甲區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 245, airport: "桃園國際機場", region: "台南市下營區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 246, airport: "桃園國際機場", region: "台南市柳營區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 247, airport: "桃園國際機場", region: "台南市鹽水區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 248, airport: "桃園國際機場", region: "台南市善化區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 249, airport: "桃園國際機場", region: "台南市大內區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 250, airport: "桃園國際機場", region: "台南市山上區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 200, status: true },
    { id: 251, airport: "桃園國際機場", region: "台南市新市區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 252, airport: "桃園國際機場", region: "台南市安定區", prices: { 1: 5000, 3: 5400, 5: 5500, 8: 10000 }, remoteSurcharge: 0, status: true },
    { id: 253, airport: "桃園國際機場", region: "高雄市新興區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 254, airport: "桃園國際機場", region: "高雄市前金區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 255, airport: "桃園國際機場", region: "高雄市苓雅區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 256, airport: "桃園國際機場", region: "高雄市鹽埕區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 257, airport: "桃園國際機場", region: "高雄市鼓山區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 200, status: true },
    { id: 258, airport: "桃園國際機場", region: "高雄市旗津區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 259, airport: "桃園國際機場", region: "高雄市前鎮區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 260, airport: "桃園國際機場", region: "高雄市三民區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 261, airport: "桃園國際機場", region: "高雄市楠梓區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 262, airport: "桃園國際機場", region: "高雄市小港區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 263, airport: "桃園國際機場", region: "高雄市左營區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 264, airport: "桃園國際機場", region: "高雄市仁武區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 265, airport: "桃園國際機場", region: "高雄市大社區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 266, airport: "桃園國際機場", region: "高雄市東沙群島", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 267, airport: "桃園國際機場", region: "高雄市南沙群島", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 268, airport: "桃園國際機場", region: "高雄市岡山區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 200, status: true },
    { id: 269, airport: "桃園國際機場", region: "高雄市路竹區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 270, airport: "桃園國際機場", region: "高雄市阿蓮區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 271, airport: "桃園國際機場", region: "高雄市田寮區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 272, airport: "桃園國際機場", region: "高雄市燕巢區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 273, airport: "桃園國際機場", region: "高雄市橋頭區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 274, airport: "桃園國際機場", region: "高雄市梓官區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 275, airport: "桃園國際機場", region: "高雄市彌陀區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 276, airport: "桃園國際機場", region: "高雄市永安區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 277, airport: "桃園國際機場", region: "高雄市湖內區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 278, airport: "桃園國際機場", region: "高雄市鳳山區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 200, status: true },
    { id: 279, airport: "桃園國際機場", region: "高雄市大寮區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 280, airport: "桃園國際機場", region: "高雄市林園區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 281, airport: "桃園國際機場", region: "高雄市鳥松區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 282, airport: "桃園國際機場", region: "高雄市大樹區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 283, airport: "桃園國際機場", region: "高雄市旗山區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 200, status: true },
    { id: 284, airport: "桃園國際機場", region: "高雄市美濃區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 285, airport: "桃園國際機場", region: "高雄市六龜區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 286, airport: "桃園國際機場", region: "高雄市內門區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 287, airport: "桃園國際機場", region: "高雄市杉林區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 288, airport: "桃園國際機場", region: "高雄市甲仙區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 289, airport: "桃園國際機場", region: "高雄市桃源區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 290, airport: "桃園國際機場", region: "高雄市那瑪夏區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 291, airport: "桃園國際機場", region: "高雄市茂林區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 292, airport: "桃園國際機場", region: "高雄市茄萣區", prices: { 1: 6000, 3: 6400, 5: 6500, 8: 12000 }, remoteSurcharge: 0, status: true },
    { id: 293, airport: "桃園國際機場", region: "屏東縣屏東市", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 0, status: true },
    { id: 294, airport: "桃園國際機場", region: "屏東縣三地門鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 295, airport: "桃園國際機場", region: "屏東縣霧台鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 296, airport: "桃園國際機場", region: "屏東縣瑪家鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 297, airport: "桃園國際機場", region: "屏東縣九如鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 298, airport: "桃園國際機場", region: "屏東縣里港鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 299, airport: "桃園國際機場", region: "屏東縣高樹鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 300, airport: "桃園國際機場", region: "屏東縣鹽埔鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 301, airport: "桃園國際機場", region: "屏東縣長治鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 302, airport: "桃園國際機場", region: "屏東縣麟洛鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 303, airport: "桃園國際機場", region: "屏東縣竹田鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 304, airport: "桃園國際機場", region: "屏東縣內埔鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 305, airport: "桃園國際機場", region: "屏東縣萬丹鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 306, airport: "桃園國際機場", region: "屏東縣潮州鎮", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 0, status: true },
    { id: 307, airport: "桃園國際機場", region: "屏東縣泰武鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 308, airport: "桃園國際機場", region: "屏東縣來義鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 309, airport: "桃園國際機場", region: "屏東縣萬巒鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 310, airport: "桃園國際機場", region: "屏東縣崁頂鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 311, airport: "桃園國際機場", region: "屏東縣新埤鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 312, airport: "桃園國際機場", region: "屏東縣南州鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 313, airport: "桃園國際機場", region: "屏東縣林邊鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 314, airport: "桃園國際機場", region: "屏東縣東港鎮", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 0, status: true },
    { id: 315, airport: "桃園國際機場", region: "屏東縣琉球鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 316, airport: "桃園國際機場", region: "屏東縣佳冬鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 317, airport: "桃園國際機場", region: "屏東縣新園鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 318, airport: "桃園國際機場", region: "屏東縣枋寮鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 319, airport: "桃園國際機場", region: "屏東縣枋山鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 320, airport: "桃園國際機場", region: "屏東縣春日鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 321, airport: "桃園國際機場", region: "屏東縣獅子鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 322, airport: "桃園國際機場", region: "屏東縣車城鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 323, airport: "桃園國際機場", region: "屏東縣牡丹鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 324, airport: "桃園國際機場", region: "屏東縣恆春鎮", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 0, status: true },
    { id: 325, airport: "桃園國際機場", region: "屏東縣滿州鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 326, airport: "桃園國際機場", region: "台東縣台東市", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 0, status: true },
    { id: 327, airport: "桃園國際機場", region: "台東縣綠島鄉", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 100, status: true },
    { id: 328, airport: "桃園國際機場", region: "台東縣蘭嶼鄉", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 100, status: true },
    { id: 329, airport: "桃園國際機場", region: "台東縣延平鄉", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 100, status: true },
    { id: 330, airport: "桃園國際機場", region: "台東縣卑南鄉", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 100, status: true },
    { id: 331, airport: "桃園國際機場", region: "台東縣鹿野鄉", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 100, status: true },
    { id: 332, airport: "桃園國際機場", region: "台東縣關山鎮", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 200, status: true },
    { id: 333, airport: "桃園國際機場", region: "台東縣海端鄉", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 100, status: true },
    { id: 334, airport: "桃園國際機場", region: "台東縣池上鄉", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 100, status: true },
    { id: 335, airport: "桃園國際機場", region: "台東縣東河鄉", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 100, status: true },
    { id: 336, airport: "桃園國際機場", region: "台東縣成功鎮", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 0, status: true },
    { id: 337, airport: "桃園國際機場", region: "台東縣長濱鄉", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 100, status: true },
    { id: 338, airport: "桃園國際機場", region: "台東縣太麻里鄉", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 100, status: true },
    { id: 339, airport: "桃園國際機場", region: "台東縣金峰鄉", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 100, status: true },
    { id: 340, airport: "桃園國際機場", region: "台東縣大武鄉", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 100, status: true },
    { id: 341, airport: "桃園國際機場", region: "台東縣達仁鄉", prices: { 1: 8000, 3: 8400, 5: 8500, 8: 16000 }, remoteSurcharge: 100, status: true },
    { id: 342, airport: "桃園國際機場", region: "花蓮縣花蓮市", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 0, status: true },
    { id: 343, airport: "桃園國際機場", region: "花蓮縣新城鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 344, airport: "桃園國際機場", region: "花蓮縣秀林鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 345, airport: "桃園國際機場", region: "花蓮縣吉安鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 346, airport: "桃園國際機場", region: "花蓮縣壽豐鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 347, airport: "桃園國際機場", region: "花蓮縣鳳林鎮", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 0, status: true },
    { id: 348, airport: "桃園國際機場", region: "花蓮縣光復鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 349, airport: "桃園國際機場", region: "花蓮縣豐濱鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 350, airport: "桃園國際機場", region: "花蓮縣瑞穗鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 351, airport: "桃園國際機場", region: "花蓮縣萬榮鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 352, airport: "桃園國際機場", region: "花蓮縣玉里鎮", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 0, status: true },
    { id: 353, airport: "桃園國際機場", region: "花蓮縣卓溪鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 354, airport: "桃園國際機場", region: "花蓮縣富里鄉", prices: { 1: 7000, 3: 7400, 5: 7500, 8: 14000 }, remoteSurcharge: 100, status: true },
    { id: 355, airport: "桃園國際機場", region: "金門縣金沙鎮", prices: { 1: 10000, 3: 10400, 5: 10500, 8: 20000 }, remoteSurcharge: 0, status: true },
    { id: 356, airport: "桃園國際機場", region: "金門縣金湖鎮", prices: { 1: 10000, 3: 10400, 5: 10500, 8: 20000 }, remoteSurcharge: 0, status: true },
    { id: 357, airport: "桃園國際機場", region: "金門縣金寧鄉", prices: { 1: 10000, 3: 10400, 5: 10500, 8: 20000 }, remoteSurcharge: 100, status: true },
    { id: 358, airport: "桃園國際機場", region: "金門縣金城鎮", prices: { 1: 10000, 3: 10400, 5: 10500, 8: 20000 }, remoteSurcharge: 0, status: true },
    { id: 359, airport: "桃園國際機場", region: "金門縣烈嶼鄉", prices: { 1: 10000, 3: 10400, 5: 10500, 8: 20000 }, remoteSurcharge: 100, status: true },
    { id: 360, airport: "桃園國際機場", region: "金門縣烏坵鄉", prices: { 1: 10000, 3: 10400, 5: 10500, 8: 20000 }, remoteSurcharge: 100, status: true },
    { id: 361, airport: "桃園國際機場", region: "連江縣南竿鄉", prices: { 1: 10000, 3: 10400, 5: 10500, 8: 20000 }, remoteSurcharge: 100, status: true },
    { id: 362, airport: "桃園國際機場", region: "連江縣北竿鄉", prices: { 1: 10000, 3: 10400, 5: 10500, 8: 20000 }, remoteSurcharge: 100, status: true },
    { id: 363, airport: "桃園國際機場", region: "連江縣莒光鄉", prices: { 1: 10000, 3: 10400, 5: 10500, 8: 20000 }, remoteSurcharge: 100, status: true },
    { id: 364, airport: "桃園國際機場", region: "連江縣東引鄉", prices: { 1: 10000, 3: 10400, 5: 10500, 8: 20000 }, remoteSurcharge: 100, status: true },
    { id: 365, airport: "桃園國際機場", region: "澎湖縣馬公市", prices: { 1: 9000, 3: 9400, 5: 9500, 8: 18000 }, remoteSurcharge: 0, status: true },
    { id: 366, airport: "桃園國際機場", region: "澎湖縣西嶼鄉", prices: { 1: 9000, 3: 9400, 5: 9500, 8: 18000 }, remoteSurcharge: 100, status: true },
    { id: 367, airport: "桃園國際機場", region: "澎湖縣望安鄉", prices: { 1: 9000, 3: 9400, 5: 9500, 8: 18000 }, remoteSurcharge: 100, status: true },
    { id: 368, airport: "桃園國際機場", region: "澎湖縣七美鄉", prices: { 1: 9000, 3: 9400, 5: 9500, 8: 18000 }, remoteSurcharge: 100, status: true },
    { id: 369, airport: "桃園國際機場", region: "澎湖縣白沙鄉", prices: { 1: 9000, 3: 9400, 5: 9500, 8: 18000 }, remoteSurcharge: 100, status: true },
    { id: 370, airport: "桃園國際機場", region: "澎湖縣湖西鄉", prices: { 1: 9000, 3: 9400, 5: 9500, 8: 18000 }, remoteSurcharge: 100, status: true },
    { id: 371, airport: "臺北松山機場", region: "基隆市仁愛區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 372, airport: "臺北松山機場", region: "基隆市信義區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 373, airport: "臺北松山機場", region: "基隆市中正區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 374, airport: "臺北松山機場", region: "基隆市中山區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 200, status: true },
    { id: 375, airport: "臺北松山機場", region: "基隆市安樂區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 376, airport: "臺北松山機場", region: "基隆市暖暖區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 377, airport: "臺北松山機場", region: "基隆市七堵區", prices: { 1: 1000, 3: 1400, 5: 1500, 8: 2000 }, remoteSurcharge: 0, status: true },
    { id: 378, airport: "臺北松山機場", region: "台北市中正區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 379, airport: "臺北松山機場", region: "台北市大同區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 380, airport: "臺北松山機場", region: "台北市中山區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 200, status: true },
    { id: 381, airport: "臺北松山機場", region: "台北市松山區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 200, status: true },
    { id: 382, airport: "臺北松山機場", region: "台北市大安區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 383, airport: "臺北松山機場", region: "台北市萬華區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 384, airport: "臺北松山機場", region: "台北市信義區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 385, airport: "臺北松山機場", region: "台北市士林區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 386, airport: "臺北松山機場", region: "台北市北投區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 387, airport: "臺北松山機場", region: "台北市內湖區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 388, airport: "臺北松山機場", region: "台北市南港區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 389, airport: "臺北松山機場", region: "台北市文山區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 200, status: true },
    { id: 390, airport: "臺北松山機場", region: "新北市萬里區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 391, airport: "臺北松山機場", region: "新北市金山區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 200, status: true },
    { id: 392, airport: "臺北松山機場", region: "新北市板橋區", prices: { 1: 1100, 3: 1500, 5: 1600, 8: 2200 }, remoteSurcharge: 0, status: true },
    { id: 393, airport: "臺北松山機場", region: "新北市汐止區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 394, airport: "臺北松山機場", region: "新北市深坑區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 395, airport: "臺北松山機場", region: "新北市石碇區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 396, airport: "臺北松山機場", region: "新北市瑞芳區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 397, airport: "臺北松山機場", region: "新北市平溪區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 398, airport: "臺北松山機場", region: "新北市雙溪區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 399, airport: "臺北松山機場", region: "新北市貢寮區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 400, airport: "臺北松山機場", region: "新北市新店區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 401, airport: "臺北松山機場", region: "新北市坪林區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 402, airport: "臺北松山機場", region: "新北市烏來區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 403, airport: "臺北松山機場", region: "新北市永和區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 404, airport: "臺北松山機場", region: "新北市中和區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 405, airport: "臺北松山機場", region: "新北市土城區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 406, airport: "臺北松山機場", region: "新北市三峽區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 407, airport: "臺北松山機場", region: "新北市樹林區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 408, airport: "臺北松山機場", region: "新北市鶯歌區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 409, airport: "臺北松山機場", region: "新北市三重區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 410, airport: "臺北松山機場", region: "新北市新莊區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 411, airport: "臺北松山機場", region: "新北市泰山區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 200, status: true },
    { id: 412, airport: "臺北松山機場", region: "新北市林口區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 413, airport: "臺北松山機場", region: "新北市蘆洲區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 414, airport: "臺北松山機場", region: "新北市五股區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 415, airport: "臺北松山機場", region: "新北市八里區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 416, airport: "臺北松山機場", region: "新北市淡水區", prices: { 1: 1400, 3: 1800, 5: 1900, 8: 2800 }, remoteSurcharge: 0, status: true },
    { id: 417, airport: "臺北松山機場", region: "新北市三芝區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 418, airport: "臺北松山機場", region: "新北市石門區", prices: { 1: 1200, 3: 1600, 5: 1700, 8: 2400 }, remoteSurcharge: 0, status: true },
    { id: 419, airport: "臺北松山機場", region: "宜蘭縣宜蘭市", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 420, airport: "臺北松山機場", region: "宜蘭縣頭城鎮", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 421, airport: "臺北松山機場", region: "宜蘭縣礁溪鄉", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 100, status: true },
    { id: 422, airport: "臺北松山機場", region: "宜蘭縣壯圍鄉", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 100, status: true },
    { id: 423, airport: "臺北松山機場", region: "宜蘭縣員山鄉", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 100, status: true },
    { id: 424, airport: "臺北松山機場", region: "宜蘭縣羅東鎮", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 425, airport: "臺北松山機場", region: "宜蘭縣三星鄉", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 100, status: true },
    { id: 426, airport: "臺北松山機場", region: "宜蘭縣大同鄉", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 100, status: true },
    { id: 427, airport: "臺北松山機場", region: "宜蘭縣五結鄉", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 100, status: true },
    { id: 428, airport: "臺北松山機場", region: "宜蘭縣冬山鄉", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 100, status: true },
    { id: 429, airport: "臺北松山機場", region: "宜蘭縣蘇澳鎮", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 430, airport: "臺北松山機場", region: "宜蘭縣南澳鄉", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 100, status: true },
    { id: 431, airport: "臺北松山機場", region: "宜蘭縣釣魚台列嶼", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 432, airport: "臺北松山機場", region: "新竹市東區", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 0, status: true },
    { id: 433, airport: "臺北松山機場", region: "新竹市北區", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 0, status: true },
    { id: 434, airport: "臺北松山機場", region: "新竹市香山區", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 200, status: true },
    { id: 435, airport: "臺北松山機場", region: "新竹縣竹北市", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 0, status: true },
    { id: 436, airport: "臺北松山機場", region: "新竹縣湖口鄉", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 100, status: true },
    { id: 437, airport: "臺北松山機場", region: "新竹縣新豐鄉", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 100, status: true },
    { id: 438, airport: "臺北松山機場", region: "新竹縣新埔鎮", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 0, status: true },
    { id: 439, airport: "臺北松山機場", region: "新竹縣關西鎮", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 0, status: true },
    { id: 440, airport: "臺北松山機場", region: "新竹縣芎林鄉", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 100, status: true },
    { id: 441, airport: "臺北松山機場", region: "新竹縣寶山鄉", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 100, status: true },
    { id: 442, airport: "臺北松山機場", region: "新竹縣竹東鎮", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 0, status: true },
    { id: 443, airport: "臺北松山機場", region: "新竹縣五峰鄉", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 100, status: true },
    { id: 444, airport: "臺北松山機場", region: "新竹縣橫山鄉", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 100, status: true },
    { id: 445, airport: "臺北松山機場", region: "新竹縣尖石鄉", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 100, status: true },
    { id: 446, airport: "臺北松山機場", region: "新竹縣北埔鄉", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 100, status: true },
    { id: 447, airport: "臺北松山機場", region: "新竹縣峨眉鄉", prices: { 1: 1700, 3: 2100, 5: 2200, 8: 3400 }, remoteSurcharge: 100, status: true },
    { id: 448, airport: "臺北松山機場", region: "桃園市中壢區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 449, airport: "臺北松山機場", region: "桃園市平鎮區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 450, airport: "臺北松山機場", region: "桃園市龍潭區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 451, airport: "臺北松山機場", region: "桃園市楊梅區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 452, airport: "臺北松山機場", region: "桃園市新屋區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 453, airport: "臺北松山機場", region: "桃園市觀音區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 454, airport: "臺北松山機場", region: "桃園市桃園區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 455, airport: "臺北松山機場", region: "桃園市龜山區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 200, status: true },
    { id: 456, airport: "臺北松山機場", region: "桃園市八德區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 457, airport: "臺北松山機場", region: "桃園市大溪區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 458, airport: "臺北松山機場", region: "桃園市復興區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 459, airport: "臺北松山機場", region: "桃園市大園區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 460, airport: "臺北松山機場", region: "桃園市蘆竹區", prices: { 1: 800, 3: 1200, 5: 1300, 8: 1600 }, remoteSurcharge: 0, status: true },
    { id: 461, airport: "臺北松山機場", region: "苗栗縣竹南鎮", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 0, status: true },
    { id: 462, airport: "臺北松山機場", region: "苗栗縣頭份市", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 0, status: true },
    { id: 463, airport: "臺北松山機場", region: "苗栗縣三灣鄉", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 100, status: true },
    { id: 464, airport: "臺北松山機場", region: "苗栗縣南庄鄉", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 100, status: true },
    { id: 465, airport: "臺北松山機場", region: "苗栗縣獅潭鄉", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 100, status: true },
    { id: 466, airport: "臺北松山機場", region: "苗栗縣後龍鎮", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 0, status: true },
    { id: 467, airport: "臺北松山機場", region: "苗栗縣通霄鎮", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 0, status: true },
    { id: 468, airport: "臺北松山機場", region: "苗栗縣苑裡鎮", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 0, status: true },
    { id: 469, airport: "臺北松山機場", region: "苗栗縣苗栗市", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 0, status: true },
    { id: 470, airport: "臺北松山機場", region: "苗栗縣造橋鄉", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 100, status: true },
    { id: 471, airport: "臺北松山機場", region: "苗栗縣頭屋鄉", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 100, status: true },
    { id: 472, airport: "臺北松山機場", region: "苗栗縣公館鄉", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 100, status: true },
    { id: 473, airport: "臺北松山機場", region: "苗栗縣大湖鄉", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 100, status: true },
    { id: 474, airport: "臺北松山機場", region: "苗栗縣泰安鄉", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 100, status: true },
    { id: 475, airport: "臺北松山機場", region: "苗栗縣銅鑼鄉", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 100, status: true },
    { id: 476, airport: "臺北松山機場", region: "苗栗縣三義鄉", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 100, status: true },
    { id: 477, airport: "臺北松山機場", region: "苗栗縣西湖鄉", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 100, status: true },
    { id: 478, airport: "臺北松山機場", region: "苗栗縣卓蘭鎮", prices: { 1: 2200, 3: 2600, 5: 2700, 8: 4400 }, remoteSurcharge: 0, status: true },
    { id: 479, airport: "臺北松山機場", region: "台中市中區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 480, airport: "臺北松山機場", region: "台中市東區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 481, airport: "臺北松山機場", region: "台中市南區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 482, airport: "臺北松山機場", region: "台中市西區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 483, airport: "臺北松山機場", region: "台中市北區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 484, airport: "臺北松山機場", region: "台中市北屯區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 485, airport: "臺北松山機場", region: "台中市西屯區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 486, airport: "臺北松山機場", region: "台中市南屯區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 487, airport: "臺北松山機場", region: "台中市太平區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 488, airport: "臺北松山機場", region: "台中市大里區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 489, airport: "臺北松山機場", region: "台中市霧峰區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 490, airport: "臺北松山機場", region: "台中市烏日區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 491, airport: "臺北松山機場", region: "台中市豐原區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 492, airport: "臺北松山機場", region: "台中市后里區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 493, airport: "臺北松山機場", region: "台中市石岡區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 494, airport: "臺北松山機場", region: "台中市東勢區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 495, airport: "臺北松山機場", region: "台中市和平區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 496, airport: "臺北松山機場", region: "台中市新社區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 497, airport: "臺北松山機場", region: "台中市潭子區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 498, airport: "臺北松山機場", region: "台中市大雅區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 499, airport: "臺北松山機場", region: "台中市神岡區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 500, airport: "臺北松山機場", region: "台中市大肚區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 501, airport: "臺北松山機場", region: "台中市沙鹿區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 502, airport: "臺北松山機場", region: "台中市龍井區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 503, airport: "臺北松山機場", region: "台中市梧棲區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 504, airport: "臺北松山機場", region: "台中市清水區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 505, airport: "臺北松山機場", region: "台中市大甲區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 506, airport: "臺北松山機場", region: "台中市外埔區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 507, airport: "臺北松山機場", region: "台中市大安區", prices: { 1: 2700, 3: 3100, 5: 3200, 8: 5400 }, remoteSurcharge: 0, status: true },
    { id: 508, airport: "臺北松山機場", region: "彰化縣彰化市", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 0, status: true },
    { id: 509, airport: "臺北松山機場", region: "彰化縣芬園鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 510, airport: "臺北松山機場", region: "彰化縣花壇鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 511, airport: "臺北松山機場", region: "彰化縣秀水鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 512, airport: "臺北松山機場", region: "彰化縣鹿港鎮", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 0, status: true },
    { id: 513, airport: "臺北松山機場", region: "彰化縣福興鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 514, airport: "臺北松山機場", region: "彰化縣線西鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 515, airport: "臺北松山機場", region: "彰化縣和美鎮", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 0, status: true },
    { id: 516, airport: "臺北松山機場", region: "彰化縣伸港鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 517, airport: "臺北松山機場", region: "彰化縣員林市", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 0, status: true },
    { id: 518, airport: "臺北松山機場", region: "彰化縣社頭鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 519, airport: "臺北松山機場", region: "彰化縣永靖鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 520, airport: "臺北松山機場", region: "彰化縣埔心鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 521, airport: "臺北松山機場", region: "彰化縣溪湖鎮", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 0, status: true },
    { id: 522, airport: "臺北松山機場", region: "彰化縣大村鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 523, airport: "臺北松山機場", region: "彰化縣埔鹽鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 524, airport: "臺北松山機場", region: "彰化縣田中鎮", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 0, status: true },
    { id: 525, airport: "臺北松山機場", region: "彰化縣北斗鎮", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 0, status: true },
    { id: 526, airport: "臺北松山機場", region: "彰化縣田尾鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 527, airport: "臺北松山機場", region: "彰化縣埤頭鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 528, airport: "臺北松山機場", region: "彰化縣溪州鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 529, airport: "臺北松山機場", region: "彰化縣竹塘鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 530, airport: "臺北松山機場", region: "彰化縣二林鎮", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 0, status: true },
    { id: 531, airport: "臺北松山機場", region: "彰化縣大城鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 532, airport: "臺北松山機場", region: "彰化縣芳苑鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 533, airport: "臺北松山機場", region: "彰化縣二水鄉", prices: { 1: 3200, 3: 3600, 5: 3700, 8: 6400 }, remoteSurcharge: 100, status: true },
    { id: 534, airport: "臺北松山機場", region: "南投縣南投市", prices: { 1: 3700, 3: 4100, 5: 4200, 8: 7400 }, remoteSurcharge: 0, status: true },
    { id: 535, airport: "臺北松山機場", region: "南投縣中寮鄉", prices: { 1: 3700, 3: 4100, 5: 4200, 8: 7400 }, remoteSurcharge: 100, status: true },
    { id: 536, airport: "臺北松山機場", region: "南投縣草屯鎮", prices: { 1: 3700, 3: 4100, 5: 4200, 8: 7400 }, remoteSurcharge: 0, status: true },
    { id: 537, airport: "臺北松山機場", region: "南投縣國姓鄉", prices: { 1: 3700, 3: 4100, 5: 4200, 8: 7400 }, remoteSurcharge: 100, status: true },
    { id: 538, airport: "臺北松山機場", region: "南投縣埔里鎮", prices: { 1: 3700, 3: 4100, 5: 4200, 8: 7400 }, remoteSurcharge: 0, status: true },
    { id: 539, airport: "臺北松山機場", region: "南投縣仁愛鄉", prices: { 1: 3700, 3: 4100, 5: 4200, 8: 7400 }, remoteSurcharge: 100, status: true },
    { id: 540, airport: "臺北松山機場", region: "南投縣名間鄉", prices: { 1: 3700, 3: 4100, 5: 4200, 8: 7400 }, remoteSurcharge: 100, status: true },
    { id: 541, airport: "臺北松山機場", region: "南投縣集集鎮", prices: { 1: 3700, 3: 4100, 5: 4200, 8: 7400 }, remoteSurcharge: 0, status: true },
    { id: 542, airport: "臺北松山機場", region: "南投縣水里鄉", prices: { 1: 3700, 3: 4100, 5: 4200, 8: 7400 }, remoteSurcharge: 100, status: true },
    { id: 543, airport: "臺北松山機場", region: "南投縣魚池鄉", prices: { 1: 3700, 3: 4100, 5: 4200, 8: 7400 }, remoteSurcharge: 100, status: true },
    { id: 544, airport: "臺北松山機場", region: "南投縣信義鄉", prices: { 1: 3700, 3: 4100, 5: 4200, 8: 7400 }, remoteSurcharge: 100, status: true },
    { id: 545, airport: "臺北松山機場", region: "南投縣竹山鎮", prices: { 1: 3700, 3: 4100, 5: 4200, 8: 7400 }, remoteSurcharge: 200, status: true },
    { id: 546, airport: "臺北松山機場", region: "南投縣鹿谷鄉", prices: { 1: 3700, 3: 4100, 5: 4200, 8: 7400 }, remoteSurcharge: 100, status: true },
    { id: 547, airport: "臺北松山機場", region: "嘉義市東區", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 0, status: true },
    { id: 548, airport: "臺北松山機場", region: "嘉義市西區", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 0, status: true },
    { id: 549, airport: "臺北松山機場", region: "嘉義縣番路鄉", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 100, status: true },
    { id: 550, airport: "臺北松山機場", region: "嘉義縣梅山鄉", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 100, status: true },
    { id: 551, airport: "臺北松山機場", region: "嘉義縣竹崎鄉", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 100, status: true },
    { id: 552, airport: "臺北松山機場", region: "嘉義縣阿里山", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 200, status: true },
    { id: 553, airport: "臺北松山機場", region: "嘉義縣中埔鄉", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 100, status: true },
    { id: 554, airport: "臺北松山機場", region: "嘉義縣大埔鄉", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 100, status: true },
    { id: 555, airport: "臺北松山機場", region: "嘉義縣水上鄉", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 100, status: true },
    { id: 556, airport: "臺北松山機場", region: "嘉義縣鹿草鄉", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 100, status: true },
    { id: 557, airport: "臺北松山機場", region: "嘉義縣太保市", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 0, status: true },
    { id: 558, airport: "臺北松山機場", region: "嘉義縣朴子市", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 0, status: true },
    { id: 559, airport: "臺北松山機場", region: "嘉義縣東石鄉", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 100, status: true },
    { id: 560, airport: "臺北松山機場", region: "嘉義縣六腳鄉", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 100, status: true },
    { id: 561, airport: "臺北松山機場", region: "嘉義縣新港鄉", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 100, status: true },
    { id: 562, airport: "臺北松山機場", region: "嘉義縣民雄鄉", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 100, status: true },
    { id: 563, airport: "臺北松山機場", region: "嘉義縣大林鎮", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 0, status: true },
    { id: 564, airport: "臺北松山機場", region: "嘉義縣溪口鄉", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 100, status: true },
    { id: 565, airport: "臺北松山機場", region: "嘉義縣義竹鄉", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 100, status: true },
    { id: 566, airport: "臺北松山機場", region: "嘉義縣布袋鎮", prices: { 1: 4700, 3: 5100, 5: 5200, 8: 9400 }, remoteSurcharge: 0, status: true },
    { id: 567, airport: "臺北松山機場", region: "雲林縣斗南鎮", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 0, status: true },
    { id: 568, airport: "臺北松山機場", region: "雲林縣大埤鄉", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 100, status: true },
    { id: 569, airport: "臺北松山機場", region: "雲林縣虎尾鎮", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 0, status: true },
    { id: 570, airport: "臺北松山機場", region: "雲林縣土庫鎮", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 0, status: true },
    { id: 571, airport: "臺北松山機場", region: "雲林縣褒忠鄉", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 100, status: true },
    { id: 572, airport: "臺北松山機場", region: "雲林縣東勢鄉", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 100, status: true },
    { id: 573, airport: "臺北松山機場", region: "雲林縣台西鄉", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 100, status: true },
    { id: 574, airport: "臺北松山機場", region: "雲林縣崙背鄉", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 100, status: true },
    { id: 575, airport: "臺北松山機場", region: "雲林縣麥寮鄉", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 100, status: true },
    { id: 576, airport: "臺北松山機場", region: "雲林縣斗六市", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 0, status: true },
    { id: 577, airport: "臺北松山機場", region: "雲林縣林內鄉", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 100, status: true },
    { id: 578, airport: "臺北松山機場", region: "雲林縣古坑鄉", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 100, status: true },
    { id: 579, airport: "臺北松山機場", region: "雲林縣莿桐鄉", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 100, status: true },
    { id: 580, airport: "臺北松山機場", region: "雲林縣西螺鎮", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 0, status: true },
    { id: 581, airport: "臺北松山機場", region: "雲林縣二崙鄉", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 100, status: true },
    { id: 582, airport: "臺北松山機場", region: "雲林縣北港鎮", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 0, status: true },
    { id: 583, airport: "臺北松山機場", region: "雲林縣水林鄉", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 100, status: true },
    { id: 584, airport: "臺北松山機場", region: "雲林縣口湖鄉", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 100, status: true },
    { id: 585, airport: "臺北松山機場", region: "雲林縣四湖鄉", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 100, status: true },
    { id: 586, airport: "臺北松山機場", region: "雲林縣元長鄉", prices: { 1: 4200, 3: 4600, 5: 4700, 8: 8400 }, remoteSurcharge: 100, status: true },
    { id: 587, airport: "臺北松山機場", region: "台南市中西區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 588, airport: "臺北松山機場", region: "台南市東區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 589, airport: "臺北松山機場", region: "台南市南區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 590, airport: "臺北松山機場", region: "台南市北區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 591, airport: "臺北松山機場", region: "台南市安平區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 592, airport: "臺北松山機場", region: "台南市安南區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 593, airport: "臺北松山機場", region: "台南市永康區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 594, airport: "臺北松山機場", region: "台南市歸仁區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 595, airport: "臺北松山機場", region: "台南市新化區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 596, airport: "臺北松山機場", region: "台南市左鎮區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 597, airport: "臺北松山機場", region: "台南市玉井區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 598, airport: "臺北松山機場", region: "台南市楠西區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 599, airport: "臺北松山機場", region: "台南市南化區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 600, airport: "臺北松山機場", region: "台南市仁德區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 601, airport: "臺北松山機場", region: "台南市關廟區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 602, airport: "臺北松山機場", region: "台南市龍崎區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 603, airport: "臺北松山機場", region: "台南市官田區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 604, airport: "臺北松山機場", region: "台南市麻豆區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 605, airport: "臺北松山機場", region: "台南市佳里區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 606, airport: "臺北松山機場", region: "台南市西港區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 607, airport: "臺北松山機場", region: "台南市七股區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 608, airport: "臺北松山機場", region: "台南市將軍區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 609, airport: "臺北松山機場", region: "台南市學甲區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 610, airport: "臺北松山機場", region: "台南市北門區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 611, airport: "臺北松山機場", region: "台南市新營區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 612, airport: "臺北松山機場", region: "台南市後壁區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 613, airport: "臺北松山機場", region: "台南市白河區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 614, airport: "臺北松山機場", region: "台南市東山區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 200, status: true },
    { id: 615, airport: "臺北松山機場", region: "台南市六甲區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 616, airport: "臺北松山機場", region: "台南市下營區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 617, airport: "臺北松山機場", region: "台南市柳營區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 618, airport: "臺北松山機場", region: "台南市鹽水區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 619, airport: "臺北松山機場", region: "台南市善化區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 620, airport: "臺北松山機場", region: "台南市大內區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 621, airport: "臺北松山機場", region: "台南市山上區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 200, status: true },
    { id: 622, airport: "臺北松山機場", region: "台南市新市區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 623, airport: "臺北松山機場", region: "台南市安定區", prices: { 1: 5200, 3: 5600, 5: 5700, 8: 10400 }, remoteSurcharge: 0, status: true },
    { id: 624, airport: "臺北松山機場", region: "高雄市新興區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 625, airport: "臺北松山機場", region: "高雄市前金區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 626, airport: "臺北松山機場", region: "高雄市苓雅區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 627, airport: "臺北松山機場", region: "高雄市鹽埕區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 628, airport: "臺北松山機場", region: "高雄市鼓山區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 200, status: true },
    { id: 629, airport: "臺北松山機場", region: "高雄市旗津區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 630, airport: "臺北松山機場", region: "高雄市前鎮區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 631, airport: "臺北松山機場", region: "高雄市三民區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 632, airport: "臺北松山機場", region: "高雄市楠梓區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 633, airport: "臺北松山機場", region: "高雄市小港區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 634, airport: "臺北松山機場", region: "高雄市左營區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 635, airport: "臺北松山機場", region: "高雄市仁武區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 636, airport: "臺北松山機場", region: "高雄市大社區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 637, airport: "臺北松山機場", region: "高雄市東沙群島", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 638, airport: "臺北松山機場", region: "高雄市南沙群島", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 639, airport: "臺北松山機場", region: "高雄市岡山區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 200, status: true },
    { id: 640, airport: "臺北松山機場", region: "高雄市路竹區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 641, airport: "臺北松山機場", region: "高雄市阿蓮區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 642, airport: "臺北松山機場", region: "高雄市田寮區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 643, airport: "臺北松山機場", region: "高雄市燕巢區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 644, airport: "臺北松山機場", region: "高雄市橋頭區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 645, airport: "臺北松山機場", region: "高雄市梓官區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 646, airport: "臺北松山機場", region: "高雄市彌陀區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 647, airport: "臺北松山機場", region: "高雄市永安區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 648, airport: "臺北松山機場", region: "高雄市湖內區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 649, airport: "臺北松山機場", region: "高雄市鳳山區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 200, status: true },
    { id: 650, airport: "臺北松山機場", region: "高雄市大寮區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 651, airport: "臺北松山機場", region: "高雄市林園區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 652, airport: "臺北松山機場", region: "高雄市鳥松區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 653, airport: "臺北松山機場", region: "高雄市大樹區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 654, airport: "臺北松山機場", region: "高雄市旗山區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 200, status: true },
    { id: 655, airport: "臺北松山機場", region: "高雄市美濃區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 656, airport: "臺北松山機場", region: "高雄市六龜區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 657, airport: "臺北松山機場", region: "高雄市內門區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 658, airport: "臺北松山機場", region: "高雄市杉林區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 659, airport: "臺北松山機場", region: "高雄市甲仙區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 660, airport: "臺北松山機場", region: "高雄市桃源區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 661, airport: "臺北松山機場", region: "高雄市那瑪夏區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 662, airport: "臺北松山機場", region: "高雄市茂林區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 663, airport: "臺北松山機場", region: "高雄市茄萣區", prices: { 1: 6200, 3: 6600, 5: 6700, 8: 12400 }, remoteSurcharge: 0, status: true },
    { id: 664, airport: "臺北松山機場", region: "屏東縣屏東市", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 0, status: true },
    { id: 665, airport: "臺北松山機場", region: "屏東縣三地門鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 666, airport: "臺北松山機場", region: "屏東縣霧台鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 667, airport: "臺北松山機場", region: "屏東縣瑪家鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 668, airport: "臺北松山機場", region: "屏東縣九如鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 669, airport: "臺北松山機場", region: "屏東縣里港鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 670, airport: "臺北松山機場", region: "屏東縣高樹鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 671, airport: "臺北松山機場", region: "屏東縣鹽埔鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 672, airport: "臺北松山機場", region: "屏東縣長治鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 673, airport: "臺北松山機場", region: "屏東縣麟洛鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 674, airport: "臺北松山機場", region: "屏東縣竹田鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 675, airport: "臺北松山機場", region: "屏東縣內埔鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 676, airport: "臺北松山機場", region: "屏東縣萬丹鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 677, airport: "臺北松山機場", region: "屏東縣潮州鎮", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 0, status: true },
    { id: 678, airport: "臺北松山機場", region: "屏東縣泰武鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 679, airport: "臺北松山機場", region: "屏東縣來義鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 680, airport: "臺北松山機場", region: "屏東縣萬巒鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 681, airport: "臺北松山機場", region: "屏東縣崁頂鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 682, airport: "臺北松山機場", region: "屏東縣新埤鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 683, airport: "臺北松山機場", region: "屏東縣南州鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 684, airport: "臺北松山機場", region: "屏東縣林邊鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 685, airport: "臺北松山機場", region: "屏東縣東港鎮", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 0, status: true },
    { id: 686, airport: "臺北松山機場", region: "屏東縣琉球鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 687, airport: "臺北松山機場", region: "屏東縣佳冬鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 688, airport: "臺北松山機場", region: "屏東縣新園鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 689, airport: "臺北松山機場", region: "屏東縣枋寮鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 690, airport: "臺北松山機場", region: "屏東縣枋山鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 691, airport: "臺北松山機場", region: "屏東縣春日鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 692, airport: "臺北松山機場", region: "屏東縣獅子鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 693, airport: "臺北松山機場", region: "屏東縣車城鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 694, airport: "臺北松山機場", region: "屏東縣牡丹鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 695, airport: "臺北松山機場", region: "屏東縣恆春鎮", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 0, status: true },
    { id: 696, airport: "臺北松山機場", region: "屏東縣滿州鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 697, airport: "臺北松山機場", region: "台東縣台東市", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 0, status: true },
    { id: 698, airport: "臺北松山機場", region: "台東縣綠島鄉", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 100, status: true },
    { id: 699, airport: "臺北松山機場", region: "台東縣蘭嶼鄉", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 100, status: true },
    { id: 700, airport: "臺北松山機場", region: "台東縣延平鄉", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 100, status: true },
    { id: 701, airport: "臺北松山機場", region: "台東縣卑南鄉", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 100, status: true },
    { id: 702, airport: "臺北松山機場", region: "台東縣鹿野鄉", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 100, status: true },
    { id: 703, airport: "臺北松山機場", region: "台東縣關山鎮", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 200, status: true },
    { id: 704, airport: "臺北松山機場", region: "台東縣海端鄉", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 100, status: true },
    { id: 705, airport: "臺北松山機場", region: "台東縣池上鄉", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 100, status: true },
    { id: 706, airport: "臺北松山機場", region: "台東縣東河鄉", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 100, status: true },
    { id: 707, airport: "臺北松山機場", region: "台東縣成功鎮", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 0, status: true },
    { id: 708, airport: "臺北松山機場", region: "台東縣長濱鄉", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 100, status: true },
    { id: 709, airport: "臺北松山機場", region: "台東縣太麻里鄉", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 100, status: true },
    { id: 710, airport: "臺北松山機場", region: "台東縣金峰鄉", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 100, status: true },
    { id: 711, airport: "臺北松山機場", region: "台東縣大武鄉", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 100, status: true },
    { id: 712, airport: "臺北松山機場", region: "台東縣達仁鄉", prices: { 1: 8200, 3: 8600, 5: 8700, 8: 16400 }, remoteSurcharge: 100, status: true },
    { id: 713, airport: "臺北松山機場", region: "花蓮縣花蓮市", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 0, status: true },
    { id: 714, airport: "臺北松山機場", region: "花蓮縣新城鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 715, airport: "臺北松山機場", region: "花蓮縣秀林鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
    { id: 716, airport: "臺北松山機場", region: "花蓮縣吉安鄉", prices: { 1: 7200, 3: 7600, 5: 7700, 8: 14400 }, remoteSurcharge: 100, status: true },
  ]);

  // --- 4. Route Settings Data ---
  const [routePrices, setRoutePrices] = useState([
    { id: 2, name: "台中-日月潭", start: "台中高鐵站", end: "日月潭水社碼頭", price: 2500, status: true },
  ]);

  // --- 5. Mileage Settings Data (Global) ---
  const [mileageSettings, setMileageSettings] = useState({
    basePrice: 85,
    baseDistance: 1.5,
    perKmPrice: 25,
    nightSurchargeRate: 1.2,
  });

  // Common States
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

  // Holiday Modal State
  // Holiday Modal State
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<HolidayType | null>(null);
  const initialHolidayFormState: Omit<HolidayType, 'id'> = {
    name: "",
    startDate: "",
    endDate: "",
    type: "加價",
    value: 0,
    status: true
  };
  const [holidayFormData, setHolidayFormData] = useState<Omit<HolidayType, 'id'>>(initialHolidayFormState);


  // Manage Vehicle Types State
  const [isManageVehicleTypesModalOpen, setIsManageVehicleTypesModalOpen] = useState(false);
  const [newVehicleTypeName, setNewVehicleTypeName] = useState("");

  const handleAddVehicleType = () => {
    if (!newVehicleTypeName.trim()) return;
    const newId = Math.max(...vehicles.map(v => v.id), 0) + 1;
    const newVehicle: VehicleType = {
      ...initialFormState as VehicleType,
      id: newId,
      name: newVehicleTypeName,
      model: "",
      status: true,
      lastModified: new Date().toLocaleDateString(),
      modifier: "Admin"
    };
    setVehicles([...vehicles, newVehicle]);
    setNewVehicleTypeName("");
  };

  const handleDeleteVehicleType = (id: number) => {
    // Prevent deleting if it's the only vehicle type left
    if (confirm("確定要刪除此車種嗎？相關的價格設定也會一併移除。")) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };



  // --- Data Normalization Effect ---
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
  const [availableRegions, setAvailableRegions] = useState<string[]>(Array.from(new Set(airportPrices.map(p => p.region))));

  // Manage Locations State
  const [isManageLocationsModalOpen, setIsManageLocationsModalOpen] = useState(false);
  const [newMasterAirport, setNewMasterAirport] = useState("");
  const [newMasterRegion, setNewMasterRegion] = useState("");

  const handleAddMasterAirport = () => {
    const airportName = newMasterAirport.trim();
    if (airportName && !availableAirports.includes(airportName)) {
      setAvailableAirports([...availableAirports, airportName]);
      setNewMasterAirport("");

      // Auto-populate pricing for this new airport with ALL existing regions
      const nextId = Math.max(0, ...airportPrices.map(p => p.id)) + 1;
      const newPrices: AirportMatrixType[] = availableRegions.map((region, index) => ({
        id: nextId + index,
        airport: airportName,
        region: region,
        prices: {},
        remoteSurcharge: 0,
        status: true
      }));
      setAirportPrices([...airportPrices, ...newPrices]);
    }
  };

  const handleDeleteMasterAirport = (airport: string) => {
    if (confirm(`確定要刪除「${airport}」嗎？這將會一併刪除所有屬於此機場的價格設定！`)) {
      setAvailableAirports(availableAirports.filter(a => a !== airport));
      setAirportPrices(airportPrices.filter(p => p.airport !== airport));
    }
  };

  const handleAddMasterRegion = () => {
    const regionName = newMasterRegion.trim();
    if (regionName && !availableRegions.includes(regionName)) {
      setAvailableRegions([...availableRegions, regionName]);
      setNewMasterRegion("");

      // Auto-populate pricing for this new region with ALL existing airports
      const nextId = Math.max(0, ...airportPrices.map(p => p.id)) + 1;
      const newPrices: AirportMatrixType[] = availableAirports.map((airport, index) => ({
        id: nextId + index,
        airport: airport,
        region: regionName,
        prices: {},
        remoteSurcharge: 0,
        status: true
      }));
      setAirportPrices([...airportPrices, ...newPrices]);
    }
  };

  const handleDeleteMasterRegion = (region: string) => {
    if (confirm(`確定要刪除「${region}」嗎？這將會一併刪除所有屬於此地區的價格設定！`)) {
      setAvailableRegions(availableRegions.filter(r => r !== region));
      setAirportPrices(airportPrices.filter(p => p.region !== region));
    }
  };



  // Holiday Handlers
  const handleOpenHolidayModal = (holiday?: HolidayType) => {
    if (holiday) {
      setEditingHoliday(holiday);
      setHolidayFormData(holiday);
    } else {
      setEditingHoliday(null);
      setHolidayFormData(initialHolidayFormState);
    }
    setIsHolidayModalOpen(true);
  };

  const handleCloseHolidayModal = () => {
    setIsHolidayModalOpen(false);
    setEditingHoliday(null);
  };

  const handleSaveHoliday = () => {
    if (editingHoliday) {
      setHolidays(holidays.map(h => h.id === editingHoliday.id ? { ...holidayFormData, id: h.id } : h));
    } else {
      const newId = Math.max(...holidays.map(h => h.id), 0) + 1;
      setHolidays([...holidays, { ...holidayFormData, id: newId }]);
    }
    handleCloseHolidayModal();
  };

  const handleDeleteHoliday = () => {
    if (editingHoliday) {
      setHolidays(holidays.filter(h => h.id !== editingHoliday.id));
      handleCloseHolidayModal();
    }
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
    status: true
  };
  const [airportFormData, setAirportFormData] = useState<any>(initialAirportFormState);

  // Airport Handlers
  const handleOpenAirportModal = (airport?: AirportMatrixType) => {
    if (airport) {
      setEditingAirport(airport);
      setAirportFormData(airport);
    } else {
      setEditingAirport(null);
      // Initialize prices with explicit vehicle IDs keys to ensure reactivity
      const initialPrices: Record<number, number> = {};
      vehicles.forEach(v => initialPrices[v.id] = 0);
      setAirportFormData({ ...initialAirportFormState, prices: initialPrices });
    }
    setIsAirportModalOpen(true);
  };

  const handleCloseAirportModal = () => {
    setIsAirportModalOpen(false);
    setEditingAirport(null);
  };

  const handleSaveAirport = () => {
    if (editingAirport) {
      setAirportPrices(airportPrices.map(p => p.id === editingAirport.id ? { ...airportFormData, id: p.id } : p));
    } else {
      const newId = Math.max(...airportPrices.map(p => p.id), 0) + 1;
      setAirportPrices([...airportPrices, { ...airportFormData, id: newId }]);
    }
    handleCloseAirportModal();
  };

  const handleDeleteAirport = () => {
    if (editingAirport) {
      setAirportPrices(airportPrices.filter(p => p.id !== editingAirport.id));
      handleCloseAirportModal();
    }
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

  const handleToggleHolidayStatus = (id: number) => {
    setHolidays(holidays.map(h => h.id === id ? { ...h, status: !h.status } : h));
  };

  const handleToggleAirportStatus = (id: number) => {
    setAirportPrices(airportPrices.map(p => p.id === id ? { ...p, status: !p.status } : p));
  };

  const handleToggleRouteStatus = (id: number) => {
    setRoutePrices(routePrices.map(r => r.id === id ? { ...r, status: !r.status } : r));
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
              <th className="px-6 py-4">加價設定</th>
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
                <td className="px-6 py-4"><span className="text-red-600 font-medium">+{h.value}元</span> ({h.type})</td>
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
    setAirportPrices(airportPrices.map(p => p.airport === airport ? { ...p, status: newStatus } : p));
  };

  const renderAirportTab = () => {
    // Group airports
    const groupedAirports = airportPrices.reduce((acc, curr) => {
      if (!acc[curr.airport]) acc[curr.airport] = [];
      acc[curr.airport].push(curr);
      return acc;
    }, {} as Record<string, typeof airportPrices>);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4 min-w-[200px]">機場/港口 / 接送地</th>
                {vehicles.map(v => (
                  <th key={v.id} className="px-4 py-4 min-w-[120px] text-center">{v.name}</th>
                ))}
                <th className="px-6 py-4 min-w-[100px] text-center">偏遠加價</th>
                <th className="px-6 py-4 min-w-[100px] text-center">狀態</th>
                <th className="px-6 py-4 min-w-[80px] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(groupedAirports).map(([airport, items]) => {
                const isGroupActive = items.every(i => i.status);
                return (
                  <div key={airport} style={{ display: 'contents' }}>
                    <tr
                      onClick={() => toggleAirportGroup(airport)}
                      className="bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <td className="px-6 py-3 font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          {expandedAirports.includes(airport) ? <ChevronDown size={20} className="text-gray-500" /> : <ChevronRight size={20} className="text-gray-500" />}
                          <span className="text-base">{airport}</span>
                          <span className="text-sm font-normal text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                            {items.length} 個地點
                          </span>
                        </div>
                      </td>
                      {/* Empty cells for vehicle columns */}
                      {vehicles.map(v => <td key={v.id} className="px-4 py-3"></td>)}
                      <td className="px-6 py-3"></td>
                      {/* Status Toggle for Group */}
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={(e) => toggleAirportGroupStatus(airport, isGroupActive, e)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 center ${isGroupActive ? 'bg-emerald-500' : 'bg-gray-200'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isGroupActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </td>
                      <td className="px-6 py-3"></td>
                    </tr>
                    {expandedAirports.includes(airport) && items.map((p, index) => (
                      <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <div className="flex flex-col gap-1.5 ml-8"> {/* Indent for hierarchy */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono text-gray-400 w-5 text-right">{index + 1}.</span>
                              <span className="text-sm text-gray-700">{p.region}</span>
                            </div>
                          </div>
                        </td>
                        {vehicles.map(v => (
                          <td key={v.id} className="px-4 py-4 text-center text-gray-600">
                            {p.prices[v.id] ? `$${p.prices[v.id]}` : '-'}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-center text-gray-600">
                          {p.remoteSurcharge > 0 ? `+$${p.remoteSurcharge}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleAirportStatus(p.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 center ${p.status ? 'bg-emerald-500' : 'bg-gray-200'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${p.status ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleOpenAirportModal(p)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </div>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };


  const renderRouteTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
            <tr>
              <th className="px-6 py-4">路線名稱</th>
              <th className="px-6 py-4">起點</th>
              <th className="px-6 py-4">終點</th>
              <th className="px-6 py-4">固定價格</th>
              <th className="px-6 py-4">狀態</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {routePrices.map(r => (
              <tr key={r.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{r.name}</td>
                <td className="px-6 py-4 text-gray-600">{r.start}</td>
                <td className="px-6 py-4 text-gray-600">{r.end}</td>
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
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><MoreHorizontal size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMileageTab = () => (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Route className="text-blue-600" size={24} />
          全域里程計費參數
        </h3>
        <p className="text-sm text-gray-500 mb-6">此處設定適用於無固定報價的點對點行程，系統將依據 Google Maps 距離計算。</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="基本起步價 (Base Price)"
            type="number"
            value={mileageSettings.basePrice}
            onChange={(v) => setMileageSettings({ ...mileageSettings, basePrice: Number(v) })}
            suffix="元"
          />
          <InputField
            label="包含基本里程 (Base Distance)"
            type="number"
            value={mileageSettings.baseDistance}
            onChange={(v) => setMileageSettings({ ...mileageSettings, baseDistance: Number(v) })}
            suffix="公里"
          />
          <InputField
            label="續程每公里單價 (Price per KM)"
            type="number"
            value={mileageSettings.perKmPrice}
            onChange={(v) => setMileageSettings({ ...mileageSettings, perKmPrice: Number(v) })}
            suffix="元/公里"
          />
          <InputField
            label="夜間加成倍率"
            type="number"
            value={mileageSettings.nightSurchargeRate}
            onChange={(v) => setMileageSettings({ ...mileageSettings, nightSurchargeRate: Number(v) })}
            suffix="倍 (x)"
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 font-medium">
            <Save size={18} />
            儲存設定
          </button>
        </div>
      </div>
    </div>
  );

  const renderVehicleTab = () => (
    <>
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        {/* Existing Search Bar Content kept as is for Vehicle Tab */}
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
            href="/vehicles?tab=holiday"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${currentTab === 'holiday' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'}`}
          >
            <Calendar size={16} />
            1. 假期特價
          </Link>
          <div className="text-gray-300"><ChevronRight size={16} /></div>
          <Link
            href="/vehicles?tab=airport"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${currentTab === 'airport' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'}`}
          >
            <Plane size={16} />
            2. 機場/港口
          </Link>
          <div className="text-gray-300"><ChevronRight size={16} /></div>

          <Link
            href="/vehicles?tab=route"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${currentTab === 'route' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'}`}
          >
            <MapPin size={16} />
            3. 特定路段
          </Link>
          <div className="text-gray-300"><ChevronRight size={16} /></div>

          <Link
            href="/vehicles?tab=mileage"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${currentTab === 'mileage' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'}`}
          >
            <Route size={16} />
            4. 里程計費
          </Link>
          <div className="text-gray-300"><ChevronRight size={16} /></div>

          <Link
            href="/vehicles"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${(!currentTab || currentTab === 'vehicle') ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'}`}
          >
            <Car size={16} />
            5. 車輛管理
          </Link>
        </div>
      </div>

      {/* Conditional Rendering Content */}
      <div className="min-h-[400px]">
        {currentTab === 'holiday' && renderHolidayTab()}
        {currentTab === 'airport' && renderAirportTab()}
        {currentTab === 'route' && renderRouteTab()}
        {currentTab === 'mileage' && renderMileageTab()}
        {(!currentTab || currentTab === 'vehicle') && renderVehicleTab()}
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
                  {editingHoliday ? '編輯特殊假期' : '新增特殊假期'}
                </h3>
                <button onClick={handleCloseHolidayModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <InputField
                  label="假期名稱"
                  value={holidayFormData.name}
                  onChange={(v) => setHolidayFormData({ ...holidayFormData, name: v })}
                  placeholder="例如：春節連假"
                  required
                />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">加價類型</label>
                    <select
                      value={holidayFormData.type}
                      onChange={(e) => setHolidayFormData({ ...holidayFormData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="加價">定額加價</option>
                      <option value="倍率">倍率加成</option>
                    </select>
                  </div>
                  <InputField
                    label="加價數值"
                    type="number"
                    value={holidayFormData.value}
                    onChange={(v) => setHolidayFormData({ ...holidayFormData, value: Number(v) })}
                    suffix={holidayFormData.type === '加價' ? '元' : '倍'}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
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
                    onChange={(v) => setAirportFormData({ ...airportFormData, remoteSurcharge: Number(v) })}
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
                              prices: { ...airportFormData.prices, [vehicle.id]: Number(e.target.value) }
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
      {isManageLocationsModalOpen && (
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
      )}

      {/* Add/Edit Modal (Existing logic) */}
      {
        isModalOpen && (
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
