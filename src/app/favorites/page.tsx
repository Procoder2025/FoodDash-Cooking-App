"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "@/context/FavoritesContext";
import { useFood } from "@/context/FoodContext";
import { useCart } from "@/context/CartContext";
import { Heart, Search, IndianRupee, Clock, Star, ShoppingBag, Trash2, MapPin } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { homeCooks } from "@/data/restaurants";

export default function FavoritesPage() {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const { foods } = useFood();

  const favoriteFoods = foods.filter((f) => favorites.includes(f.id));

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
        width: "100%", background: "linear-gradient(135deg, #e11d48, #f43f5e, #fb7185)",
        padding: "50px 20px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.12, 0.06] }} transition={{ repeat: Infinity, duration: 5 }}
          style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, background: "radial-gradient(circle, #fff, transparent 70%)", borderRadius: "50%" }} />
        {["❤️", "🍛", "⭐", "🥘", "💖", "🍜"].map((e, i) => (
          <motion.div key={i} animate={{ y: [0, -15, 0, 10, 0], x: [0, 8, 0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4 + i * 0.5, delay: i * 0.3 }}
            style={{ position: "absolute", top: `${8 + i * 15}%`, left: `${3 + i * 17}%`, fontSize: 28 + i * 3, opacity: 0.1 }}
          >{e}</motion.div>
        ))}

        <div style={{ position: "relative", zIndex: 1 }}>
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}>
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Heart size={44} color="#fff" fill="#fff" style={{ margin: "0 auto 14px", filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))" }} />
            </motion.div>
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#fff", marginBottom: 6 }}>
            My Favorites
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ color: "rgba(255,255,255,0.8)", fontSize: 15 }}>
            {favoriteFoods.length} saved dish{favoriteFoods.length !== 1 ? "es" : ""}
          </motion.p>
        </div>
      </motion.div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 60px" }}>
        {favoriteFoods.length === 0 ? (
          <FadeInUp>
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <Heart size={64} color="#e5e7eb" style={{ margin: "0 auto 16px" }} />
              </motion.div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No favorites yet</h2>
              <p style={{ color: "#6b7280", marginBottom: 28, maxWidth: 300, margin: "0 auto 28px" }}>
                Browse food and tap the heart icon to save your favorite dishes here
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/browse" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#e11d48", color: "#fff", padding: "14px 32px", borderRadius: 12,
                  fontSize: 15, fontWeight: 700, boxShadow: "0 4px 15px rgba(225,29,72,0.3)",
                }}>
                  <Search size={18} /> Browse Food
                </Link>
              </motion.div>
            </div>
          </FadeInUp>
        ) : (
          <>
            {/* Actions Bar */}
            <FadeInUp>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>
                  {favoriteFoods.length} Favorite{favoriteFoods.length !== 1 ? "s" : ""}
                </p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={clearFavorites}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                    borderRadius: 8, border: "1px solid #fecaca", background: "#fff",
                    color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>
                  <Trash2 size={13} /> Clear All
                </motion.button>
              </div>
            </FadeInUp>

            {/* Favorites Grid */}
            <StaggerContainer stagger={0.06}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                <AnimatePresence>
                  {favoriteFoods.map((food) => (
                    <StaggerItem key={food.id}>
                      <motion.div
                        layout
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ y: -4, boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}
                        style={{
                          background: "#fff", borderRadius: 16, overflow: "hidden",
                          border: "1px solid #f3f4f6", transition: "all 0.3s",
                        }}
                      >
                        {/* Image */}
                        <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                          <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}
                            src={food.image} alt={food.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          {/* Veg Badge */}
                          <span style={{
                            position: "absolute", top: 10, left: 10,
                            width: 18, height: 18, border: `2px solid ${food.isVeg ? "#16a34a" : "#ef4444"}`,
                            borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 8, color: food.isVeg ? "#16a34a" : "#ef4444", background: "#fff",
                          }}>●</span>
                          {/* Unfavorite Button */}
                          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                            onClick={() => toggleFavorite(food.id)}
                            style={{
                              position: "absolute", top: 10, right: 10,
                              width: 34, height: 34, borderRadius: 10,
                              background: "rgba(255,255,255,0.95)", border: "none", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}>
                            <Heart size={16} color="#e11d48" fill="#e11d48" />
                          </motion.button>
                        </div>

                        {/* Info */}
                        <div style={{ padding: "16px 18px" }}>
                          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{food.name}</h3>
                          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 10, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MapPin size={11} /> {food.kitchenName}</span>
                            <span>•</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Star size={11} color="#f59e0b" fill="#f59e0b" /> {food.rating}</span>
                            <span>•</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} /> {food.prepTime}</span>
                          </p>
                          <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.4, marginBottom: 14, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                            {food.description}
                          </p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 18, fontWeight: 900, color: "#16a34a", display: "flex", alignItems: "center" }}>
                              <IndianRupee size={15} strokeWidth={3} />{food.price}
                            </span>
                            {food.isAvailable ? (
                              <Link href="/browse" style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "8px 18px", borderRadius: 10,
                                background: "#16a34a", color: "#fff",
                                fontSize: 12, fontWeight: 700,
                                boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
                              }}>
                                <ShoppingBag size={13} /> Order
                              </Link>
                            ) : (
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", background: "#fef2f2", padding: "6px 14px", borderRadius: 8 }}>
                                Unavailable
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </AnimatePresence>
              </div>
            </StaggerContainer>
          </>
        )}
      </div>
    </div>
  );
}
