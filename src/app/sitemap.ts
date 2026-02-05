import { supabase } from '@/lib/supabase';
import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.serendiagem.com'; // User provided domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/collections`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ];

    // Fetch all products
    const { data: products } = await supabase
        .from('products')
        .select('id, updated_at'); // Assuming updated_at exists, else new Date()

    if (products) {
        products.forEach((product) => {
            routes.push({
                url: `${BASE_URL}/product/${product.id}`,
                lastModified: new Date(), // product.updated_at ? new Date(product.updated_at) : new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });
    }



    return routes;
}
