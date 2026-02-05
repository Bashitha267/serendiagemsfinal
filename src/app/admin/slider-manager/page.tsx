"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import toast from "react-hot-toast";
import { Upload, Trash } from "lucide-react";

interface HeroImage {
    id: number;
    image_url: string;
}

export default function SliderManager() {
    const [images, setImages] = useState<HeroImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("hero_images")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching images:", error);
                toast.error("Failed to fetch images");
            } else {
                setImages(data || []);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!CLOUD_NAME || !UPLOAD_PRESET) {
            toast.error("Cloudinary configuration missing");
            return;
        }

        setUploading(true);
        const toastId = toast.loading("Uploading image...");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();
            if (data.secure_url) {
                await saveToSupabase(data.secure_url);
                toast.success("Image uploaded successfully", { id: toastId });
            } else {
                console.error("Upload failed:", data);
                toast.error("Failed to upload image", { id: toastId });
            }
        } catch (error) {
            console.error("Error uploading:", error);
            toast.error("Error uploading image", { id: toastId });
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    const saveToSupabase = async (url: string) => {
        const { error } = await supabase.from("hero_images").insert([{ image_url: url }]);
        if (error) {
            console.error("Error saving to Supabase:", error);
            toast.error("Failed to save image record");
        } else {
            fetchImages();
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        const { error } = await supabase.from("hero_images").delete().eq("id", id);
        if (error) {
            console.error("Error deleting:", error);
            toast.error("Failed to delete image");
        } else {
            setImages(images.filter((img) => img.id !== id));
            toast.success("Image deleted successfully");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Slider Manager</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage the images displayed on the home page hero slider.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Image</label>
                    <div className="flex items-center gap-4">
                        <label className={`flex items-center gap-2 px-4 py-2 bg-[#b38e5d] text-white rounded-lg cursor-pointer hover:bg-[#9a7b50] transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <Upload className="w-5 h-5" />
                            <span>{uploading ? "Uploading..." : "Select Image"}</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                        </label>
                        <div className="text-xs text-gray-400">
                            Recommended size: 1920x1080px or higher.
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Current Images</h3>

                    {loading ? (
                        <div className="text-center py-10 text-gray-400">Loading specific content...</div>
                    ) : images.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-gray-400">
                            No images uploaded yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {images.map((img) => (
                                <div key={img.id} className="group relative aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                    <Image
                                        src={img.image_url}
                                        alt="Slider Image"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => handleDelete(img.id)}
                                            className="p-2 bg-white/10 text-white hover:bg-red-500 rounded-full backdrop-blur-sm transition-colors"
                                            title="Delete Image"
                                        >
                                            <Trash className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
