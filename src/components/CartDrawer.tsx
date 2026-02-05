"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

import { useRouter } from "next/navigation";

export default function CartDrawer() {
    const router = useRouter();
    const {
        items,
        isOpen,
        closeCart,
        removeItem,
        updateQuantity,
        totalItems,
        totalPrice,
    } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Cart Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-slate-200 z-[70] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#1152d4]">
                                    shopping_bag
                                </span>
                                <h2 className="text-gray-900 text-lg font-bold">
                                    Your Cart ({totalItems})
                                </h2>
                            </div>
                            <button
                                onClick={closeCart}
                                className="text-gray-400 hover:text-gray-900 transition-colors p-1"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {items.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center h-full text-center"
                                >
                                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                                        shopping_bag
                                    </span>
                                    <h3 className="text-gray-900 text-xl font-medium mb-2">
                                        Your cart is empty
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-6">
                                        Discover our exquisite gemstone collection
                                    </p>
                                    <button
                                        onClick={closeCart}
                                        className="bg-[#1152d4] hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {items.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200"
                                        >
                                            {/* Image */}
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-gray-900 font-medium text-sm">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-gray-500 text-xs mt-0.5">
                                                        {item.weight} • {item.cut}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-[#1152d4] font-bold">
                                                        ${item.price.toLocaleString()}
                                                    </span>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(item.id, item.quantity - 1)
                                                            }
                                                            className="w-7 h-7 rounded-md bg-slate-200 text-gray-700 hover:bg-slate-300 transition-colors flex items-center justify-center"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">
                                                                remove
                                                            </span>
                                                        </button>
                                                        <span className="text-gray-900 text-sm w-6 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(item.id, item.quantity + 1)
                                                            }
                                                            className="w-7 h-7 rounded-md bg-slate-200 text-gray-700 hover:bg-slate-300 transition-colors flex items-center justify-center"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">
                                                                add
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors self-start"
                                            >
                                                <span className="material-symbols-outlined text-lg">
                                                    delete
                                                </span>
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border-t border-slate-200 px-6 py-5"
                            >
                                {/* Subtotal */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900 font-bold text-xl">
                                        ${totalPrice.toLocaleString()}
                                    </span>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={() => {
                                        closeCart();
                                        router.push("/checkout");
                                    }}
                                    className="w-full bg-[#1152d4] hover:bg-blue-600 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <span>Proceed to Checkout</span>
                                    <span className="material-symbols-outlined text-sm">
                                        arrow_forward
                                    </span>
                                </button>

                                {/* Continue Shopping */}
                                <button
                                    onClick={closeCart}
                                    className="w-full mt-3 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors py-2"
                                >
                                    Continue Shopping
                                </button>

                                {/* Trust Badges */}
                                <div className="flex items-center justify-center gap-4 mt-4 text-gray-400 text-xs">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm text-green-500">
                                            verified
                                        </span>
                                        <span>Secure</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm text-green-500">
                                            local_shipping
                                        </span>
                                        <span>Free Shipping</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
