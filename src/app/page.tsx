
import { getPageMetadata } from '@/lib/seo';
import { Metadata } from "next";
import HomeClient from "./HomeClient";

export async function generateMetadata(): Promise<Metadata> {
  return await getPageMetadata('/');
}

export default function Home() {
  return <HomeClient />;
}
