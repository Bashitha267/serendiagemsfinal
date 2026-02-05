
import { getPageMetadata } from '@/lib/seo';
import { supabase } from "@/lib/supabase";
import { Metadata } from 'next';
import ProductClient from './ProductClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const path = `/product/${id}`;

    // 1. Fetch Admin Overrides
    const adminMetadata = await getPageMetadata(path);

    // 2. Fetch Product Data for defaults
    const { data: product } = await supabase
        .from('products')
        .select('name, description, images')
        .eq('id', id)
        .single();

    const isDefaultTitle = adminMetadata.title === 'Serendia Gems | Heart of Sri Lanka'; // Check against default constant from seo.ts ideally

    if (product) {
        // If no specific admin override found (heuristic), use product info
        if (isDefaultTitle) {
            return {
                title: `${product.name} | Serendia Gems`,
                description: product.description?.slice(0, 160) || "Luxury gemstone from Serendia Gems.",
                openGraph: {
                    images: product.images?.[0] ? [product.images[0]] : [],
                }
            };
        }
    }

    return adminMetadata;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ProductClient id={id} />;
}
