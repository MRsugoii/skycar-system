'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ChevronLeft } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();

    // Form States
    const [idno, setIdno] = useState('');
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneCode, setPhoneCode] = useState('');
    const [addr, setAddr] = useState('');
    const [email, setEmail] = useState('');
    const [lineId, setLineId] = useState('');
    const [waId, setWaId] = useState('');

    // UI States
    const [phoneMsg, setPhoneMsg] = useState('');

    const handleSendPhoneCode = () => {
        const cleanPhone = phone.trim().replace(/\D/g, '');
        if (!/^09\d{8}$/.test(cleanPhone)) {
            alert('請先輸入正確的手機號 (09xxxxxxxx)');
            return;
        }

        // Mock Send Code
        const code = String(Math.floor(100000 + Math.random() * 900000));
        sessionStorage.setItem('phoneCode:' + cleanPhone, code);
        setPhoneMsg(`驗證碼已發送至手機（示範用：${code}）`);
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Basic Validation
        const cleanId = idno.trim().toUpperCase();
        if (!/^[A-Z][12]\d{8}$/.test(cleanId)) {
            alert('請輸入正確的身分證字號');
            return;
        }

        // Check exists
        if (localStorage.getItem('user_' + cleanId)) {
            alert('此身分證帳號已被註冊');
            return;
        }

        if (!name.trim()) { alert('請輸入姓名'); return; }
        if (!birthday) { alert('請選擇生日'); return; }
        if (!addr.trim()) { alert('請輸入地址'); return; }

        // Phone check
        const cleanPhone = phone.trim().replace(/\D/g, '');
        if (!/^09\d{8}$/.test(cleanPhone)) {
            alert('請輸入正確的手機號 (09xxxxxxxx)');
            return;
        }

        // Verification Code Check
        const realCode = sessionStorage.getItem('phoneCode:' + cleanPhone);
        if (!phoneCode || phoneCode.trim() !== realCode) {
            alert('手機驗證碼不正確或未發送');
            return;
        }

        // 2. Create User
        // Temporary password = phone number
        const newUser = {
            account: cleanId,
            password: cleanPhone,
            displayName: name.trim(),
            birthday,
            phone: cleanPhone,
            address: addr.trim(),
            email: email.trim(),
            lineId: lineId.trim(),
            whatsappId: waId.trim(),
            createdAt: Date.now(),
            totalSpent: 0,
            totalTrips: 0,
            level: 'C'
        };

        localStorage.setItem('user_' + cleanId, JSON.stringify(newUser));

        // 3. Auto Login
        sessionStorage.setItem('memberAccount', cleanId);
        sessionStorage.setItem('memberName', newUser.displayName);
        sessionStorage.setItem('memberEmail', newUser.email || '');
        sessionStorage.setItem('memberPhone', newUser.phone);

        alert('註冊成功！將自動登入');

        // Check for returnTo param
        const params = new URLSearchParams(window.location.search);
        const returnTo = params.get('returnTo');
        if (returnTo) {
            router.push(returnTo);
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10 relative overflow-hidden">

            {/* Header Background */}
            <div className="bg-blue-600 h-[220px] rounded-b-[40px] shadow-lg pt-6 px-6 text-center text-white relative z-0">
                {/* Back Button */}
                <button
                    onClick={() => {
                        const params = new URLSearchParams(window.location.search);
                        const returnTo = params.get('returnTo');
                        if (returnTo) {
                            router.push(returnTo);
                        } else {
                            router.push('/login');
                        }
                    }}
                    className="absolute left-6 top-6 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white active:scale-95 hover:bg-white/30 transition z-50"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3 mt-10">
                    <UserPlus size={32} className="text-white" />
                </div>
                <h1 className="text-2xl font-black tracking-wider">註冊新帳號</h1>
            </div>

            {/* Main Card */}
            <div className="px-4 -mt-8 relative z-10 max-w-[420px] mx-auto">
                <form onSubmit={handleRegister} className="bg-white rounded-2xl shadow-xl p-6 space-y-6">

                    {/* ID (Account) */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 ml-1">身分證字號 (帳號)</label>
                        <input
                            value={idno}
                            onChange={e => setIdno(e.target.value.toUpperCase())}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition uppercase"
                            placeholder="A123456789"
                        />
                        <p className="text-[10px] text-gray-400 pl-1">作為日後登入帳號</p>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <InputGroup label="姓名" value={name} onChange={setName} placeholder="您的姓名" />
                        <InputGroup label="生日" value={birthday} onChange={setBirthday} type="date" />
                        <InputGroup label="地址" value={addr} onChange={setAddr} placeholder="市/區/路/號..." />
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Contact & Verify */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 ml-1">手機 (做為預設密碼)</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                                placeholder="09xxxxxxxx"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 ml-1">手機驗證碼</label>
                            <div className="flex gap-2">
                                <input
                                    value={phoneCode}
                                    onChange={e => setPhoneCode(e.target.value)}
                                    className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition text-center tracking-widest"
                                    placeholder="6位數"
                                    maxLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={handleSendPhoneCode}
                                    className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-200 hover:bg-blue-100 transition whitespace-nowrap"
                                >
                                    發送驗證碼
                                </button>
                            </div>
                            {phoneMsg && <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg text-center font-bold" dangerouslySetInnerHTML={{ __html: phoneMsg }}></div>}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Optional */}
                    <div className="space-y-4">
                        <InputGroup label="Email (選填)" value={email} onChange={setEmail} type="email" placeholder="example@mail.com" />
                        <div className="grid grid-cols-2 gap-3">
                            <InputGroup label="Line ID (選填)" value={lineId} onChange={setLineId} />
                            <InputGroup label="WhatsApp (選填)" value={waId} onChange={setWaId} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 text-white font-black text-lg rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all mt-4"
                    >
                        註冊並登入
                    </button>

                    <p className="text-center text-xs text-gray-400">
                        點擊註冊即代表同意隱私權政策與服務條款
                    </p>
                </form>
            </div>
        </div>
    );
}

function InputGroup({ label, value, onChange, type = "text", placeholder }: { label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
            />
        </div>
    );
}
