"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Welcome back!');
                router.push('/admin');
                router.refresh();
            } else {
                toast.error(data.error || 'Login failed');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-[#0f172a] p-8 text-center">
                    <div className="inline-flex items-center gap-3 text-white">
                        <Image
                            src="/logo.jpg"
                            alt="Serendia Gems Logo"
                            width={40}
                            height={40}
                            className="rounded-full border-2 border-[#b38e5d]"
                        />
                        <h2 className="text-xl font-serif font-bold">Serendia Gems</h2>
                    </div>
                    <p className="text-slate-400 text-sm mt-3 uppercase tracking-widest">Admin Portal</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b38e5d]/20 focus:border-[#b38e5d] text-gray-900 bg-slate-50/50"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b38e5d]/20 focus:border-[#b38e5d] text-gray-900 bg-slate-50/50"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#b38e5d] text-white font-bold rounded-lg hover:bg-[#a07d4f] transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>
            </div>
            <p className="text-gray-400 text-xs mt-8">
                &copy; {new Date().getFullYear()} Serendia Gems. Restricted Access.
            </p>
        </div>
    );
}
