"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function WriteReviewPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        comment: "",
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Submitting review...");

        try {
            let imageUrl = null;

            // Upload Image if exists
            if (image) {
                if (!CLOUD_NAME || !UPLOAD_PRESET) {
                    throw new Error("Image upload configuration missing");
                }
                const formData = new FormData();
                formData.append("file", image);
                formData.append("upload_preset", UPLOAD_PRESET);

                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                    { method: "POST", body: formData }
                );
                const data = await res.json();
                if (data.secure_url) {
                    imageUrl = data.secure_url;
                }
            }

            // Save to Supabase
            const { error } = await supabase.from("reviews").insert([{
                name: formData.name,
                email: formData.email,
                rating,
                comment: formData.comment,
                image_url: imageUrl,
                status: 'pending'
            }]);

            if (error) throw error;

            toast.success("Review submitted! It will be visible after approval.", { id: toastId });
            setFormData({ name: "", email: "", comment: "" });
            setRating(5);
            setImage(null);
            setImagePreview(null);
            setTimeout(() => router.push("/"), 2000);

        } catch (error: any) {
            console.error(error);
            toast.error(`Failed to submit: ${error.message || "Unknown error"}`, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-[#b38e5d] p-8 text-center">
                    <h1 className="text-2xl font-serif font-bold text-white">Write a Review</h1>
                    <p className="text-[#fdf6e7] mt-2 text-sm">Share your experience with Serendia Gems</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Rating */}
                    <div className="flex flex-col items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Your Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#b38e5d] outline-none"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#b38e5d] outline-none"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.comment}
                                onChange={e => setFormData({ ...formData, comment: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#b38e5d] outline-none resize-none"
                                placeholder="Tell us what you liked..."
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optional)</label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <span className="material-symbols-outlined">image</span>
                                        </div>
                                    )}
                                </div>
                                <label className="cursor-pointer px-4 py-2 text-sm text-[#b38e5d] font-medium border border-[#b38e5d] rounded-lg hover:bg-[#b38e5d]/5 transition-colors">
                                    Choose File
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#b38e5d] text-white font-bold rounded-lg shadow-md hover:bg-[#9a7b50] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>
        </div>
    );
}
