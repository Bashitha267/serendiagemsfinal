"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FileText, Edit, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface LegalPage {
    id: string;
    title: string;
    slug: string;
    updated_at: string;
}

export default function LegalPagesAdmin() {
    const [pages, setPages] = useState<LegalPage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const { data, error } = await supabase
                .from('legal_pages')
                .select('id, title, slug, updated_at')
                .order('title');

            if (error) throw error;
            setPages(data || []);
        } catch (error) {
            console.error('Error fetching legal pages:', error);
            // toast.error('Failed to load legal pages'); 
            // Commented out to avoid instant error if table doesn't exist yet
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Legal Pages</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage Privacy Policy and Terms of Service</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Page Title</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Updated</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Loading...
                                        </div>
                                    </td>
                                </tr>
                            ) : pages.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        No legal pages found. Please run the migration script.
                                    </td>
                                </tr>
                            ) : (
                                pages.map((page) => (
                                    <tr key={page.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{page.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">/{page.slug}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(page.updated_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/legal/${page.id}`}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-[#b38e5d] rounded-lg hover:bg-[#a07d4f] transition-colors"
                                            >
                                                <Edit className="w-3 h-3" />
                                                Edit Content
                                            </Link>
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
