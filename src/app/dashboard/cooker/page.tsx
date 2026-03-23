"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useFood } from "@/context/FoodContext";
import { Plus, Trash2, Eye, EyeOff, ChefHat, Package, TrendingUp, Star, X, Upload, ImageIcon, Video, FileText, Clock, IndianRupee, Flame, Calendar, MapPin } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

export default function CookerDashboard() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { addFood, updateFood, deleteFood, getFoodsByCooker } = useFood();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", image: "", category: "Rice",
    isVeg: true, servings: "", prepTime: "",
    doorNo: "", street: "", area: "", city: "", pincode: "",
    videoUrl: "", videoFile: "", recipe: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { alert("Video must be under 50MB"); return; }
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    setForm((p) => ({ ...p, videoFile: url, videoUrl: "" }));
  };
  const [filter, setFilter] = useState("all");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      setForm((p) => ({ ...p, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  if (!isLoggedIn || user?.role !== "cooker") {
    if (typeof window !== "undefined") router.push("/auth/login");
    return null;
  }

  const myFoods = getFoodsByCooker(user.id);
  const totalOrders = myFoods.reduce((s, f) => s + f.orders, 0);
  const avgRating = myFoods.filter((f) => f.rating > 0).reduce((s, f, _, a) => s + f.rating / a.length, 0);
  const todayStr = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" });

  const filteredFoods = filter === "all" ? myFoods
    : filter === "available" ? myFoods.filter((f) => f.isAvailable)
    : myFoods.filter((f) => !f.isAvailable);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addFood({
      cookerId: user.id, cookerName: user.name, kitchenName: user.kitchenName || "",
      location: [form.doorNo, form.street, form.area, form.city, form.pincode].filter(Boolean).join(", "),
      name: form.name, description: form.description, price: parseFloat(form.price),
      image: form.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      category: form.category, isVeg: form.isVeg, isAvailable: true,
      servings: parseInt(form.servings) || 10, prepTime: form.prepTime || "30 min",
    });
    setForm({ name: "", description: "", price: "", image: "", category: "Rice", isVeg: true, servings: "", prepTime: "", doorNo: "", street: "", area: "", city: "", pincode: "", videoUrl: "", videoFile: "", recipe: "" });
    setImagePreview("");
    setShowForm(false);
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none" };

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", background: "linear-gradient(135deg, #15803d, #16a34a)", padding: "36px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, background: "rgba(255,255,255,0.15)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>👩‍🍳</div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{user.kitchenName || "My Kitchen"}</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Welcome, {user.name}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ background: "rgba(255,255,255,0.12)", color: "#fff", padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={14} /> {todayStr}
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(true)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", color: "#16a34a", padding: "10px 22px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
              <Plus size={18} /> Post Today&apos;s Food
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Stats */}
        <FadeInUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
            {[
              { icon: Package, label: "Total Dishes", value: myFoods.length, color: "#3b82f6" },
              { icon: TrendingUp, label: "Total Orders", value: totalOrders, color: "#16a34a" },
              { icon: Star, label: "Avg Rating", value: avgRating ? avgRating.toFixed(1) : "New", color: "#f59e0b" },
              { icon: Eye, label: "Available Now", value: myFoods.filter((f) => f.isAvailable).length, color: "#8b5cf6" },
              { icon: Flame, label: "Today Posted", value: myFoods.filter((f) => new Date(f.postedAt).toDateString() === new Date().toDateString()).length, color: "#ef4444" },
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ y: -3 }} style={{
                background: "#fff", borderRadius: 14, padding: 18, border: "1px solid #f3f4f6",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{ width: 42, height: 42, background: `${s.color}12`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 900 }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeInUp>

        {/* Removed Today's Menu Banner */}

        {/* Filter + Food List */}
        <FadeInUp delay={0.1}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
              <ChefHat size={20} color="#16a34a" /> My Posted Foods ({myFoods.length})
            </h2>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { id: "all", label: "All" },
                { id: "available", label: "Available" },
                { id: "soldout", label: "Sold Out" },
              ].map((f) => (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer",
                  background: filter === f.id ? "#16a34a" : "#f3f4f6",
                  color: filter === f.id ? "#fff" : "#6b7280",
                }}>{f.label}</button>
              ))}
            </div>
          </div>
        </FadeInUp>

        {filteredFoods.length === 0 ? (
          <FadeInUp delay={0.2}>
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6" }}>
              <ChefHat size={48} color="#d1d5db" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>No food posted yet</h3>
              <p style={{ color: "#6b7280", marginBottom: 20 }}>Start posting your delicious homemade food!</p>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowForm(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#16a34a", color: "#fff", padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>
                <Plus size={16} /> Post Your First Dish
              </motion.button>
            </div>
          </FadeInUp>
        ) : (
          <StaggerContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredFoods.map((food) => (
                <StaggerItem key={food.id}>
                  <motion.div whileHover={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
                    style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", borderRadius: 14, padding: 16, border: "1px solid #f3f4f6", flexWrap: "wrap" }}>
                    <img src={food.image} alt={food.name} style={{ width: 70, height: 70, borderRadius: 12, objectFit: "cover" }} />
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ width: 12, height: 12, border: `2px solid ${food.isVeg ? "#16a34a" : "#ef4444"}`, borderRadius: 2, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 6, color: food.isVeg ? "#16a34a" : "#ef4444" }}>●</span>
                        <h3 style={{ fontSize: 15, fontWeight: 700 }}>{food.name}</h3>
                        <span style={{ fontSize: 11, fontWeight: 600, color: food.isAvailable ? "#16a34a" : "#ef4444", background: food.isAvailable ? "#f0fdf4" : "#fef2f2", padding: "2px 8px", borderRadius: 50 }}>
                          {food.isAvailable ? "Available" : "Sold Out"}
                        </span>
                        {new Date(food.postedAt).toDateString() === new Date().toDateString() && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", background: "#fffbeb", padding: "2px 8px", borderRadius: 50 }}>Today</span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 2 }}><IndianRupee size={11} strokeWidth={3} />{food.price}</span>
                        <span>•</span>
                        <span>{food.servings} servings</span>
                        <span>•</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 2 }}><Clock size={11} /> {food.prepTime}</span>
                        <span>•</span>
                        <span>{food.orders} orders</span>
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateFood(food.id, { isAvailable: !food.isAvailable })}
                        style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title={food.isAvailable ? "Mark Sold Out" : "Mark Available"}>
                        {food.isAvailable ? <EyeOff size={14} color="#6b7280" /> : <Eye size={14} color="#16a34a" />}
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => deleteFood(food.id)}
                        style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #fecaca", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Trash2 size={14} color="#ef4444" />
                      </motion.button>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        )}
      </div>

      {/* Add Food Modal — with Video & Recipe */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 20, padding: 26, width: "100%", maxWidth: 540, maxHeight: "92vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
                  <Flame size={20} color="#f59e0b" /> Post Today&apos;s Food
                </h3>
                <button onClick={() => setShowForm(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
              </div>

              <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Food Name */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Food Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sambar Rice Combo" style={inputStyle} />
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Description *</label>
                  <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Describe your dish — ingredients, taste, what makes it special..." style={{ ...inputStyle, resize: "none" as const }} />
                </div>

                {/* Price */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Price (₹) *</label>
                  <input type="number" step="1" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="89" style={inputStyle} />
                </div>

                {/* Category & Prep Time */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                      {["Rice", "Tiffin", "Main Course", "Biryani", "Starters", "Breads", "Beverages", "Desserts", "Snacks"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Prep Time</label>
                    <input value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} placeholder="30 min" style={inputStyle} />
                  </div>
                </div>

                {/* Location Details */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                    <MapPin size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Kitchen Location *
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8, marginBottom: 8 }}>
                    <input required value={form.doorNo} onChange={(e) => setForm({ ...form, doorNo: e.target.value })} placeholder="Door No." style={inputStyle} />
                    <input required value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="Street Name" style={inputStyle} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <input required value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="Area / Locality" style={inputStyle} />
                    <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" style={inputStyle} />
                    <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="Pincode" style={inputStyle} />
                  </div>
                </div>

                {/* Food Photo */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
                    <ImageIcon size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Food Photo
                  </label>
                  {imagePreview ? (
                    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 6 }}>
                      <img src={imagePreview} alt="Preview" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 12 }} />
                      <button type="button" onClick={() => { setImagePreview(""); setForm({ ...form, image: "" }); }}
                        style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={12} color="#fff" />
                      </button>
                    </div>
                  ) : (
                    <label style={{
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      padding: "20px 14px", borderRadius: 12,
                      border: "2px dashed #d1d5db", background: "#f9fafb",
                      cursor: "pointer", transition: "all 0.2s", textAlign: "center",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.background = "#f0fdf4"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.background = "#f9fafb"; }}
                    >
                      <Upload size={24} color="#9ca3af" style={{ marginBottom: 6 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Upload food photo</span>
                      <span style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>JPG, PNG up to 5MB</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                    </label>
                  )}
                  <input value={form.image.startsWith("data:") ? "" : form.image} onChange={(e) => { setForm({ ...form, image: e.target.value }); setImagePreview(""); }} placeholder="Or paste image URL..." style={{ ...inputStyle, marginTop: 4, fontSize: 12 }} />
                </div>

                {/* Veg toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} />
                    🟢 Vegetarian
                  </label>
                </div>

                {/* Submit */}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                  style={{ width: "100%", padding: 14, borderRadius: 12, background: "#16a34a", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 15px rgba(22,163,74,0.3)" }}>
                  <Plus size={18} /> Post Food
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
