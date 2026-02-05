"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { HelpCircle, Plus, Edit, Trash2, Loader2, ArrowUpDown } from "lucide-react";
import toast from "react-hot-toast";

interface FAQ {
    id: string;
    question: string;
    answer: string;
    display_order: number;
    updated_at: string;
}

export default function FAQsAdmin() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('display_order', { ascending: true })
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setFaqs(data || []);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            // toast.error('Failed to load FAQs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

        setDeleting(id);
        try {
            const { error } = await supabase
                .from('faqs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('FAQ deleted successfully');
            setFaqs(faqs.filter(faq => faq.id !== id));
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            toast.error('Failed to delete FAQ');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Manage FAQs</h1>
                    <p className="text-sm text-gray-500 mt-1">Add, edit, or remove frequently asked questions</p>
                </div>
                <Link
                    href="/admin/faqs/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#b38e5d] text-white rounded-lg hover:bg-[#a07d4f] transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add New FAQ
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-16 text-center">Order</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Question</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider max-w-xs">Answer Preview</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Loading FAQs...
                                        </div>
                                    </td>
                                </tr>
                            ) : faqs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        No FAQs found. Please run the migration script or add a new one.
                                    </td>
                                </tr>
                            ) : (
                                faqs.map((faq) => (
                                    <tr key={faq.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-center text-gray-500 font-mono text-xs">
                                            {faq.display_order}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-600 mt-0.5">
                                                    <HelpCircle className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 line-clamp-2">{faq.question}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                            <p className="line-clamp-2">{faq.answer}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/faqs/${faq.id}`}
                                                    className="p-2 text-gray-400 hover:text-[#b38e5d] hover:bg-slate-50 rounded-lg transition-colors"
                                                    title="Edit FAQ"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(faq.id)}
                                                    disabled={deleting === faq.id}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete FAQ"
                                                >
                                                    {deleting === faq.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
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
