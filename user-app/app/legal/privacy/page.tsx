
'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
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
                    <h1 className="text-xl font-bold tracking-wide">隱私權政策</h1>
                </div>
            </div>

            <div className="px-6 py-8 relative z-10 space-y-6 text-sm text-gray-600 leading-relaxed text-justify">

                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-2">一、隱私權保護政策適用範圍</h2>
                    <p>
                        本隱私權政策內容，包括馳航派車系統（以下簡稱「本平台」）如何處理您在使用網站服務時收集到的個人識別資料。本政策不適用於本平台以外的相關連結網站，也不適用於非本平台所委託或參與管理的人員。
                    </p>
                </section>

                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-2">二、資料的蒐集與使用方式</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>為了提供您最佳的互動性服務（如預約叫車、行程管理），我們會請您提供相關個人的必要資料，範圍如下：姓名、聯絡電話、電子郵件地址、行程起訖點等。</li>
                        <li>除非取得您的同意或其他法令之特別規定，本平台絕不會將您的個人資料揭露予第三人或使用於蒐集目的以外之其他用途。</li>
                        <li>但若為完成服務之必要（如提供給承運之代僱駕駛），本平台將僅提供必要之聯絡資訊與行程資料予服務提供者。</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-2">三、資料之保護</h2>
                    <p>
                        本平台主機均設有防火牆、防毒系統等相關的各項資訊安全設備及必要的安全防護措施，加以保護網站及您的個人資料採用嚴格的保護措施，只由經過授權的人員才能接觸您的個人資料，相關處理人員皆簽有保密合約，如有違反保密義務者，將會受到相關的法律處分。
                    </p>
                </section>

                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-2">四、Cookie 之使用</h2>
                    <p>
                        為了提供您最佳的服務，本平台可能會在您的電腦中放置並取用我們的 Cookie，若您不願接受 Cookie 的寫入，您可在您使用的瀏覽器功能項中設定隱私權等級為高，即可拒絕 Cookie 的寫入，但可能會導致網站某些功能無法正常執行。
                    </p>
                </section>

                <section>
                    <h2 className="text-base font-bold text-gray-900 mb-2">五、隱私權保護政策之修正</h2>
                    <p>
                        本平台隱私權保護政策將因應需求隨時進行修正，修正後的條款將刊登於網站上。
                    </p>
                </section>

                <div className="pt-6 text-center">
                    <button
                        onClick={() => window.close()}
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all"
                    >
                        我已了解
                    </button>
                </div>
            </div>
        </div>
    );
}
