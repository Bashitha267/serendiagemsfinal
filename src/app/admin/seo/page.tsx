'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface SEOMetadata {
    path: string;
    title: string;
    description: string | null;
    og_image: string | null;
}

export default function AdminSEOPage() {
    const [metadataList, setMetadataList] = useState<SEOMetadata[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<SEOMetadata | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState<SEOMetadata>({
        path: '',
        title: '',
        description: '',
        og_image: ''
    });

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('seo_metadata')
            .select('*')
            .order('path');

        if (error) {
            toast.error('Failed to fetch SEO data');
            console.error(error);
        } else {
            setMetadataList(data || []);
        }
        setLoading(false);
    };

    const handleEdit = (item: SEOMetadata) => {
        setEditingItem(item);
        setFormData(item);
        setIsCreating(false);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setFormData({ path: '/', title: '', description: '', og_image: '' });
        setIsCreating(true);
    };

    const handleCancel = () => {
        setEditingItem(null);
        setIsCreating(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isNew = isCreating;

        try {
            const { error } = await supabase
                .from('seo_metadata')
                .upsert({
                    path: formData.path,
                    title: formData.title,
                    description: formData.description || null,
                    og_image: formData.og_image || null,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            toast.success(isNew ? 'SEO Tag Created' : 'SEO Tag Updated');
            fetchMetadata();
            handleCancel();

            // Trigger revalidation ideally via server action, but for now client refresh
            router.refresh();

        } catch (error) {
            toast.error('Error saving data');
            console.error(error);
        }
    };

    const handleDelete = async (path: string) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;

        const { error } = await supabase.from('seo_metadata').delete().eq('path', path);
        if (error) {
            toast.error("Failed to delete");
        } else {
            toast.success("Deleted successfully");
            fetchMetadata();
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">SEO Management</h1>
                    <p className="text-sm text-gray-500">Manage meta tags for your pages dynamically.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-[#b38e5d] text-white rounded-lg text-sm font-bold hover:bg-[#967d54] transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add New Page
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Section */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-700">Path</th>
                                    <th className="px-6 py-4 font-bold text-gray-700">Title</th>
                                    <th className="px-6 py-4 font-bold text-gray-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={3} className="p-6 text-center text-gray-400">Loading...</td></tr>
                                ) : metadataList.length === 0 ? (
                                    <tr><td colSpan={3} className="p-6 text-center text-gray-400">No SEO tags found. Add one to get started.</td></tr>
                                ) : (
                                    metadataList.map((item) => (
                                        <tr key={item.path} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-[#1152d4]">{item.path}</td>
                                            <td className="px-6 py-4 text-gray-900 font-medium max-w-[200px] truncate">{item.title}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-gray-400 hover:text-[#b38e5d] transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.path)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Editor Section */}
                <div className="lg:col-span-1">
                    {(isCreating || editingItem) ? (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-slate-100 pb-4">
                                {isCreating ? 'Add New Tag' : 'Edit Tag'}
                            </h2>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Page Path</label>
                                    <input
                                        type="text"
                                        required
                                        disabled={!isCreating}
                                        value={formData.path}
                                        onChange={e => setFormData({ ...formData, path: e.target.value })}
                                        placeholder="/about"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#b38e5d] disabled:opacity-60 disabled:cursor-not-allowed font-mono"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Use exact path like / or /collections</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Meta Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Page Title | Brand Name"
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#b38e5d]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Meta Description</label>
                                    <textarea
                                        rows={4}
                                        value={formData.description || ''}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="A brief summary of the page content..."
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#b38e5d] resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">OG Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.og_image || ''}
                                        onChange={e => setFormData({ ...formData, og_image: e.target.value })}
                                        placeholder="/hero/image.jpg"
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#b38e5d]"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 px-4 py-3 border border-slate-200 text-gray-600 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-[#1152d4] text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/10"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center text-gray-400">
                            <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">edit_document</span>
                            <p className="text-sm">Select an item to edit or create a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
