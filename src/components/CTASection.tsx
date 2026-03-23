"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChefHat, Bike, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section style={{ width: "100%", padding: "80px 20px", background: "#f9fafb" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 50 }}
        >
          <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Partner With FoodDash
          </h2>
          <p style={{ color: "#6b7280", fontSize: 17 }}>Join the home food revolution</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {/* Home Chef */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8, boxShadow: "0 16px 40px rgba(22,163,74,0.12)" }}
            style={{
              background: "#fff", borderRadius: 20, padding: "36px 28px",
              border: "1px solid #f3f4f6", cursor: "default",
            }}
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              style={{
                width: 60, height: 60, borderRadius: 16,
                background: "#16a34a", display: "flex",
                alignItems: "center", justifyContent: "center",
                marginBottom: 20,
                boxShadow: "0 6px 20px rgba(22,163,74,0.25)",
              }}
            >
              <ChefHat size={28} color="#fff" />
            </motion.div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Become a Home Chef</h3>
            <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              Love cooking? Start your own food business from home with zero investment.
              Join 500+ home chefs earning doing what they love.
            </p>
            <motion.div whileHover={{ scale: 1.05, x: 4 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/signup?role=cooker" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#16a34a", color: "#fff",
                padding: "12px 28px", borderRadius: 12,
                fontSize: 14, fontWeight: 700,
                boxShadow: "0 3px 12px rgba(22,163,74,0.3)",
              }}>
                Join as Chef <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Delivery Partner */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8, boxShadow: "0 16px 40px rgba(249,115,22,0.12)" }}
            style={{
              background: "#fff", borderRadius: 20, padding: "36px 28px",
              border: "1px solid #f3f4f6", cursor: "default",
            }}
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              style={{
                width: 60, height: 60, borderRadius: 16,
                background: "#f97316", display: "flex",
                alignItems: "center", justifyContent: "center",
                marginBottom: 20,
                boxShadow: "0 6px 20px rgba(249,115,22,0.25)",
              }}
            >
              <Bike size={28} color="#fff" />
            </motion.div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Become a Delivery Partner</h3>
            <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              Be your own boss! Deliver happiness with flexible hours and
              great earnings. Start today and earn on your schedule.
            </p>
            <motion.div whileHover={{ scale: 1.05, x: 4 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/signup?role=delivery" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#f97316", color: "#fff",
                padding: "12px 28px", borderRadius: 12,
                fontSize: 14, fontWeight: 700,
                boxShadow: "0 3px 12px rgba(249,115,22,0.3)",
              }}>
                Join as Partner <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
