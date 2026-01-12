'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50 text-gray-900">
                    <h1 className="text-2xl font-bold mb-4">糟糕！發生了嚴重錯誤</h1>
                    <p className="text-gray-600 mb-8">系統遇到無法處理的問題。</p>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-left mb-6 w-full max-w-md overflow-auto">
                        <p className="font-bold text-red-800 text-sm">Error Message:</p>
                        <code className="text-xs text-red-600 block mt-1">{error.message}</code>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                    >
                        重新整理
                    </button>
                </div>
            </body>
        </html>
    );
}
