import Link from "next/link";
import { LayoutDashboard, Users, Car, ClipboardList, Settings, Bell, User } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-sm z-10">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Car className="text-white" size={20} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Dispatch<span className="text-blue-600">Pro</span></h1>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="儀表板 (Dashboard)" />
                    <NavItem href="/orders" icon={<ClipboardList size={20} />} label="訂單管理 (Orders)" />
                    <NavItem href="/drivers" icon={<Car size={20} />} label="司機管理 (Drivers)" />
                    <NavItem href="/users" icon={<Users size={20} />} label="用戶管理 (Users)" />
                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                        <NavItem href="/settings" icon={<Settings size={20} />} label="系統設定 (Settings)" />
                    </div>
                </nav>
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                            <User size={20} className="text-gray-500" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Admin User</p>
                            <p className="text-xs text-gray-500 truncate">admin@dispatch.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 shadow-sm z-10">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">管理控制台</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full relative transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200 group"
        >
            <span className="group-hover:scale-110 transition-transform duration-200">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}
