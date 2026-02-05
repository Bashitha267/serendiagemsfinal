"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import gemMine from "@/assests/gem-mine.jpeg";
import gemsMining from "@/assests/gems-mining.jpeg";
import rubi from "@/assests/rubi.jpeg";

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export default function AboutPage() {
    return (
        <main className="flex flex-col w-full bg-white overflow-hidden">
            {/* Elegant Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
                <Image
                    src={gemMine}
                    alt="Fine Jewelry Heritage"
                    fill
                    className="object-cover brightness-[0.4]"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={fadeInUp}
                    transition={{ duration: 1 }}
                    className="relative z-10 text-center px-4 md:px-10 max-w-4xl"
                >
                    <span className="text-[#b38e5d] font-bold tracking-[0.4em] uppercase text-xs mb-6 block">
                        Our Legacy
                    </span>
                    <h1 className="text-white text-5xl md:text-7xl font-serif font-medium leading-tight mb-8">
                        Unearthing the Heart of <br />
                        <span>Sri Lanka</span>
                    </h1>
                    <p className="text-white text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10 [text-shadow:_0_1px_10px_rgb(0_0_0_/_20%)]">
                        Since our inception, Serendia Gems has been committed to unearthing the world&apos;s
                        most exceptional gemstones while honoring the earth and the communities that provide them.
                    </p>
                    <div className="w-12 h-[1px] bg-[#b38e5d] mx-auto" />
                </motion.div>
            </section>

            {/* The Vision Section */}
            <section className="py-24 md:py-32 bg-white relative z-10">
                <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="flex-1 space-y-8"
                        >
                            <div className="space-y-4">
                                <span className="text-[#b38e5d] font-bold tracking-[0.2em] uppercase text-[10px]">
                                    The Philosophy
                                </span>
                                <h2 className="text-gray-900 text-4xl md:text-5xl font-serif font-medium leading-[1.2]">
                                    A Commitment to <br />
                                    <span className="italic text-[#b38e5d]">Purity & Ethics</span>
                                </h2>
                            </div>
                            <p className="text-gray-600 text-lg font-light leading-relaxed">
                                At Serendia Gems, we believe a gemstone is more than a piece of jewelry;
                                it is a piece of the earth&apos;s history. Our journey takes us deep into
                                the mines of Ratnapura, where we maintain direct relationships with
                                artisanal miners to ensure every stone is ethically sourced.
                            </p>
                            <p className="text-gray-600 text-lg font-light leading-relaxed">
                                We specialize in unheated and untreated sapphires, preserving the
                                natural brilliance that only millions of years of geological pressure
                                can create. Our master lapidaries then cut each stone with surgical
                                precision to maximize its unique optical properties.
                            </p>
                            <div className="pt-4">
                                <Link
                                    href="/collections"
                                    className="inline-flex items-center gap-3 text-gray-900 font-bold border-b border-gray-900 pb-1 group hover:text-[#b38e5d] hover:border-[#b38e5d] transition-all"
                                >
                                    <span className="text-xs uppercase tracking-widest">Explore Collection</span>
                                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="flex-1 relative aspect-[4/5] w-full"
                        >
                            <div className="absolute inset-4 border border-[#b38e5d]/20 -z-10 translate-x-4 translate-y-4" />
                            <Image
                                src={rubi}
                                alt="Master Craftsmanship"
                                fill
                                className="object-cover shadow-2xl"
                            />
                            <div className="absolute -bottom-10 -left-10 bg-white p-8 shadow-xl hidden md:block max-w-[240px] border border-slate-50">
                                <span className="text-4xl font-serif font-bold text-[#b38e5d]">100%</span>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2 leading-loose">
                                    Natural provenance & certified authenticity for every stone.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Heritage Banner */}
            <section className="py-20 bg-[#FBFBFB] border-y border-slate-100">
                <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center"
                    >
                        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4">
                            <span className="material-symbols-outlined text-[#b38e5d] text-4xl font-light">history_edu</span>
                            <h3 className="text-gray-900 font-serif text-xl italic">Century-Old Legacy</h3>
                            <p className="text-gray-500 text-sm font-light leading-relaxed">Three generations of expertise in the Sri Lankan gem trade, passed down with integrity.</p>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4">
                            <span className="material-symbols-outlined text-[#b38e5d] text-4xl font-light">diamond</span>
                            <h3 className="text-gray-900 font-serif text-xl italic">Rare Selections</h3>
                            <p className="text-gray-500 text-sm font-light leading-relaxed">Direct access to the rarest unheated Padparadscha and Blue Sapphires from Ratnapura.</p>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4">
                            <span className="material-symbols-outlined text-[#b38e5d] text-4xl font-light">verified_user</span>
                            <h3 className="text-gray-900 font-serif text-xl italic">Global Trust</h3>
                            <p className="text-gray-500 text-sm font-light leading-relaxed">Certified by leading laboratories including GRS, GIA, and IGI for absolute peace of mind.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* The Process Section */}
            <section className="py-24 md:py-32 bg-white">
                <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20">
                    <div className="flex flex-col lg:flex-row-reverse gap-20 items-center">
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="flex-1 space-y-8"
                        >
                            <div className="space-y-4">
                                <span className="text-[#b38e5d] font-bold tracking-[0.2em] uppercase text-[10px]">
                                    The Process
                                </span>
                                <h2 className="text-gray-900 text-4xl md:text-5xl font-serif font-medium leading-[1.2]">
                                    From Mine to <br />
                                    <span className="italic text-[#b38e5d]">Masterpiece</span>
                                </h2>
                            </div>
                            <p className="text-gray-600 text-lg font-light leading-relaxed">
                                Our value chain is entirely internal. By maintaining control from the
                                moment a crystal is pulled from the riverbeds to the final polish in
                                our workshop, we eliminate unnecessary premiums and guarantee the
                                lineage of our gemstones.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div className="space-y-2">
                                    <h4 className="text-gray-900 font-bold text-xs uppercase tracking-widest">Sourcing</h4>
                                    <p className="text-gray-500 text-sm font-light">Direct mining partnerships in the Ratnapura district.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-gray-900 font-bold text-xs uppercase tracking-widest">Selection</h4>
                                    <p className="text-gray-500 text-sm font-light">Only top 1% of rough stones meet our quality criteria.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="flex-1 relative aspect-[16/10] w-full bg-slate-100 overflow-hidden"
                        >
                            <Image
                                src={gemsMining}
                                alt="Ethical Sourcing"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#0B0F19] relative overflow-hidden text-center">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#b38e5d]/20 to-transparent" />
                </div>
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <h2 className="text-white text-4xl md:text-5xl font-serif mb-8 leading-tight">
                        Experience the Timeless <br />
                        <span className="italic text-[#b38e5d]">Beauty of Serendia</span>
                    </h2>
                    <p className="text-gray-400 text-lg font-light mb-12 max-w-2xl mx-auto">
                        Whether you are a collector or looking for an engagement stone that
                        lasts a lifetime, our team is ready to guide you through the selection process.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/collections"
                            className="w-full sm:w-auto px-12 py-4 bg-[#b38e5d] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#a17e4f] transition-all"
                        >
                            View Collection
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto px-12 py-4 border border-white/20 text-white font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-all"
                        >
                            Contact Specialist
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
