"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import {
    LayoutDashboard,
    ClipboardList,
    Car,
    Users,
    Settings,
    Bell,
    User,
    LogOut,
    ChevronRight,
    ChevronDown,
    BarChart3,
    Wallet,
    Truck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SystemActivityProvider } from "./context/SystemActivityContext";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationPopover from "./components/NotificationPopover";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    return (
        <SystemActivityProvider>
            <NotificationProvider>
                <div className="flex h-screen bg-gray-50 font-sans text-slate-900">
                    {/* Sidebar - Figma Aligned Dark Theme */}
                    <aside className="w-64 bg-[#1e2124] text-white flex flex-col shadow-xl z-20 transition-all duration-300 flex-shrink-0">
                        <div className="h-16 flex items-center px-6 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                                    <Car className="text-white" size={18} />
                                </div>
                                <span className="text-lg font-bold tracking-wide text-gray-100">SKYCAR</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                            <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="儀表板" />

                            <Suspense fallback={<div className="h-10 bg-gray-800/50 rounded animate-pulse" />}>
                                <NavGroup icon={<ClipboardList size={20} />} label="訂單管理" basePath="/orders" mainHref="/orders?status=unconfirmed">
                                    <SubNavItem href="/orders?status=unconfirmed" label="未確認訂單" />
                                    <SubNavItem href="/orders?status=confirmed" label="已確認訂單" />
                                    <SubNavItem href="/orders?status=completed" label="已完成訂單" />
                                    <SubNavItem href="/orders?status=refund" label="退費訂單審核" />

                                    <SubNavItem href="/orders?status=trash" label="垃圾桶" />
                                </NavGroup>
                            </Suspense>

                            <Suspense fallback={<div className="h-10 bg-gray-800/50 rounded animate-pulse" />}>
                                <NavGroup icon={<Car size={20} />} label="司機管理" basePath="/drivers" mainHref="/drivers">
                                    <SubNavItem href="/drivers?status=all" label="司機名單" />
                                    <SubNavItem href="/drivers?status=audit" label="審核名單" />
                                    <SubNavItem href="/drivers?status=rejected" label="審核不通過" />
                                </NavGroup>
                            </Suspense>
                            <NavItem href="/users" icon={<Users size={20} />} label="用戶管理" />

                            <Suspense fallback={<div className="h-10 bg-gray-800/50 rounded animate-pulse" />}>
                                <NavGroup icon={<Truck size={20} />} label="前台管理" activePaths={["/vehicles", "/coupons"]} mainHref="/vehicles">
                                    <SubNavItem href="/vehicles" label="價格管理" />
                                    <SubNavItem href="/coupons" label="優惠卷管理" />
                                </NavGroup>
                            </Suspense>
                            <NavItem href="/finance" icon={<Wallet size={20} />} label="財務管理" />
                            <NavItem href="/notifications" icon={<Bell size={20} />} label="通知中心" />
                            <NavItem href="/analytics" icon={<BarChart3 size={20} />} label="數據分析" />
                            <NavItem href="/settings" icon={<Settings size={20} />} label="系統設定" />
                        </div>

                        <div className="p-4 border-t border-gray-800 bg-[#1a1d20]">
                            <div className="flex items-center gap-3 px-2">
                                <div className="w-9 h-9 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center">
                                    <User size={18} className="text-gray-300" />
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <p className="text-sm font-medium text-white truncate">Admin</p>
                                    <p className="text-xs text-gray-400 truncate">總管理員</p>
                                </div>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-[#f3f4f6]">
                        {/* Header */}
                        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>管理後台</span>
                                <ChevronRight size={14} />
                                <span className="text-gray-900 font-medium">儀表板</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <NotificationPopover />
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
            </NotificationProvider>
        </SystemActivityProvider>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group mb-1",
                isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
        >
            <span className={cn("transition-transform duration-200", !isActive && "group-hover:scale-110")}>{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}

function NavGroup({ icon, label, children, basePath, activePaths, mainHref }: { icon: React.ReactNode; label: string; children: React.ReactNode; basePath?: string; activePaths?: string[]; mainHref?: string }) {
    const pathname = usePathname();
    // Open if current path starts with basePath or matches any of activePaths
    const isActive = basePath ? pathname.startsWith(basePath) : (activePaths ? activePaths.some(path => pathname.startsWith(path)) : false);
    const [isOpen, setIsOpen] = useState(isActive);

    return (
        <div className="mb-1">
            <div className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isOpen ? "text-white bg-gray-800/50" : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}>
                <Link href={mainHref || "#"} className="flex items-center gap-3 flex-1">
                    <span className={cn("transition-transform duration-200", !isOpen && "group-hover:scale-110")}>{icon}</span>
                    <span className="text-sm font-medium">{label}</span>
                </Link>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    className="p-1 hover:bg-gray-700 rounded"
                >
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
            </div>

            {isOpen && (
                <div className="mt-1 ml-4 pl-4 border-l border-gray-700 space-y-1 animate-in slide-in-from-left-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}



// ... AdminLayout code

function SubNavItem({ href, label }: { href: string; label: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isActive = (() => {
        if (!pathname) return false;

        // Split href into path and query
        const [linkPath, linkQuery] = href.split('?');

        // Check if path matches
        if (pathname !== linkPath) return false;

        // If no query in link, it's a match (assuming strict path match)
        if (!linkQuery) return true;

        // Check if all params in link are present and equal in current URL
        const linkParams = new URLSearchParams(linkQuery);
        for (const [key, value] of Array.from(linkParams.entries())) {
            if (searchParams.get(key) !== value) {
                return false;
            }
        }

        return true;
    })();

    return (
        <Link
            href={href}
            className={cn(
                "block px-3 py-2 rounded-md text-sm transition-colors",
                isActive ? "text-blue-400 font-medium bg-blue-900/20" : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"
            )}
        >
            {label}
        </Link>
    );
}
