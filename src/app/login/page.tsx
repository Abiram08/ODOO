"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Globe, Loader2, Plane, MapPin, Compass } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#FF6B4A] via-[#F59E0B] to-[#2D5016]">
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Floating Icons */}
                <Plane
                    className="absolute w-12 h-12 text-white/20 animate-float"
                    style={{ top: "15%", left: "10%", animationDelay: "0s" }}
                />
                <MapPin
                    className="absolute w-10 h-10 text-white/15 animate-float"
                    style={{ top: "40%", right: "15%", animationDelay: "1s" }}
                />
                <Compass
                    className="absolute w-14 h-14 text-white/10 animate-float"
                    style={{ bottom: "25%", left: "20%", animationDelay: "2s" }}
                />

                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <Globe className="w-8 h-8" />
                        </div>
                        <span className="text-4xl font-bold">GlobeTrotter</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Your Journey<br />Starts Here
                    </h1>
                    <p className="text-xl text-white/80 max-w-md">
                        Plan unforgettable trips, discover amazing destinations, and share your adventures with the world.
                    </p>

                    <div className="mt-12 space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                                ✈️
                            </div>
                            <span className="text-lg">Multi-city itineraries</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                                💰
                            </div>
                            <span className="text-lg">Smart budget tracking</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                                🗓️
                            </div>
                            <span className="text-lg">Visual timeline planning</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div
                className="flex-1 flex items-center justify-center p-8"
                style={{ background: "linear-gradient(180deg, #FFFBF7 0%, #F5E6D3 100%)" }}
            >
                <div className="w-full max-w-md animate-fade-in">
                    <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B4A] to-[#F59E0B] flex items-center justify-center">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-[#2C2C2C]">GlobeTrotter</span>
                    </div>

                    <div className="card p-8 bg-white">
                        <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">Welcome back</h2>
                        <p className="text-[#6B5B4F] mb-8">Sign in to continue planning your adventures</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input pr-12"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B5B4F] hover:text-[#2C2C2C]"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-[#6B5B4F]">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-[#FF6B4A] font-medium hover:text-[#E63E23]">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <p className="mt-8 text-center text-sm text-[#A09080]">
                        Demo: john@example.com / password123
                    </p>
                </div>
            </div>
        </div>
    );
}
