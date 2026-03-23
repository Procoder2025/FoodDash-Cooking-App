"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChefHat, Star, Clock, Shield, IndianRupee, Flame, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1400&h=700&fit=crop",
    videoId: "1IszT_guI08",
    title: "Freshly Homemade Meals",
    highlight: "Cooked with Love",
    sub: "in Your Neighbourhood",
    desc: "Order authentic home-cooked food from talented home chefs near you.",
  },
  {
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=1400&h=700&fit=crop",
    videoId: "mhDJNfV7hjk",
    title: "Experience the Taste of",
    highlight: "Real Home Food",
    sub: "Wherever You Are",
    desc: "From sambar rice to biryani — real home food delivered to your door.",
  },
  {
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1400&h=700&fit=crop",
    videoId: "1IszT_guI08",
    title: "Say Goodbye to Junk,",
    highlight: "Hello Healthy",
    sub: "Home-Style Dinners",
    desc: "Wholesome, nutritious meals from clean, verified home kitchens.",
  },
  {
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=1400&h=700&fit=crop",
    videoId: "ZJy1ajvMU1k",
    title: "South Indian Specials",
    highlight: "From Amma's Kitchen",
    sub: "to Your Doorstep",
    desc: "Sambar rice, dosa, idli & more — authentic Tamil Nadu home cooking.",
  },
  {
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1400&h=700&fit=crop",
    videoId: "vJapzH_46a8",
    title: "Royal Biryani &",
    highlight: "Mughlai Flavours",
    sub: "Made with Secret Recipes",
    desc: "Dum biryani, kebabs & more from 3-generation family recipes.",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  // No auto-advance — user controls video navigation manually

  const s = slides[current];

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div style={{ width: "100%", position: "relative", overflow: "hidden", minHeight: 520 }}>

        {/* Blurred Background Image Slideshow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: "absolute", inset: 0, zIndex: 0,
            }}
          >
            <img
              src={s.image}
              alt=""
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                filter: "blur(6px) brightness(0.3)",
                transform: "scale(1.1)",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark overlay for text readability */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1 }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
          <div className="hero-layout">

            {/* Left - Text */}
            <div className="hero-text">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
                  color: "#fff", padding: "7px 16px", borderRadius: 50, fontSize: 12, fontWeight: 600, marginBottom: 18,
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ width: 8, height: 8, background: "#4ade80", borderRadius: "50%", display: "inline-block" }}
                />
                <ChefHat size={13} /> 500+ Home Chefs Active
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="hero-title">
                    {s.title}<br />
                    <motion.span
                      animate={{ color: ["#4ade80", "#86efac", "#4ade80"] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      {s.highlight}
                    </motion.span><br />
                    <span style={{ color: "rgba(255,255,255,0.6)" }} className="hero-sub">{s.sub}</span>
                  </h1>
                  <p className="hero-desc">{s.desc}</p>
                </motion.div>
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}
              >
                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} style={{ flex: "1 1 auto" }}>
                  <Link href="/browse" className="hero-btn-primary">
                    <Search size={16} /> Order Now
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} style={{ flex: "1 1 auto" }}>
                  <Link href="/auth/signup?role=cooker" className="hero-btn-secondary">
                    <ChefHat size={16} /> Become a Chef
                  </Link>
                </motion.div>
              </motion.div>

              {/* Mini stats */}
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[
                  { val: "500+", label: "Chefs" },
                  { val: "50K+", label: "Customers" },
                  { val: "4.8", label: "Rating" },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#4ade80" }}>{stat.val}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right - YouTube Video */}
            <div className="hero-image">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  borderRadius: 18, overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                  border: "2px solid rgba(255,255,255,0.12)",
                  aspectRatio: "16/9",
                  background: "#000",
                  position: "relative",
                }}
              >
                <iframe
                  key={current}
                  src={`https://www.youtube.com/embed/${s.videoId}?rel=0&modestbranding=1&playsinline=1`}
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  style={{ width: "100%", height: "100%", border: "none", position: "absolute", top: 0, left: 0 }}
                />
              </motion.div>

              {/* Navigation */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 14 }}>
                <button onClick={prev} className="hero-nav-btn"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                >
                  <ChevronLeft size={16} />
                </button>
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} style={{
                    width: current === i ? 28 : 9, height: 9, borderRadius: 50, border: "none", cursor: "pointer",
                    background: current === i ? "#4ade80" : "rgba(255,255,255,0.3)",
                    transition: "all 0.3s",
                  }} />
                ))}
                <button onClick={next} className="hero-nav-btn"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div style={{ width: "100%", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "14px 16px" }}>
        <div className="trust-bar">
          {[
            { icon: <Star size={18} color="#f59e0b" fill="#f59e0b" />, label: "4.8 Rating", sub: "50K+ reviews" },
            { icon: <Clock size={18} color="#3b82f6" />, label: "30 Min Delivery", sub: "Fresh & hot" },
            { icon: <Shield size={18} color="#16a34a" />, label: "Hygiene Certified", sub: "All verified" },
            { icon: <IndianRupee size={18} color="#f97316" />, label: "Best Prices", sub: "No middleman" },
            { icon: <Flame size={18} color="#8b5cf6" />, label: "500+ Chefs", sub: "Near you" },
          ].map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2, scale: 1.05 }}
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "default" }}
            >
              <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
                {b.icon}
              </motion.div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{b.label}</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>{b.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .hero-layout {
          display: flex; gap: 36px; align-items: center; flex-wrap: wrap;
        }
        .hero-text { flex: 1 1 320px; min-width: 0; }
        .hero-image { flex: 1 1 440px; min-width: 0; }
        .hero-title {
          font-size: clamp(26px, 4vw, 44px); font-weight: 900;
          color: #fff; line-height: 1.12; margin-bottom: 12px;
        }
        .hero-sub { font-size: clamp(17px, 3vw, 32px); }
        .hero-desc {
          color: rgba(255,255,255,0.6); font-size: 15px;
          line-height: 1.6; margin-bottom: 22px; max-width: 420px;
        }
        .hero-btn-primary {
          display: inline-flex; align-items: center; gap: 8px; width: 100%;
          justify-content: center; background: #16a34a; color: #fff;
          padding: 13px 24px; border-radius: 12px; font-size: 15px; font-weight: 700;
          box-shadow: 0 4px 20px rgba(22,163,74,0.4);
        }
        .hero-btn-secondary {
          display: inline-flex; align-items: center; gap: 8px; width: 100%;
          justify-content: center; background: rgba(255,255,255,0.1); color: #fff;
          padding: 13px 24px; border-radius: 12px; font-size: 15px; font-weight: 600;
          border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(4px);
        }
        .hero-nav-btn {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15);
          color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .trust-bar {
          max-width: 1200px; margin: 0 auto;
          display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px 20px;
        }

        @media (max-width: 640px) {
          .hero-layout { flex-direction: column; gap: 24px; }
          .hero-text { flex-basis: 100%; text-align: center; }
          .hero-image { flex-basis: 100%; }
          .hero-desc { margin-left: auto; margin-right: auto; font-size: 13px; }
          .hero-btn-primary, .hero-btn-secondary { padding: 12px 20px; font-size: 14px; }
          .trust-bar { gap: 12px 20px; justify-content: flex-start; overflow-x: auto; flex-wrap: nowrap; -ms-overflow-style: none; scrollbar-width: none; }
          .trust-bar::-webkit-scrollbar { display: none; }
        }

        @media (min-width: 641px) and (max-width: 900px) {
          .hero-layout { gap: 24px; }
          .hero-text { flex-basis: 100%; }
          .hero-image { flex-basis: 100%; }
        }
      `}</style>
    </div>
  );
}
