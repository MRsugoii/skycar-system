
'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 pb-10 text-gray-900 max-w-[420px] mx-auto relative overflow-hidden flex flex-col">

            {/* Header */}
            <div className="bg-blue-600 px-4 pt-8 pb-10 text-white rounded-b-[40px] shadow-lg sticky top-0 z-20 mb-[-20px]">
                <div className="relative flex items-center justify-center">
                    <button
                        onClick={() => window.close()}
                        className="absolute left-2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition shadow-inner"
                    >
                        <ChevronLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-xl font-bold tracking-wide">預約服務條款</h1>
                </div>
            </div>

            <div className="px-6 py-8 relative z-10 space-y-6 text-sm text-gray-600 leading-relaxed text-justify">

                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-2">一、服務內容與契約成立</h2>
                    <p>
                        歡迎使用馳航派車系統（以下簡稱「本平台」）。本平台提供媒合乘客與租賃車代僱駕駛之服務。當您完成預約並收到系統確認通知時，即視為您與代僱駕駛間之運送契約已成立。
                    </p>
                </section>

                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-2">二、費用與付款</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>本平台顯示之預估車資包含過路費、油資及代僱駕駛費用，但不包含停車費、舉牌費、安全座椅加價等額外服務費用，除非另有說明。</li>
                        <li>若行程中有額外停靠點或變更路線，駕駛有權依實際里程與時間調整最終收費。</li>
                        <li>夜間加成（22:00-06:00）、偏遠地區加價及特殊節日加價將依平台公告標準計算。</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-2">三、乘客義務</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>乘客應如實告知搭乘人數、行李件數及是否需要安全座椅。若現場人數或行李超出車輛負載，駕駛有權拒絕載運，且不予退費。</li>
                        <li>車內禁止吸菸、飲食（礦泉水除外）及攜帶違禁品。若造成車輛污損，乘客需負擔清潔費用（新台幣 3,000 元起）。</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-2">四、取消與退費政策</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>於預約用車時間前 24 小時取消，全額退費。</li>
                        <li>於預約用車時間前 12-24 小時內取消，收取 50% 車資。</li>
                        <li>於預約用車時間前 12 小時內取消或未出現（No Show），收取 100% 車資，不予退費。</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-2">五、免責聲明</h2>
                    <p>
                        如因天災、交通管制、車輛故障等不可抗力因素導致無法提供服務，本平台將協助安排其他車輛或全額退費，但不負擔額外賠償責任。
                    </p>
                </section>

                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-2">六、準據法與管轄法院</h2>
                    <p>
                        本條款之解釋與適用，均應依照中華民國法律。如因本服務衍生之爭議，雙方同意以台灣台北地方法院為第一審管轄法院。
                    </p>
                </section>

                <div className="pt-6 text-center">
                    <button
                        onClick={() => window.close()}
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all"
                    >
                        我已了解並同意
                    </button>
                </div>
            </div>
        </div>
    );
}
