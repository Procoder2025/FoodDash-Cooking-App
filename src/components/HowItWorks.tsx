"use client";

import { motion } from "framer-motion";
import { Search, UserPlus, ShoppingCart, Bike } from "lucide-react";

const steps = [
  { icon: <Search size={26} color="#fff" />, title: "Browse Food", desc: "Explore fresh homemade dishes near you", color: "#3b82f6" },
  { icon: <UserPlus size={26} color="#fff" />, title: "Sign Up Free", desc: "Create your account in 30 seconds", color: "#8b5cf6" },
  { icon: <ShoppingCart size={26} color="#fff" />, title: "Add to Cart", desc: "Pick your meals & customize order", color: "#f97316" },
  { icon: <Bike size={26} color="#fff" />, title: "Get Delivered", desc: "Hot food at your door in 30 min", color: "#16a34a" },
];

export default function HowItWorks() {
  return (
    <section style={{ width: "100%", padding: "80px 20px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 50 }}
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            style={{
              display: "inline-block", background: "#f0fdf4", color: "#16a34a",
              padding: "6px 16px", borderRadius: 50, fontSize: 13, fontWeight: 600, marginBottom: 12,
            }}
          >
            ✨ Simple & Easy
          </motion.span>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8 }}>
            How It Works
          </h2>
          <p style={{ color: "#6b7280", fontSize: 17, maxWidth: 450, margin: "0 auto" }}>
            Browse first, sign up when ready to order
          </p>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 24,
        }}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -8, boxShadow: "0 16px 40px rgba(0,0,0,0.1)" }}
              style={{
                position: "relative", textAlign: "center", background: "#fff", borderRadius: 20,
                padding: "36px 24px 32px", border: "1px solid #f3f4f6",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)", cursor: "default",
              }}
            >
              <span style={{ position: "absolute", top: 8, right: 14, fontSize: 48, fontWeight: 900, color: "#f9fafb" }}>
                0{i + 1}
              </span>
              <motion.div
                whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: step.color, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  margin: "0 auto 18px",
                  boxShadow: `0 6px 20px ${step.color}33`,
                }}
              >
                {step.icon}
              </motion.div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
