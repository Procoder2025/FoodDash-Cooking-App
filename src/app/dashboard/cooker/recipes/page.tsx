"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRecipe } from "@/context/RecipeContext";
import { Plus, Trash2, BookOpen, X, Upload, ImageIcon, Video, Clock, Users, ChefHat, Flame, Heart } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

export default function CookerRecipes() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { addRecipe, deleteRecipe, getRecipesByCooker } = useRecipe();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "Rice", image: "",
    ingredients: "", steps: "", prepTime: "", cookTime: "",
    servings: "", isVeg: true, difficulty: "Easy" as "Easy" | "Medium" | "Hard",
    tips: "", videoUrl: "",
  });
  const [imagePreview, setImagePreview] = useState("");

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

  const myRecipes = getRecipesByCooker(user.id);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addRecipe({
      cookerId: user.id,
      cookerName: user.name,
      kitchenName: user.kitchenName || "",
      title: form.title,
      description: form.description,
      category: form.category,
      image: form.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      videoUrl: form.videoUrl,
      ingredients: form.ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
      steps: form.steps.split("\n").map((s) => s.trim()).filter(Boolean),
      prepTime: form.prepTime,
      cookTime: form.cookTime,
      servings: form.servings,
      isVeg: form.isVeg,
      difficulty: form.difficulty,
      tips: form.tips,
    });
    setForm({ title: "", description: "", category: "Rice", image: "", ingredients: "", steps: "", prepTime: "", cookTime: "", servings: "", isVeg: true, difficulty: "Easy", tips: "", videoUrl: "" });
    setImagePreview("");
    setShowForm(false);
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none" };
  const diffColors = { Easy: "#16a34a", Medium: "#f59e0b", Hard: "#ef4444" };

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", background: "linear-gradient(135deg, #7c3aed, #a855f7)", padding: "36px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, background: "rgba(255,255,255,0.15)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>📖</div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>My Recipes</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Share your cooking secrets with customers</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(true)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", color: "#7c3aed", padding: "10px 22px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
            <Plus size={18} /> Upload Recipe
          </motion.button>
        </div>
      </motion.div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Stats */}
        <FadeInUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
            {[
              { icon: BookOpen, label: "Total Recipes", value: myRecipes.length, color: "#7c3aed" },
              { icon: Heart, label: "Total Likes", value: myRecipes.reduce((s, r) => s + r.likes, 0), color: "#ef4444" },
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ y: -3 }} style={{ background: "#fff", borderRadius: 14, padding: 18, border: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 12 }}>
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

        {/* Recipe List */}
        {myRecipes.length === 0 ? (
          <FadeInUp delay={0.2}>
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6" }}>
              <BookOpen size={48} color="#d1d5db" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>No recipes uploaded yet</h3>
              <p style={{ color: "#6b7280", marginBottom: 20 }}>Share your recipes to attract more customers!</p>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowForm(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#7c3aed", color: "#fff", padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>
                <Plus size={16} /> Upload Your First Recipe
              </motion.button>
            </div>
          </FadeInUp>
        ) : (
          <StaggerContainer>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {myRecipes.map((recipe) => (
                <StaggerItem key={recipe.id}>
                  <motion.div whileHover={{ y: -4, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
                    style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #f3f4f6" }}>
                    <div style={{ position: "relative" }}>
                      <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: 10, left: 10, background: diffColors[recipe.difficulty], color: "#fff", padding: "3px 10px", borderRadius: 50, fontSize: 11, fontWeight: 700 }}>
                        {recipe.difficulty}
                      </span>
                      <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", color: "#fff", padding: "3px 10px", borderRadius: 50, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                        <Heart size={12} fill="#fff" /> {recipe.likes}
                      </span>
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <span style={{ width: 12, height: 12, border: `2px solid ${recipe.isVeg ? "#16a34a" : "#ef4444"}`, borderRadius: 2, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 6, color: recipe.isVeg ? "#16a34a" : "#ef4444" }}>●</span>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>{recipe.title}</h3>
                      </div>
                      <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{recipe.description}</p>
                      <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#9ca3af", marginBottom: 12 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={12} /> {recipe.prepTime} + {recipe.cookTime}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Users size={12} /> {recipe.servings}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Flame size={12} /> {recipe.ingredients.length} ingredients</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => deleteRecipe(recipe.id)}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "1px solid #fecaca", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#ef4444" }}>
                          <Trash2 size={13} /> Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        )}
      </div>

      {/* Add Recipe Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 20, padding: 26, width: "100%", maxWidth: 580, maxHeight: "92vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
                  <BookOpen size={20} color="#7c3aed" /> Upload Recipe
                </h3>
                <button onClick={() => setShowForm(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
              </div>

              <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Recipe Title *</label>
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Perfect Sambar Rice" style={inputStyle} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Description *</label>
                  <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Tell customers what makes this recipe special..." style={{ ...inputStyle, resize: "none" as const }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                      {["Rice", "Tiffin", "Main Course", "Biryani", "Starters", "Breads", "Beverages", "Desserts", "Snacks"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Difficulty</label>
                    <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as "Easy" | "Medium" | "Hard" })} style={inputStyle}>
                      {["Easy", "Medium", "Hard"].map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Prep Time *</label>
                    <input required value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} placeholder="15 min" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Cook Time *</label>
                    <input required value={form.cookTime} onChange={(e) => setForm({ ...form, cookTime: e.target.value })} placeholder="30 min" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Servings *</label>
                    <input required value={form.servings} onChange={(e) => setForm({ ...form, servings: e.target.value })} placeholder="4" style={inputStyle} />
                  </div>
                </div>

                {/* Recipe Photo */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
                    <ImageIcon size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Recipe Photo
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
                    <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 14px", borderRadius: 12, border: "2px dashed #d1d5db", background: "#f9fafb", cursor: "pointer" }}>
                      <Upload size={24} color="#9ca3af" style={{ marginBottom: 6 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Upload photo</span>
                      <span style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>JPG, PNG up to 5MB</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                    </label>
                  )}
                  <input value={form.image.startsWith("data:") ? "" : form.image} onChange={(e) => { setForm({ ...form, image: e.target.value }); setImagePreview(""); }} placeholder="Or paste image URL..." style={{ ...inputStyle, marginTop: 4, fontSize: 12 }} />
                </div>

                {/* Video URL */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
                    <Video size={13} color="#ef4444" style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> Cooking Video (YouTube URL)
                  </label>
                  <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." style={inputStyle} />
                </div>

                {/* Ingredients */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Ingredients * (one per line)</label>
                  <textarea required value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} rows={4}
                    placeholder={"1 cup rice\n1/2 cup toor dal\n2 tbsp sambar powder\nSalt to taste"}
                    style={{ ...inputStyle, resize: "none" as const, fontSize: 12, lineHeight: 1.6 }} />
                </div>

                {/* Steps */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Cooking Steps * (one per line)</label>
                  <textarea required value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} rows={5}
                    placeholder={"Wash and soak rice for 30 min\nPressure cook dal with turmeric\nHeat oil and add mustard seeds\nAdd vegetables and cook\nMix everything and serve hot"}
                    style={{ ...inputStyle, resize: "none" as const, fontSize: 12, lineHeight: 1.6 }} />
                </div>

                {/* Tips */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Chef Tips (optional)</label>
                  <textarea value={form.tips} onChange={(e) => setForm({ ...form, tips: e.target.value })} rows={2}
                    placeholder="Share your secret tips that make this dish special..."
                    style={{ ...inputStyle, resize: "none" as const, fontSize: 12 }} />
                </div>

                {/* Veg toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} />
                    Vegetarian
                  </label>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                  style={{ width: "100%", padding: 14, borderRadius: 12, background: "#7c3aed", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 15px rgba(124,58,237,0.3)" }}>
                  <Plus size={18} /> Upload Recipe
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
