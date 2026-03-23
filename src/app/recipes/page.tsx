"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRecipe } from "@/context/RecipeContext";
import { BookOpen, Search, Heart, Clock, Users, Flame, ChefHat, X, CheckCircle2, Lightbulb, Play } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const categories = ["All", "Rice", "Tiffin", "Main Course", "Biryani", "Starters", "Breads", "Beverages", "Desserts", "Snacks"];
const categoryEmojis: Record<string, string> = { All: "🍽️", Rice: "🍚", Tiffin: "🥞", "Main Course": "🍛", Biryani: "🍲", Starters: "🥘", Breads: "🫓", Beverages: "☕", Desserts: "🍰", Snacks: "🍿" };

export default function RecipesPage() {
  const { recipes, likeRecipe } = useRecipe();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  const filtered = recipes.filter((r) => {
    if (category !== "All" && r.category !== category) return false;
    if (vegOnly && !r.isVeg) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.cookerName.toLowerCase().includes(q) || r.kitchenName.toLowerCase().includes(q);
    }
    return true;
  });

  const openRecipe = recipes.find((r) => r.id === selectedRecipe);
  const diffColors: Record<string, string> = { Easy: "#16a34a", Medium: "#f59e0b", Hard: "#ef4444" };

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ width: "100%", background: "linear-gradient(135deg, #7c3aed, #a855f7)", padding: "40px 20px 30px", textAlign: "center" }}>
        <motion.div initial={{ y: 20 }} animate={{ y: 0 }}>
          <BookOpen size={40} color="#fff" style={{ margin: "0 auto 10px", opacity: 0.9 }} />
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#fff", marginBottom: 6 }}>Recipes from Our Chefs</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, maxWidth: 500, margin: "0 auto" }}>
            Discover authentic homemade recipes shared by our talented home chefs
          </p>
        </motion.div>
      </motion.div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Search & Filters */}
        <FadeInUp>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
              <Search size={16} color="#9ca3af" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipes, chefs..." style={{ width: "100%", padding: "12px 14px 12px 40px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, fontSize: 14, outline: "none" }} />
            </div>
            <button onClick={() => setVegOnly(!vegOnly)} style={{
              padding: "10px 18px", borderRadius: 12, fontSize: 13, fontWeight: 700, border: "2px solid",
              borderColor: vegOnly ? "#16a34a" : "#e5e7eb", background: vegOnly ? "#f0fdf4" : "#fff",
              color: vegOnly ? "#16a34a" : "#6b7280", cursor: "pointer",
            }}>
              🟢 Veg Only
            </button>
          </div>
        </FadeInUp>

        {/* Category Filter */}
        <FadeInUp delay={0.05}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 20 }}>
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding: "8px 16px", borderRadius: 50, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                background: category === c ? "#7c3aed" : "#f3f4f6", color: category === c ? "#fff" : "#6b7280",
                whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4,
              }}>
                {categoryEmojis[c]} {c}
              </button>
            ))}
          </div>
        </FadeInUp>

        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>{filtered.length} recipe{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Recipe Grid */}
        {filtered.length === 0 ? (
          <FadeInUp>
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6" }}>
              <BookOpen size={48} color="#d1d5db" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>No recipes found</h3>
              <p style={{ color: "#6b7280" }}>Try adjusting your filters</p>
            </div>
          </FadeInUp>
        ) : (
          <StaggerContainer>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
              {filtered.map((recipe) => (
                <StaggerItem key={recipe.id}>
                  <motion.div whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}
                    onClick={() => setSelectedRecipe(recipe.id)}
                    style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #f3f4f6", cursor: "pointer" }}>
                    <div style={{ position: "relative" }}>
                      <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: 10, left: 10, background: diffColors[recipe.difficulty], color: "#fff", padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 700 }}>
                        {recipe.difficulty}
                      </span>
                      <span style={{ position: "absolute", top: 10, right: 10, background: recipe.isVeg ? "#16a34a" : "#ef4444", color: "#fff", padding: "4px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700 }}>
                        {recipe.isVeg ? "VEG" : "NON-VEG"}
                      </span>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.6))", padding: "20px 14px 10px" }}>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{recipe.category}</span>
                      </div>
                    </div>
                    <div style={{ padding: 16 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>{recipe.title}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <ChefHat size={13} color="#7c3aed" />
                        <span style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>{recipe.cookerName}</span>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>• {recipe.kitchenName}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{recipe.description}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#9ca3af" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={12} /> {recipe.prepTime} + {recipe.cookTime}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Users size={12} /> {recipe.servings}</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); likeRecipe(recipe.id); }}
                          style={{ display: "flex", alignItems: "center", gap: 4, background: "#fef2f2", border: "none", padding: "5px 10px", borderRadius: 50, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#ef4444" }}>
                          <Heart size={13} fill="#ef4444" /> {recipe.likes}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        )}
      </div>

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {openRecipe && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
            onClick={() => setSelectedRecipe(null)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 640, maxHeight: "92vh", overflowY: "auto" }}>

              {/* Hero Image */}
              <div style={{ position: "relative" }}>
                <img src={openRecipe.image} alt={openRecipe.title} style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: "20px 20px 0 0" }} />
                <button onClick={() => setSelectedRecipe(null)}
                  style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={18} color="#fff" />
                </button>
                <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", gap: 6 }}>
                  <span style={{ background: diffColors[openRecipe.difficulty], color: "#fff", padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 700 }}>{openRecipe.difficulty}</span>
                  <span style={{ background: openRecipe.isVeg ? "#16a34a" : "#ef4444", color: "#fff", padding: "4px 10px", borderRadius: 50, fontSize: 11, fontWeight: 700 }}>{openRecipe.isVeg ? "VEG" : "NON-VEG"}</span>
                </div>
              </div>

              <div style={{ padding: "20px 24px 28px" }}>
                {/* Title & Chef */}
                <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>{openRecipe.title}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <ChefHat size={15} color="#7c3aed" />
                  <span style={{ fontSize: 13, color: "#7c3aed", fontWeight: 700 }}>{openRecipe.cookerName}</span>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>• {openRecipe.kitchenName}</span>
                </div>
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.6, marginBottom: 16 }}>{openRecipe.description}</p>

                {/* Quick Info */}
                <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                  {[
                    { icon: Clock, label: "Prep", value: openRecipe.prepTime, color: "#3b82f6" },
                    { icon: Flame, label: "Cook", value: openRecipe.cookTime, color: "#f59e0b" },
                    { icon: Users, label: "Serves", value: openRecipe.servings, color: "#16a34a" },
                  ].map((info, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: `${info.color}08`, padding: "8px 14px", borderRadius: 10 }}>
                      <info.icon size={16} color={info.color} />
                      <div>
                        <p style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>{info.label}</p>
                        <p style={{ fontSize: 13, fontWeight: 700 }}>{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Video */}
                {openRecipe.videoUrl && openRecipe.videoUrl.includes("youtube") && (
                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                      <Play size={16} color="#ef4444" /> Cooking Video
                    </h3>
                    <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "16/9" }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${openRecipe.videoUrl.split("v=")[1]?.split("&")[0] || openRecipe.videoUrl.split("/").pop()}`}
                        allow="encrypted-media; fullscreen" allowFullScreen
                        style={{ width: "100%", height: "100%", border: "none" }}
                      />
                    </div>
                  </div>
                )}

                {/* Ingredients */}
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 24, height: 24, background: "#f0fdf4", borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🧂</span>
                    Ingredients ({openRecipe.ingredients.length})
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {openRecipe.ingredients.map((ing, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#f9fafb", borderRadius: 8, fontSize: 13 }}>
                        <CheckCircle2 size={14} color="#16a34a" /> {ing}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 24, height: 24, background: "#eff6ff", borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>👩‍🍳</span>
                    Steps ({openRecipe.steps.length})
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {openRecipe.steps.map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "#f9fafb", borderRadius: 10 }}>
                        <span style={{ width: 28, height: 28, background: "#7c3aed", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                        <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.5, paddingTop: 4 }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chef Tips */}
                {openRecipe.tips && (
                  <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 6, color: "#92400e" }}>
                      <Lightbulb size={16} color="#f59e0b" /> Chef&apos;s Tips
                    </h3>
                    <p style={{ fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>{openRecipe.tips}</p>
                  </div>
                )}

                {/* Like Button */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => likeRecipe(openRecipe.id)}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "2px solid #fecaca", padding: "10px 24px", borderRadius: 50, cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#ef4444" }}>
                    <Heart size={18} fill="#ef4444" /> Love this recipe ({openRecipe.likes})
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
