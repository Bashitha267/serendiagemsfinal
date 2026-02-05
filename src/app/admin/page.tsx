"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
    LayoutDashboard,
    Package,
    Shapes,
    ShoppingCart,
    Clock,
    CheckCircle2,
    Truck,
    MoreHorizontal,
    FileText
} from "lucide-react";
import toast from "react-hot-toast";

interface Order {
    id: number;
    created_at: string;
    customer_name: string;
    status: 'pending' | 'processing' | 'handed_over' | 'delivered';
    total: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalCategories: 0
    });
    const [popularProducts, setPopularProducts] = useState<{ name: string, clicks: number }[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch Counts
            const { count: productsCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            const { count: categoriesCount } = await supabase
                .from('categories')
                .select('*', { count: 'exact', head: true })
                .neq('slug', 'fine-gems');

            const { count: ordersCount } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true });

            setStats({
                totalOrders: ordersCount || 0,
                totalProducts: productsCount || 0,
                totalCategories: categoriesCount || 0
            });



            // Fetch Popularity Data
            const { data: popularityData } = await supabase
                .from('popularity')
                .select('*');

            if (popularityData) {
                // Aggregate Product Clicks
                const productClicks: Record<string, number> = {};
                const categoryClicks: Record<string, number> = {};

                popularityData.forEach(item => {
                    if (item.item_type === 'product') {
                        productClicks[item.item_id] = (productClicks[item.item_id] || 0) + 1;
                    } else if (item.item_type === 'category') {
                        categoryClicks[item.item_id] = (categoryClicks[item.item_id] || 0) + 1;
                    }
                });

                // Top 5 Products
                const topProductIds = Object.keys(productClicks).sort((a, b) => productClicks[b] - productClicks[a]).slice(0, 5);
                if (topProductIds.length > 0) {
                    const { data: products } = await supabase
                        .from('products')
                        .select('id, name')
                        .in('id', topProductIds);

                    if (products) {
                        const mappedProducts = topProductIds.map(id => {
                            const p = products.find(p => p.id.toString() === id); // id might be num or string
                            return p ? { name: p.name, clicks: productClicks[id] } : null;
                        }).filter(Boolean) as { name: string, clicks: number }[];
                        setPopularProducts(mappedProducts);
                    }
                }
            }

        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back, Admin</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="p-2 text-gray-400 hover:text-[#b38e5d] transition-colors"
                >
                    <Clock className="w-5 h-5" />
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Orders</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</h3>
                    </div>
                    <div className="w-12 h-12 bg-[#b38e5d]/10 rounded-full flex items-center justify-center text-[#b38e5d]">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                </div>

                <Link
                    href="/admin/products"
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-[#b38e5d]/50 transition-all cursor-pointer group"
                >
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider group-hover:text-[#b38e5d] transition-colors">Total Products</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-[#b38e5d]/10 group-hover:text-[#b38e5d] transition-colors">
                        <Package className="w-6 h-6" />
                    </div>
                </Link>

                <Link
                    href="/admin/categories"
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-[#b38e5d]/50 transition-all cursor-pointer group"
                >
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider group-hover:text-[#b38e5d] transition-colors">Total Categories</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCategories}</h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 group-hover:bg-[#b38e5d]/10 group-hover:text-[#b38e5d] transition-colors">
                        <Shapes className="w-6 h-6" />
                    </div>
                </Link>

                <Link
                    href="/admin/legal"
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-[#b38e5d]/50 transition-all cursor-pointer group"
                >
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider group-hover:text-[#b38e5d] transition-colors">Legal Pages</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">2</h3>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 group-hover:bg-[#b38e5d]/10 group-hover:text-[#b38e5d] transition-colors">
                        <FileText className="w-6 h-6" />
                    </div>
                </Link>
            </div>

            {/* Popularity Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Most Clicked Products */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Most Clicked Products</h3>
                    <div className="space-y-3">
                        {popularProducts.length === 0 ? (
                            <p className="text-sm text-gray-500">No data yet.</p>
                        ) : (
                            popularProducts.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                    <span className="text-xs font-bold text-[#b38e5d] bg-[#b38e5d]/10 px-2 py-1 rounded-full">{item.clicks} clicks</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Orders Table removed */}
        </div>
    );
}
