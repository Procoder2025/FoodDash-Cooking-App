"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { homeCooks } from "@/data/restaurants";
import HomeCookCard from "@/components/HomeCookCard";
import { Search, SlidersHorizontal, Leaf, UtensilsCrossed, ChefHat } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const filters = ["All", "South Indian", "North Indian", "Biryani", "Healthy", "Snacks", "Desserts"];
const filterIcons: Record<string, string> = { All: "🍽️", "South Indian": "🍛", "North Indian": "🫓", Biryani: "🍚", Healthy: "🥗", Snacks: "🍿", Desserts: "🍰" };

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);

  const filtered = useMemo(() => {
    return homeCooks.filter((cook) => {
      const s = search.toLowerCase();
      const matchSearch = !search || cook.kitchenName.toLowerCase().includes(s) || cook.name.toLowerCase().includes(s) || cook.speciality.some((sp) => sp.toLowerCase().includes(s));
      const matchCuisine = cuisine === "All" || cook.speciality.some((sp) => sp.toLowerCase().includes(cuisine.toLowerCase()));
      const matchVeg = !vegOnly || cook.menu.some((m) => m.isVeg);
      return matchSearch && matchCuisine && matchVeg;
    });
  }, [search, cuisine, vegOnly]);

  return (
    <div style={{ width: "100%" }}>
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ width: "100%", background: "linear-gradient(135deg, #15803d, #16a34a)", padding: "48px 20px", position: "relative", overflow: "hidden" }}
      >
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.1 }} transition={{ delay: 0.3 }} style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, background: "#fff", borderRadius: "50%" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <UtensilsCrossed size={28} color="#fff" />
            <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>Order Home Food</h1>
          </motion.div>
          <motion.p initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ color: "rgba(255,255,255,0.75)", fontSize: 16 }}>
            Browse home kitchens near you and order fresh, homemade meals
          </motion.p>
        </div>
      </motion.div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 60px" }}>
        {/* Search & Filters */}
        <FadeInUp>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #f3f4f6", marginBottom: 32 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              <div style={{ flex: 1, minWidth: 250, position: "relative" }}>
                <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input
                  type="text" placeholder="Search home chefs, cuisines..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px 12px 42px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, fontSize: 14, outline: "none" }}
                />
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setVegOnly(!vegOnly)} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer",
                border: vegOnly ? "2px solid #16a34a" : "2px solid #e5e7eb",
                background: vegOnly ? "#f0fdf4" : "#fff",
                color: vegOnly ? "#15803d" : "#4b5563",
              }}>
                <Leaf size={16} color={vegOnly ? "#16a34a" : "#9ca3af"} />
                Veg Only
              </motion.button>
            </div>

            <div style={{ display: "flex", gap: 8, overflowX: "auto" }} className="no-scrollbar">
              {filters.map((c) => (
                <motion.button key={c} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCuisine(c)} style={{
                  padding: "8px 18px", borderRadius: 50, fontSize: 13, fontWeight: 600,
                  border: "none", cursor: "pointer", whiteSpace: "nowrap",
                  background: cuisine === c ? "#16a34a" : "#f3f4f6",
                  color: cuisine === c ? "#fff" : "#4b5563",
                  display: "flex", alignItems: "center", gap: 6,
                  boxShadow: cuisine === c ? "0 2px 10px rgba(22,163,74,0.3)" : "none",
                  transition: "background 0.2s, color 0.2s",
                }}>
                  <span>{filterIcons[c]}</span> {c}
                </motion.button>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* Results */}
        <FadeInUp delay={0.1}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <ChefHat size={20} color="#16a34a" />
              {filtered.length} Home Kitchen{filtered.length !== 1 ? "s" : ""} Available
            </h2>
            <span style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 6 }}>
              <SlidersHorizontal size={14} /> Sort by: <strong style={{ color: "#111" }}>Rating</strong>
            </span>
          </div>
        </FadeInUp>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center", padding: "80px 20px" }}>
              <motion.p animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: 60, marginBottom: 16 }}>🍽️</motion.p>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No kitchens found</h3>
              <p style={{ color: "#6b7280" }}>Try a different search or filter</p>
            </motion.div>
          ) : (
            <StaggerContainer key="grid">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
                {filtered.map((cook) => (
                  <StaggerItem key={cook.id}>
                    <HomeCookCard cook={cook} />
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
