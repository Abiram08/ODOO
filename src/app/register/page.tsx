"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Globe, Loader2, Plane, MapPin, Compass } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Registration failed");
            }

            router.push("/login?registered=true");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#2D5016] via-[#F59E0B] to-[#FF6B4A]">
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Floating Icons */}
                <Plane
                    className="absolute w-12 h-12 text-white/20 animate-float"
                    style={{ top: "20%", right: "15%", animationDelay: "0.5s" }}
                />
                <MapPin
                    className="absolute w-10 h-10 text-white/15 animate-float"
                    style={{ top: "50%", left: "10%", animationDelay: "1.5s" }}
                />
                <Compass
                    className="absolute w-14 h-14 text-white/10 animate-float"
                    style={{ bottom: "20%", right: "20%", animationDelay: "0s" }}
                />

                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <Globe className="w-8 h-8" />
                        </div>
                        <span className="text-4xl font-bold">GlobeTrotter</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Start Your<br />Adventure
                    </h1>
                    <p className="text-xl text-white/80 max-w-md">
                        Join thousands of travelers who plan their perfect trips with GlobeTrotter.
                    </p>

                    <div className="mt-12 grid grid-cols-2 gap-6">
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6">
                            <div className="text-4xl font-bold mb-2">50K+</div>
                            <div className="text-white/70">Trips Created</div>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6">
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-white/70">Destinations</div>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6">
                            <div className="text-4xl font-bold mb-2">10K+</div>
                            <div className="text-white/70">Happy Travelers</div>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6">
                            <div className="text-4xl font-bold mb-2">4.9★</div>
                            <div className="text-white/70">User Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Register Form */}
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
                        <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">Create an account</h2>
                        <p className="text-[#6B5B4F] mb-8">Start planning your dream trips today</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                    Full name
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="input"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

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
                                        minLength={6}
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

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                    Confirm password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create account"
                                )}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-[#6B5B4F]">
                            Already have an account?{" "}
                            <Link href="/login" className="text-[#FF6B4A] font-medium hover:text-[#E63E23]">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
