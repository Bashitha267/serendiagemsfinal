"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <h3 className="text-gray-900 font-medium text-lg transition-colors group-hover:text-[#1152d4]">
          {question}
        </h3>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="material-symbols-outlined text-gray-400 group-hover:text-[#1152d4] flex-shrink-0"
        >
          expand_more
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-8 pt-0">
              <p className="text-gray-600 leading-relaxed max-w-2xl">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


interface Category {
  id: number;
  name: string;
  image_url: string;
  slug: string;
}

// Trust Bar Component
function TrustBar() {
  const features = [
    {
      icon: "diamond",
      title: "Natural Gemstones",
      subtitle: "UNHEATED & UNTREATED",
    },
    {
      icon: "verified",
      title: "Lab Certified",
      subtitle: "GET AUTHENTICITY PROOF",
    },
    {
      icon: "sell",
      title: "Affordable Range",
      subtitle: "WIDE VARIETY",
    },
    {
      icon: "security",
      title: "100% Payment Secure",
      subtitle: "SECURE PAYMENT",
    },
    {
      icon: "public",
      title: "World Wide Shipping",
      subtitle: "GLOBAL DELIVERY",
    },
    {
      icon: "package_2",
      title: "100% Pure",
      subtitle: "DIRECT FROM MINE",
    },
  ];

  return (
    <div className="w-full bg-[#E7EAE5] py-20 border-y border-slate-100">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-100 p-8 flex flex-col items-center text-center gap-5 group rounded-sm transition-all duration-500 hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:border-[#b38e5d]/20"
            >
              <span className="material-symbols-outlined text-[#b38e5d] text-4xl font-extralight group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </span>
              <div className="flex flex-col gap-2">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">
                  {feature.title}
                </h4>
                <div className="w-6 h-[1px] bg-[#b38e5d]/30 mx-auto group-hover:w-10 transition-all duration-500" />
                <p className="text-[9px] text-gray-400 uppercase tracking-[0.15em] font-medium leading-relaxed">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>([
    "/hero/hero.jpeg",
    "/hero/hero1.jpeg",
    "/hero/hero3.jpeg",
    "/hero/hero4.jpeg",
  ]);
  const [faqs, setFaqs] = useState<{ id: string; question: string; answer: string }[]>([]);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const { data } = await supabase
          .from("faqs")
          .select("id, question, answer")
          .order("display_order", { ascending: true });

        if (data) setFaqs(data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFAQs();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true });

        if (data) setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);



  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const { data } = await supabase.from('hero_images').select('image_url').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          setHeroImages(data.map((d: { image_url: string }) => d.image_url));
        }
      } catch (error) {
        console.error("Error fetching hero images", error);
      }
    };
    fetchHeroImages();
  }, []);

  // Automatic slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-50">
      {/* Hero Section */}
      <header className="relative flex min-h-screen items-center justify-center pt-24 pb-8 px-4 md:px-8">
        <div className="absolute inset-2 md:inset-4 z-0 rounded-3xl overflow-hidden">
          {/* Slideshow backgrounds */}
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
            >
              <div
                className="h-full w-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `linear-gradient(rgba(11, 15, 25, 0.3) 0%, rgba(11, 15, 25, 0.7) 100%), url("${image}")`,
                }}
              />
              <div
                className="absolute inset-0 z-10 bg-transparent"
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/20 z-0" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex flex-col items-start text-left max-w-4xl px-4 md:px-10 lg:px-20 w-full"
        >

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >

          </motion.div>
        </motion.div>
      </header>

      {/* Features Section */}


      <div className="layout-container flex grow flex-col max-w-[1440px] mx-auto w-full px-4 md:px-10 lg:px-20 py-16 gap-20">
        {/* Philosophy Section: Rare Gems */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-10"
        >
          <div className="flex flex-col lg:flex-row gap-16 lg:items-center">
            {/* Left side: Overlapping Images */}
            <motion.div variants={fadeInUp} className="flex-1 relative">
              <div className="group relative aspect-square w-full max-w-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <motion.div
                  initial={{ scale: 1.2, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full w-full"
                >
                  <Image
                    src="/neckless.jpg"
                    alt="Fine Jewelry"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute -bottom-8 -right-8 w-48 h-48 rounded-xl overflow-hidden border-8 border-white shadow-xl hidden md:block"
              >
                <Image
                  src="/philosophy-section.jpeg"
                  alt="Gemstone Detail"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>

            {/* Right side: Content */}
            <motion.div variants={fadeInUp} className="flex-1 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-gray-900 font-serif text-5xl md:text-6xl leading-[1.1]">
                  Rare gems for <br />
                  <span className="text-[#b38e5d] italic font-serif">unique moments</span>
                </h2>
                <div className="w-16 h-[2px] bg-gray-300 mt-6" />
              </div>

              <p className="text-gray-600 text-lg font-light leading-relaxed max-w-xl">
                At Serendia Gems, we don&apos;t just sell stones; we curate legacies.
                Each gem in our collection is hand-selected from the
                mines of Ratnapura district in Sri Lanka ensuring
                unparalleled clarity and vibrant color.
              </p>

              <div className="grid grid-cols-2 gap-10 py-4">
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-gray-900">500+</span>
                  <span className="text-gray-400 text-sm uppercase tracking-wider font-medium">Stones Sold</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-gray-900">100%</span>
                  <span className="text-gray-400 text-sm uppercase tracking-wider font-medium">Certified Natural</span>
                </div>
              </div>

              <Link
                href="/about"
                className="flex items-center gap-2 text-gray-900 font-bold border-b-2 border-gray-900 w-fit pb-1 group hover:text-[#b38e5d] hover:border-[#b38e5d] transition-all"
              >
                <span className="text-xs uppercase tracking-[0.2em]">Read our philosophy</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.section>

      </div>

      {/* Categories Section with Custom Background */}
      <div className="w-full bg-[#FAFAFA] py-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20">
          <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col gap-10"
          >
            <motion.div
              variants={fadeInUp}
              className="text-center"
            >
              <h2 className="text-gray-900 text-3xl md:text-5xl font-serif font-bold mb-4 uppercase tracking-widest text-center">
                Gemstone Categories
              </h2>
              <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                Explore the finest selection of ethically sourced gemstones from the heart of Sri Lanka.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col gap-4 group transition-all duration-300"
                >
                  <Link
                    href={`/collections?category=${category.slug}`}
                    className="w-full aspect-square rounded-none overflow-hidden relative bg-white border border-slate-100 p-6"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        className="object-contain transition-transform duration-1000 group-hover:scale-120"
                      />
                      <div className="absolute inset-0 z-10 bg-transparent" />
                    </div>
                  </Link>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-gray-900 text-sm font-medium transition-colors line-clamp-1">
                      {category.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </div>
      </div>

      <TrustBar />

      <div className="layout-container flex grow flex-col max-w-[1440px] mx-auto w-full px-4 md:px-10 lg:px-20 py-16 gap-20">

        {/* Client Stories Section */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col gap-16 py-10"
        >
          <div className="text-center flex flex-col gap-4">
            <span className="text-[#b38e5d] font-bold tracking-[0.3em] uppercase text-[10px]">
              Client Stories
            </span>
            <h2 className="text-gray-900 text-4xl md:text-5xl font-serif font-medium leading-tight">
              Enduring Legacies
            </h2>
            <p className="text-gray-600 text-sm max-w-xl mx-auto font-light">
              Hear from collectors who have found their perfect gem with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Eleanor P.",
                location: "NEW YORK, USA",
                initial: "E",
                quote: "The blue sapphire I purchased is absolutely mesmerizing. The clarity surpasses anything I've seen in local jewelry stores. Highly recommended for serious collectors."
              },
              {
                name: "Marcus T.",
                location: "LONDON, UK",
                initial: "M",
                quote: "Incredible service from start to finish. They helped me source a rare Padparadscha for my engagement ring. It's unique and stunning."
              },
              {
                name: "Sarah L.",
                location: "SYDNEY, AUSTRALIA",
                initial: "S",
                quote: "Authenticity was my biggest concern when buying online. The GRS certificate provided peace of mind, and the stone is exactly as described."
              }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="bg-white p-10 rounded-xl relative flex flex-col gap-8 group shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#b38e5d]/20 transition-all duration-500"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-1 text-[#b38e5d]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px] fill-current">star</span>
                    ))}
                  </div>
                  <span className="material-symbols-outlined text-slate-100 text-6xl font-extralight absolute top-4 right-6 select-none">
                    format_quote
                  </span>
                </div>

                <blockquote className="text-gray-800 text-base font-serif italic leading-relaxed relative z-10">
                  &quot;{testimonial.quote}&quot;
                </blockquote>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#b38e5d] font-serif font-bold border border-slate-100 shadow-inner">
                    {testimonial.initial}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-bold text-sm tracking-tight">{testimonial.name}</span>
                    <span className="text-gray-500 text-[10px] tracking-[0.1em] uppercase font-medium">{testimonial.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center py-20"
        >
          <div className="max-w-4xl w-full">
            <div className="text-center mb-16">
              <span className="text-[#b38e5d] font-bold tracking-[0.2em] uppercase text-xs">
                Common Questions
              </span>
              <h2 className="text-gray-900 text-4xl md:text-5xl font-serif font-bold mt-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="flex flex-col">
              {faqs.length > 0 ? (
                faqs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))
              ) : (
                <>
                  <FAQItem
                    question="Are your gemstones natural and treated?"
                    answer="All our gemstones are 100% natural. We clearly disclose any treatments. The majority of our collection consists of unheated and untreated stones, directly sourced from mines."
                  />
                  <FAQItem
                    question="Do you provide certification?"
                    answer="Yes, every gemstone comes with a certificate of authenticity from reputable gemological laboratories. We ensure transparency in every purchase."
                  />
                  <FAQItem
                    question="What is your return policy?"
                    answer="We offer a 30-day money-back guarantee. If you are not completely satisfied with your purchase, you can return it for a full refund or exchange, provided it is in its original condition."
                  />
                  <FAQItem
                    question="Do you ship internationally?"
                    answer="Yes, we offer secure, insured worldwide shipping. Shipping times vary by location, but we strive to deliver your precious gems as safely and quickly as possible."
                  />
                  <FAQItem
                    question="Can I request a custom jewelry design?"
                    answer="Absolutely! We specialize in bespoke jewelry design. Our master craftsmen can create unique pieces around the gemstone of your choice. Contact us to discuss your vision."
                  />
                  <FAQItem
                    question="How do I care for my gemstones?"
                    answer="Store your gemstones separately in soft pouches, clean them with mild soap and water, and avoid exposure to harsh chemicals. We provide detailed care instructions with every purchase."
                  />
                </>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
