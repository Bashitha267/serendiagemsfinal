"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, Suspense, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

interface Product {
    id: string;
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
    category: string;
    badge?: string;
    badgeColor?: string;
}

function FineGemsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    // Force category to 'finegems'
    const categoryFilter = "finegems";

    // We can still allow other filters like type/shape if we want, but the category is fixed.

    const { addItem, openCart } = useCart();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [sortBy, setSortBy] = useState("Popular");
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    const sortOptions = [
        { name: "Popular", label: "Most Popular" },
        { name: "PriceLowHigh", label: "Price: Low to High" },
        { name: "PriceHighLow", label: "Price: High to Low" },
        { name: "Newest", label: "Newest Arrivals" },
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
    const [types, setTypes] = useState<{ name: string, slug: string }[]>([]);
    const [shapes, setShapes] = useState<{ name: string, slug: string }[]>([]);

    useEffect(() => {
        const fetchFilters = async () => {
            const { data: categoriesData } = await supabase.from('categories').select('*').order('name');
            if (categoriesData) {
                setCategories(categoriesData.map(cat => ({
                    name: cat.name,
                    slug: cat.slug
                })));
            }
            const { data: typesData } = await supabase.from('types').select('*').order('name');
            if (typesData) {
                setTypes(typesData.map(t => ({ name: t.name, slug: t.slug })));
            }
            const { data: shapesData } = await supabase.from('shapes').select('*').order('name');
            if (shapesData) {
                setShapes(shapesData.map(s => ({ name: s.name, slug: s.slug })));
            }
        };
        fetchFilters();
    }, []);

    // Initial Data Fetch
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                // Fixed category filter
                let selectQuery = `
                    id,
                    name,
                    price,
                    description,
                    weight,
                    origin,
                    treatment,
                    clarity,
                    color,
                    cut,
                    images,
                    category:categories!inner(name, slug),
                    type:types(name, slug),
                    shape:shapes(name, slug)
                `;

                let builder = supabase.from('products').select(selectQuery);

                // Hardcode filter for finegems
                builder = builder.eq('category.slug', 'finegems');

                const { data, error } = await builder;

                if (error) {
                    console.error('Error fetching products:', error);
                } else {
                    // Transform data to match Product interface
                    const formatedProducts: Product[] = (data || []).map((item: any) => ({
                        id: item.id.toString(),
                        name: item.name,
                        price: item.price,
                        description: item.description,
                        weight: item.weight,
                        origin: item.origin,
                        shape: item.shape?.name || '',
                        treatment: item.treatment,
                        clarity: item.clarity,
                        color: item.color,
                        cut: item.cut,
                        images: item.images || [],
                        category: item.category?.name || '',
                    }));
                    setProducts(formatedProducts);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []); // Run once on mount since category is fixed

    // Client-side Sorting
    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case "PriceLowHigh":
                return a.price - b.price;
            case "PriceHighLow":
                return b.price - a.price;
            case "Newest":
                return parseInt(b.id) - parseInt(a.id);
            default:
                return 0;
        }
    });

    const toggleFavorite = (id: string) => {
        setFavorites((prev: string[]) =>
            prev.includes(id) ? prev.filter((fav: string) => fav !== id) : [...prev, id]
        );
    };

    const handleAddToCart = (product: Product) => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            weight: product.weight,
            cut: product.cut,
        });
        openCart();
    };

    const handleCategoryClick = (slug: string) => {
        // If clicking on another category, go to main collections page
        if (slug !== 'finegems') {
            router.push(`/collections?category=${slug}`);
        }
    };

    return (
        <main className="min-h-screen bg-white pt-32 pb-20">
            <div className="mx-auto max-w-[1440px] px-4 md:px-10 lg:px-20">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Sidebar - Filter Pane */}
                    <aside className={`lg:w-64 shrink-0 flex flex-col gap-10 bg-white lg:bg-transparent p-6 lg:p-0 rounded-3xl lg:rounded-none border lg:border-none border-slate-100 ${showMobileFilters ? "block" : "hidden lg:flex"}`}>
                        {/* Mobile Header */}
                        <div className="flex lg:hidden items-center justify-between pb-4 border-b border-gray-100">
                            <h2 className="text-xl font-serif font-bold text-gray-900">Filters</h2>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="size-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider">Category</h3>
                            <nav className="flex flex-col gap-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.slug}
                                        onClick={() => handleCategoryClick(cat.slug)}
                                        className={`text-left text-sm transition-colors hover:text-[#b38e5d] ${cat.slug === 'finegems'
                                            ? "text-[#b38e5d] font-bold"
                                            : "text-gray-500 font-medium"
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Filter by: */}
                        <div className="flex flex-col gap-10">
                            <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider">Filter by:</h3>

                            {/* Type Filter */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-900">Type</span>
                                    <span className="material-symbols-outlined text-gray-400 text-sm">expand_less</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {types.map((type) => (
                                        <label key={type.slug} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-[#b38e5d] focus:ring-[#b38e5d]" />
                                            <span className="text-sm text-gray-500 group-hover:text-gray-900">{type.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Shape etc... (omitted detailed filters for brevity if not strictly needed, but included for completeness) */}
                            <div className="flex flex-col gap-5">
                                <div className="flex items-center gap-2 cursor-pointer group">
                                    <span className="material-symbols-outlined text-gray-900 text-lg">arrow_drop_down</span>
                                    <span className="text-sm font-bold text-gray-900">Shape</span>
                                </div>
                                <div className="flex flex-col gap-3 ml-1">
                                    {shapes.map((shape) => (
                                        <label key={shape.slug} className="flex items-center justify-between group cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-[#b38e5d] focus:ring-[#b38e5d] cursor-pointer" />
                                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{shape.name}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <div className="h-px bg-gray-100 mt-2" />
                            </div>

                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col gap-8">
                        {/* Header & Controls */}
                        <div className="flex flex-col gap-6">
                            {/* Breadcrumbs */}
                            <nav className="flex items-center gap-2 text-[12px] font-medium text-gray-400 uppercase tracking-widest">
                                <Link href="/" className="hover:text-gray-900 whitespace-nowrap">Main Page</Link>
                                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                                <span className="text-gray-900">Fine Gems</span>
                            </nav>

                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 capitalize">
                                    Fine Gems
                                </h1>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                                        className="lg:hidden flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">filter_list</span>
                                        {showMobileFilters ? "Hide Filters" : "Filters"}
                                    </button>

                                    <div className="relative" ref={sortDropdownRef}>
                                        <button
                                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-4 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors min-w-[180px]"
                                        >
                                            <span className="whitespace-nowrap">Sort: <span className="text-gray-900">{sortOptions.find(o => o.name === sortBy)?.label.split(': ')[1] || sortOptions.find(o => o.name === sortBy)?.label}</span></span>
                                            <motion.span
                                                animate={{ rotate: showSortDropdown ? 180 : 0 }}
                                                className="material-symbols-outlined text-sm"
                                            >
                                                expand_more
                                            </motion.span>
                                        </button>

                                        <AnimatePresence>
                                            {showSortDropdown && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
                                                >
                                                    <div className="py-2">
                                                        {sortOptions.map((option) => (
                                                            <button
                                                                key={option.name}
                                                                onClick={() => {
                                                                    setSortBy(option.name);
                                                                    setShowSortDropdown(false);
                                                                }}
                                                                className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-slate-50 ${sortBy === option.name ? "text-[#b38e5d] font-bold bg-[#b38e5d]/5" : "text-gray-700"
                                                                    }`}
                                                            >
                                                                {option.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {isLoading ? (
                                <div className="col-span-1 sm:col-span-2 xl:col-span-3 flex justify-center py-20 text-gray-400">
                                    Loading fine gems...
                                </div>
                            ) : sortedProducts.length === 0 ? (
                                <div className="col-span-1 sm:col-span-2 xl:col-span-3 flex justify-center py-20 text-gray-400">
                                    No fine gems found.
                                </div>
                            ) : (
                                sortedProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
                                    >
                                        {/* Image Container */}
                                        <div className="relative aspect-square overflow-hidden bg-white border-b border-slate-100 p-8">
                                            <Link
                                                href={`/product/${product.id}`}
                                                className="block relative w-full h-full"
                                                onContextMenu={(e) => e.preventDefault()}
                                            >
                                                {product.images?.[0] ? (
                                                    <>
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            fill
                                                            className="object-contain transition-transform duration-1000 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 z-10 bg-transparent" />
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                                        <span className="material-symbols-outlined text-4xl">diamond</span>
                                                    </div>
                                                )}
                                            </Link>

                                            {/* Top Badges */}
                                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                                {product.badge && (
                                                    <span className={`px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider rounded-full shadow-sm ${product.badgeColor || "bg-[#b38e5d]"}`}>
                                                        {product.badge}
                                                    </span>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleFavorite(product.id);
                                                    }}
                                                    className="size-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-gray-400 group-hover:text-rose-500 transition-all duration-300 shadow-sm ml-auto"
                                                >
                                                    <span className="material-symbols-outlined text-[20px] leading-none">
                                                        {favorites.includes(product.id) ? "favorite" : "favorite"}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col gap-4">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-[#b38e5d] transition-colors line-clamp-1">
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">
                                                        Price
                                                    </p>
                                                    <span className="text-xl font-bold text-gray-900">
                                                        ${product.price.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-3 pt-2">
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="flex-1 py-3 bg-[#b38e5d] text-white rounded-xl font-bold text-sm shadow-md shadow-[#b38e5d]/10 transform transition-all active:scale-95"
                                                >
                                                    Add to Cart
                                                </button>
                                                <Link
                                                    href={`/product/${product.id}`}
                                                    className="p-3 text-gray-400 border border-gray-100 rounded-xl hover:text-[#b38e5d] hover:border-[#b38e5d]/20 transition-all active:scale-95"
                                                >
                                                    <span className="material-symbols-outlined text-[20px] leading-none">visibility</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function FineGemsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white pt-32 flex items-center justify-center font-serif text-2xl animate-pulse text-[#b38e5d]">Loading Fine Gems...</div>}>
            <FineGemsContent />
        </Suspense>
    );
}
