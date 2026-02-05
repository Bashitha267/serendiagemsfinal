"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

// ... imports

interface Product {
    id: number;
    name: string;
    price: number;
    images: string[];
    category: { name: string } | null;
    type: { name: string } | null;
    shape: { name: string } | null;
}

export default function ProductsManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("products")
                .select(`
                    id,
                    name,
                    price,
                    images,
                    category:category_id(name),
                    type:type_id(name),
                    shape:shape_id(name)
                `)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching products:", error);
            } else {
                const formattedData = (data as any[]).map(item => ({
                    ...item,
                    category: Array.isArray(item.category) ? item.category[0] : item.category,
                    type: Array.isArray(item.type) ? item.type[0] : item.type,
                    shape: Array.isArray(item.shape) ? item.shape[0] : item.shape,
                }));
                setProducts(formattedData);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) {
            console.error("Error deleting:", error);
            toast.error("Failed to delete product");
        } else {
            setProducts(products.filter((p) => p.id !== id));
            toast.success("Product deleted successfully");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Products Manager</h1>
                    <p className="text-sm text-gray-500 mt-1">Add, edit, and manage your gemstone inventory.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="px-5 py-2.5 bg-[#b38e5d] text-white font-medium rounded-lg hover:bg-[#9a7b50] transition-colors flex items-center gap-2 shadow-sm"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                    Add Product
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type / Shape</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading inventory...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No products found. Click "Add Product" to create one.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-white">
                                                {product.images && product.images[0] ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                                        <span className="material-symbols-outlined text-sm">image</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900 font-medium block max-w-[200px] truncate">{product.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                {product.category?.name || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className="text-gray-600">Tip: {product.type?.name || "-"}</span>
                                                <span className="text-gray-500">Shape: {product.shape?.name || "-"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                            ${product.price ? product.price.toLocaleString() : "0"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                                title="Delete Product"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
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
