"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useFood } from "@/context/FoodContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { Search, Leaf, Star, Clock, ShoppingBag, Plus, Minus, Trash2, Filter, LogIn, MapPin, Flame, ChefHat, X, IndianRupee, Package, ShoppingCart, ArrowRight, Navigation, Heart } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const categories = ["All", "Rice", "Tiffin", "Main Course", "Biryani", "Starters", "Breads", "Beverages", "Desserts", "Snacks"];
const catIcons: Record<string, string> = { All: "🍽️", Rice: "🍚", Tiffin: "🥞", "Main Course": "🍛", Biryani: "🍲", Starters: "🥘", Breads: "🫓", Beverages: "☕", Desserts: "🍰", Snacks: "🍿" };

export default function BrowsePage() {
  const router = useRouter();
  const { getAvailableFoods } = useFood();
  const { items, addItem, updateQuantity, removeItem, totalItems, total } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  // Location filter — auto-detect from user address or default
  const userLocation = user?.address?.split(",")[0]?.trim() || "";
  const defaultLocation = userLocation && ["Komarapalayam", "Hosur", "Coimbatore"].some(
    (c) => userLocation.toLowerCase().includes(c.toLowerCase())
  ) ? ["Komarapalayam", "Hosur", "Coimbatore"].find(
    (c) => userLocation.toLowerCase().includes(c.toLowerCase())
  ) || "All" : "All";

  const [location, setLocation] = useState(defaultLocation);

  const available = getAvailableFoods();

  const filtered = useMemo(() => {
    return available.filter((f) => {
      const s = search.toLowerCase();
      const matchSearch = !search || f.name.toLowerCase().includes(s) || f.kitchenName.toLowerCase().includes(s) || f.cookerName.toLowerCase().includes(s) || f.category.toLowerCase().includes(s);
      const matchCat = category === "All" || f.category === category;
      const matchVeg = !vegOnly || f.isVeg;
      const matchLoc = location === "All" || ((f as any).location || "").toLowerCase().includes(location.toLowerCase());
      return matchSearch && matchCat && matchVeg && matchLoc;
    });
  }, [available, search, category, vegOnly, location]);

  const getCartItem = (foodId: string) => items.find((i) => i.id === foodId);

  const handleAdd = (food: any) => {
    // Anyone can add to cart — signup required only at checkout
    const cook = { id: food.cookerId, kitchenName: food.kitchenName, deliveryFee: 25, isOpen: true } as any;
    const menuItem = { id: food.id, name: food.name, description: food.description, price: food.price, image: food.image, category: food.category, isVeg: food.isVeg, rating: food.rating, bestseller: false };
    addItem(menuItem, cook);
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <div style={{ width: "100%", background: "linear-gradient(135deg, #15803d, #16a34a)", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#fff", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
            <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
              <Search size={28} />
            </motion.div>
            Browse Home Food
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
            <Flame size={14} /> {filtered.length} fresh dishes {location !== "All" ? `in ${location}` : "available right now"}
            {!isLoggedIn && <span style={{ background: "rgba(255,255,255,0.15)", padding: "2px 10px", borderRadius: 50, fontSize: 11, marginLeft: 8 }}>👆 Sign up to order</span>}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 100px" }}>
        {/* Search */}
        <FadeInUp>
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #f3f4f6", marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
                <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input type="text" placeholder="🔍 Search food, chef name, kitchen..." value={search} onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px 12px 42px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, fontSize: 14, outline: "none" }} />
              </div>
              <div style={{ position: "relative" }}>
                <Navigation size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#f97316" }} />
                <select value={location} onChange={(e) => setLocation(e.target.value)} style={{
                  padding: "12px 14px 12px 34px", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  border: location !== "All" ? "2px solid #f97316" : "2px solid #e5e7eb",
                  background: location !== "All" ? "#fff7ed" : "#fff",
                  color: location !== "All" ? "#c2410c" : "#4b5563",
                  outline: "none", appearance: "auto",
                }}>
                  <option value="All">All Locations</option>
                  <option value="Komarapalayam">Komarapalayam</option>
                  <option value="Hosur">Hosur</option>
                  <option value="Coimbatore">Coimbatore</option>
                </select>
              </div>
              <button onClick={() => setVegOnly(!vegOnly)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "12px 18px", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer",
                border: vegOnly ? "2px solid #16a34a" : "2px solid #e5e7eb", background: vegOnly ? "#f0fdf4" : "#fff", color: vegOnly ? "#15803d" : "#4b5563",
              }}>
                <Leaf size={15} color={vegOnly ? "#16a34a" : "#9ca3af"} /> 🟢 Veg Only
              </button>
            </div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto" }} className="no-scrollbar">
              {categories.map((c) => (
                <button key={c} onClick={() => setCategory(c)} style={{
                  padding: "8px 16px", borderRadius: 50, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap",
                  background: category === c ? "#16a34a" : "#f3f4f6", color: category === c ? "#fff" : "#4b5563",
                  boxShadow: category === c ? "0 2px 8px rgba(22,163,74,0.3)" : "none",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  {catIcons[c]} {c}
                </button>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* Results count */}
        <FadeInUp delay={0.05}>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={13} /> Showing <strong style={{ color: "#111" }}>{filtered.length}</strong> dishes
          </p>
        </FadeInUp>

        {/* Food Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "60px 20px" }}>
              <p style={{ fontSize: 56, marginBottom: 12 }}>🍽️</p>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>No dishes found</h3>
              <p style={{ color: "#6b7280" }}>Try a different search or filter</p>
            </motion.div>
          ) : (
            <StaggerContainer key="grid" stagger={0.05}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
                {filtered.map((food) => {
                  const cart = getCartItem(food.id);
                  return (
                    <StaggerItem key={food.id}>
                      <motion.div whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                        style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #f3f4f6", transition: "all 0.3s" }}>
                        {/* Image */}
                        <div style={{ position: "relative", height: 150, overflow: "hidden" }}>
                          <img src={food.image} alt={food.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div style={{ position: "absolute", top: 8, left: 8 }}>
                            <span style={{ width: 20, height: 20, border: `2px solid ${food.isVeg ? "#16a34a" : "#ef4444"}`, borderRadius: 4, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: food.isVeg ? "#16a34a" : "#ef4444", background: "#fff" }}>●</span>
                          </div>
                          <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 6 }}>
                            {food.rating > 0 && (
                              <div style={{ background: "#fff", borderRadius: 8, padding: "3px 8px", display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
                                <Star size={11} color="#f59e0b" fill="#f59e0b" /> {food.rating}
                              </div>
                            )}
                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                              onClick={(e) => { e.stopPropagation(); toggleFavorite(food.id); }}
                              style={{
                                width: 32, height: 32, borderRadius: 8, background: "#fff", border: "none",
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                              }}>
                              <Heart size={14} color={isFavorite(food.id) ? "#e11d48" : "#9ca3af"} fill={isFavorite(food.id) ? "#e11d48" : "none"} />
                            </motion.button>
                          </div>
                          <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.6)", color: "#fff", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, backdropFilter: "blur(4px)" }}>
                            {food.category}
                          </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: 16 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{food.name}</h3>
                          <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                            <ChefHat size={12} /> {food.kitchenName}
                            <span style={{ color: "#9ca3af" }}>•</span>
                            <MapPin size={11} color="#9ca3af" /> {food.cookerName}
                          </p>
                          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                            {food.description}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 11, color: "#6b7280" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                              <Clock size={11} color="#f59e0b" /> {food.prepTime}
                            </span>
                            <span>•</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Package size={11} color="#3b82f6" /> {food.servings} left</span>
                            <span>•</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><ShoppingCart size={11} color="#16a34a" /> {food.orders} orders</span>
                          </div>

                          {/* Price + Add */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 20, fontWeight: 900, display: "flex", alignItems: "center", gap: 2, color: "#16a34a" }}>
                              <IndianRupee size={18} strokeWidth={3} /> {food.price}
                            </span>
                            {cart ? (
                              <div style={{ display: "flex", alignItems: "center", background: "#16a34a", borderRadius: 10, overflow: "hidden" }}>
                                <button onClick={() => cart.quantity === 1 ? removeItem(food.id) : updateQuantity(food.id, cart.quantity - 1)}
                                  style={{ padding: "8px 10px", background: "transparent", border: "none", cursor: "pointer", color: "#fff", display: "flex" }}>
                                  {cart.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                                </button>
                                <span style={{ padding: "8px 6px", fontSize: 13, fontWeight: 700, color: "#fff", minWidth: 24, textAlign: "center" as const }}>{cart.quantity}</span>
                                <button onClick={() => handleAdd(food)}
                                  style={{ padding: "8px 10px", background: "transparent", border: "none", cursor: "pointer", color: "#fff", display: "flex" }}>
                                  <Plus size={14} />
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => handleAdd(food)}
                                style={{ display: "flex", alignItems: "center", gap: 4, background: "#fff", color: "#16a34a", border: "2px solid #16a34a", padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#16a34a"; }}
                              >
                                <Plus size={14} /> ADD
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  );
                })}
              </div>
            </StaggerContainer>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Cart */}
      <AnimatePresence>
        {totalItems > 0 && isLoggedIn && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#16a34a", padding: "14px 20px", boxShadow: "0 -4px 20px rgba(0,0,0,0.15)", zIndex: 50 }}>
            <Link href="/cart" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ShoppingBag size={20} />
                <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 16 }}>
                <ShoppingCart size={18} /> View Cart <span style={{ display: "flex", alignItems: "center" }}><IndianRupee size={14} strokeWidth={3} />{total.toFixed(0)}</span> <ArrowRight size={16} />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login/Signup Prompt Modal */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLoginPrompt(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 24, padding: "40px 32px", width: "100%", maxWidth: 420, textAlign: "center", position: "relative" }}
            >
              <button onClick={() => setShowLoginPrompt(false)} style={{
                position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: "50%",
                background: "#f3f4f6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <X size={16} />
              </button>

              <div style={{ width: 72, height: 72, background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36 }}>
                🔐
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Sign Up to Order!</h3>
              <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
                Create a free account to add items to your cart and order delicious homemade food.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/auth/signup" onClick={() => setShowLoginPrompt(false)} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "#16a34a", color: "#fff", padding: "14px 24px", borderRadius: 12,
                  fontSize: 15, fontWeight: 700, boxShadow: "0 4px 15px rgba(22,163,74,0.3)",
                }}>
                  ✨ Create Free Account
                </Link>
                <Link href="/auth/login" onClick={() => setShowLoginPrompt(false)} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "#f9fafb", color: "#374151", padding: "14px 24px", borderRadius: 12,
                  fontSize: 15, fontWeight: 600, border: "1px solid #e5e7eb",
                }}>
                  <LogIn size={16} /> Already have an account? Login
                </Link>
              </div>

              <p style={{ marginTop: 18, fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                🛡️ Free forever • No spam • Secure
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
