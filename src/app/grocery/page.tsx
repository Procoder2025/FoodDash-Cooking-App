"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ShoppingBasket, Search, Plus, Minus, Trash2 } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

interface GroceryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  isAvailable: boolean;
}

const categories = ["All", "Vegetables", "Fruits", "Dairy", "Spices", "Grains & Pulses", "Oil & Ghee", "Snacks", "Beverages"];
const categoryEmojis: Record<string, string> = { All: "🛒", Vegetables: "🥬", Fruits: "🍎", Dairy: "🥛", Spices: "🌶️", "Grains & Pulses": "🌾", "Oil & Ghee": "🫒", Snacks: "🍪", Beverages: "🧃" };

const groceryItems: GroceryItem[] = [
  // Vegetables
  { id: "g1", name: "Fresh Tomatoes", description: "Farm-fresh red tomatoes", price: 30, unit: "500g", image: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=300&h=200&fit=crop", category: "Vegetables", isAvailable: true },
  { id: "g2", name: "Onions", description: "Premium quality onions", price: 35, unit: "1 kg", image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&h=200&fit=crop", category: "Vegetables", isAvailable: true },
  { id: "g3", name: "Potatoes", description: "Fresh farm potatoes", price: 28, unit: "1 kg", image: "https://images.unsplash.com/photo-1518977676601-b53f82ber633?w=300&h=200&fit=crop", category: "Vegetables", isAvailable: true },
  { id: "g4", name: "Green Chillies", description: "Spicy green chillies", price: 15, unit: "100g", image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=300&h=200&fit=crop", category: "Vegetables", isAvailable: true },
  { id: "g5", name: "Carrot", description: "Fresh orange carrots", price: 40, unit: "500g", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=200&fit=crop", category: "Vegetables", isAvailable: true },
  { id: "g6", name: "Drumstick", description: "Tender moringa drumsticks", price: 25, unit: "250g", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop", category: "Vegetables", isAvailable: true },
  { id: "g7", name: "Brinjal", description: "Fresh purple brinjal", price: 30, unit: "500g", image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=300&h=200&fit=crop", category: "Vegetables", isAvailable: true },
  { id: "g8", name: "Curry Leaves", description: "Aromatic fresh curry leaves", price: 10, unit: "bunch", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop", category: "Vegetables", isAvailable: true },

  // Fruits
  { id: "g9", name: "Bananas", description: "Ripe yellow bananas", price: 45, unit: "1 dozen", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop", category: "Fruits", isAvailable: true },
  { id: "g10", name: "Apples", description: "Shimla red apples", price: 160, unit: "1 kg", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop", category: "Fruits", isAvailable: true },
  { id: "g11", name: "Mangoes", description: "Alphonso mangoes", price: 250, unit: "1 kg", image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=200&fit=crop", category: "Fruits", isAvailable: true },
  { id: "g12", name: "Oranges", description: "Juicy Nagpur oranges", price: 80, unit: "1 kg", image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=200&fit=crop", category: "Fruits", isAvailable: true },
  { id: "g13", name: "Coconut", description: "Fresh mature coconut", price: 35, unit: "1 pc", image: "https://images.unsplash.com/photo-1580984969071-a8da8c33720f?w=300&h=200&fit=crop", category: "Fruits", isAvailable: true },
  { id: "g14", name: "Pomegranate", description: "Ruby red pomegranate", price: 120, unit: "500g", image: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=300&h=200&fit=crop", category: "Fruits", isAvailable: true },

  // Dairy
  { id: "g15", name: "Fresh Milk", description: "Farm-fresh cow milk", price: 28, unit: "500ml", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop", category: "Dairy", isAvailable: true },
  { id: "g16", name: "Curd / Yogurt", description: "Thick set curd", price: 30, unit: "400g", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop", category: "Dairy", isAvailable: true },
  { id: "g17", name: "Paneer", description: "Fresh cottage cheese", price: 90, unit: "200g", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop", category: "Dairy", isAvailable: true },
  { id: "g18", name: "Butter", description: "Amul salted butter", price: 56, unit: "100g", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&h=200&fit=crop", category: "Dairy", isAvailable: true },

  // Spices
  { id: "g19", name: "Turmeric Powder", description: "Pure haldi powder", price: 45, unit: "100g", image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&h=200&fit=crop", category: "Spices", isAvailable: true },
  { id: "g20", name: "Red Chilli Powder", description: "Kashmiri chilli powder", price: 55, unit: "100g", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop", category: "Spices", isAvailable: true },
  { id: "g21", name: "Garam Masala", description: "Aromatic spice blend", price: 65, unit: "100g", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop", category: "Spices", isAvailable: true },
  { id: "g22", name: "Mustard Seeds", description: "Yellow mustard seeds", price: 25, unit: "100g", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop", category: "Spices", isAvailable: true },
  { id: "g23", name: "Sambar Powder", description: "Homemade sambar masala", price: 70, unit: "200g", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop", category: "Spices", isAvailable: true },

  // Grains & Pulses
  { id: "g24", name: "Basmati Rice", description: "Aged long-grain basmati", price: 95, unit: "1 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop", category: "Grains & Pulses", isAvailable: true },
  { id: "g25", name: "Toor Dal", description: "Split pigeon peas", price: 120, unit: "1 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop", category: "Grains & Pulses", isAvailable: true },
  { id: "g26", name: "Urad Dal", description: "Black gram split", price: 130, unit: "1 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop", category: "Grains & Pulses", isAvailable: true },
  { id: "g27", name: "Wheat Flour (Atta)", description: "Whole wheat chapati flour", price: 55, unit: "1 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop", category: "Grains & Pulses", isAvailable: true },
  { id: "g28", name: "Chickpeas", description: "Kabuli chana", price: 110, unit: "1 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop", category: "Grains & Pulses", isAvailable: true },

  // Oil & Ghee
  { id: "g29", name: "Coconut Oil", description: "Cold-pressed virgin coconut oil", price: 180, unit: "500ml", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop", category: "Oil & Ghee", isAvailable: true },
  { id: "g30", name: "Ghee", description: "Pure cow ghee", price: 280, unit: "500ml", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop", category: "Oil & Ghee", isAvailable: true },
  { id: "g31", name: "Gingelly Oil", description: "Sesame oil for cooking", price: 150, unit: "500ml", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop", category: "Oil & Ghee", isAvailable: true },

  // Snacks
  { id: "g32", name: "Murukku", description: "Crunchy rice flour snack", price: 60, unit: "200g", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop", category: "Snacks", isAvailable: true },
  { id: "g33", name: "Mixture", description: "Spicy south Indian mixture", price: 50, unit: "200g", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop", category: "Snacks", isAvailable: true },
  { id: "g34", name: "Banana Chips", description: "Kerala-style banana chips", price: 70, unit: "200g", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop", category: "Snacks", isAvailable: true },

  // Beverages
  { id: "g35", name: "Filter Coffee Powder", description: "Freshly ground coffee", price: 120, unit: "200g", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop", category: "Beverages", isAvailable: true },
  { id: "g36", name: "Tea Powder", description: "Premium CTC tea", price: 80, unit: "250g", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=200&fit=crop", category: "Beverages", isAvailable: true },
  { id: "g37", name: "Horlicks", description: "Health & nutrition drink", price: 210, unit: "500g", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop", category: "Beverages", isAvailable: true },
];

export default function GroceryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<Record<string, number>>({});

  const filtered = useMemo(() => groceryItems.filter((item) => {
    if (category !== "All" && item.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    }
    return true;
  }), [search, category]);

  const addToCart = (id: string) => setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: string) => setCart((prev) => {
    const qty = (prev[id] || 0) - 1;
    if (qty <= 0) { const { [id]: _, ...rest } = prev; return rest; }
    return { ...prev, [id]: qty };
  });

  const totalItems = Object.values(cart).reduce((s, q) => s + q, 0);
  const totalPrice = Object.entries(cart).reduce((s, [id, qty]) => {
    const item = groceryItems.find((g) => g.id === id);
    return s + (item ? item.price * qty : 0);
  }, 0);

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ width: "100%", background: "linear-gradient(135deg, #f59e0b, #d97706)", padding: "40px 20px 30px", textAlign: "center" }}>
        <motion.div initial={{ y: 20 }} animate={{ y: 0 }}>
          <ShoppingBasket size={40} color="#fff" style={{ margin: "0 auto 10px", opacity: 0.9 }} />
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#fff", marginBottom: 6 }}>Grocery Store</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, maxWidth: 500, margin: "0 auto" }}>
            Fresh vegetables, fruits, spices & essentials delivered to your door
          </p>
        </motion.div>
      </motion.div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 80px" }}>
        {/* Search */}
        <FadeInUp>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <Search size={16} color="#9ca3af" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search groceries..." style={{ width: "100%", padding: "12px 14px 12px 40px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, fontSize: 14, outline: "none" }} />
          </div>
        </FadeInUp>

        {/* Category Filter */}
        <FadeInUp delay={0.05}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 20 }}>
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding: "8px 16px", borderRadius: 50, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                background: category === c ? "#f59e0b" : "#f3f4f6", color: category === c ? "#fff" : "#6b7280",
                whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4,
              }}>
                {categoryEmojis[c]} {c}
              </button>
            ))}
          </div>
        </FadeInUp>

        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>{filtered.length} item{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Grocery Grid */}
        <StaggerContainer>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {filtered.map((item) => {
              const qty = cart[item.id] || 0;
              return (
                <StaggerItem key={item.id}>
                  <motion.div whileHover={{ y: -3, boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}
                    style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #f3f4f6" }}>
                    <div style={{ position: "relative", height: 140, background: "#f9fafb" }}>
                      <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: 8, left: 8, background: "#f59e0b", color: "#fff", padding: "3px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700 }}>
                        {item.category}
                      </span>
                    </div>
                    <div style={{ padding: 14 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{item.name}</h3>
                      <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>{item.description}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontSize: 17, fontWeight: 800, color: "#16a34a" }}>₹{item.price}</span>
                          <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 4 }}>/ {item.unit}</span>
                        </div>
                        {qty > 0 ? (
                          <div style={{ display: "flex", alignItems: "center", background: "#16a34a", borderRadius: 8, overflow: "hidden" }}>
                            <button onClick={() => removeFromCart(item.id)}
                              style={{ padding: "6px 10px", background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                              {qty === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
                            </button>
                            <span style={{ padding: "6px 6px", color: "#fff", fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{qty}</span>
                            <button onClick={() => addToCart(item.id)}
                              style={{ padding: "6px 10px", background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                              <Plus size={13} />
                            </button>
                          </div>
                        ) : (
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => addToCart(item.id)}
                            style={{ background: "#fff", color: "#16a34a", border: "2px solid #16a34a", padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                            ADD
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
      </div>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }}
          style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#16a34a", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 50, boxShadow: "0 -4px 20px rgba(0,0,0,0.15)" }}>
          <div style={{ color: "#fff" }}>
            <span style={{ fontSize: 15, fontWeight: 800 }}>{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
            <span style={{ fontSize: 13, opacity: 0.8, marginLeft: 8 }}>|</span>
            <span style={{ fontSize: 17, fontWeight: 900, marginLeft: 8 }}>₹{totalPrice}</span>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ background: "#fff", color: "#16a34a", padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 800, border: "none", cursor: "pointer" }}>
            View Cart →
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
