"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    weight: string;
    origin: string;
    treatment: string;
    clarity: string;
    color: string;
    cut: string;
    shape: string;
    images: string[];
    video_url?: string;
    category?: string;
    type?: string;
    badge?: string;
    badgeColor?: string;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
    const [isShippingOpen, setIsShippingOpen] = useState(false);
    const { addItem, openCart } = useCart();

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                // Fetch Main Product
                const { data: productData, error } = await supabase
                    .from('products')
                    .select(`
                        *,
                        category:categories(name),
                        type:types(name),
                        shape:shapes(name)
                    `)
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error("Error fetching product:", error);
                    setProduct(null);
                } else if (productData) {
                    // Map Supabase data to local interface
                    const mappedProduct: Product = {
                        ...productData,
                        category: productData.category?.name,
                        type: productData.type?.name,
                        shape: productData.shape?.name,
                        images: productData.images || [],
                    };
                    setProduct(mappedProduct);

                    // Fetch Similar Products (same category, excluding current)
                    if (productData.category_id) {
                        const { data: similarData } = await supabase
                            .from('products')
                            .select('id, name, price, images, clarity, weight')
                            .eq('category_id', productData.category_id)
                            .neq('id', id)
                            .limit(4);

                        if (similarData) {
                            setSimilarProducts(similarData.map((p: any) => ({
                                ...p,
                                images: p.images || [],
                                // Defaults for minimal display
                                description: '', weight: p.weight || '', origin: '', treatment: '', clarity: p.clarity || '', color: '', cut: '', shape: ''
                            })));
                        }
                    }
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] pt-32 flex items-center justify-center">
                <div className="text-[#b38e5d] text-2xl font-serif animate-pulse">Loading Gemstone...</div>
            </div>
        );
    }

    // If product not found
    if (!product) {
        return (
            <main className="pt-20 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
                    <Link
                        href="/collections"
                        className="bg-[#1152d4] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Browse Collections
                    </Link>
                </div>
            </main>
        );
    }

    const handleAddToCart = () => {
        addItem({
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            image: product.images[0],
            weight: product.weight,
            cut: product.shape,
        });
        openCart();
    };

    // Combine images and video into a single media list
    const mediaList = [
        ...(product?.images || []).map(url => ({ type: 'image' as const, url })),
        ...(product?.video_url ? [{ type: 'video' as const, url: product.video_url }] : [])
    ];

    const selectedMedia = mediaList[selectedMediaIndex] || mediaList[0];

    return (
        <main className="pt-24 bg-[#F8FAFC]">
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <nav className="flex text-sm text-gray-500">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li>
                            <Link href="/" className="hover:text-[#1152d4]">
                                Home
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="material-symbols-outlined text-base mx-1">
                                    chevron_right
                                </span>
                                <Link href="/collections" className="hover:text-[#1152d4]">
                                    Gemstones
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="material-symbols-outlined text-base mx-1">
                                    chevron_right
                                </span>
                                <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            {/* Main Product Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                    {/* Left Column: Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-4"
                    >
                        {/* Main Image / Video View */}
                        <div
                            className="aspect-[4/3] rounded-lg bg-white border border-slate-200 overflow-hidden relative group flex items-center justify-center"
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            {selectedMedia ? (
                                selectedMedia.type === 'video' ? (
                                    <video
                                        controls
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-contain bg-black"
                                        key={selectedMedia.url}
                                        onMouseEnter={(e) => e.currentTarget.play()}
                                        onMouseLeave={(e) => e.currentTarget.pause()}
                                    >
                                        <source src={selectedMedia.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <>
                                        <Image
                                            src={selectedMedia.url}
                                            alt={product?.name || "Product Image"}
                                            fill
                                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                                        />
                                        <div className="absolute inset-0 z-10 bg-transparent" />
                                        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                            <span className="material-symbols-outlined text-xl">
                                                zoom_in
                                            </span>
                                        </div>
                                    </>
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-slate-50">
                                    <span className="material-symbols-outlined text-6xl">diamond</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {mediaList.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {mediaList.map((item, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedMediaIndex(index)}
                                        onContextMenu={(e) => e.preventDefault()}
                                        className={`relative aspect-square rounded-lg overflow-hidden bg-white ${selectedMediaIndex === index
                                            ? "border-2 border-[#1152d4] ring-2 ring-[#1152d4]/20"
                                            : "border border-slate-200 hover:border-[#1152d4]/50"
                                            }`}
                                    >
                                        {item.type === 'video' ? (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={product?.images?.[0] || '/placeholder.png'}
                                                    alt="Video Thumbnail"
                                                    fill
                                                    className="object-cover opacity-60"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center text-[#1152d4]">
                                                    <span className="material-symbols-outlined text-3xl drop-shadow-md">play_circle</span>
                                                </div>
                                                <div className="absolute inset-0 bg-transparent z-10" />
                                            </div>
                                        ) : (
                                            <>
                                                <Image
                                                    src={item.url}
                                                    alt={`${product?.name} view ${index + 1}`}
                                                    fill
                                                    className="object-contain p-1 hover:opacity-75 transition-opacity"
                                                />
                                                <div className="absolute inset-0 bg-transparent z-10" />
                                            </>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Right Column: Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-10 px-0 sm:mt-16 lg:mt-0 lg:sticky lg:top-24"
                    >
                        {/* Title & Price */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">
                                {product.name}
                            </h1>
                            <div className="mt-4 flex items-end gap-4">
                                <p className="text-3xl font-semibold text-[#1152d4]">
                                    ${product.price.toLocaleString()}
                                </p>
                                <span className="text-sm text-gray-500 mb-1.5">
                                    Free insured shipping
                                </span>
                            </div>
                        </div>

                        {/* Short Description */}
                        <div className="mt-6 space-y-6 text-gray-600">
                            <p className="text-base leading-relaxed">{product.description}</p>
                        </div>

                        {/* Key Specs Grid */}
                        <div className="mt-8 grid grid-cols-2 gap-4 border-y border-slate-200 py-6">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400">
                                    scale
                                </span>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                        Weight
                                    </p>
                                    <p className="font-medium text-gray-900">{product.weight || "-"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400">
                                    public
                                </span>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                        Origin
                                    </p>
                                    <p className="font-medium text-gray-900">{product.origin || "-"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400">
                                    diamond
                                </span>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                        Shape
                                    </p>
                                    <p className="font-medium text-gray-900">{product.shape || "-"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400">
                                    science
                                </span>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                        Treatment
                                    </p>
                                    <p className="font-medium text-gray-900">{product.treatment || "-"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#1152d4] border border-transparent rounded-lg py-4 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1152d4] shadow-lg transition-all"
                            >
                                <span className="material-symbols-outlined mr-2">
                                    shopping_bag
                                </span>
                                Add to Cart
                            </motion.button>
                            <button className="flex-none bg-slate-100 border border-slate-200 rounded-lg py-4 px-4 flex items-center justify-center text-gray-700 hover:bg-slate-200 transition-all">
                                <span className="material-symbols-outlined">favorite_border</span>
                            </button>
                            <button className="flex-none bg-slate-100 border border-slate-200 rounded-lg py-4 px-4 flex items-center justify-center text-gray-700 hover:bg-slate-200 transition-all">
                                <span className="material-symbols-outlined">chat</span>
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-500 text-lg">
                                    verified
                                </span>
                                <span>GIA Certified</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-500 text-lg">
                                    local_shipping
                                </span>
                                <span>Free Global Shipping</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-500 text-lg">
                                    published_with_changes
                                </span>
                                <span>30-Day Returns</span>
                            </div>
                        </div>

                        {/* Accordion Details */}
                        <div className="mt-10 border-t border-slate-200 pt-6">
                            <div className="space-y-4">
                                {/* Description Accordion */}
                                <details
                                    open={isDescriptionOpen}
                                    onToggle={(e) =>
                                        setIsDescriptionOpen((e.target as HTMLDetailsElement).open)
                                    }
                                    className="group"
                                >
                                    <summary className="flex cursor-pointer items-center justify-between text-gray-900 font-medium list-none">
                                        <h2 className="text-lg">Detailed Description</h2>
                                        <span className="material-symbols-outlined transition group-open:rotate-180">
                                            expand_more
                                        </span>
                                    </summary>
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-4 text-sm leading-6 text-gray-600">
                                        <p>{product.description}</p>
                                        {product.clarity && (
                                            <p className="mt-2">
                                                <strong>Clarity:</strong> {product.clarity} - This gemstone exhibits
                                                exceptional transparency and minimal inclusions, ensuring maximum
                                                brilliance and value.
                                            </p>
                                        )}
                                        {product.color && (
                                            <p className="mt-2">
                                                <strong>Color:</strong> The {product.color} hue is consistent and
                                                vibrant, making this a standout piece in any collection.
                                            </p>
                                        )}
                                    </motion.div>
                                </details>

                                <div className="border-t border-slate-200 my-4" />

                                {/* Shipping Accordion */}
                                <details
                                    open={isShippingOpen}
                                    onToggle={(e) =>
                                        setIsShippingOpen((e.target as HTMLDetailsElement).open)
                                    }
                                    className="group"
                                >
                                    <summary className="flex cursor-pointer items-center justify-between text-gray-900 font-medium list-none">
                                        <h2 className="text-lg">Shipping & Returns</h2>
                                        <span className="material-symbols-outlined transition group-open:rotate-180">
                                            expand_more
                                        </span>
                                    </summary>
                                    <div className="mt-4 text-sm leading-6 text-gray-600">
                                        <p>
                                            We offer complimentary insured shipping worldwide via
                                            FedEx Priority. All shipments are fully insured until they
                                            reach your hands. If you are not completely satisfied with
                                            your purchase, you may return the item in its original
                                            condition within 30 days for a full refund.
                                        </p>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Similar Items Section */}
                {similarProducts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-24 border-t border-slate-200 pt-16"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Similar Gemstones</h2>
                            <Link
                                href="/collections"
                                className="text-[#1152d4] hover:text-blue-700 font-medium text-sm flex items-center"
                            >
                                View All Sapphires
                                <span className="material-symbols-outlined text-sm ml-1">
                                    arrow_forward
                                </span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {similarProducts.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="group relative bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="aspect-square w-full overflow-hidden bg-white relative">
                                        {item.images && item.images[0] ? (
                                            <Image
                                                src={item.images[0]}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                <span className="material-symbols-outlined text-4xl">diamond</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                                            <Link href={`/product/${item.id}`}>
                                                <span className="absolute inset-0" />
                                                {item.name}
                                            </Link>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{item.clarity || item.weight}</p>
                                        <p className="mt-2 text-lg font-medium text-[#1152d4]">
                                            ${item.price.toLocaleString()}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
