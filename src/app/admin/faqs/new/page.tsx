"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function NewFAQPage() {
    const router = useRouter();
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [displayOrder, setDisplayOrder] = useState("0");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!question.trim() || !answer.trim()) {
            toast.error("Please fill in both question and answer");
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('faqs')
                .insert([{
                    question,
                    answer,
                    display_order: parseInt(displayOrder) || 0
                }]);

            if (error) throw error;
            toast.success('FAQ added successfully');
            router.push('/admin/faqs');
        } catch (error) {
            console.error('Error saving FAQ:', error);
            toast.error('Failed to create FAQ');
        } finally {
            setSaving(false);
        }
    };

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
                        <h1 className="text-2xl font-serif font-bold text-gray-900">Add New FAQ</h1>
                        <p className="text-sm text-gray-500 mt-1">Create a new frequently asked question</p>
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
                            Save
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
                        placeholder="e.g., What is your return policy?"
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
                        placeholder="Type the answer here..."
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
