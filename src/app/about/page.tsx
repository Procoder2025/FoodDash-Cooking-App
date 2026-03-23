"use client";

import { motion } from "framer-motion";
import { Heart, Shield, Users, Leaf, Award, Target, Building2, Eye } from "lucide-react";
import { FadeInUp, FadeInLeft, FadeInRight, StaggerContainer, StaggerItem, HoverLift } from "@/components/AnimatedSection";

const values = [
  { icon: Heart, title: "Cooked with Love", desc: "Every meal is made with the same care as cooking for family", color: "#ef4444" },
  { icon: Shield, title: "Hygiene First", desc: "All kitchens verified and regularly audited for food safety", color: "#3b82f6" },
  { icon: Leaf, title: "Fresh & Natural", desc: "No preservatives or MSG. Just fresh ingredients and recipes", color: "#16a34a" },
  { icon: Users, title: "Empowering Women", desc: "80% of our chefs are women running food businesses from home", color: "#8b5cf6" },
  { icon: Award, title: "Quality Promise", desc: "Not happy? Get a full refund, no questions asked", color: "#f59e0b" },
  { icon: Target, title: "Affordable Pricing", desc: "Home food at home prices. No fancy overheads", color: "#14b8a6" },
];

export default function AboutPage() {
  return (
    <div style={{ width: "100%" }}>
      {/* Hero */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", background: "linear-gradient(135deg, #15803d, #16a34a, #059669)", padding: "80px 20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%" }} />
        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} style={{ position: "absolute", bottom: -80, left: -80, width: 250, height: 250, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50%" }} />
        {["🍛", "👩‍🍳", "❤️", "🌿", "⭐", "🏡"].map((e, i) => (
          <motion.div key={i} animate={{ y: [0, -15, 0, 10, 0], x: [0, 8, 0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4 + i * 0.5, delay: i * 0.3, ease: "easeInOut" }}
            style={{ position: "absolute", top: `${8 + i * 15}%`, left: `${3 + i * 17}%`, fontSize: 28 + i * 3, opacity: 0.08 }}
          >{e}</motion.div>
        ))}
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ repeat: Infinity, duration: 5 }}
          style={{ position: "absolute", top: -60, left: "40%", width: 250, height: 250, background: "radial-gradient(circle, #fff, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}>
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
              <Building2 size={44} color="#fff" style={{ margin: "0 auto 16px", filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))" }} />
            </motion.div>
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 900, color: "#fff", marginBottom: 16 }}>
            About FoodDash
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.7 }}>
            We&apos;re on a mission to bring the warmth and taste of home-cooked meals to everyone, while empowering home chefs to build their dreams.
          </motion.p>
        </div>
      </motion.div>

      {/* Our Story */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <FadeInUp>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ fontSize: 28 }}>📖</span> Our Story
          </h2>
        </FadeInUp>
        <FadeInUp delay={0.1}>
          <p style={{ color: "#4b5563", fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            FoodDash was born from a simple observation: millions of talented home cooks prepare incredible food every day, but only their families get to enjoy it. Meanwhile, millions of people eat unhealthy fast food because they don&apos;t have time to cook.
          </p>
        </FadeInUp>
        <FadeInUp delay={0.2}>
          <p style={{ color: "#4b5563", fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            We built a platform that bridges this gap. Our technology connects food lovers with passionate home chefs in their neighbourhood, ensuring fresh, authentic, and affordable meals reach doorsteps every day.
          </p>
        </FadeInUp>
        <FadeInUp delay={0.3}>
          <p style={{ color: "#4b5563", fontSize: 16, lineHeight: 1.8 }}>
            Today, we serve thousands of happy customers across multiple cities, powered by 500+ home chefs who earn a dignified livelihood doing what they love most — cooking.
          </p>
        </FadeInUp>
      </div>

      {/* Values */}
      <div style={{ width: "100%", background: "#f9fafb", padding: "60px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeInUp>
            <h2 style={{ fontSize: 28, fontWeight: 900, textAlign: "center", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Eye size={24} color="#16a34a" /> What We Stand For
            </h2>
            <p style={{ textAlign: "center", color: "#6b7280", fontSize: 16, marginBottom: 40 }}>Our core values drive everything we do</p>
          </FadeInUp>

          <StaggerContainer stagger={0.08}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {values.map((v, i) => (
                <StaggerItem key={i}>
                  <HoverLift>
                    <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #f3f4f6", transition: "box-shadow 0.3s" }}>
                      <div style={{ width: 50, height: 50, background: `${v.color}15`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                        <v.icon size={24} color={v.color} />
                      </div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{v.title}</h3>
                      <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{v.desc}</p>
                    </div>
                  </HoverLift>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </div>

      {/* Mission + Stats */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <FadeInUp>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Target size={24} color="#16a34a" /> Our Mission
          </h2>
          <p style={{ color: "#4b5563", fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
            To become the most trusted home food delivery platform, connecting every neighbourhood with its best home chefs. We envision a world where everyone has access to affordable, healthy, and delicious home-cooked meals.
          </p>
        </FadeInUp>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 500, margin: "0 auto" }}>
          {[
            { num: "3", label: "Cities", icon: "🏙️" },
            { num: "500+", label: "Home Chefs", icon: "👨‍🍳" },
            { num: "50K+", label: "Happy Users", icon: "😊" },
          ].map((s, i) => (
            <FadeInUp key={i} delay={i * 0.15}>
              <motion.div whileHover={{ scale: 1.08 }} style={{ padding: 16 }}>
                <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>{s.icon}</span>
                <div style={{ fontSize: 36, fontWeight: 900, color: "#16a34a" }}>{s.num}</div>
                <div style={{ fontSize: 14, color: "#6b7280" }}>{s.label}</div>
              </motion.div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </div>
  );
}
