"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Loader2, FileText, ShieldCheck } from "lucide-react";

interface LegalContent {
    title: string;
    content: string;
    slug: string;
}

export default function Footer() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'privacy-policy' | 'terms-of-service'>('privacy-policy');
    const [legalData, setLegalData] = useState<Record<string, LegalContent>>({});
    const [loading, setLoading] = useState(false);

    // Fetch legal content when modal opens
    useEffect(() => {
        if (isModalOpen && Object.keys(legalData).length === 0) {
            fetchLegalPages();
        }
    }, [isModalOpen]);

    const fetchLegalPages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('legal_pages')
                .select('slug, title, content')
                .in('slug', ['privacy-policy', 'terms-of-service']);

            if (data) {
                const dataMap: Record<string, LegalContent> = {};
                data.forEach(page => {
                    dataMap[page.slug] = page;
                });
                setLegalData(dataMap);
            }
        } catch (error) {
            console.error("Error fetching legal pages:", error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (tab: 'privacy-policy' | 'terms-of-service') => {
        setActiveTab(tab);
        setIsModalOpen(true);
    };

    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3 text-gray-900">
                            <Image
                                src="/logo.jpg"
                                alt="Serendia Gems Logo"
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                            <h2 className="text-xl font-serif font-bold">Serendia Gems</h2>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Exporting the finest Sri Lankan gemstones to the world with
                            integrity, transparency, and a commitment to our heritage.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-[#1152d4] transition-colors"
                            >
                                <span className="material-symbols-outlined">public</span>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-[#1152d4] transition-colors"
                            >
                                <span className="material-symbols-outlined">
                                    alternate_email
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Links - Collections */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-gray-900 font-bold text-sm tracking-widest uppercase">
                            Collections
                        </h3>
                        <Link
                            href="/collections"
                            className="text-gray-600 hover:text-[#1152d4] transition-colors text-sm"
                        >
                            Blue Sapphires
                        </Link>
                        <Link
                            href="/collections"
                            className="text-gray-600 hover:text-[#1152d4] transition-colors text-sm"
                        >
                            Rubies
                        </Link>
                        <Link
                            href="/fine-gems"
                            className="text-gray-600 hover:text-[#1152d4] transition-colors text-sm"
                        >
                            Fine Gems
                        </Link>
                        <Link
                            href="/collections"
                            className="text-gray-600 hover:text-[#1152d4] transition-colors text-sm"
                        >
                            Padparadscha
                        </Link>
                        <Link
                            href="/collections"
                            className="text-gray-600 hover:text-[#1152d4] transition-colors text-sm"
                        >
                            Engagement Rings
                        </Link>
                    </div>

                    {/* Links - Company */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-gray-900 font-bold text-sm tracking-widest uppercase">
                            Company
                        </h3>
                        <Link
                            href="/about"
                            className="text-gray-600 hover:text-[#1152d4] transition-colors text-sm"
                        >
                            Our Story
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-600 hover:text-[#1152d4] transition-colors text-sm"
                        >
                            Ethical Mining
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-600 hover:text-[#1152d4] transition-colors text-sm"
                        >
                            Certification (GIA/GRS)
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-600 hover:text-[#1152d4] transition-colors text-sm"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>

                <div className="border-t border-slate-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs">
                        © 2024 Serendia Gems. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <button
                            onClick={() => openModal('privacy-policy')}
                            className="text-gray-400 text-xs hover:text-[#1152d4] cursor-pointer transition-colors"
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={() => openModal('terms-of-service')}
                            className="text-gray-400 text-xs hover:text-[#1152d4] cursor-pointer transition-colors"
                        >
                            Terms of Service
                        </button>
                        <span className="text-gray-400 text-xs hover:text-[#1152d4] cursor-pointer transition-colors">
                            Shipping &amp; Returns
                        </span>
                    </div>
                </div>
            </div>

            {/* Legal Pages Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header with Tabs */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveTab('privacy-policy')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'privacy-policy'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    Privacy Policy
                                </button>
                                <button
                                    onClick={() => setActiveTab('terms-of-service')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'terms-of-service'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    Terms of Service
                                </button>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                            {loading && Object.keys(legalData).length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#b38e5d]" />
                                    <p className="text-sm">Loading legal documents...</p>
                                </div>
                            ) : (
                                <div className="max-w-3xl mx-auto">
                                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
                                        {legalData[activeTab]?.title || (activeTab === 'privacy-policy' ? 'Privacy Policy' : 'Terms of Service')}
                                    </h2>

                                    {legalData[activeTab]?.content ? (
                                        <div
                                            className="prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-a:text-[#1152d4] prose-img:rounded-xl"
                                            dangerouslySetInnerHTML={{ __html: legalData[activeTab].content }}
                                        />
                                    ) : (
                                        <div className="text-gray-500 italic">
                                            Content not found. Please contact support.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}
