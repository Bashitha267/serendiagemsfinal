"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function EditFAQPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [displayOrder, setDisplayOrder] = useState("0");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id) {
            fetchFAQ();
        }
    }, [id]);

    const fetchFAQ = async () => {
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setQuestion(data.question);
                setAnswer(data.answer);
                setDisplayOrder(data.display_order.toString());
            }
        } catch (error) {
            console.error('Error fetching FAQ:', error);
            // toast.error('Failed to load FAQ'); 
            router.push('/admin/faqs');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!question.trim() || !answer.trim()) {
            toast.error("Please fill in both question and answer");
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('faqs')
                .update({
                    question,
                    answer,
                    display_order: parseInt(displayOrder) || 0,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            toast.success('FAQ updated successfully');
            router.push('/admin/faqs');
        } catch (error) {
            console.error('Error saving FAQ:', error);
            toast.error('Failed to update FAQ');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#b38e5d]" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/faqs"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-gray-900">Edit FAQ</h1>
                        <p className="text-sm text-gray-500 mt-1">Update frequently asked question</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#b38e5d] text-white rounded-lg hover:bg-[#a07d4f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question
                    </label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b38e5d]/20 focus:border-[#b38e5d]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Answer
                    </label>
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b38e5d]/20 focus:border-[#b38e5d]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Order
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Lower numbers appear first</p>
                    <input
                        type="number"
                        value={displayOrder}
                        onChange={(e) => setDisplayOrder(e.target.value)}
                        className="w-32 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b38e5d]/20 focus:border-[#b38e5d]"
                    />
                </div>
            </div>
        </div>
    );
}
