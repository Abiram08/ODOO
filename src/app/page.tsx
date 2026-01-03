"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Globe, MapPin, Compass, Plane, Users, Map, Star, ChevronDown, Menu, X } from "lucide-react";

// Animated Counter Component
function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <div ref={ref} className="text-3xl font-bold text-[#2C2C2C]">
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </div>
  );
}

// Floating Trip Card Component
function FloatingTripCard({
  city,
  country,
  image,
  days,
  budget,
  delay,
  position,
}: {
  city: string;
  country: string;
  image: string;
  days: number;
  budget: string;
  delay: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
}) {
  return (
    <div
      className="absolute w-52 bg-white rounded-2xl overflow-hidden shadow-2xl cursor-pointer
                 hover:scale-105 transition-all duration-500
                 border border-[#F5E6D3]"
      style={{
        ...position,
        animation: `floatCard 6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <div
        className="h-28 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
          <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
          <span className="text-xs font-medium text-[#2C2C2C]">4.8</span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-[#2C2C2C] text-lg">{city}</h4>
        <p className="text-sm text-[#6B5B4F]">{country}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F5E6D3]">
          <span className="text-sm text-[#6B5B4F]">{days} days</span>
          <span className="font-bold text-[#FF6B4A]">{budget}</span>
        </div>
      </div>
    </div>
  );
}

// Flying Plane Component
function FlyingPlane({ delay, path }: { delay: number; path: string }) {
  return (
    <div
      className="absolute w-6 h-6"
      style={{
        offsetPath: `path('${path}')`,
        animation: `flyAlongPath 8s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <Plane className="w-6 h-6 text-[#FF6B4A] drop-shadow-lg" style={{ transform: "rotate(45deg)" }} />
    </div>
  );
}

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Premium Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-[#F5E6D3]"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF6B4A] to-[#F59E0B] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#2C2C2C]">GlobeTrotter</span>
                <span className="text-[10px] text-[#6B5B4F] -mt-1 tracking-wider">TRAVEL PLANNER</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { label: "Features", href: "#features" },
                { label: "Destinations", href: "#destinations" },
                { label: "Pricing", href: "#pricing" },
                { label: "About", href: "#about" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-[#2C2C2C] hover:text-[#FF6B4A] font-medium transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#FF6B4A] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2.5 text-[#2C2C2C] hover:text-[#FF6B4A] font-semibold transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#F59E0B] text-white font-semibold hover:shadow-xl hover:scale-105 transition-all shadow-lg shadow-[#FF6B4A]/30"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#F5E6D3] transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#2C2C2C]" />
              ) : (
                <Menu className="w-6 h-6 text-[#2C2C2C]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#F5E6D3] shadow-xl">
            <div className="px-6 py-4 space-y-3">
              {["Features", "Destinations", "Pricing", "About"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block py-2 text-[#2C2C2C] font-medium">
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-[#F5E6D3] space-y-3">
                <Link href="/login" className="block py-2 text-[#2C2C2C] font-medium">Sign in</Link>
                <Link href="/register" className="block py-3 text-center rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#F59E0B] text-white font-semibold">
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center pt-20"
        style={{
          background: "linear-gradient(180deg, #FFFBF7 0%, #F5E6D3 50%, rgba(245, 158, 11, 0.12) 100%)",
        }}
      >
        {/* Animated Flight Paths SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <linearGradient id="flightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B4A" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Flight Path 1 */}
          <path
            id="flightPath1"
            d="M 100 200 Q 300 100, 500 250 T 900 180"
            fill="none"
            stroke="url(#flightGradient)"
            strokeWidth="2"
            strokeDasharray="8 8"
            opacity="0.4"
          />

          {/* Flight Path 2 */}
          <path
            id="flightPath2"
            d="M 150 450 Q 350 350, 550 400 T 950 350"
            fill="none"
            stroke="url(#flightGradient)"
            strokeWidth="2"
            strokeDasharray="8 8"
            opacity="0.3"
          />

          {/* Flight Path 3 */}
          <path
            id="flightPath3"
            d="M 50 600 Q 250 500, 450 550 T 850 480"
            fill="none"
            stroke="url(#flightGradient)"
            strokeWidth="2"
            strokeDasharray="8 8"
            opacity="0.25"
          />
        </svg>

        {/* Flying Planes along paths */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <FlyingPlane delay={0} path="M 100 200 Q 300 100, 500 250 T 900 180" />
          <FlyingPlane delay={3} path="M 150 450 Q 350 350, 550 400 T 950 350" />
          <FlyingPlane delay={6} path="M 50 600 Q 250 500, 450 550 T 850 480" />
        </div>

        {/* Floating Travel Icons (subtle) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <MapPin
            className="absolute w-8 h-8 text-[#FF6B4A]/15"
            style={{ top: "20%", left: "8%", animation: "floatIcon 7s ease-in-out infinite" }}
          />
          <Compass
            className="absolute w-10 h-10 text-[#F59E0B]/15"
            style={{ top: "65%", left: "5%", animation: "floatIcon 8s ease-in-out infinite", animationDelay: "2s" }}
          />
          <Map
            className="absolute w-8 h-8 text-[#2D5016]/10"
            style={{ top: "30%", right: "5%", animation: "floatIcon 6s ease-in-out infinite", animationDelay: "1s" }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left Side - Text & CTAs */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-[#F5E6D3] shadow-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#F59E0B] border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    {["A", "B", "C", "D"][i - 1]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-[#6B5B4F]">
                <strong className="text-[#2C2C2C]">12,500+</strong> happy travelers
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-[#2C2C2C] leading-[1.1]">
                Plan Your
                <span className="block bg-gradient-to-r from-[#FF6B4A] via-[#E63E23] to-[#F59E0B] bg-clip-text text-transparent">
                  Perfect Journey
                </span>
              </h1>
              <p className="text-xl text-[#6B5B4F] max-w-lg leading-relaxed">
                Create stunning multi-city itineraries, track your budget in ₹,
                and share your adventures with friends & family.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="group px-8 py-4 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#E63E23] text-white font-bold text-lg shadow-xl shadow-[#FF6B4A]/30 hover:shadow-2xl hover:shadow-[#FF6B4A]/40 hover:scale-105 transition-all flex items-center gap-2"
              >
                Start Planning Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-full border-2 border-[#2C2C2C]/20 text-[#2C2C2C] font-semibold text-lg hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-all"
              >
                View Demo
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="space-y-1">
                <AnimatedCounter target={150} suffix="+" />
                <p className="text-sm text-[#6B5B4F]">Destinations</p>
              </div>
              <div className="space-y-1">
                <AnimatedCounter target={50000} prefix="₹" suffix=" avg" />
                <p className="text-sm text-[#6B5B4F]">Trip savings</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <AnimatedCounter target={4.9} suffix="" />
                  <Star className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
                </div>
                <p className="text-sm text-[#6B5B4F]">User rating</p>
              </div>
            </div>
          </div>

          {/* Right Side - Interactive Globe & Floating Cards */}
          <div
            className="relative h-[550px] lg:h-[650px] hidden lg:block"
            style={{
              transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
              transition: "transform 0.5s ease-out",
            }}
          >
            {/* Glowing Globe */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                className="w-80 h-80 rounded-full relative"
                style={{
                  background: "conic-gradient(from 0deg, #FF6B4A, #F59E0B, #2D5016, #10B981, #FF6B4A)",
                  animation: "rotateGlobe 20s linear infinite",
                  boxShadow: "0 0 80px rgba(255, 107, 74, 0.35), inset 0 0 80px rgba(255,255,255,0.15)",
                }}
              >
                {/* Globe overlay gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-black/20" />

                {/* Grid lines */}
                <div className="absolute inset-4 rounded-full border border-white/20" />
                <div className="absolute inset-8 rounded-full border border-white/15" />
                <div className="absolute inset-12 rounded-full border border-white/10" />

                {/* Orbiting city dots */}
                <div
                  className="absolute w-4 h-4 bg-[#FCD34D] rounded-full"
                  style={{
                    top: "8%",
                    left: "50%",
                    animation: "orbitCity 10s linear infinite",
                    boxShadow: "0 0 20px #FCD34D",
                  }}
                />
                <div
                  className="absolute w-3 h-3 bg-white rounded-full"
                  style={{
                    top: "75%",
                    right: "15%",
                    animation: "orbitCity 12s linear infinite reverse",
                    boxShadow: "0 0 15px white",
                  }}
                />
                <div
                  className="absolute w-3 h-3 bg-[#10B981] rounded-full"
                  style={{
                    bottom: "25%",
                    left: "10%",
                    animation: "orbitCity 15s linear infinite",
                    boxShadow: "0 0 15px #10B981",
                  }}
                />
              </div>

              {/* Globe shadow */}
              <div
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-56 h-10 rounded-[100%]"
                style={{
                  background: "radial-gradient(ellipse, rgba(44,44,44,0.2) 0%, transparent 70%)",
                }}
              />
            </div>

            {/* Floating Trip Cards - Indian Destinations */}
            <FloatingTripCard
              city="Santorini"
              country="Greece"
              image="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=250&fit=crop"
              days={7}
              budget="₹1,80,000"
              delay={0}
              position={{ top: "2%", left: "-8%" }}
            />
            <FloatingTripCard
              city="Jaipur"
              country="Rajasthan, India"
              image="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=250&fit=crop"
              days={4}
              budget="₹35,000"
              delay={2}
              position={{ top: "50%", right: "-10%" }}
            />
            <FloatingTripCard
              city="Bali"
              country="Indonesia"
              image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=250&fit=crop"
              days={6}
              budget="₹95,000"
              delay={1}
              position={{ bottom: "5%", left: "5%" }}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-sm text-[#6B5B4F]">Explore</span>
          <ChevronDown className="w-5 h-5 text-[#FF6B4A]" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#FF6B4A]/10 text-[#FF6B4A] font-semibold text-sm mb-4">
              FEATURES
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#2C2C2C] mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-[#6B5B4F] max-w-2xl mx-auto">
              From destination research to budget tracking in ₹, we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: MapPin,
                title: "Multi-City Itineraries",
                desc: "Plan trips across multiple cities with drag & drop.",
                color: "#FF6B4A",
                bg: "from-[#FFF5F2] to-[#FFE8E2]",
              },
              {
                icon: Plane,
                title: "Visual Timeline",
                desc: "See your entire trip with calendar views.",
                color: "#F59E0B",
                bg: "from-[#FFFBEB] to-[#FEF3C7]",
              },
              {
                icon: Globe,
                title: "Budget in ₹",
                desc: "Track expenses in INR with smart insights.",
                color: "#2D5016",
                bg: "from-[#F0FDF4] to-[#DCFCE7]",
              },
              {
                icon: Users,
                title: "Share & Collaborate",
                desc: "Share trips with friends and travel together.",
                color: "#FF6B4A",
                bg: "from-[#FFF5F2] to-[#FFE8E2]",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl bg-gradient-to-br ${feature.bg} border border-white/50
                           hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group`}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: feature.color }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#6B5B4F]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-24 px-6 lg:px-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FF6B4A 0%, #E63E23 50%, #F59E0B 100%)" }}
      >
        <div className="absolute inset-0 opacity-10">
          <Plane className="absolute w-32 h-32 text-white top-10 left-10 rotate-12" />
          <Globe className="absolute w-40 h-40 text-white bottom-10 right-10" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Explore India & Beyond?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start planning your dream trip today. It&apos;s free to get started!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-10 py-4 rounded-full bg-white text-[#FF6B4A] font-bold text-lg hover:bg-[#FFFBF7] hover:scale-105 transition-all shadow-2xl"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="px-10 py-4 rounded-full border-2 border-white/40 text-white font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-12 bg-[#2C2C2C] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-8 h-8 text-[#FF6B4A]" />
                <span className="text-xl font-bold">GlobeTrotter</span>
              </div>
              <p className="text-gray-400 text-sm">
                Plan your perfect journey with smart itineraries and budget tracking.
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Demo"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Support", links: ["Help Center", "Contact", "Privacy"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-[#FF6B4A] transition-colors text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 GlobeTrotter. Made with ❤️ in India.
            </p>
            <div className="flex items-center gap-4">
              {["Twitter", "Instagram", "LinkedIn"].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-[#FF6B4A] text-sm transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(1deg); }
        }
        
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes rotateGlobe {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes orbitCity {
          from { transform: rotate(0deg) translateX(140px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
        }
        
        @keyframes flyAlongPath {
          0% { offset-distance: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
