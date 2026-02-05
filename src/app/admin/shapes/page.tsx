"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface Shape {
    id: number;
    name: string;
    slug: string;
}

export default function ShapesManager() {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchShapes();
    }, []);

    const fetchShapes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("shapes")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching shapes:", error);
                toast.error("Failed to fetch shapes");
            } else {
                setShapes(data || []);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Shape name is required");
            return;
        }

        setSubmitting(true);
        const toastId = toast.loading("Creating shape...");

        try {
            const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

            const { error } = await supabase.from("shapes").insert([{
                name: name.trim(),
                slug: slug
            }]);

            if (error) throw error;

            toast.success("Shape created successfully", { id: toastId });
            setName("");
            fetchShapes();

        } catch (error: any) {
            console.error("Error creating shape:", error);
            toast.error(`Failed to create shape: ${error.message}`, { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this shape?")) return;

        const { error } = await supabase.from("shapes").delete().eq("id", id);
        if (error) {
            console.error("Error deleting:", error);
            toast.error("Failed to delete shape");
        } else {
            setShapes(shapes.filter((s) => s.id !== id));
            toast.success("Shape deleted successfully");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Shapes Manager</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage gemstone shapes (e.g. Oval, Cushion).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-8">
                        <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Add New Shape</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Oval"
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
                                        Create Shape
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
                            <h3 className="text-lg font-serif font-bold text-gray-900">Existing Shapes</h3>
                        </div>

                        {loading ? (
                            <div className="text-center py-20 text-gray-400">Loading shapes...</div>
                        ) : shapes.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">No shapes found. Add one to get started.</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {shapes.map((shape) => (
                                    <div key={shape.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                        <div>
                                            <h4 className="text-gray-900 font-medium">{shape.name}</h4>
                                            <p className="text-xs text-gray-500 font-mono">/{shape.slug}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(shape.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                            title="Delete Shape"
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
