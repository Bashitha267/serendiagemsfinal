"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    ShoppingCart,
    Clock,
    MoreHorizontal,
    Search,
    Filter
} from "lucide-react";
import toast from "react-hot-toast";

interface Order {
    id: number; // Or string if UUID
    created_at: string;
    customer_name: string;
    status: 'pending' | 'processing' | 'handed_over' | 'delivered';
    total: number;
    email?: string;
    phone?: string;
}

export default function OrdersManager() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredOrders(orders);
        } else {
            const lowerTerm = searchTerm.toLowerCase();
            const filtered = orders.filter(order =>
                order.customer_name.toLowerCase().includes(lowerTerm) ||
                String(order.id).toLowerCase().includes(lowerTerm) ||
                (order.email && order.email.toLowerCase().includes(lowerTerm))
            );
            setFilteredOrders(filtered);
        }
    }, [searchTerm, orders]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load orders");
            } else {
                setOrders(data || []);
                setFilteredOrders(data || []);
            }
        } catch (error) {
            console.error("Error:", error);
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

            const updateOrders = (list: Order[]) => list.map(order =>
                order.id === orderId ? { ...order, status: newStatus as any } : order
            );

            setOrders(updateOrders(orders));
            setFilteredOrders(updateOrders(filteredOrders));
            toast.success(`Order status updated to ${newStatus.replace('_', ' ')}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (orderId: number) => {
        if (!confirm('Are you sure you want to delete this order?')) return;

        try {
            const { error } = await supabase.from('orders').delete().eq('id', orderId);
            if (error) throw error;

            setOrders(orders.filter(o => o.id !== orderId));
            setFilteredOrders(filteredOrders.filter(o => o.id !== orderId));
            toast.success('Order deleted');
        } catch (error) {
            console.error("Error deleting order:", error);
            toast.error("Failed to delete order");
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

    const sendToWhatsApp = (order: Order) => {
        const shortId = String(order.id).slice(0, 8);
        const message = `*Order Update: #${shortId}*\n\nHello ${order.customer_name},\n\nYour order status is currently: *${getStatusLabel(order.status)}*.\nTotal: Rs. ${order.total.toLocaleString()}\n\nThank you for shopping with Serendia Gems!`;
        const url = `https://wa.me/${order.phone || ''}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Orders</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and track customer orders.</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#b38e5d] w-64"
                        />
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="p-2 text-gray-400 hover:text-[#b38e5d] transition-colors border border-slate-200 rounded-lg"
                        title="Refresh Orders"
                    >
                        <Clock className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading orders...</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No orders found.</td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            #{String(order.id).slice(0, 8)}
                                            {String(order.id).length > 8 && "..."}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {order.customer_name}
                                            {order.phone && <div className="text-xs text-gray-400">{order.phone}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                                            Rs. {order.total?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => sendToWhatsApp(order)}
                                                    className="p-1 text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                                                    title="Send Update via WhatsApp"
                                                >
                                                    <span className="material-symbols-outlined text-lg">chat</span>
                                                </button>

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
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete Order"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
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
