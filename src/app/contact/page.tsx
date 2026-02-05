
import { getPageMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import ContactClient from './ContactClient';

export async function generateMetadata(): Promise<Metadata> {
    return await getPageMetadata('/contact');
}

export default function ContactPage() {
    return <ContactClient />;
}
