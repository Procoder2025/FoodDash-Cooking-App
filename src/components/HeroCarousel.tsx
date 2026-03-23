"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChefHat, Star, Clock, Shield, IndianRupee, Flame, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1400&h=700&fit=crop",
    featured: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&h=600&fit=crop",
    title: "Freshly Homemade Meals",
    highlight: "Cooked with Love",
    sub: "in Your Neighbourhood",
    desc: "Order authentic home-cooked food from talented home chefs near you.",
  },
  {
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=1400&h=700&fit=crop",
    featured: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop",
    title: "Experience the Taste of",
    highlight: "Real Home Food",
    sub: "Wherever You Are",
    desc: "From sambar rice to biryani — real home food delivered to your door.",
  },
  {
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1400&h=700&fit=crop",
    featured: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    title: "Say Goodbye to Junk,",
    highlight: "Hello Healthy",
    sub: "Home-Style Dinners",
    desc: "Wholesome, nutritious meals from clean, verified home kitchens.",
  },
  {
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=1400&h=700&fit=crop",
    featured: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
    title: "South Indian Specials",
    highlight: "From Amma's Kitchen",
    sub: "to Your Doorstep",
    desc: "Sambar rice, dosa, idli & more — authentic Tamil Nadu home cooking.",
  },
  {
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1400&h=700&fit=crop",
    featured: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&h=600&fit=crop",
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

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const s = slides[current];

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div className="hero-wrapper">

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
        <div className="hero-content">
          <div className="hero-layout">

            {/* Left - Text */}
            <div className="hero-text">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="hero-badge"
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ width: 7, height: 7, background: "#4ade80", borderRadius: "50%", display: "inline-block", flexShrink: 0 }}
                />
                <ChefHat size={12} /> 500+ Home Chefs Active
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
                className="hero-buttons"
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
              <div className="hero-stats">
                {[
                  { val: "500+", label: "Chefs" },
                  { val: "50K+", label: "Customers" },
                  { val: "4.8", label: "Rating" },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                    <div className="hero-stat-val">{stat.val}</div>
                    <div className="hero-stat-label">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right - Featured Food Image */}
            <div className="hero-image">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="hero-image-card"
                >
                  <img
                    src={s.featured}
                    alt={s.title}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {/* Gradient overlay on image */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: "40%",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                    borderRadius: "0 0 16px 16px",
                  }} />
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="hero-nav">
                <button onClick={prev} className="hero-nav-btn"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                >
                  <ChevronLeft size={16} />
                </button>
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} className="hero-dot" style={{
                    width: current === i ? 20 : 7, height: 7, borderRadius: 50, border: "none", cursor: "pointer",
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
      <div className="trust-bar-wrapper">
        <div className="trust-bar">
          {[
            { icon: <Star size={16} color="#f59e0b" fill="#f59e0b" />, label: "4.8 Rating", sub: "50K+ reviews" },
            { icon: <Clock size={16} color="#3b82f6" />, label: "30 Min Delivery", sub: "Fresh & hot" },
            { icon: <Shield size={16} color="#16a34a" />, label: "Hygiene Certified", sub: "All verified" },
            { icon: <IndianRupee size={16} color="#f97316" />, label: "Best Prices", sub: "No middleman" },
            { icon: <Flame size={16} color="#8b5cf6" />, label: "500+ Chefs", sub: "Near you" },
          ].map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="trust-item"
            >
              <div style={{ flexShrink: 0 }}>
                {b.icon}
              </div>
              <div>
                <div className="trust-label">{b.label}</div>
                <div className="trust-sub">{b.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .hero-wrapper {
          width: 100%; position: relative; overflow: hidden; min-height: 480px;
        }
        .hero-content {
          position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 36px 20px;
        }
        .hero-layout {
          display: flex; gap: 36px; align-items: center; flex-wrap: wrap;
        }
        .hero-text { flex: 1 1 320px; min-width: 0; }
        .hero-image { flex: 1 1 400px; min-width: 0; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 6;
          background: rgba(255,255,255,0.1); backdrop-filter: blur(12px);
          color: #fff; padding: 6px 14px; border-radius: 50px; font-size: 11px; font-weight: 600; margin-bottom: 16px;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .hero-title {
          font-size: clamp(24px, 4vw, 44px); font-weight: 900;
          color: #fff; line-height: 1.15; margin-bottom: 10px;
        }
        .hero-sub { font-size: clamp(16px, 3vw, 32px); }
        .hero-desc {
          color: rgba(255,255,255,0.6); font-size: 14px;
          line-height: 1.6; margin-bottom: 20px; max-width: 420px;
        }
        .hero-buttons {
          display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;
        }
        .hero-btn-primary {
          display: inline-flex; align-items: center; gap: 8px; width: 100%;
          justify-content: center; background: #16a34a; color: #fff;
          padding: 12px 22px; border-radius: 12px; font-size: 14px; font-weight: 700;
          box-shadow: 0 4px 20px rgba(22,163,74,0.4);
        }
        .hero-btn-secondary {
          display: inline-flex; align-items: center; gap: 8px; width: 100%;
          justify-content: center; background: rgba(255,255,255,0.1); color: #fff;
          padding: 12px 22px; border-radius: 12px; font-size: 14px; font-weight: 600;
          border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(4px);
        }
        .hero-stats {
          display: flex; gap: 20px; flex-wrap: wrap;
        }
        .hero-stat-val { font-size: 18px; font-weight: 900; color: #4ade80; }
        .hero-stat-label { font-size: 10px; color: rgba(255,255,255,0.5); font-weight: 500; }
        .hero-image-card {
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          border: 2px solid rgba(255,255,255,0.12);
          aspect-ratio: 4/3;
          background: #000;
          position: relative;
        }
        .hero-nav {
          display: flex; justify-content: center; align-items: center; gap: 6px; margin-top: 12px;
        }
        .hero-nav-btn {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15);
          color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s; flex-shrink: 0;
        }
        .hero-dot {
          flex-shrink: 0;
        }
        .trust-bar-wrapper {
          width: 100%; background: #f9fafb; border-bottom: 1px solid #e5e7eb; padding: 12px 16px;
        }
        .trust-bar {
          max-width: 1200px; margin: 0 auto;
          display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px 16px;
        }
        .trust-item {
          display: flex; align-items: center; gap: 6px; cursor: default; flex-shrink: 0;
        }
        .trust-label { font-size: 11px; font-weight: 700; color: #111; white-space: nowrap; }
        .trust-sub { font-size: 9px; color: #9ca3af; white-space: nowrap; }

        /* Mobile <= 640px */
        @media (max-width: 640px) {
          .hero-wrapper { min-height: auto; }
          .hero-content { padding: 24px 16px 20px; }
          .hero-layout { flex-direction: column; gap: 18px; }
          .hero-text { flex-basis: 100%; text-align: center; }
          .hero-image { flex-basis: 100%; }
          .hero-badge { font-size: 10px; padding: 5px 10px; margin-bottom: 12px; }
          .hero-title { font-size: 22px; margin-bottom: 8px; line-height: 1.2; }
          .hero-sub { font-size: 15px; }
          .hero-desc { margin-left: auto; margin-right: auto; font-size: 12px; margin-bottom: 14px; line-height: 1.5; }
          .hero-buttons { gap: 8px; margin-bottom: 16px; }
          .hero-btn-primary, .hero-btn-secondary { padding: 10px 16px; font-size: 13px; border-radius: 10px; }
          .hero-stats { justify-content: center; gap: 24px; }
          .hero-stat-val { font-size: 16px; }
          .hero-stat-label { font-size: 9px; }
          .hero-image-card { aspect-ratio: 16/10; border-radius: 12px; border-width: 1px; }
          .hero-nav { gap: 4px; margin-top: 10px; }
          .hero-nav-btn { width: 28px; height: 28px; }
          .hero-dot { height: 6px !important; }
          .trust-bar-wrapper { padding: 10px 12px; }
          .trust-bar {
            gap: 8px 14px; justify-content: center; flex-wrap: wrap;
          }
          .trust-item { gap: 4px; }
          .trust-label { font-size: 10px; }
          .trust-sub { font-size: 8px; }
        }

        /* Tablet 641-900px */
        @media (min-width: 641px) and (max-width: 900px) {
          .hero-layout { gap: 24px; }
          .hero-text { flex-basis: 100%; }
          .hero-image { flex-basis: 100%; }
          .hero-content { padding: 30px 20px; }
        }
      `}</style>
    </div>
  );
}
