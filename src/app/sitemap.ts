import { supabase } from '@/lib/supabase';
import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://serendiagems.com'; // Adjust default production URL

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

    // Fetch all categories for collections filtering if we had dynamic routes for them
    // Currently /collections?category=sapphire is a query param, not a separate route in Next.js usually
    // unless we strictly want to index them as separate pages. 
    // Google recommends separate URLs for faceted navigation if we want them indexed.
    // Since our structure is /collections?category=..., we can add them to sitemap if we want.

    const { data: categories } = await supabase.from('categories').select('slug');

    if (categories) {
        categories.forEach((cat) => {
            routes.push({
                url: `${BASE_URL}/collections?category=${cat.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.6,
            });
        })
    }

    return routes;
}
