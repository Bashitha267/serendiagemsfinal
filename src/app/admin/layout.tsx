"use client";

import { useState } from "react";
import { LayoutDashboard, Images, Package, Shapes, Diamond, Layers, Globe, User, FileText, HelpCircle, Settings, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh(); // clear client cache
    };

    return (
        <div className="flex h-screen bg-slate-50 relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-[51] p-2.5 bg-white rounded-lg shadow-sm border border-slate-200 md:hidden hover:bg-slate-50 active:scale-95 transition-all text-gray-600"
                aria-label="Toggle Navigation"
            >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Sidebar */}
            <aside className={`
                w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50
                transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <Link href="/" className="text-xl font-serif font-bold text-gray-900">
                            Serendia<span className="text-[#b38e5d]">.</span>
                        </Link>
                        <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">Admin Panel</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <Link
                        href="/admin"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/slider-manager"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <Images className="w-5 h-5" />
                        Manage Slide Images
                    </Link>
                    <Link
                        href="/admin/products"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <Package className="w-5 h-5" />
                        Manage Products
                    </Link>
                    <Link
                        href="/admin/categories"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <Shapes className="w-5 h-5" />
                        Manage Categories
                    </Link>
                    <Link
                        href="/admin/types"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <Diamond className="w-5 h-5" />
                        Manage Types
                    </Link>
                    <Link
                        href="/admin/shapes"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <Layers className="w-5 h-5" />
                        Manage Shapes
                    </Link>
                    <Link
                        href="/admin/legal"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <FileText className="w-5 h-5" />
                        Legal Pages
                    </Link>
                    <Link
                        href="/admin/faqs"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <HelpCircle className="w-5 h-5" />
                        Manage FAQs
                    </Link>
                    <Link
                        href="/admin/reviews"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">reviews</span>
                        Manage Reviews
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-1">
                    <Link
                        href="/admin/settings"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors text-left"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>

                    <div className="h-px bg-slate-100 my-2" />

                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <Globe className="w-5 h-5" />
                        Go to Live Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto md:ml-64 transition-all duration-300">
                <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
