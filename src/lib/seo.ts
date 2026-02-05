import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';

// Default metadata to fallback to if no DB entry exists
const DEFAULT_METADATA = {
    title: 'Serendia Gems | Heart of Sri Lanka',
    description: 'Ethically mined, expertly cut. Discover the world\'s finest Sapphires directly from the source.',
    ogImage: '/hero/hero.jpeg', // Ensure this path exists or use a robust default
};

export async function getPageMetadata(path: string): Promise<Metadata> {
    try {
        const { data: seo } = await supabase
            .from('seo_metadata')
            .select('*')
            .eq('path', path)
            .single();

        if (seo) {
            return {
                title: seo.title,
                description: seo.description || DEFAULT_METADATA.description,
                openGraph: {
                    title: seo.title,
                    description: seo.description || DEFAULT_METADATA.description,
                    images: [seo.og_image || DEFAULT_METADATA.ogImage],
                    type: 'website',
                },
                twitter: {
                    card: 'summary_large_image',
                    title: seo.title,
                    description: seo.description || DEFAULT_METADATA.description,
                    images: [seo.og_image || DEFAULT_METADATA.ogImage],
                }
            };
        }
    } catch (error) {
        console.warn(`Failed to fetch SEO metadata for ${path}, using defaults.`, error);
    }

    // Return Defaults
    return {
        title: DEFAULT_METADATA.title,
        description: DEFAULT_METADATA.description,
        openGraph: {
            title: DEFAULT_METADATA.title,
            description: DEFAULT_METADATA.description,
            images: [DEFAULT_METADATA.ogImage],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: DEFAULT_METADATA.title,
            description: DEFAULT_METADATA.description,
            images: [DEFAULT_METADATA.ogImage],
        }
    };
}
