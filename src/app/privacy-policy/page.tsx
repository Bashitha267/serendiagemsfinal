import { supabase } from "@/lib/supabase";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Serendia Gems',
    description: 'Our privacy policy outlines how we collect, use, and protect your personal information.',
};

export const revalidate = 3600; // Revalidate every hour

async function getPrivacyPolicy() {
    const { data, error } = await supabase
        .from('legal_pages')
        .select('*')
        .eq('slug', 'privacy-policy')
        .single();

    if (error) {
        console.error('Error fetching privacy policy:', error);
        return null;
    }
    return data;
}

export default async function PrivacyPolicyPage() {
    const page = await getPrivacyPolicy();

    if (!page) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Privacy Policy</h1>
                    <p>Content not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-20 py-16 lg:py-24">
                <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-8 lg:mb-12">
                    {page.title}
                </h1>

                {/* Content */}
                <div
                    className="prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-a:text-[#1152d4] prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: page.content || '' }}
                />

                <div className="mt-12 pt-8 border-t border-slate-100 text-sm text-gray-500">
                    Last updated: {new Date(page.updated_at).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}
