"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Star, Check, Trash, Copy, Clock, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface Review {
    id: number;
    created_at: string;
    name: string;
    email: string;
    rating: number;
    comment: string;
    status: 'pending' | 'approved';
    image_url?: string;
}

export default function ReviewsManager() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("reviews")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            // toast.error("Failed to fetch reviews"); // Suppress if table doesn't exist yet
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            const { error } = await supabase
                .from("reviews")
                .update({ status: 'approved' })
                .eq('id', id);

            if (error) throw error;

            toast.success("Review approved!");
            setReviews(reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r));
        } catch (error) {
            console.error(error);
            toast.error("Failed to approve review");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            const { error } = await supabase
                .from("reviews")
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success("Review deleted");
            setReviews(reviews.filter(r => r.id !== id));
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete review");
        }
    };

    const copyLink = () => {
        const url = `${window.location.origin}/reviews/write`;
        navigator.clipboard.writeText(url);
        toast.success("Review form link copied to clipboard!");
    };

    const filteredReviews = reviews.filter(r => r.status === activeTab);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Reviews Manager</h1>
                    <p className="text-sm text-gray-500 mt-1">Moderate customer reviews and testimonials.</p>
                </div>
                <button
                    onClick={copyLink}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-gray-700 font-medium rounded-lg hover:bg-slate-50 hover:text-[#b38e5d] transition-colors shadow-sm"
                >
                    <Copy className="w-4 h-4" />
                    Copy Review Form Link
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'pending'
                            ? "border-[#b38e5d] text-[#b38e5d]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <Clock className="w-4 h-4" />
                        Pending
                        <span className="bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs ml-1">
                            {reviews.filter(r => r.status === 'pending').length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('approved')}
                        className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'approved'
                            ? "border-[#b38e5d] text-[#b38e5d]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <Check className="w-4 h-4" />
                        Published
                        <span className="bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs ml-1">
                            {reviews.filter(r => r.status === 'approved').length}
                        </span>
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading reviews...</div>
                ) : filteredReviews.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
                        <MessageSquare className="w-10 h-10 text-slate-200" />
                        <p>No {activeTab} reviews found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    {/* Content */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-gray-900 font-bold">{review.name}</h3>
                                                    <span className="text-xs text-gray-400">• {new Date(review.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-500">{review.email}</p>
                                            </div>
                                            <div className="flex gap-1 text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-200"}`} />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-gray-700 leading-relaxed text-sm">
                                            {review.comment}
                                        </p>

                                        {review.image_url && (
                                            <div className="mt-3 relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 cursor-pointer group">
                                                <Image src={review.image_url} alt="Review attachment" fill className="object-cover" />
                                                <a href={review.image_url} target="_blank" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex sm:flex-col items-center justify-center gap-2 sm:border-l sm:border-slate-100 sm:pl-6 min-w-[120px]">
                                        {review.status === 'pending' && (
                                            <button
                                                onClick={() => handleApprove(review.id)}
                                                className="w-full py-2 px-3 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Check className="w-3 h-3" />
                                                Approve
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="w-full py-2 px-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Trash className="w-3 h-3" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
