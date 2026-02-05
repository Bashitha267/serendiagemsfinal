"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface Type {
    id: number;
    name: string;
    slug: string;
}

export default function TypesManager() {
    const [types, setTypes] = useState<Type[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("types")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching types:", error);
                toast.error("Failed to fetch types");
            } else {
                setTypes(data || []);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Type name is required");
            return;
        }

        setSubmitting(true);
        const toastId = toast.loading("Creating type...");

        try {
            const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

            const { error } = await supabase.from("types").insert([{
                name: name.trim(),
                slug: slug
            }]);

            if (error) throw error;

            toast.success("Type created successfully", { id: toastId });
            setName("");
            fetchTypes();

        } catch (error: any) {
            console.error("Error creating type:", error);
            toast.error(`Failed to create type: ${error.message}`, { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this type?")) return;

        const { error } = await supabase.from("types").delete().eq("id", id);
        if (error) {
            console.error("Error deleting:", error);
            toast.error("Failed to delete type");
        } else {
            setTypes(types.filter((t) => t.id !== id));
            toast.success("Type deleted successfully");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Types Manager</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage gemstone types (e.g. Unheated, Natural).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-8">
                        <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Add New Type</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Unheated"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#b38e5d] focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-3 px-4 bg-[#b38e5d] text-white font-medium rounded-lg hover:bg-[#9a7b50] transition-colors flex items-center justify-center gap-2 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {submitting ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">add_circle</span>
                                        Create Type
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-lg font-serif font-bold text-gray-900">Existing Types</h3>
                        </div>

                        {loading ? (
                            <div className="text-center py-20 text-gray-400">Loading types...</div>
                        ) : types.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">No types found. Add one to get started.</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {types.map((type) => (
                                    <div key={type.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                        <div>
                                            <h4 className="text-gray-900 font-medium">{type.name}</h4>
                                            <p className="text-xs text-gray-500 font-mono">/{type.slug}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(type.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                            title="Delete Type"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
