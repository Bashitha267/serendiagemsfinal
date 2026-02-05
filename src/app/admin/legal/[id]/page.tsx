"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface PageProps {
    params: {
        id: string;
    };
}

export default function EditLegalPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id) {
            fetchPage();
        }
    }, [id]);

    const fetchPage = async () => {
        try {
            const { data, error } = await supabase
                .from('legal_pages')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setTitle(data.title);
                setContent(data.content || "");
            }
        } catch (error) {
            console.error('Error fetching page:', error);
            // toast.error('Failed to load page');
            router.push('/admin/legal');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('legal_pages')
                .update({
                    content,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            toast.success('Page updated successfully');
            router.push('/admin/legal');
        } catch (error) {
            console.error('Error saving page:', error);
            toast.error('Failed to save changes');
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
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/legal"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-gray-900">Edit {title}</h1>
                        <p className="text-sm text-gray-500 mt-1">Update the content for this page</p>
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

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Page Content (HTML support)
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                        You can use HTML tags like &lt;h1&gt;, &lt;p&gt;, &lt;ul&gt;, etc. to format the text.
                    </p>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={20}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b38e5d]/20 focus:border-[#b38e5d] font-mono text-sm"
                        placeholder="Enter page content here..."
                    />
                </div>
            </div>
        </div>
    );
}
