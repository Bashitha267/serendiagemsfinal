"use client";

import { LayoutDashboard, Images, Package, Shapes, Diamond, Layers, Globe, User, FileText, HelpCircle, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh(); // clear client cache
    };

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50">
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
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/slider-manager"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <Images className="w-5 h-5" />
                        Manage Slide Images
                    </Link>
                    <Link
                        href="/admin/products"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <Package className="w-5 h-5" />
                        Manage Products
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <Shapes className="w-5 h-5" />
                        Manage Categories
                    </Link>
                    <Link
                        href="/admin/types"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <Diamond className="w-5 h-5" />
                        Manage Types
                    </Link>
                    <Link
                        href="/admin/shapes"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <Layers className="w-5 h-5" />
                        Manage Shapes
                    </Link>
                    <Link
                        href="/admin/legal"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <FileText className="w-5 h-5" />
                        Legal Pages
                    </Link>
                    <Link
                        href="/admin/faqs"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors"
                    >
                        <HelpCircle className="w-5 h-5" />
                        Manage FAQs
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-1">
                    <Link
                        href="/admin/settings"
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
            <main className="flex-1 overflow-auto ml-64">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
