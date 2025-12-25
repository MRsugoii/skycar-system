'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, X } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [idno, setIdno] = useState('');
    const [password, setPassword] = useState('');
    const [showForgot, setShowForgot] = useState(false);

    useEffect(() => {
        // initialize demo user if not exists
        if (typeof window !== 'undefined') {
            const demoKey = 'user_A123456789';
            if (!localStorage.getItem(demoKey)) {
                localStorage.setItem(
                    demoKey,
                    JSON.stringify({
                        account: 'A123456789',
                        password: '0912345678',
                        displayName: '示範用戶',
                        email: 'demo@mail.com',
                        phone: '0912345678',
                        totalSpent: 5000,
                        totalTrips: 3,
                    })
                );
            }
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanId = idno.trim().toUpperCase();
        const cleanPwd = password.trim();

        if (!cleanId || !cleanPwd) {
            alert('請輸入身分證字號與密碼');
            return;
        }

        // 台灣身分證格式：英文字母 + 1/2 + 8 碼 (Simple regex check)
        if (!/^[A-Z][12]\d{8}$/.test(cleanId)) {
            alert('身分證字號格式不正確');
            return;
        }

        const userStr = localStorage.getItem('user_' + cleanId) || '{}';
        const user = JSON.parse(userStr);

        if (!user.account) {
            alert('查無此身分證帳號，請先註冊');
            return;
        }

        if (user.password !== cleanPwd) {
            alert('密碼錯誤（請輸入註冊手機號碼）');
            return;
        }

        // Login success
        sessionStorage.setItem('memberAccount', cleanId);
        sessionStorage.setItem('memberName', user.displayName || '');
        sessionStorage.setItem('memberEmail', user.email || '');
        sessionStorage.setItem('memberPhone', user.phone || '');

        try {
            // Attempt to find Supabase User ID for 3-way sync
            // 1. Try by phone
            let { data: sbUser } = await supabase
                .from('users')
                .select('id')
                .eq('phone', user.phone)
                .single();

            // 2. Fallback: Try to match the seeded "Demo User" if we are logging in as the demo account
            if (!sbUser && cleanId === 'A123456789') {
                // The seed script created "Demo User" / "demo@example.com" / "0900-000-000"
                // This ensures the demo data I created is accessible even if local storage phone mismatch
                const { data: demoUser } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', 'demo@example.com')
                    .single();
                sbUser = demoUser;
            }

            if (sbUser) {
                sessionStorage.setItem('supabaseUserId', sbUser.id);
            }
        } catch (err) {
            console.error("Supabase link failed", err);
        }

        router.push('/dashboard');
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
                        <User size={40} className="text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-widest mb-2 text-shadow-sm">SKYCAR</h1>
                    <p className="text-blue-100 font-bold text-lg tracking-widest">會員端</p>
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
                                placeholder="請輸入密碼"
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
    const [msg, setMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setMsg("請輸入 Email");
            return;
        }

        setLoading(true);

        // Simulate API check
        setTimeout(() => {
            const mail = email.trim().toLowerCase();
            let acc = '';
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith('user_')) {
                    const u = JSON.parse(localStorage.getItem(k) || '{}');
                    if ((u.email || '').toLowerCase() === mail) {
                        acc = u.account;
                        break;
                    }
                }
            }

            if (!acc) {
                setMsg('查無此 Email');
                setLoading(false);
                return;
            }

            const temp = Math.random().toString(36).slice(-8);
            const u = JSON.parse(localStorage.getItem('user_' + acc) || '{}');
            u.password = temp;
            localStorage.setItem('user_' + acc, JSON.stringify(u));

            alert(`新密碼已寄出\n（示範用臨時密碼：${temp}）`);
            setLoading(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-6 relative">
                <button
                    className="absolute right-4 top-4 border-0 bg-transparent text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    onClick={onClose}
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">重設密碼</h3>
                    <p className="text-sm text-gray-500 mt-2">請輸入您註冊時的 Email</p>
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
                    {msg && <p className="text-center text-red-500 text-sm">{msg}</p>}
                </form>
            </div>
        </div>
    );
}
