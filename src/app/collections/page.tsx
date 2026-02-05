
import { getPageMetadata } from '@/lib/seo';
import CollectionsClient from "./CollectionsClient";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    return await getPageMetadata('/collections');
}

export default function CollectionsPage() {
    return <CollectionsClient />;
}
