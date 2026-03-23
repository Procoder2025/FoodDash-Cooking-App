"use client";

import { motion } from "framer-motion";
import { Users, ShoppingBag, ChefHat, MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref}>{count.toLocaleString("en-IN")}{suffix}</div>;
}

const stats = [
  { icon: <Users size={20} color="#fff" />, number: 50000, suffix: "+", label: "Happy Customers", color: "#3b82f6" },
  { icon: <ShoppingBag size={20} color="#fff" />, number: 200000, suffix: "+", label: "Meals Delivered", color: "#f97316" },
  { icon: <ChefHat size={20} color="#fff" />, number: 500, suffix: "+", label: "Home Chefs", color: "#16a34a" },
  { icon: <MapPin size={20} color="#fff" />, number: 3, suffix: "", label: "Cities", color: "#8b5cf6" },
];

export default function StatsSection() {
  return (
    <section style={{
      width: "100%", padding: "50px 20px",
      background: "linear-gradient(135deg, #111827, #1f2937)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Floating background circles */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, background: "rgba(74,222,128,0.05)", borderRadius: "50%" }}
      />
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: -60, left: -60, width: 250, height: 250, background: "rgba(59,130,246,0.05)", borderRadius: "50%" }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 36 }}
        >
          <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginBottom: 8 }}>
            Growing With <motion.span animate={{ color: ["#4ade80", "#86efac", "#4ade80"] }} transition={{ repeat: Infinity, duration: 3 }}>Trust</motion.span>
          </h2>
          <p style={{ color: "#9ca3af", fontSize: 17 }}>
            Numbers that speak for our commitment
          </p>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
        }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
              whileHover={{ y: -6, scale: 1.04 }}
              style={{
                textAlign: "center",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 16, padding: "24px 16px",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "default",
              }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: s.color, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  margin: "0 auto 12px",
                  boxShadow: `0 6px 20px ${s.color}44`,
                }}
              >
                {s.icon}
              </motion.div>
              <div style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, color: "#fff", marginBottom: 2 }}>
                <AnimatedNumber target={s.number} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
