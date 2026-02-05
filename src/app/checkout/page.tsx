"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { CreditCard, Calendar, Lock, User, MapPin, Mail, Phone } from "lucide-react";

export default function CheckoutPage() {
    const { items, totalPrice } = useCart();

    // Form States
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        altPhone: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zip: "",
        country: "",
        cardName: "",
        cardNumber: "",
        expDate: "",
        cvv: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Format Card Number for visual display
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.substring(i, i + 4));
        }
        return parts.length > 1 ? parts.join(" ") : value;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 pt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">

                    {/* LEFT COLUMN: Customer Information */}
                    <div className="space-y-10">
                        {/* Contact Info */}
                        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-[#1152d4]/10 text-[#1152d4] flex items-center justify-center text-sm">1</span>
                                Contact Information
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1152d4] focus:border-transparent outline-none transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1152d4] focus:border-transparent outline-none transition-all"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Phone <span className="text-gray-400 font-normal">(Optional)</span></label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="tel"
                                                name="altPhone"
                                                value={formData.altPhone}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1152d4] focus:border-transparent outline-none transition-all"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Shipping Address */}
                        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-[#1152d4]/10 text-[#1152d4] flex items-center justify-center text-sm">2</span>
                                Shipping Address
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1152d4] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1152d4] outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1152d4] outline-none"
                                            placeholder="123 Street Name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1152d4] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1152d4] outline-none"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Payment & Summary */}
                    <div className="mt-10 lg:mt-0 space-y-8">

                        {/* Order Summary */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                            <div className="flex flex-col gap-4 mb-6">
                                {items.length === 0 ? (
                                    <p className="text-gray-500 text-sm text-center py-4">Your cart is empty.</p>
                                ) : (
                                    items.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                                <p className="text-xs text-gray-500">{item.weight} • Qty {item.quantity}</p>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="border-t border-slate-100 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                                    <span>Total</span>
                                    <span>${totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Section (White Theme) */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">

                            <div className="flex items-center gap-3 mb-8">
                                <CreditCard className="text-[#1152d4] w-6 h-6" />
                                <h2 className="text-xl font-bold text-gray-900 tracking-wide uppercase font-serif">Payment Method</h2>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 relative overflow-hidden group focus-within:border-[#1152d4] focus-within:ring-1 focus-within:ring-[#1152d4] transition-all shadow-inner">

                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-gray-900 font-bold italic text-lg tracking-wide">Card Payment</h3>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-6 bg-[#0057ff] rounded-md shadow-sm"></div>
                                        <div className="w-10 h-6 bg-[#ff6b00] rounded-md shadow-sm"></div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Card Number */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Card Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            maxLength={19}
                                            value={formatCardNumber(formData.cardNumber)}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, "");
                                                setFormData({ ...formData, cardNumber: val });
                                            }}
                                            className="w-full bg-white text-gray-900 px-5 py-4 rounded-xl border border-slate-300 focus:border-[#1152d4] focus:ring-0 placeholder-gray-400 font-mono text-lg tracking-widest transition-colors shadow-sm"
                                            placeholder="XXXX XXXX XXXX XXXX"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Expiry */}
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Expiry</label>
                                            <input
                                                type="text"
                                                name="expDate"
                                                maxLength={5}
                                                value={formData.expDate}
                                                onChange={handleInputChange}
                                                className="w-full bg-white text-gray-900 px-5 py-4 rounded-xl border border-slate-300 focus:border-[#1152d4] focus:ring-0 placeholder-gray-400 font-mono text-lg tracking-widest transition-colors shadow-sm"
                                                placeholder="MM / YY"
                                            />
                                        </div>
                                        {/* CVC */}
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">CVC</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    maxLength={3}
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white text-gray-900 px-5 py-4 rounded-xl border border-slate-300 focus:border-[#1152d4] focus:ring-0 placeholder-gray-400 font-mono text-lg tracking-widest transition-colors shadow-sm"
                                                    placeholder="***"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name on Card */}
                                    <div className="pt-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Card Holder Name</label>
                                        <input
                                            type="text"
                                            name="cardName"
                                            value={formData.cardName}
                                            onChange={handleInputChange}
                                            className="w-full bg-white text-gray-900 px-5 py-4 rounded-xl border border-slate-300 focus:border-[#1152d4] focus:ring-0 placeholder-gray-400 font-medium tracking-wide transition-colors uppercase shadow-sm"
                                            placeholder="JOHN DOE"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-8 bg-[#1152d4] hover:bg-blue-600 text-white font-bold py-5 rounded-xl shadow-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 uppercase tracking-wider text-sm">
                                <Lock className="w-4 h-4" />
                                Secure Pay ${totalPrice.toLocaleString()}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
