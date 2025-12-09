import React, { useRef } from "react";
import { X, Printer, Check, DollarSign } from "lucide-react";

interface InvoicePreviewProps {
    orders: any[];
    driverName: string;
    invoiceNumber?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function InvoicePreview({ orders, driverName, invoiceNumber, onCancel, onConfirm }: InvoicePreviewProps) {
    const componentRef = useRef<HTMLDivElement>(null);

    const totalAmount = orders.reduce((sum, order) => {
        // Parse amount string like "$1,234" or "1234"
        const amt = parseInt(String(order.amount).replace(/[^0-9]/g, "")) || 0;
        return sum + amt;
    }, 0);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-gray-900/80 z-[60] flex flex-col items-center justify-start overflow-y-auto p-4 md:p-8 backdrop-blur-sm print:bg-white print:p-0 print:absolute print:inset-0 print:z-[100]">

            {/* Action Bar (Hidden when printing) */}
            <div className="w-full max-w-[210mm] flex justify-between items-center mb-6 print:hidden">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                    出帳單預覽
                    <span className="text-gray-400 text-sm font-normal">(共 {orders.length} 筆訂單)</span>
                </h2>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                        <X size={18} />
                        取消
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                        <Printer size={18} />
                        列印
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-lg shadow-blue-900/20 flex items-center gap-2"
                    >
                        <Check size={18} />
                        確認出帳
                    </button>
                </div>
            </div>

            {/* A4 Paper Container */}
            <div
                ref={componentRef}
                className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-2xl mx-auto p-[15mm] md:p-[20mm] relative text-gray-900 print:shadow-none print:w-full print:max-w-none print:mx-0"
            >
                {/* Header */}
                <div className="text-center mb-10 border-b border-gray-900 pb-6">
                    <h1 className="text-3xl font-black mb-2 tracking-wider">派遣服務費請款單</h1>
                    <p className="text-gray-500 font-serif italic text-sm">Dispatch Service Invoice</p>
                </div>

                {/* Info Grid */}
                <div className="flex justify-between items-end mb-8">
                    <div className="space-y-2">
                        <div className="text-sm">
                            <span className="text-gray-500 w-24 inline-block">請款人 (Driver):</span>
                            <span className="font-bold text-lg border-b border-gray-300 px-2 min-w-[120px] inline-block">{driverName}</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-500 w-24 inline-block">單號 (Inv #):</span>
                            <span className="font-mono font-bold text-gray-900 border-b border-gray-300 px-2 min-w-[120px] inline-block">{invoiceNumber || "PENDING"}</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-500 w-24 inline-block">日期 (Date):</span>
                            <span className="font-medium">{new Date().toLocaleDateString('zh-TW')}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">本期應付總額 (Total)</div>
                        <div className="text-4xl font-black font-mono">NT$ {totalAmount.toLocaleString()}</div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="mb-12">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-900 text-xs uppercase text-gray-600 font-bold">
                                <th className="py-2 w-16">No.</th>
                                <th className="py-2">訂單編號 (Order ID)</th>
                                <th className="py-2">日期 (Date)</th>
                                <th className="py-2">行程 (Route)</th>
                                <th className="py-2 text-right">金額 (Amount)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map((order, index) => (
                                <tr key={order.id} className="text-sm">
                                    <td className="py-3 text-gray-500 font-mono text-xs">{index + 1}</td>
                                    <td className="py-3 font-mono text-xs">{order.id}</td>
                                    <td className="py-3 text-gray-600">{order.date}</td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-1 text-xs text-gray-700 max-w-[200px] truncate">
                                            {order.from} <span className="text-gray-400">→</span> {order.to}
                                        </div>
                                    </td>
                                    <td className="py-3 text-right font-bold w-24">{order.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-gray-900">
                                <td colSpan={4} className="py-4 text-right font-bold text-gray-600 pr-4">合計 (Total)</td>
                                <td className="py-4 text-right font-black text-lg">NT$ {totalAmount.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Signatures */}
                <div className="mt-auto grid grid-cols-2 gap-20 pt-20">
                    <div className="space-y-8">
                        <div className="border-b-2 border-gray-300 h-10"></div>
                        <div className="text-center">
                            <p className="font-bold text-gray-900">請款人簽名</p>
                            <p className="text-xs text-gray-500 uppercase mt-1">Applicant Signature</p>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="border-b-2 border-gray-300 h-10"></div>
                        <div className="text-center">
                            <p className="font-bold text-gray-900">公司財務簽章</p>
                            <p className="text-xs text-gray-500 uppercase mt-1">Finance Dept. Approval</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-sm text-gray-500 border-t border-gray-100 pt-8">
                    <p>Generated by Skycar Dispatch System 派車調度管理系統</p>
                </div>
            </div>
        </div>
    );
}
