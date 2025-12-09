export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">此頁面功能開發中...</p>
        </div>
      </div>
      <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🚧</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900">功能建置中</h3>
        <p className="text-gray-500 mt-2 max-w-sm">
            我們正在努力開發 {title} 功能，請稍後再回來查看。
        </p>
      </div>
    </div>
  );
}
