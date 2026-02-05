"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, Suspense, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { getAllProducts, Product } from "@/data/productsData";
import { supabase } from "@/lib/supabase";

function CollectionsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categoryFilter = searchParams.get("category");
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

    // Initial Data Fetch
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                let query = supabase
                    .from('products')
                    .select(`
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
                        category:categories(name, slug),
                        type:types(name, slug),
                        shape:shapes(name, slug)
                    `);

                // If specific category selected, filter by it
                if (categoryFilter) {
                    // We need to filter by the related category's slug. 
                    // Supabase syntax for filtering on related tables:
                    query = query.eq('category.slug', categoryFilter);
                    // Note: This often requires !inner in the select string to work as a filter: category:categories!inner(name,slug)
                    // Let's adjust the select string above to use !inner if we are strictly filtering, or just handle it.
                    // Actually, simpler approach for now if relations are set up:
                    // We can't easily validly eq('category.slug') without !inner. 
                }

                // Let's retry the query construction to be safe with the !inner requirement for filtering
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
                    category:categories${categoryFilter ? '!inner' : ''}(name, slug),
                    type:types(name, slug),
                    shape:shapes(name, slug)
                `;

                let builder = supabase.from('products').select(selectQuery);

                if (categoryFilter) {
                    builder = builder.eq('category.slug', categoryFilter);
                }

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
    }, [categoryFilter]);

    // Client-side Sorting (applied to the fetched products)
    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case "PriceLowHigh":
                return a.price - b.price;
            case "PriceHighLow":
                return b.price - a.price;
            case "Newest":
                return parseInt(b.id) - parseInt(a.id);
            default:
                return 0; // Popular / Default
        }
    });

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
        if (categoryFilter === slug) {
            router.push('/collections');
        } else {
            router.push(`/collections?category=${slug}`);
        }
        setShowMobileFilters(false);
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
                                        className={`text-left text-sm transition-colors hover:text-[#b38e5d] ${categoryFilter === cat.slug
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

                            {/* Shape Filter */}
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
                                            {/* Count removed as it requires complex product-relation queries */}
                                        </label>
                                    ))}
                                </div>
                                <div className="h-px bg-gray-100 mt-2" />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-2 cursor-pointer group">
                                    <span className="material-symbols-outlined text-gray-900 text-lg">arrow_drop_down</span>
                                    <span className="text-sm font-bold text-gray-900">Price (Rs)</span>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                    <div className="w-full sm:flex-1 flex items-center border border-gray-200 rounded min-w-0">
                                        <div className="bg-gray-100 px-2 py-2 text-[#b38e5d] font-bold text-sm border-r border-gray-200">Rs</div>
                                        <input type="number" placeholder="139400" className="w-full px-2 py-2 text-sm focus:outline-none bg-transparent" />
                                    </div>
                                    <span className="hidden sm:inline text-gray-400">-</span>
                                    <div className="w-full sm:flex-1 flex items-center border border-gray-200 rounded min-w-0">
                                        <div className="bg-gray-50 px-2 py-2 text-gray-500 font-medium text-sm border-r border-gray-200">Rs</div>
                                        <input type="number" placeholder="2515600" className="w-full px-2 py-2 text-sm focus:outline-none bg-transparent" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 px-1">
                                    <div className="relative h-1 bg-gray-900 rounded-full mt-4">
                                        <div className="absolute -top-[7px] left-0 w-4 h-4 rounded-full bg-white border-2 border-gray-900 cursor-pointer shadow-sm hover:scale-110 transition-transform" />
                                        <div className="absolute -top-[7px] right-0 w-4 h-4 rounded-full bg-white border-2 border-gray-900 cursor-pointer shadow-sm hover:scale-110 transition-transform" />

                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-px h-2 bg-gray-900 -mt-0.5" />
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-500 font-medium tracking-tighter">
                                        <span>139,400</span>
                                        <span>733,450</span>
                                        <span>1,327,500</span>
                                        <span>1,921,550</span>
                                        <span>2,515,600</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="w-full py-4 bg-[#b38e5d] text-white rounded-lg font-bold text-sm shadow-md transition-all active:scale-95 hover:bg-[#a17e4f]"
                            >
                                Apply Filters
                            </button>
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
                                <Link href="/collections" className={`${!categoryFilter ? "text-gray-900" : "hover:text-gray-900"} whitespace-nowrap`}>Category</Link>
                                {categoryFilter && (
                                    <>
                                        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                                        <span className="text-gray-900 uppercase truncate">{categoryFilter.replace(/-/g, ' ')}</span>
                                    </>
                                )}
                            </nav>

                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 capitalize">
                                    {categoryFilter ? categoryFilter.replace(/-/g, ' ') : "All Collections"}
                                </h1>

                                <div className="flex items-center gap-3">
                                    {/* Mobile Filter Toggle */}
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

                            {/* Active Tags */}
                            <div className="flex flex-wrap gap-2">
                                {categoryFilter && (
                                    <button
                                        onClick={() => router.push('/collections')}
                                        className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                        {categoryFilter.toUpperCase()}
                                        <span className="material-symbols-outlined text-[14px]">close</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {isLoading ? (
                                <div className="col-span-1 sm:col-span-2 xl:col-span-3 flex justify-center py-20 text-gray-400">
                                    Loading products...
                                </div>
                            ) : sortedProducts.length === 0 ? (
                                <div className="col-span-1 sm:col-span-2 xl:col-span-3 flex justify-center py-20 text-gray-400">
                                    No products found in this collection.
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

                        {/* Pagination Simulation */}
                        <div className="mt-12 flex items-center justify-center gap-2">
                            <span className="text-sm font-bold text-gray-400 cursor-not-allowed">Previous</span>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${num === 1 ? "bg-[#b38e5d] text-white shadow-lg shadow-[#b38e5d]/20" : "text-gray-500 hover:bg-gray-100"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                            <span className="text-sm font-bold text-gray-400">...</span>
                            <button className="w-10 h-10 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100">20</button>
                            <span className="text-sm font-bold text-[#b38e5d] cursor-pointer hover:underline">Next</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function CollectionsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white pt-32 flex items-center justify-center font-serif text-2xl animate-pulse text-[#b38e5d]">Loading Collection...</div>}>
            <CollectionsContent />
        </Suspense>
    );
}
