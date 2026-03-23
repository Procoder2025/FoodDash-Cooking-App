"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, MapPin, ChefHat, Edit3, Save, X, Camera, Star, Package, Clock, Shield, Bell, Heart, Settings, LogOut } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const avatarOptions = ["👤", "👩", "👨", "👩‍🍳", "👨‍🍳", "🧑‍🍳", "😊", "😎", "🤗", "🦸", "🧑‍💻", "👩‍💼"];

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", address: "", avatar: "", kitchenName: "", speciality: "", bio: "",
  });
  const [saved, setSaved] = useState(false);

  if (!isLoggedIn || !user) {
    if (typeof window !== "undefined") router.push("/auth/login");
    return null;
  }

  const isCooker = user.role === "cooker";

  const startEdit = () => {
    setForm({
      name: user.name, phone: user.phone, address: user.address || "",
      avatar: user.avatar, kitchenName: user.kitchenName || "",
      speciality: user.speciality || "", bio: user.bio || "",
    });
    setEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", background: "#f9fafb",
    border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
        width: "100%", padding: "50px 20px 60px", textAlign: "center", position: "relative", overflow: "hidden",
        background: isCooker ? "linear-gradient(135deg, #15803d, #16a34a, #059669)" : "linear-gradient(135deg, #1e40af, #3b82f6, #2563eb)",
      }}>
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.12, 0.06] }} transition={{ repeat: Infinity, duration: 5 }}
          style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, background: "radial-gradient(circle, #fff, transparent 70%)", borderRadius: "50%" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{ position: "relative", display: "inline-block", marginBottom: 16 }}
          >
            <div style={{
              width: 90, height: 90, borderRadius: 24, background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44,
              border: "3px solid rgba(255,255,255,0.3)", margin: "0 auto",
            }}>
              {user.avatar}
            </div>
            {!editing && (
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={startEdit}
                style={{
                  position: "absolute", bottom: -4, right: -4, width: 32, height: 32,
                  borderRadius: 10, background: "#fff", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}>
                <Camera size={14} color={isCooker ? "#16a34a" : "#3b82f6"} />
              </motion.button>
            )}
          </motion.div>

          <motion.h1 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
            {user.name}
          </motion.h1>
          <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
            {user.email}
          </motion.p>
          {isCooker && user.kitchenName && (
            <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
              style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, marginTop: 4 }}>
              {user.kitchenName}
            </motion.p>
          )}
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }}
            style={{
              display: "inline-block", marginTop: 10, fontSize: 11, fontWeight: 700,
              background: "rgba(255,255,255,0.2)", color: "#fff",
              padding: "5px 16px", borderRadius: 50, textTransform: "uppercase",
            }}>
            {isCooker ? "Home Chef" : "Food Lover"}
          </motion.span>
        </div>
      </motion.div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 20px 60px" }}>
        {/* Success toast */}
        <AnimatePresence>
          {saved && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: "12px 18px", borderRadius: 12, marginBottom: 20, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <Save size={16} /> Profile updated successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Form */}
        <AnimatePresence mode="wait">
          {editing ? (
            <motion.form key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              onSubmit={handleSave}
              style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", border: "1px solid #f3f4f6", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
                  <Edit3 size={18} color={isCooker ? "#16a34a" : "#3b82f6"} /> Edit Profile
                </h3>
                <button type="button" onClick={() => setEditing(false)}
                  style={{ width: 34, height: 34, borderRadius: 10, background: "#f3f4f6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={16} />
                </button>
              </div>

              {/* Avatar Picker */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Avatar</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {avatarOptions.map((a) => (
                    <motion.button key={a} type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => setForm({ ...form, avatar: a })}
                      style={{
                        width: 44, height: 44, borderRadius: 12, border: form.avatar === a ? `2px solid ${isCooker ? "#16a34a" : "#3b82f6"}` : "2px solid #e5e7eb",
                        background: form.avatar === a ? (isCooker ? "#f0fdf4" : "#eff6ff") : "#f9fafb",
                        cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                      {a}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = isCooker ? "#16a34a" : "#3b82f6"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Phone</label>
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = isCooker ? "#16a34a" : "#3b82f6"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Address</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Your address" style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = isCooker ? "#16a34a" : "#3b82f6"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }} />
              </div>

              {isCooker && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Kitchen Name</label>
                      <input value={form.kitchenName} onChange={(e) => setForm({ ...form, kitchenName: e.target.value })} style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#16a34a"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Speciality</label>
                      <input value={form.speciality} onChange={(e) => setForm({ ...form, speciality: e.target.value })} placeholder="e.g. South Indian" style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#16a34a"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Bio</label>
                    <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2} placeholder="Tell customers about yourself..." style={{ ...inputStyle, resize: "none" as const }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "#16a34a"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }} />
                  </div>
                </>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                  style={{
                    flex: 1, padding: 14, borderRadius: 12, border: "none", cursor: "pointer",
                    background: isCooker ? "#16a34a" : "#3b82f6", color: "#fff",
                    fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: `0 4px 15px ${isCooker ? "rgba(22,163,74,0.3)" : "rgba(59,130,246,0.3)"}`,
                  }}>
                  <Save size={16} /> Save Changes
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setEditing(false)}
                  style={{ padding: "14px 24px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  Cancel
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div key="view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Profile Info Card */}
              <FadeInUp>
                <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f3f4f6", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
                      <User size={18} color={isCooker ? "#16a34a" : "#3b82f6"} /> Personal Info
                    </h3>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startEdit}
                      style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10,
                        border: `1px solid ${isCooker ? "#16a34a" : "#3b82f6"}`, background: "transparent",
                        color: isCooker ? "#16a34a" : "#3b82f6", fontSize: 12, fontWeight: 700, cursor: "pointer",
                      }}>
                      <Edit3 size={13} /> Edit
                    </motion.button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                      { icon: User, label: "Name", value: user.name },
                      { icon: Mail, label: "Email", value: user.email },
                      { icon: Phone, label: "Phone", value: user.phone },
                      { icon: MapPin, label: "Address", value: user.address || "Not set" },
                      ...(isCooker ? [
                        { icon: ChefHat, label: "Kitchen", value: user.kitchenName || "Not set" },
                        { icon: Star, label: "Speciality", value: user.speciality || "Not set" },
                      ] : []),
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", background: "#f9fafb", borderRadius: 12 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 10,
                          background: `${isCooker ? "#16a34a" : "#3b82f6"}10`,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <item.icon size={16} color={isCooker ? "#16a34a" : "#3b82f6"} />
                        </div>
                        <div>
                          <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{item.label}</p>
                          <p style={{ fontSize: 14, fontWeight: 600, color: item.value === "Not set" ? "#d1d5db" : "#374151" }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                    {isCooker && user.bio && (
                      <div style={{ padding: "10px 14px", background: "#f9fafb", borderRadius: 12 }}>
                        <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>Bio</p>
                        <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{user.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </FadeInUp>

              {/* Quick Links */}
              <FadeInUp delay={0.1}>
                <StaggerContainer>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      ...(isCooker ? [
                        { href: "/dashboard/cooker", icon: ChefHat, label: "My Kitchen", desc: "Manage your food posts", color: "#16a34a" },
                        { href: "/dashboard/cooker/orders", icon: Package, label: "Orders Received", desc: "View incoming orders", color: "#3b82f6" },
                        { href: "/dashboard/cooker/earnings", icon: Star, label: "Earnings", desc: "Track your income", color: "#f97316" },
                      ] : [
                        { href: "/orders", icon: Package, label: "My Orders", desc: "Track your deliveries", color: "#3b82f6" },
                        { href: "/favorites", icon: Heart, label: "Favorites", desc: "Your saved dishes", color: "#ef4444" },
                        { href: "/browse", icon: Star, label: "Browse Food", desc: "Discover new dishes", color: "#16a34a" },
                        { href: "/subscription", icon: Clock, label: "Subscriptions", desc: "Manage meal plans", color: "#8b5cf6" },
                      ]),
                    ].map((link, i) => (
                      <StaggerItem key={i}>
                        <motion.a href={link.href} whileHover={{ x: 4, boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
                          style={{
                            display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                            background: "#fff", borderRadius: 14, border: "1px solid #f3f4f6",
                            cursor: "pointer", textDecoration: "none", color: "inherit",
                          }}>
                          <div style={{
                            width: 42, height: 42, borderRadius: 12, background: `${link.color}12`,
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          }}>
                            <link.icon size={20} color={link.color} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 14, fontWeight: 700 }}>{link.label}</p>
                            <p style={{ fontSize: 12, color: "#9ca3af" }}>{link.desc}</p>
                          </div>
                          <span style={{ fontSize: 18, color: "#d1d5db" }}>›</span>
                        </motion.a>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>
              </FadeInUp>

              {/* Logout */}
              <FadeInUp delay={0.2}>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={() => { logout(); router.push("/"); }}
                  style={{
                    width: "100%", marginTop: 20, padding: "14px", borderRadius: 14,
                    border: "1px solid #fecaca", background: "#fff", color: "#ef4444",
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                  <LogOut size={16} /> Sign Out
                </motion.button>
              </FadeInUp>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
