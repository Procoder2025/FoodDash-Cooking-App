"use client";

import { homeCooks } from "@/data/restaurants";
import HomeCookCard from "./HomeCookCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChefHat, ArrowRight } from "lucide-react";

export default function HomeCooksCarousel() {
  return (
    <section style={{ width: "100%", padding: "80px 20px", background: "#f9fafb" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 40 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#fff7ed", color: "#c2410c",
                padding: "6px 16px", borderRadius: 50, fontSize: 13, fontWeight: 600, marginBottom: 12,
              }}
            >
              <ChefHat size={14} /> Trusted Home Chefs
            </motion.span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 6 }}>
              Meet Our Home Chefs
            </h2>
            <p style={{ color: "#6b7280", fontSize: 16, maxWidth: 480 }}>
              Talented neighbourhood cooks bringing authentic meals to your doorstep
            </p>
          </motion.div>
          <motion.div whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link href="/menu" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              color: "#16a34a", fontWeight: 600, fontSize: 14,
            }}>
              View All Chefs <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 24,
        }}>
          {homeCooks.map((cook, i) => (
            <motion.div
              key={cook.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <HomeCookCard cook={cook} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
