"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form Stats
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        weight: "",
        origin: "",
        treatment: "",
        clarity: "",
        color: "",
        cut: "",
        category_id: "",
        type_id: "",
        shape_id: "",
    });

    const [images, setImages] = useState<(File | null)[]>([null, null, null]);
    const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null]);
    const [video, setVideo] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    // Initial Data
    const [categories, setCategories] = useState<any[]>([]);
    const [types, setTypes] = useState<any[]>([]);
    const [shapes, setShapes] = useState<any[]>([]);

    useEffect(() => {
        fetchDependencies();
    }, []);

    const fetchDependencies = async () => {
        const { data: catData } = await supabase.from("categories").select("id, name").order("name");
        const { data: typeData } = await supabase.from("types").select("id, name").order("name");
        const { data: shapeData } = await supabase.from("shapes").select("id, name").order("name");

        if (catData) setCategories(catData);
        if (typeData) setTypes(typeData);
        if (shapeData) setShapes(shapeData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newImages = [...images];
            newImages[index] = file;
            setImages(newImages);

            const newPreviews = [...imagePreviews];
            newPreviews[index] = URL.createObjectURL(file);
            setImagePreviews(newPreviews);
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setVideo(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET || "");

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${file.type.startsWith('video') ? 'video' : 'image'}/upload`,
            { method: "POST", body: formData }
        );
        const data = await response.json();
        return data.secure_url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
            toast.error("Cloudinary config missing.");
            return;
        }

        setUploading(true);
        const toastId = toast.loading("Uploading media & creating product...");

        try {
            // 1. Upload Images
            const imageUrls = [];
            for (const img of images) {
                if (img) {
                    const url = await uploadFile(img);
                    imageUrls.push(url);
                }
            }

            // 2. Upload Video
            let videoUrl = null;
            if (video) {
                videoUrl = await uploadFile(video);
            }

            // 3. Save to Supabase
            const { error } = await supabase.from("products").insert([{
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                weight: formData.weight,
                origin: formData.origin,
                treatment: formData.treatment,
                clarity: formData.clarity,
                color: formData.color,
                cut: formData.cut,
                category_id: formData.category_id ? parseInt(formData.category_id) : null,
                type_id: formData.type_id ? parseInt(formData.type_id) : null,
                shape_id: formData.shape_id ? parseInt(formData.shape_id) : null,
                images: imageUrls,
                video_url: videoUrl
            }]);

            if (error) throw error;

            toast.success("Product created successfully!", { id: toastId });
            router.push("/admin/products");

        } catch (error: any) {
            console.error(error);
            toast.error(`Failed: ${error.message}`, { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-8">Add New Product</h1>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input name="name" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#b38e5d] outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input name="price" type="number" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#b38e5d] outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (e.g. 2.5 ct)</label>
                        <input name="weight" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#b38e5d] outline-none" />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" rows={4} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#b38e5d] outline-none" />
                </div>

                {/* Classification Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select name="category_id" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#b38e5d] outline-none bg-white">
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select name="type_id" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#b38e5d] outline-none bg-white">
                            <option value="">Select Type</option>
                            {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
                        <select name="shape_id" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#b38e5d] outline-none bg-white">
                            <option value="">Select Shape</option>
                            {shapes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Detailed Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Origin</label>
                        <input name="origin" onChange={handleChange} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-[#b38e5d] outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Treatment</label>
                        <input name="treatment" onChange={handleChange} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-[#b38e5d] outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Clarity</label>
                        <input name="clarity" onChange={handleChange} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-[#b38e5d] outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
                        <input name="color" onChange={handleChange} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-[#b38e5d] outline-none" />
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Media</h3>

                    {/* Image Uploads */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Product Images (Max 3)</label>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="relative w-32 h-32 flex-shrink-0">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id={`img-${i}`}
                                        className="hidden"
                                        onChange={(e) => handleImageChange(i, e)}
                                    />
                                    <label
                                        htmlFor={`img-${i}`}
                                        className="w-full h-full border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#b38e5d] hover:bg-slate-50 transition-all overflow-hidden"
                                    >
                                        {imagePreviews[i] ? (
                                            <Image src={imagePreviews[i]!} alt="Preview" fill className="object-cover" />
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-slate-400">add_photo_alternate</span>
                                                <span className="text-xs text-slate-500 mt-1">Image {i + 1}</span>
                                            </>
                                        )}
                                    </label>
                                    {imagePreviews[i] && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newImgs = [...images]; newImgs[i] = null; setImages(newImgs);
                                                const newPrevs = [...imagePreviews]; newPrevs[i] = null; setImagePreviews(newPrevs);
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                        >
                                            <span className="material-symbols-outlined text-xs">close</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Video Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Product Video (Optional)</label>
                        <div className="relative w-full max-w-sm">
                            <input
                                type="file"
                                accept="video/*"
                                id="video-upload"
                                className="hidden"
                                onChange={handleVideoChange}
                            />
                            <label
                                htmlFor="video-upload"
                                className="w-full aspect-video border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#b38e5d] hover:bg-slate-50 transition-all overflow-hidden bg-slate-50"
                            >
                                {videoPreview ? (
                                    <video src={videoPreview} controls className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-slate-400 text-4xl">videocam</span>
                                        <span className="text-sm text-slate-500 mt-2">Upload Short Video</span>
                                    </>
                                )}
                            </label>
                            {videoPreview && (
                                <button
                                    type="button"
                                    onClick={() => { setVideo(null); setVideoPreview(null); }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                >
                                    <span className="material-symbols-outlined text-xs">close</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={uploading}
                        className="w-full py-4 bg-[#b38e5d] text-white font-bold rounded-lg hover:bg-[#9a7b50] transition-colors shadow-md flex justify-center items-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                Publishing Product...
                            </>
                        ) : "Publish Product"}
                    </button>
                </div>

            </form>
        </div>
    );
}
