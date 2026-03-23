"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mail, Phone, Send, Loader2, CheckCircle, MessageSquare, Clock, Globe } from "lucide-react";
import { FadeInUp } from "@/components/AnimatedSection";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "14px 16px",
  background: "#f9fafb", border: "1px solid #e5e7eb",
  borderRadius: 12, fontSize: 14, outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "general", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); setForm({ name: "", email: "", phone: "", type: "general", message: "" }); }, 1500);
  };

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <div style={{ width: "100%" }}>
      {/* Hero */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", background: "linear-gradient(135deg, #15803d, #16a34a, #059669)", padding: "70px 20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Floating background elements */}
        {["💬", "📞", "✉️", "🤝", "💡", "🌟"].map((emoji, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -18, 0, 12, 0], x: [0, 8, 0, -8, 0], rotate: [0, 10, -10, 5, 0] }}
            transition={{ repeat: Infinity, duration: 4 + i * 0.5, delay: i * 0.4, ease: "easeInOut" }}
            style={{ position: "absolute", top: `${10 + i * 14}%`, left: `${5 + i * 16}%`, fontSize: 30 + i * 4, opacity: 0.08, zIndex: 0 }}
          >{emoji}</motion.div>
        ))}
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.12, 0.06] }} transition={{ repeat: Infinity, duration: 5 }}
          style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, background: "radial-gradient(circle, #fff, transparent 70%)", borderRadius: "50%" }} />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04] }} transition={{ repeat: Infinity, duration: 6, delay: 1 }}
          style={{ position: "absolute", bottom: -100, left: -100, width: 350, height: 350, background: "radial-gradient(circle, #4ade80, transparent 70%)", borderRadius: "50%" }} />

        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}>
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <MessageSquare size={44} color="#fff" style={{ margin: "0 auto 16px", filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))" }} />
            </motion.div>
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, color: "#fff", marginBottom: 10 }}>
            Get In Touch
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
            Have questions, feedback, or want to join us? We&apos;d love to hear from you!
          </motion.p>
        </div>
      </motion.div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px 60px" }}>
        {/* Contact Info Cards */}
        <FadeInUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { icon: MapPin, title: "Address", text: "Main Road, Komarapalayam, TN 638183", color: "#16a34a" },
              { icon: Mail, title: "Email", text: "support@fooddash.in", color: "#3b82f6" },
              { icon: Phone, title: "Phone", text: "+91 90922 41237", color: "#f97316" },
              { icon: Clock, title: "Working Hours", text: "Mon-Sun: 7 AM - 10 PM", color: "#8b5cf6" },
            ].map((c, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.08)", scale: 1.02 }}
                style={{ background: "#fff", borderRadius: 16, padding: 22, display: "flex", alignItems: "flex-start", gap: 14, border: "1px solid #f3f4f6", cursor: "default" }}>
                <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}
                  style={{ width: 44, height: 44, background: `${c.color}12`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <c.icon size={22} color={c.color} />
                </motion.div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{c.title}</h4>
                  <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>{c.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeInUp>

        {/* Form */}
        <FadeInUp delay={0.1}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ background: "#fff", borderRadius: 20, padding: "60px 40px", textAlign: "center", border: "1px solid #f3f4f6" }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 0.6 }}>
                    <CheckCircle size={64} color="#16a34a" style={{ margin: "0 auto 16px" }} />
                  </motion.div>
                </motion.div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: "#6b7280", marginBottom: 24 }}>We&apos;ll get back to you within 24 hours.</p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSubmitted(false)} style={{
                  padding: "12px 28px", borderRadius: 12, border: "2px solid #16a34a",
                  background: "transparent", color: "#16a34a", fontSize: 14, fontWeight: 700, cursor: "pointer",
                }}>
                  Send Another Message
                </motion.button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onSubmit={handleSubmit}
                style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", border: "1px solid #f3f4f6", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                  <Send size={20} color="#16a34a" /> Send us a Message
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Name</label>
                    <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name"
                      style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
                    <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com"
                      style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210"
                      style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>I am interested in</label>
                    <select value={form.type} onChange={(e) => update("type", e.target.value)} style={inputStyle}>
                      <option value="general">General Inquiry</option>
                      <option value="chef">Becoming a Home Chef</option>
                      <option value="delivery">Delivery Partner</option>
                      <option value="party">Party / Bulk Orders</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Message</label>
                  <textarea required value={form.message} onChange={(e) => update("message", e.target.value)} rows={5} placeholder="Tell us how we can help..."
                    style={{ ...inputStyle, resize: "none" as const }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }} />
                </div>
                <motion.button whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(22,163,74,0.4)" }} whileTap={{ scale: 0.97 }} type="submit" disabled={submitting} style={{
                  width: "100%", padding: "14px 24px", borderRadius: 12,
                  background: "#16a34a", color: "#fff", border: "none",
                  fontSize: 15, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(22,163,74,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: submitting ? 0.7 : 1,
                }}>
                  {submitting ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Sending...</> : <><Send size={18} /> Send Message</>}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </FadeInUp>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
