"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [idno, setIdno] = useState('A123456789');
    const [password, setPassword] = useState('0912345678');
    const [showForgot, setShowForgot] = useState(false);

    useEffect(() => {
        // Enforce demo credentials on client side (bypasses browser password managers clearing inputs)
        const fillDemoContent = () => {
            setIdno('A123456789');
            setPassword('0912345678');
        };
        fillDemoContent();
        const timeout = setTimeout(fillDemoContent, 500); // Re-fill after browser extension kicks in
        return () => clearTimeout(timeout);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (!idno || !password) {
            alert('請輸入帳號與密碼');
            return;
        }

        const login = async () => {
            try {
                const { data, error } = await supabase
                    .from('drivers')
                    .select('*')
                    .eq('national_id', idno.trim())
                    .single();

                if (error || !data) {
                    alert("找無此帳號，請確認身分證字號正確或先註冊。");
                    return;
                }

                // Check password - in this demo, password is often the phone number
                // Strip non-numeric chars from phone for comparison if needed, but let's assume exact match with input
                const driverPhone = data.phone || "";
                const cleanPhone = driverPhone.replace(/-/g, '');

                if (password.trim() === cleanPhone || password.trim() === driverPhone) {
                    // Success
                    const driverData = {
                        name: data.name,
                        idno: data.national_id,
                        status: data.status,
                        phone: data.phone,
                        email: data.email,
                        // Add other fields as needed
                    };
                    localStorage.setItem("driver_" + data.national_id, JSON.stringify(driverData));
                    sessionStorage.setItem("driverIdno", data.national_id);

                    if (data.status === '停權') {
                        alert("您的帳號已被停權，請聯繫客服。");
                    } else {
                        router.push('/dashboard');
                    }
                } else {
                    alert("密碼錯誤（預設密碼為手機號碼）");
                }
            } catch (err) {
                console.error("Login error:", err);
                alert("登入發生錯誤，請稍後再試。");
            }
        };

        login();
    };


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
                        <div className="space-y-1.5 flex flex-col">
                            <label className="text-sm font-bold text-gray-700 ml-1">帳號 (身分證)</label>
                            <input
                                id="idno"
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
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                placeholder=""
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setIdno('A123456789');
                                setPassword('0912345678');
                                // Force DOM update for aggressive overriding browsers
                                const idInput = document.getElementById('idno') as HTMLInputElement;
                                const pwdInput = document.getElementById('password') as HTMLInputElement;
                                if(idInput) idInput.value = 'A123456789';
                                if(pwdInput) pwdInput.value = '0912345678';
                            }}
                            className="w-full bg-blue-50 text-blue-600 font-bold py-2 rounded-xl border border-blue-200 hover:bg-blue-100 transition-all text-sm mb-2"
                        >
                            💡 一鍵填入示範帳密
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] hover:bg-blue-700 transition-all text-base mt-2 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {isLoading ? "登入中..." : "登入"}
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
