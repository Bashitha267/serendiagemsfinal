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
    const [orders, setOrders] = useState<Order[]>([]);
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
                .select('*', { count: 'exact', head: true });

            const { count: ordersCount } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true });

            setStats({
                totalOrders: ordersCount || 0,
                totalProducts: productsCount || 0,
                totalCategories: categoriesCount || 0
            });

            // Fetch Recent Orders
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (ordersError) {
                console.error("Error fetching orders:", ordersError);
                // Don't show toast on 404/missing table to avoid clutter if table doesn't exist yet
            } else {
                setOrders(ordersData || []);
            }

        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus as any } : order
            ));
            toast.success(`Order status updated to ${newStatus.replace('_', ' ')}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'handed_over': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'handed_over': return 'Handed to Delivery';
            default: return status.charAt(0).toUpperCase() + status.slice(1);
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

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                    <div className="flex gap-2">
                        {/* Filter placeholders could go here */}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading orders...</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No orders found.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{order.customer_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                                            ${order.total?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative inline-block text-left group">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="appearance-none bg-white border border-slate-200 text-gray-700 py-1 pl-3 pr-8 rounded leading-tight focus:outline-none focus:border-[#b38e5d] text-xs cursor-pointer"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="handed_over">Handed Over</option>
                                                    <option value="delivered">Delivered</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <MoreHorizontal className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
