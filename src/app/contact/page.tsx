"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import contactUs from "@/assests/contact-us.jpeg";

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

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white overflow-hidden">
            {/* Elegant Hero Section for Contact */}
            <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
                <Image
                    src={contactUs}
                    alt="Serendia Gems Bespoke Service"
                    fill
                    className="object-cover brightness-[0.45]"
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
                    <span className="text-[#b38e5d] font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">
                        Concierge
                    </span>
                    <h1 className="text-white text-5xl md:text-7xl font-serif font-medium leading-tight mb-6">
                        Bespoke <br />
                        <span className="italic">Excellence</span>
                    </h1>
                    <div className="w-12 h-[1px] bg-[#b38e5d] mx-auto" />
                </motion.div>
            </section>

            <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-24">
                <div className="flex flex-col lg:flex-row gap-24 items-start">

                    {/* Left Column: Form */}
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        transition={{ duration: 0.8 }}
                        className="flex-1 w-full"
                    >
                        <div className="mb-12">
                            <h2 className="text-gray-900 text-4xl font-serif font-medium mb-4">Send an Inquiry</h2>
                            <p className="text-gray-500 font-light text-lg">Our specialists will respond to your request within 24 business hours.</p>
                        </div>

                        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                            <div className="flex flex-col gap-3 group">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#b38e5d]">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Your preferred name"
                                    className="bg-transparent border-b border-gray-200 py-3 text-gray-900 placeholder:text-gray-300 focus:border-[#b38e5d] outline-none transition-all duration-300"
                                />
                            </div>
                            <div className="flex flex-col gap-3 group">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#b38e5d]">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    className="bg-transparent border-b border-gray-200 py-3 text-gray-900 placeholder:text-gray-300 focus:border-[#b38e5d] outline-none transition-all duration-300"
                                />
                            </div>
                            <div className="flex flex-col gap-3 md:col-span-2 group">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#b38e5d]">Inquiry Type</label>
                                <div className="relative border-b border-gray-200">
                                    <select className="w-full bg-transparent py-3 text-gray-900 focus:outline-none appearance-none cursor-pointer">
                                        <option>Bespoke Jewelry Design</option>
                                        <option>Loose Gemstone Inquiry</option>
                                        <option>Investment Grade Sapphire Consultation</option>
                                        <option>General Concierge Inquiries</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">expand_more</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 md:col-span-2 group">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#b38e5d]">Your Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about the piece or stone you are envisioning..."
                                    className="bg-transparent border-b border-gray-200 py-3 text-gray-900 placeholder:text-gray-300 focus:border-[#b38e5d] outline-none transition-all duration-300 resize-none"
                                />
                            </div>
                            <div className="md:col-span-2 pt-8">
                                <button className="inline-flex items-center justify-center px-16 py-5 bg-[#0B0F19] text-white font-bold text-xs tracking-[0.3em] uppercase hover:bg-[#b38e5d] transition-all duration-500 shadow-xl shadow-black/10 active:scale-[0.98]">
                                    Submit Inquiry
                                </button>
                                <p className="text-[9px] text-gray-400 mt-6 tracking-widest uppercase font-medium">
                                    Strictly Confidential &mdash; Privacy Protected
                                </p>
                                <div className="mt-8 flex items-center gap-4">
                                    <a href="#" className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-gray-500 hover:text-[#b38e5d] hover:border-[#b38e5d] transition-all duration-300">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                        </svg>
                                        <span className="text-[10px] uppercase tracking-widest font-bold">Instagram</span>
                                    </a>
                                    <a href="#" className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-gray-500 hover:text-[#b38e5d] hover:border-[#b38e5d] transition-all duration-300">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        <span className="text-[10px] uppercase tracking-widest font-bold">Facebook</span>
                                    </a>
                                    <a href="https://wa.me/94112345678" className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-gray-500 hover:text-[#b38e5d] hover:border-[#b38e5d] transition-all duration-300">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.301-.15-1.767-.872-2.04-.971-.272-.1-.47-.15-.67.15-.2.3-.77.971-.944 1.17-.173.2-.347.225-.648.075-.301-.15-1.27-.468-2.42-1.494-.894-.797-1.498-1.782-1.673-2.081-.173-.3-.018-.462.13-.61.137-.133.301-.351.452-.527.15-.176.2-.301.3-.501.1-.2.05-.375-.025-.526-.075-.15-.67-1.616-.917-2.214-.241-.58-.487-.5-.67-.508-.173-.008-.371-.01-.57-.01-.2 0-.525.075-.8.375-.272.3-1.042 1.016-1.042 2.479 0 1.462 1.066 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.767-.721 2.016-1.417.247-.695.247-1.291.173-1.417-.074-.125-.272-.2-.573-.35zm-5.462 7.618C10.51 22.01 9.043 21.613 7.74 20.847L5 21.647l.813-2.673A9.974 9.974 0 014.223 12c0-5.523 4.477-10 10-10 5.522 0 10 4.477 10 10 0 5.522-4.478 10-10 10zm0-18c-4.411 0-8 3.589-8 8 0 1.448.389 2.85 1.127 4.073L2.559 20.6l3.527-.797c1.235.808 2.68 1.237 4.148 1.237 4.411 0 8-3.589 8-8 0-4.411-3.589-8-8-8z" />
                                        </svg>
                                        <span className="text-[10px] uppercase tracking-widest font-bold">WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        </form>
                    </motion.div>

                    {/* Right Column: Information */}
                    <div className="lg:w-[450px] w-full flex flex-col gap-16">

                        {/* Location Section */}
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="flex flex-col gap-10"
                        >
                            <motion.div variants={fadeInUp} className="space-y-6 bg-[#FBFBFB] p-10 border border-slate-50">
                                <h3 className="text-gray-900 font-serif text-2xl italic">The Atelier</h3>
                                <div className="text-gray-500 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-[#b38e5d] text-xl mt-1">location_on</span>
                                        <p className="text-sm font-light leading-relaxed">
                                            Level 32, West Tower, World Trade Center, <br />
                                            Echelon Square, Colombo 00100, <br />
                                            Sri Lanka
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="material-symbols-outlined text-[#b38e5d] text-xl">schedule</span>
                                        <p className="text-sm font-light">Mon &mdash; Fri: 09:00 &ndash; 18:00 IST</p>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <a href="#" className="inline-flex items-center gap-2 text-[#b38e5d] text-[10px] font-bold uppercase tracking-widest border-b border-transparent hover:border-[#b38e5d] transition-all pb-1">
                                        Request in-person appointment
                                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                    </a>
                                </div>
                            </motion.div>

                            {/* Contact Details */}
                            <motion.div variants={fadeInUp} className="space-y-8 pl-10">
                                <div className="space-y-2">
                                    <h4 className="text-[#b38e5d] text-[10px] uppercase font-bold tracking-[0.3em]">Direct Communication</h4>
                                    <div className="space-y-3">
                                        <a href="mailto:concierge@serendiagems.com" className="block text-gray-900 text-xl font-serif hover:text-[#b38e5d] transition-colors">concierge@serendiagems.com</a>
                                        <a href="tel:+94112345678" className="block text-gray-900 text-xl font-serif hover:text-[#b38e5d] transition-colors">+94 11 234 5678</a>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4">
                                    <h4 className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.3em]">Social Portfolios</h4>
                                    <div className="flex items-center gap-8">
                                        {["Instagram", "Facebook", "LinkedIn"].map((social) => (
                                            <a key={social} href="#" className="text-gray-500 hover:text-gray-900 text-[10px] font-bold uppercase tracking-widest transition-colors">
                                                {social}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Visual Accent */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-square w-full grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 hidden lg:block overflow-hidden"
                        >
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv3vZ9NiNnfKygQhnpORz_9oYRwfvExv7J7AfC_SauSE3X3V1HIxkOAfW136kRVD7tHyBLYzfGtjk7ALTcOoFufVdyBh8yuvG3_qHpKGbDq80oW5zisBfZ8NWWNWIG6hFFOcEM2PtfDGI2vTBA7m4iTn9sKC1og3o1KE5TyZPmq3w459-eC55E_J-iDwbrQ5Kt_cNc7vWf47Jf1UIjhxXvOmysp_a7ZwvS2mmHnQs_D0ZqdID6Tc5wG4mJOGifxDaA11QSbO19_cAL"
                                alt="Atelier Detail"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Global Reach Section */}
            <section className="bg-[#0B0F19] py-24 border-t border-white/5">
                <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { title: "Sourcing", desc: "Direct lineage from Ratnapura primary mines." },
                            { title: "Logistics", desc: "Fully insured global door-to-door delivery." },
                            { title: "Certification", desc: "Verified by GRS, GIA, and IGI laboratories." },
                            { title: "Support", desc: "Dedicated jewelery specialists for every client." }
                        ].map((item, idx) => (
                            <div key={idx} className="space-y-4">
                                <h5 className="text-[#b38e5d] font-serif text-lg italic">{item.title}</h5>
                                <p className="text-white/40 text-sm font-light leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
