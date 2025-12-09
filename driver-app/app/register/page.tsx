"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { FileButton } from "../../components/FileButton"; // Re-use existing component but style it inside if needed

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        idno: '',
        name: '',
        birth: '',
        phone: '',
        otp: '',
        addr: '',
        email: '',
        line: '',
        licenseExpire: '',
        insuranceExpire: '',
    });

    // File Names (Mock)
    const [files, setFiles] = useState<Record<string, string>>({});

    const handleFile = (field: string, name: string) => {
        setFiles(prev => ({ ...prev, [field]: name }));
    }

    const handleSubmit = () => {
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            const driverData = {
                ...formData,
                password: formData.phone, // Default password
                status: '審核中',
                docs: { ...files }
            };
            localStorage.setItem("driver_" + formData.idno, JSON.stringify(driverData));

            alert("註冊成功！請使用身分證與手機號碼登入。");
            router.push('/login');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-20 relative overflow-hidden">
            {/* Immersive Branding Header (Curve Bottom) */}
            <div className="absolute top-0 left-0 right-0 h-[260px] bg-blue-600 rounded-b-[40px] shadow-lg z-0"></div>

            <div className="w-full max-w-[390px] relative z-20">
                <PageHeader title="司機註冊" variant="ghost" />
            </div>

            <div className="w-full max-w-[390px] pt-4 px-4 relative z-10">
                <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-6 space-y-5 animate-in slide-in-from-bottom-5">

                    <InputGroup label="身分證字號（帳號）" sub="請輸入正確格式：英文開頭＋ 1/2 ＋ 8 位數字。">
                        <input
                            value={formData.idno}
                            onChange={e => setFormData({ ...formData, idno: e.target.value.toUpperCase() })}
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-medium shadow-inner" placeholder="例如 A123456789"
                        />
                    </InputGroup>

                    <InputGroup label="姓名">
                        <input
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-medium shadow-inner" placeholder="您的姓名"
                        />
                    </InputGroup>

                    <InputGroup label="生日">
                        <input
                            type="date"
                            value={formData.birth}
                            onChange={e => setFormData({ ...formData, birth: e.target.value })}
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-medium shadow-inner font-mono text-gray-600"
                        />
                    </InputGroup>

                    <InputGroup label="手機" sub="首次登入密碼為您的手機號碼（登入後可隨時修改）。">
                        <input
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-medium shadow-inner" placeholder="09xxxxxxxx" type="tel" maxLength={10}
                        />
                    </InputGroup>

                    <InputGroup label="手機驗證碼">
                        <div className="grid grid-cols-[1fr_120px] gap-2">
                            <input
                                value={formData.otp}
                                onChange={e => setFormData({ ...formData, otp: e.target.value })}
                                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-medium shadow-inner tracking-widest text-center" placeholder="6 位數" maxLength={6}
                            />
                            <button className="bg-white text-blue-600 border border-blue-600 font-bold rounded-xl text-sm hover:bg-blue-50">
                                發送驗證碼
                            </button>
                        </div>
                    </InputGroup>

                    <InputGroup label="地址">
                        <input
                            value={formData.addr}
                            onChange={e => setFormData({ ...formData, addr: e.target.value })}
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-medium shadow-inner" placeholder="市 / 區 / 路 / 號…"
                        />
                    </InputGroup>

                    <InputGroup label="Email（選填）">
                        <input
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-medium shadow-inner" type="email" placeholder="example@mail.com"
                        />
                    </InputGroup>

                    <InputGroup label="Line ID（選填）">
                        <input
                            value={formData.line}
                            onChange={e => setFormData({ ...formData, line: e.target.value })}
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-medium shadow-inner" placeholder="@ 或 ID"
                        />
                    </InputGroup>

                    <div className="h-px bg-gray-100 my-2"></div>

                    {/* Docs Section */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900">駕照上傳（正面 / 反面）</h3>
                        <CustomFileBtn label="上傳 駕照正面" field="licenseFront" onFile={handleFile} />
                        <CustomFileBtn label="上傳 駕照反面" field="licenseBack" onFile={handleFile} />
                        <input type="date" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-medium shadow-inner text-gray-600 font-mono"
                            value={formData.licenseExpire} onChange={e => setFormData({ ...formData, licenseExpire: e.target.value })}
                        />
                        <p className="text-xs text-gray-400">請輸入駕照到期日。</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900">行照上傳</h3>
                        <CustomFileBtn label="上傳 行照" field="vehicle" onFile={handleFile} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900">保險上傳（正面 / 反面）</h3>
                        <CustomFileBtn label="上傳 保險正面" field="insFront" onFile={handleFile} />
                        <CustomFileBtn label="上傳 保險反面" field="insBack" onFile={handleFile} />
                        <input type="date" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-medium shadow-inner text-gray-600 font-mono"
                            value={formData.insuranceExpire} onChange={e => setFormData({ ...formData, insuranceExpire: e.target.value })}
                        />
                        <p className="text-xs text-gray-400">請輸入保險到期日。</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900">良民證上傳</h3>
                        <CustomFileBtn label="上傳 良民證" field="police" onFile={handleFile} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900">個人照（自拍）上傳</h3>
                        <CustomFileBtn label="上傳 個人照（自拍）" field="idPhoto" onFile={handleFile} />
                        <p className="text-xs text-gray-400">請上傳清晰、正面、無墨鏡或帽子的自拍照。</p>
                    </div>

                    {/* Docs Section End */}

                </div>

                {/* Static Card Footer Action Bar */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 rounded-b-xl flex flex-col gap-2">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-base shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? "提交中..." : "註冊並送出審核"}
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                        送出後將於 1–2 天內完成審核
                    </p>
                </div>
            </div>


        </div>
    );
}

function InputGroup({ label, sub, children }: any) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">{label}</label>
            {children}
            {sub && <p className="text-xs text-gray-400">{sub}</p>}
        </div>
    )
}

function CustomFileBtn({ label, field, onFile }: any) {
    const [fileName, setFileName] = useState("");

    const handleChange = (e: any) => {
        if (e.target.files?.[0]) {
            setFileName(e.target.files[0].name);
            onFile(field, e.target.files[0].name);
        }
    }

    return (
        <div>
            <label className="block w-full py-3.5 text-center text-blue-600 border border-blue-600 rounded-xl font-bold cursor-pointer hover:bg-blue-50 transition-colors">
                {label}
                <input type="file" className="hidden" onChange={handleChange} />
            </label>
            {fileName && <p className="text-xs text-gray-500 mt-1 truncate">{fileName}</p>}
        </div>
    )
}
