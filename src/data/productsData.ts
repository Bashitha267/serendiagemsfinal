export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    weight: string;
    origin: string;
    shape: string;
    treatment: string;
    clarity?: string;
    color?: string;
    cut: string;
    badge?: string | null;
    badgeColor?: string;
    images: string[];
    category?: string;
}

export const productsData: Record<string, Product> = {
    "1": {
        id: "1",
        name: "Royal Blue Ceylon Sapphire",
        price: 4250,
        description:
            "An exceptional 2.14 carat oval cut sapphire featuring the coveted 'Royal Blue' hue. Sourced ethically from the mines of Ratnapura, Sri Lanka. This stone exhibits excellent clarity and brilliance, perfect for a custom engagement ring or investment piece.",
        weight: "2.14 Carats",
        origin: "Sri Lanka (Ceylon)",
        shape: "Oval Mixed Cut",
        treatment: "Heat Only",
        clarity: "VVS1 - Eye Clean",
        color: "Royal Blue",
        cut: "Cushion Cut",
        badge: "New Arrival",
        badgeColor: "bg-[#1152d4]/90",
        category: "Blue Sapphire",
        images: ["/collections/blue/1.png"],
    },
    "2": {
        id: "2",
        name: "Vivid Pink Sapphire",
        price: 3100,
        description:
            "A stunning 1.85 carat pink sapphire with exceptional vivid color saturation. This elegant oval cut gemstone showcases the finest pink hues found in Ceylon sapphires. Heat-treated to enhance its natural beauty while maintaining its authentic character.",
        weight: "1.85 Carats",
        origin: "Sri Lanka (Ceylon)",
        shape: "Oval Cut",
        treatment: "Heated",
        clarity: "VS - Very Good",
        color: "Vivid Pink",
        cut: "Oval Cut",
        badge: null,
        category: "Pink Sapphire",
        images: ["/collections/pink/1.png"],
    },
    "3": {
        id: "3",
        name: "Burma Ruby",
        price: 8500,
        description:
            "An extraordinary 1.50 carat round Burmese ruby displaying the legendary 'pigeon blood' red color. This natural, unheated ruby is exceptionally rare and represents the pinnacle of ruby quality. A true collector's gemstone with impeccable provenance.",
        weight: "1.50 Carats",
        origin: "Myanmar (Burma)",
        shape: "Round Brilliant Cut",
        treatment: "Natural",
        clarity: "VVS - Excellent",
        color: "Pigeon Blood Red",
        cut: "Round Cut",
        badge: "Rare Find",
        badgeColor: "bg-rose-600/90",
        category: "Ruby",
        images: ["/collections/rubie/1.png"],
    },
    "4": {
        id: "4",
        name: "Canary Yellow Sapphire",
        price: 5900,
        description:
            "A magnificent 3.05 carat yellow sapphire with a captivating canary yellow hue. The emerald cut showcases the stone's exceptional clarity and vibrant color. This natural, unheated sapphire is perfect for statement jewelry or as an astrological gemstone.",
        weight: "3.05 Carats",
        origin: "Sri Lanka (Ceylon)",
        shape: "Emerald Cut",
        treatment: "Natural",
        clarity: "VS1 - Eye Clean",
        color: "Canary Yellow",
        cut: "Emerald Cut",
        badge: null,
        category: "Yellow Sapphire",
        images: ["/collections/yellow/1.png"],
    },
    "5": {
        id: "5",
        name: "Peacock Teal Sapphire",
        price: 2800,
        description:
            "A mesmerizing 1.95 carat teal sapphire showcasing a unique peacock-inspired color blend of blue and green. The radiant cut enhances the stone's exceptional brilliance and color play. Heat-treated to bring out its captivating hues.",
        weight: "1.95 Carats",
        origin: "Sri Lanka (Ceylon)",
        shape: "Radiant Cut",
        treatment: "Heated",
        clarity: "VS - Very Good",
        color: "Peacock Teal",
        cut: "Radiant Cut",
        badge: null,
        category: "Teal Sapphire",
        images: ["/collections/green/1.png"],
    },
    "6": {
        id: "6",
        name: "Lavender Spinel",
        price: 1950,
        description:
            "A delightful 2.50 carat lavender spinel with excellent transparency and a soft, romantic color. The cushion cut perfectly complements the stone's gentle hue. This natural, untreated spinel is a rare and beautiful alternative to traditional gemstones.",
        weight: "2.50 Carats",
        origin: "Sri Lanka (Ceylon)",
        shape: "Cushion Cut",
        treatment: "Natural",
        clarity: "VVS - Excellent",
        color: "Lavender",
        cut: "Cushion Cut",
        badge: null,
        category: "Spinel",
        images: ["/collections/green/1.png"],
    },
    "7": {
        id: "7",
        name: "Rare Padparadscha Sapphire",
        price: 12500,
        description:
            "A breathtaking 2.01 carat Padparadscha sapphire, exhibiting the perfect marriage of lotus pink and sunset orange. This natural, unheated stone is among the rarest of all sapphires. A true masterpiece of nature from the gem fields of Sri Lanka.",
        weight: "2.01 Carats",
        origin: "Sri Lanka (Ceylon)",
        shape: "Oval Cut",
        treatment: "Natural",
        clarity: "VVS2 - Eye Clean",
        color: "Pinkish Orange",
        cut: "Oval Cut",
        badge: "Investment Grade",
        badgeColor: "bg-purple-600/90",
        category: "Padparadscha",
        images: ["/collections/padmaracha/1.png"],
    },
    "8": {
        id: "8",
        name: "Cat's Eye Chrysoberyl",
        price: 4800,
        description:
            "An exceptional 5.40 carat cat's eye chrysoberyl with a sharp, well-defined 'milk and honey' effect. This natural gemstone exhibits a strong chatoyancy that glides across the surface. A rare specimen of exceptional quality and clarity.",
        weight: "5.40 Carats",
        origin: "Sri Lanka (Ceylon)",
        shape: "Cabochon",
        treatment: "Natural",
        clarity: "Excellent Chatoyancy",
        color: "Honey Green",
        cut: "Cabochon",
        badge: "Unique",
        badgeColor: "bg-emerald-600/90",
        category: "Cats Eye",
        images: ["/collections/cats-eye/1.png"],
    },
    "9": {
        id: "9",
        name: "Deep Red Garnet",
        price: 850,
        description:
            "A magnificent 3.25 carat deep red garnet with exceptional clarity and a rich, velvety color. This natural, unheated gemstone is sourced from the fertile lands of Ratnapura, Sri Lanka. Its brilliant cut ensures a captivating play of light, making it a perfect center stone for elegant jewelry.",
        weight: "3.25 Carats",
        origin: "Sri Lanka",
        shape: "Round Brilliant",
        treatment: "Natural",
        clarity: "VVS - Eye Clean",
        color: "Deep Red",
        cut: "Round Cut",
        badge: "Classic",
        badgeColor: "bg-red-700/90",
        category: "Fine Gems",
        images: ["/collections/fine-gems/garnet.png"],
    },
    "10": {
        id: "10",
        name: "Sky Blue Topaz",
        price: 650,
        description:
            "A breathtaking 4.50 carat sky blue topaz featuring a serene and clear blue hue. This expertly cut emerald-shaped gemstone exhibits remarkable brilliance and transparency. Its refreshing color and durable nature make it an ideal choice for daily wear jewelry.",
        weight: "4.50 Carats",
        origin: "Brazil",
        shape: "Emerald Cut",
        treatment: "Irradiated (Standard)",
        clarity: "IF - Flawless",
        color: "Sky Blue",
        cut: "Emerald Cut",
        badge: "Popular",
        badgeColor: "bg-sky-500/90",
        category: "Fine Gems",
        images: ["/collections/fine-gems/topaz.png"],
    },
    "11": {
        id: "11",
        name: "Vibrant Green Peridot",
        price: 920,
        description:
            "A stunning 2.80 carat peridot with a vivid, olive-green glow. Known as the 'gem of the sun', this natural gemstone is carefully cut to maximize its unique double refraction and brilliance. A fresh and energetic piece for any gemstone collection.",
        weight: "2.80 Carats",
        origin: "Pakistan",
        shape: "Oval Cut",
        treatment: "Natural",
        clarity: "VS - Very Good",
        color: "Olive Green",
        cut: "Oval Cut",
        badge: "Organic",
        badgeColor: "bg-lime-600/90",
        category: "Fine Gems",
        images: ["/collections/fine-gems/peridot.png"],
    },
    "12": {
        id: "12",
        name: "Golden Citrine",
        price: 580,
        description:
            "A radiant 5.10 carat golden citrine that captures the essence of sunshine. This cushion-cut gemstone displays a warm, honey-yellow hue with excellent transparency. Its vibrant energy and beautiful color make it a favorite for statement rings and pendants.",
        weight: "5.10 Carats",
        origin: "Brazil",
        shape: "Cushion Cut",
        treatment: "Heated (Standard)",
        clarity: "VVS - Eye Clean",
        color: "Golden Yellow",
        cut: "Cushion Cut",
        badge: "Warmth",
        badgeColor: "bg-amber-500/90",
        category: "Fine Gems",
        images: ["/collections/fine-gems/citrine.png"],
    },
    "13": {
        id: "13",
        name: "Royal Purple Amethyst",
        price: 750,
        description:
            "An exquisite 3.90 carat royal purple amethyst with deep, saturated color and flashes of rose-red. This heart-shaped gemstone is meticulously cut to showcase its natural beauty and exceptional clarity. A symbol of royalty and peace.",
        weight: "3.90 Carats",
        origin: "Uruguay",
        shape: "Heart Cut",
        treatment: "Natural",
        clarity: "VVS1 - Eye Clean",
        color: "Royal Purple",
        cut: "Heart Cut",
        badge: "Elegant",
        badgeColor: "bg-purple-800/90",
        category: "Fine Gems",
        images: ["/collections/fine-gems/amethyst.png"],
    },
};

// Helper function to get all products as an array
export const getAllProducts = (): Product[] => {
    return Object.values(productsData);
};

// Helper function to get a product by ID
export const getProductById = (id: string): Product | undefined => {
    return productsData[id];
};

// Helper function to get similar products (same category, excluding current product)
export const getSimilarProducts = (productId: string, limit: number = 4): Product[] => {
    const currentProduct = productsData[productId];
    if (!currentProduct) return [];

    const allProducts = getAllProducts();
    const similarProducts = allProducts.filter(
        (product) =>
            product.id !== productId &&
            (product.category === currentProduct.category ||
                product.treatment === currentProduct.treatment)
    );

    return similarProducts.slice(0, limit);
};
