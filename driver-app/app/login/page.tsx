"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [idno, setIdno] = useState('');
    const [password, setPassword] = useState('');
    const [showForgot, setShowForgot] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (!idno || !password) {
            alert('請輸入帳號與密碼');
            return;
        }

        // Mock Login Logic
        const key = "driver_" + idno;
        const driverRaw = localStorage.getItem(key);

        if (driverRaw) {
            const driver = JSON.parse(driverRaw);
            if (driver.password === password) {
                // Determine redirect based on status
                if (driver.status === '審核中' || driver.status === 'pending') {
                    // Perhaps allow login but limited? User story implies login after register success is possible but maybe limited.
                    // For now, standard behavior:
                    sessionStorage.setItem("driverIdno", driver.idno);
                    router.push('/dashboard');
                } else if (driver.status === '停權') {
                    alert("您的帳號已被停權，請聯繫客服。");
                } else {
                    sessionStorage.setItem("driverIdno", driver.idno);
                    router.push('/dashboard');
                }
            } else {
                alert("密碼錯誤（預設密碼為手機號碼）");
            }
        } else {
            // Support hardcoded demo user if needed or just fail
            if (idno.trim() === 'A123456789' && password.trim() === '0912345678') {
                // Ensure default demo driver exists
                const demoDriver = {
                    name: "王小明",
                    idno: "A123456789",
                    status: "active",
                    password: "0912345678",
                    phone: "0912-345-678",
                    email: "wang@example.com",
                    addr: "台北市信義區",
                    licenseExpire: "2030-01-01",
                    insuranceExpire: "2030-01-01",
                    docs: {
                        license: { expire: "2030-01-01" },
                        insurance: { expire: "2030-01-01" }
                    },
                    totalOrders: 15
                };
                localStorage.setItem("driver_A123456789", JSON.stringify(demoDriver));

                // Also ensure this driver is in the main drivers list for consistency
                const allDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
                if (!allDrivers.find((d: any) => d.idno === 'A123456789')) {
                    allDrivers.push(demoDriver);
                    localStorage.setItem("drivers", JSON.stringify(allDrivers));
                }

                sessionStorage.setItem("driverIdno", "A123456789");
                router.push('/dashboard');
            } else if (idno.trim() === 'C123456789' && password.trim() === '0987654321') {
                // Mock: Force "Docs Error" state
                const demoDriver = {
                    name: "孫小美",
                    idno: "C123456789",
                    status: "denied", // Triggers 'docs_error' or 'denied' alert in dashboard
                    password: "0987654321", // Required for subsequent logins
                    phone: "0987-654-321",
                    email: "sun@example.com",
                    addr: "台北市大安區",
                    licenseExpire: "2024-12-31", // Expired or invalid implying why it failed
                    insuranceExpire: "2024-12-31",
                    docs: {
                        license: { expire: "2024-12-31" },
                        insurance: { expire: "2024-12-31" }
                    },
                    totalOrders: 0
                };
                localStorage.setItem("driver_C123456789", JSON.stringify(demoDriver));

                // Also ensure this driver is in the main drivers list for consistency
                const allDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
                if (!allDrivers.find((d: any) => d.idno === 'C123456789')) {
                    allDrivers.push(demoDriver);
                    localStorage.setItem("drivers", JSON.stringify(allDrivers));
                }

                sessionStorage.setItem("driverIdno", "C123456789");
                router.push('/dashboard');
            } else {
                alert("找無此帳號，請先註冊");
            }
        }

    }


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Immersive Background Header */}
            <div className="absolute top-0 left-0 right-0 h-[45vh] bg-blue-600 rounded-b-[40px] z-0 shadow-2xl">
                <div className="absolute inset-0 bg-blue-600 rounded-b-[40px]"></div>
            </div>

            <div className="w-full max-w-[380px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-white rounded-2xl mx-auto shadow-xl flex items-center justify-center mb-6">
                        <Car size={40} className="text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-widest mb-2 text-shadow-sm">SKYCAR</h1>
                    <p className="text-blue-100 font-bold text-lg tracking-widest">司機端</p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">帳號</label>
                            <input
                                type="text"
                                value={idno}
                                onChange={(e) => setIdno(e.target.value.toUpperCase())}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                placeholder="身分證字號"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">密碼</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                placeholder=""
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] hover:bg-blue-700 transition-all text-base mt-2"
                        >
                            登入
                        </button>
                    </form>

                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={() => setShowForgot(true)}
                            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            忘記密碼？
                        </button>
                        <Link href="/register" className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
                            註冊新帳號
                        </Link>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-400 mt-8">
                    © 2025 Skycar Dispatch System 派車調度管理系統
                </p>
            </div>

            {/* Forgot Password Modal */}
            {showForgot && (
                <ForgotPasswordModal onClose={() => setShowForgot(false)} />
            )}
        </div>
    );
}

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            alert("請輸入 Email");
            return;
        }

        setLoading(true);

        // Simulate API check
        setTimeout(() => {
            // Find driver by email
            let foundKey = "";
            let foundDriver: any = null;

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith("driver_")) {
                    try {
                        const d = JSON.parse(localStorage.getItem(key) || "");
                        if (d.email === email) {
                            foundKey = key;
                            foundDriver = d;
                            break;
                        }
                    } catch (e) { }
                }
            }

            if (foundDriver) {
                // Generate new temp password
                const tempPass = Math.floor(100000 + Math.random() * 900000).toString();
                // Update driver
                foundDriver.password = tempPass;
                localStorage.setItem(foundKey, JSON.stringify(foundDriver));

                alert(`系統已生成暫時密碼並發送至您的信箱：\n${email}\n\n您的暫時密碼為：${tempPass}`);
                onClose();
            } else {
                alert("查無此 Email 帳號，請確認輸入是否正確。");
            }
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-6">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">忘記密碼</h3>
                    <p className="text-sm text-gray-500 mt-2">請輸入您註冊時的 Email，系統將發送暫時密碼給您。</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="example@mail.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "處理中..." : "發送暫時密碼"}
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                    >
                        取消
                    </button>
                </form>
            </div>
        </div>
    );
}
