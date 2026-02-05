"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import toast from "react-hot-toast";

interface Category {
    id: number;
    name: string;
    image_url: string;
    slug: string;
}

export default function CategoriesManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to fetch categories");
            } else {
                setCategories(data || []);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const [editingId, setEditingId] = useState<number | null>(null);

    const resetForm = () => {
        setName("");
        setFile(null);
        setEditingId(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleEdit = (category: Category) => {
        setName(category.name);
        setEditingId(category.id);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) {
            console.error("Error deleting:", error);
            toast.error("Failed to delete category");
        } else {
            setCategories(categories.filter((cat) => cat.id !== id));
            toast.success("Category deleted successfully");
            if (editingId === id) resetForm();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        if (!file && !editingId) {
            toast.error("Category image is required for new categories");
            return;
        }

        const cloudName = CLOUD_NAME?.trim();
        const uploadPreset = UPLOAD_PRESET?.trim();

        if (!cloudName || !uploadPreset) {
            toast.error("Cloudinary configuration missing");
            return;
        }

        setUploading(true);
        const toastId = toast.loading(editingId ? "Updating category..." : "Creating category...");

        try {
            let imageUrl = "";

            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);

                const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
                const response = await fetch(uploadUrl, { method: "POST", body: formData });

                if (!response.ok) throw new Error("Image upload failed");

                const data = await response.json();
                imageUrl = data.secure_url;
            }

            const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            const updates: any = { name: name.trim(), slug };
            if (imageUrl) updates.image_url = imageUrl;

            if (editingId) {
                const { error } = await supabase
                    .from("categories")
                    .update(updates)
                    .eq("id", editingId);
                if (error) throw error;
                toast.success("Category updated successfully", { id: toastId });
            } else {
                const { error } = await supabase
                    .from("categories")
                    .insert([{ ...updates, image_url: imageUrl }]);
                if (error) throw error;
                toast.success("Category created successfully", { id: toastId });
            }

            resetForm();
            fetchCategories();

        } catch (error: any) {
            console.error("Error saving category:", error);
            toast.error(`Failed: ${error.message}`, { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Categories Manager</h1>
                    <p className="text-sm text-gray-500 mt-1">Add and manage product categories.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-8">
                        <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Add New Category</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Blue Sapphire"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#b38e5d] focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-[#b38e5d] transition-colors bg-slate-50">
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined text-4xl text-slate-400">cloud_upload</span>
                                        <span className="text-sm text-slate-600 font-medium">
                                            {file ? file.name : "Click to upload image"}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className={`flex-1 py-3 px-4 bg-[#b38e5d] text-white font-medium rounded-lg hover:bg-[#9a7b50] transition-colors flex items-center justify-center gap-2 ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {uploading ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                            {editingId ? "Updating..." : "Creating..."}
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">{editingId ? "save" : "add_circle"}</span>
                                            {editingId ? "Update Category" : "Create Category"}
                                        </>
                                    )}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="py-3 px-4 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-lg font-serif font-bold text-gray-900">Existing Categories</h3>
                        </div>

                        {loading ? (
                            <div className="text-center py-20 text-gray-400">Loading categories...</div>
                        ) : categories.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">No categories found. Add one to get started.</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {categories.map((category) => (
                                    <div key={category.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 bg-white">
                                            <Image
                                                src={category.image_url}
                                                alt={category.name}
                                                fill
                                                className="object-contain p-1"
                                                sizes="64px"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-gray-900 font-medium">{category.name}</h4>
                                            <p className="text-xs text-gray-500 font-mono">/{category.slug}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
                                            title="Delete Category"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all"
                                            title="Edit Category"
                                        >
                                            <span className="material-symbols-outlined">edit</span>
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
