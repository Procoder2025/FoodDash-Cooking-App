"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChefHat, Truck, Star, Phone, PartyPopper, Utensils, MapPin, IndianRupee, Send, CheckCircle, User, Mail, MessageSquare, Calendar, X } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem, HoverLift } from "@/components/AnimatedSection";

const menus = [
  { title: "South Indian Feast", price: "From ₹149/person", items: ["Sambar Rice", "Curd Rice", "Rasam", "Poriyal", "Appalam", "Payasam"], img: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=250&fit=crop" },
  { title: "North Indian Thali", price: "From ₹199/person", items: ["Butter Chicken / Paneer", "Dal Makhani", "Naan & Rice", "Raita", "Gulab Jamun"], img: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=250&fit=crop" },
  { title: "Biryani Special", price: "From ₹179/person", items: ["Dum Biryani (Veg/Non-Veg)", "Raita", "Salan", "Kebabs", "Phirni"], img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=250&fit=crop" },
  { title: "Snacks Party Pack", price: "From ₹99/person", items: ["Samosa", "Vada Pav", "Pani Puri", "Bajji", "Chai / Coffee"], img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=250&fit=crop" },
  { title: "Dessert Platter", price: "From ₹79/person", items: ["Gulab Jamun", "Mysore Pak", "Brownies", "Payasam", "Laddu"], img: "https://images.unsplash.com/photo-1666190064517-1471990684a1?w=400&h=250&fit=crop" },
  { title: "Custom Menu", price: "Get a quote", items: ["Mix & match from all chefs", "Customize portions", "Special dietary needs", "Festival specials"], img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop" },
];

const partyCookers = [
  {
    name: "Lakshmi Devi", kitchen: "Amma's Kitchen", image: "https://images.unsplash.com/photo-1595257841889-eca2678571b2?w=200&h=200&fit=crop&crop=face",
    speciality: "South Indian Feast", location: "Komarapalayam", rating: 4.9, partyOrders: 120,
    capacity: "10-200 people", priceRange: "₹149-₹249/person",
    highlights: ["Sambar Rice", "Dosa Live Counter", "Payasam", "Filter Coffee"],
  },
  {
    name: "Meera Sharma", kitchen: "Spice Trail Kitchen", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200&fit=crop&crop=face",
    speciality: "North Indian Thali", location: "Hosur", rating: 4.8, partyOrders: 85,
    capacity: "20-300 people", priceRange: "₹199-₹349/person",
    highlights: ["Butter Chicken", "Dal Makhani", "Naan Counter", "Gulab Jamun"],
  },
  {
    name: "Fatima Begum", kitchen: "Royal Biryani House", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    speciality: "Biryani & Mughlai", location: "Komarapalayam", rating: 4.9, partyOrders: 200,
    capacity: "25-500 people", priceRange: "₹179-₹299/person",
    highlights: ["Dum Biryani", "Seekh Kebab", "Chicken 65", "Phirni"],
  },
  {
    name: "Kavitha Rajan", kitchen: "Kavitha's Snack Box", image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&crop=face",
    speciality: "Snacks & Street Food", location: "Coimbatore", rating: 4.7, partyOrders: 150,
    capacity: "10-400 people", priceRange: "₹79-₹149/person",
    highlights: ["Samosa", "Pani Puri Counter", "Bajji", "Masala Chai"],
  },
  {
    name: "Radha Krishnan", kitchen: "Sweet Home Bakery", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    speciality: "Desserts & Sweets", location: "Coimbatore", rating: 4.8, partyOrders: 95,
    capacity: "10-300 people", priceRange: "₹79-₹199/person",
    highlights: ["Gulab Jamun", "Mysore Pak", "Cakes", "Payasam"],
  },
];

export default function PartyOrdersPage() {
  const [selectedCooker, setSelectedCooker] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", date: "", guests: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setSelectedCooker(null); setFormData({ name: "", phone: "", email: "", date: "", guests: "", message: "" }); }, 3000);
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none" };

  return (
    <div style={{ width: "100%" }}>
      {/* Hero */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
        width: "100%", padding: "80px 20px", textAlign: "center",
        background: "linear-gradient(135deg, #111827, #1e293b, #0f172a)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Animated floating background elements */}
        {[
          { emoji: "🎉", top: "8%", left: "5%", size: 50, dur: 4, delay: 0 },
          { emoji: "🎂", bottom: "10%", left: "8%", size: 45, dur: 3.5, delay: 0.5 },
          { emoji: "🍛", top: "15%", right: "6%", size: 42, dur: 5, delay: 0.2 },
          { emoji: "🎊", bottom: "15%", right: "10%", size: 48, dur: 4.5, delay: 0.8 },
          { emoji: "🍱", top: "50%", left: "3%", size: 38, dur: 3, delay: 1 },
          { emoji: "🎈", top: "25%", right: "15%", size: 40, dur: 6, delay: 0.3 },
          { emoji: "🥘", bottom: "25%", left: "15%", size: 36, dur: 4, delay: 0.6 },
          { emoji: "✨", top: "40%", right: "4%", size: 34, dur: 3.5, delay: 1.2 },
          { emoji: "🍰", top: "60%", left: "12%", size: 36, dur: 5, delay: 0.4 },
          { emoji: "🎁", bottom: "5%", right: "20%", size: 40, dur: 4, delay: 0.7 },
        ].map((item, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0, 15, 0],
              x: [0, 10, 0, -10, 0],
              rotate: [0, 10, -10, 5, 0],
              scale: [1, 1.1, 1, 0.95, 1],
            }}
            transition={{ repeat: Infinity, duration: item.dur, delay: item.delay, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: (item as any).top, bottom: (item as any).bottom,
              left: (item as any).left, right: (item as any).right,
              fontSize: item.size, opacity: 0.12, zIndex: 0,
              filter: "blur(1px)",
            }}
          >
            {item.emoji}
          </motion.div>
        ))}

        {/* Glowing gradient orbs */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          style={{ position: "absolute", top: -100, right: -100, width: 350, height: 350, background: "radial-gradient(circle, #f97316, transparent 70%)", borderRadius: "50%", zIndex: 0 }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
          style={{ position: "absolute", bottom: -120, left: -120, width: 400, height: 400, background: "radial-gradient(circle, #8b5cf6, transparent 70%)", borderRadius: "50%", zIndex: 0 }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
          style={{ position: "absolute", top: "40%", left: "50%", transform: "translateX(-50%)", width: 300, height: 300, background: "radial-gradient(circle, #f59e0b, transparent 70%)", borderRadius: "50%", zIndex: 0 }}
        />

        {/* Animated lines / sparkles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`spark-${i}`}
            animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.5, delay: i * 0.8, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: `${15 + i * 14}%`, left: `${10 + i * 15}%`,
              width: 4, height: 4, background: "#f97316", borderRadius: "50%",
              boxShadow: "0 0 10px #f97316, 0 0 20px #f97316",
              zIndex: 0,
            }}
          />
        ))}

        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <PartyPopper size={52} color="#f97316" style={{ margin: "0 auto 18px", filter: "drop-shadow(0 0 12px rgba(249,115,22,0.5))" }} />
            </motion.div>
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 900, color: "#fff", marginBottom: 16 }}>
            Party Orders &<br />
            <motion.span animate={{ color: ["#f97316", "#fbbf24", "#f97316"] }} transition={{ repeat: Infinity, duration: 3 }}>
              Bulk Catering
            </motion.span>
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.6, maxWidth: 500, margin: "0 auto 32px" }}>
            Celebrate with authentic homemade food! Perfect for birthdays, office parties & festivals.
          </motion.p>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Link href="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff",
              padding: "14px 36px", borderRadius: 14,
              fontSize: 16, fontWeight: 700,
              boxShadow: "0 4px 20px rgba(249,115,22,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <Phone size={18} /> Enquire Now
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 20px 60px" }}>
        {/* Features */}
        <FadeInUp>
          <StaggerContainer>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 60 }}>
              {[
                { icon: Users, title: "10 to 500+ People", desc: "From intimate gatherings to grand celebrations", color: "#3b82f6" },
                { icon: ChefHat, title: "Custom Menu", desc: "Choose dishes from multiple home chefs", color: "#16a34a" },
                { icon: Truck, title: "On-Time Delivery", desc: "Hot food delivered at your event location", color: "#f97316" },
                { icon: Star, title: "Premium Quality", desc: "Same homemade taste, scaled for your party", color: "#8b5cf6" },
              ].map((f, i) => (
                <StaggerItem key={i}>
                  <HoverLift>
                    <div style={{ textAlign: "center", background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #f3f4f6" }}>
                      <div style={{ width: 56, height: 56, background: `${f.color}15`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                        <f.icon size={26} color={f.color} />
                      </div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                      <p style={{ fontSize: 13, color: "#6b7280" }}>{f.desc}</p>
                    </div>
                  </HoverLift>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </FadeInUp>

        {/* Menus */}
        <FadeInUp>
          <h2 style={{ fontSize: 28, fontWeight: 900, textAlign: "center", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Utensils size={24} color="#16a34a" /> Popular Party Menus
          </h2>
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: 16, marginBottom: 40 }}>Choose from curated menus or create your own</p>
        </FadeInUp>

        <StaggerContainer stagger={0.1}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {menus.map((m, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }} style={{
                  background: "#fff", borderRadius: 16, overflow: "hidden",
                  border: "1px solid #f3f4f6", transition: "all 0.3s",
                }}>
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} src={m.img} alt={m.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: 22 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700 }}>{m.title}</h3>
                      <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 13 }}>{m.price}</span>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, marginBottom: 18 }}>
                      {m.items.map((item) => (
                        <li key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
                          <span style={{ width: 5, height: 5, background: "#16a34a", borderRadius: "50%", flexShrink: 0 }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link href="/contact" style={{
                        display: "block", textAlign: "center",
                        padding: "10px 20px", borderRadius: 10,
                        border: "2px solid #16a34a", color: "#16a34a",
                        fontSize: 13, fontWeight: 700,
                      }}>
                        Enquire →
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* Available Party Cookers */}
        <FadeInUp delay={0.1}>
          <div style={{ marginTop: 60 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, textAlign: "center", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <ChefHat size={24} color="#f97316" /> Available Party Chefs
            </h2>
            <p style={{ textAlign: "center", color: "#6b7280", fontSize: 16, marginBottom: 36 }}>Interested cookers ready to cater your event — contact them directly</p>
          </div>
        </FadeInUp>

        <StaggerContainer stagger={0.1}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {partyCookers.map((cooker, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}
                  style={{ background: "#fff", borderRadius: 18, padding: 24, border: "1px solid #f3f4f6", display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>

                  {/* Chef Info */}
                  <div style={{ display: "flex", gap: 14, alignItems: "center", flex: "1 1 280px", minWidth: 240 }}>
                    <motion.img whileHover={{ scale: 1.08 }} src={cooker.image} alt={cooker.name}
                      style={{ width: 64, height: 64, borderRadius: 16, objectFit: "cover", border: "2px solid #f3f4f6" }} />
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 2 }}>{cooker.kitchen}</h3>
                      <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, marginBottom: 4 }}>by {cooker.name}</p>
                      <div style={{ display: "flex", gap: 10, fontSize: 11, color: "#6b7280", flexWrap: "wrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Star size={10} color="#f59e0b" fill="#f59e0b" /> {cooker.rating}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MapPin size={10} color="#ef4444" /> {cooker.location}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><PartyPopper size={10} color="#8b5cf6" /> {cooker.partyOrders} events</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ flex: "1 1 200px", minWidth: 180 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>{cooker.speciality}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                      {cooker.highlights.map((h) => (
                        <span key={h} style={{ background: "#f3f4f6", color: "#6b7280", padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600 }}>{h}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Users size={10} /> {cooker.capacity}</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flex: "0 0 auto" }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#16a34a", display: "flex", alignItems: "center", gap: 2 }}>
                      {cooker.priceRange}
                    </span>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCooker(cooker.kitchen)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: "#f97316", color: "#fff", border: "none",
                        padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
                        boxShadow: "0 3px 10px rgba(249,115,22,0.3)",
                      }}>
                      <Phone size={14} /> Contact Chef
                    </motion.button>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {selectedCooker && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedCooker(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 22, padding: 32, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", position: "relative" }}
            >
              {submitted ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center", padding: "40px 0" }}>
                  <CheckCircle size={60} color="#16a34a" style={{ margin: "0 auto 16px" }} />
                  <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Enquiry Sent!</h3>
                  <p style={{ color: "#6b7280", fontSize: 14 }}>
                    <strong>{selectedCooker}</strong> will contact you within 2 hours.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}>
                        <PartyPopper size={20} color="#f97316" /> Party Enquiry
                      </h3>
                      <p style={{ fontSize: 13, color: "#6b7280" }}>for <strong>{selectedCooker}</strong></p>
                    </div>
                    <button onClick={() => setSelectedCooker(null)} style={{ width: 36, height: 36, borderRadius: 10, background: "#f3f4f6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Your Name *</label>
                        <div style={{ position: "relative" }}>
                          <User size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                          <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" style={{ ...inputStyle, paddingLeft: 34 }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Phone *</label>
                        <div style={{ position: "relative" }}>
                          <Phone size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                          <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" style={{ ...inputStyle, paddingLeft: 34 }} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Email</label>
                      <div style={{ position: "relative" }}>
                        <Mail size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@email.com" style={{ ...inputStyle, paddingLeft: 34 }} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Event Date *</label>
                        <div style={{ position: "relative" }}>
                          <Calendar size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                          <input required type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} style={{ ...inputStyle, paddingLeft: 34 }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>No. of Guests *</label>
                        <div style={{ position: "relative" }}>
                          <Users size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                          <input required type="number" value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} placeholder="e.g. 50" style={{ ...inputStyle, paddingLeft: 34 }} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Event Details / Special Requests</label>
                      <div style={{ position: "relative" }}>
                        <MessageSquare size={14} style={{ position: "absolute", left: 12, top: 14, color: "#9ca3af" }} />
                        <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3}
                          placeholder="Birthday party, office lunch, festival, veg/non-veg preference..."
                          style={{ ...inputStyle, paddingLeft: 34, resize: "none" as const }} />
                      </div>
                    </div>

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                      style={{
                        width: "100%", padding: 14, borderRadius: 12,
                        background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff", border: "none",
                        fontSize: 15, fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        boxShadow: "0 4px 15px rgba(249,115,22,0.3)",
                      }}>
                      <Send size={16} /> Send Enquiry
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
