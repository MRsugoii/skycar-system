'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">發生了一些錯誤</h2>
            <p className="text-gray-500 mb-6">我們無法載入此頁面。</p>
            <button
                onClick={() => {
                    sessionStorage.clear();
                    window.location.href = '/login';
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
            >
                清除資料並重新登入
            </button>
            <p className="mt-4 text-xs text-gray-400">Error: {error.message}</p>
        </div>
    );
}
