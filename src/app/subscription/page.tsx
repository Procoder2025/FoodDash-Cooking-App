"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Star, Clock, Leaf, Crown, Users, Sparkles } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem, HoverLift } from "@/components/AnimatedSection";

const plans = [
  { name: "Weekly Tiffin", price: 399, period: "per week", desc: "Perfect for trying out our home-cooked meals", popular: false, icon: Leaf,
    features: ["5 meals per week (Mon-Fri)", "Choose from 3 home chefs", "Lunch or dinner", "Free delivery", "Cancel anytime"] },
  { name: "Monthly Meals", price: 1499, period: "per month", desc: "Our most popular plan for daily home food", popular: true, icon: Crown,
    features: ["22 meals per month", "Choose from all home chefs", "Lunch + dinner options", "Free delivery", "Weekend specials included", "Priority delivery", "Customize menu weekly"] },
  { name: "Family Plan", price: 2999, period: "per month", desc: "Feed the whole family with love", popular: false, icon: Users,
    features: ["22 meals x 4 servings", "Choose from all home chefs", "Lunch + dinner for family", "Free delivery", "Festival special meals", "Priority support", "Customize daily"] },
];

const faqs = [
  { q: "Can I choose different home chefs each day?", a: "Yes! With Monthly and Family plans, you can pick from any available home chef in your area for each meal." },
  { q: "What if I need to skip a day?", a: "Simply pause your subscription from the app before 9 PM the previous day. Unused meals roll over to the next week." },
  { q: "Is the food freshly cooked?", a: "Absolutely! Every meal is freshly prepared by home chefs within 1-2 hours of delivery. No reheated or stored food." },
];

export default function SubscriptionPage() {
  return (
    <div style={{ width: "100%" }}>
      {/* Hero */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", background: "linear-gradient(135deg, #15803d, #16a34a, #059669)", padding: "60px 20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ repeat: Infinity, duration: 5 }}
          style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, background: "radial-gradient(circle, #fff, transparent 70%)", borderRadius: "50%" }} />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04] }} transition={{ repeat: Infinity, duration: 6, delay: 1 }}
          style={{ position: "absolute", top: -60, right: -60, width: 250, height: 250, background: "radial-gradient(circle, #4ade80, transparent 70%)", borderRadius: "50%" }} />
        {["🍱", "📅", "💰", "🥗", "✨"].map((e, i) => (
          <motion.div key={i} animate={{ y: [0, -15, 0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 3.5 + i * 0.5, delay: i * 0.3, ease: "easeInOut" }}
            style={{ position: "absolute", top: `${10 + i * 18}%`, right: `${5 + i * 15}%`, fontSize: 28 + i * 3, opacity: 0.08 }}
          >{e}</motion.div>
        ))}
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", color: "#fff", padding: "8px 20px", borderRadius: 50, fontSize: 13, fontWeight: 600, marginBottom: 16, border: "1px solid rgba(255,255,255,0.1)" }}>
              <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <Sparkles size={14} />
              </motion.div>
              Save up to 40% with subscriptions
            </span>
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            Daily Home Food Subscriptions
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.6 }}>
            Never worry about cooking again. Freshly prepared meals delivered daily.
          </motion.p>
        </div>
      </motion.div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "50px 20px 60px" }}>
        {/* Benefits */}
        <FadeInUp>
          <StaggerContainer>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 50 }}>
              {[
                { icon: Star, title: "Trusted Home Chefs", desc: "All meals cooked by verified, hygiene-certified home chefs", color: "#f59e0b" },
                { icon: Clock, title: "On-Time Delivery", desc: "Hot meals delivered at your preferred time, every single day", color: "#3b82f6" },
                { icon: Leaf, title: "Fresh & Healthy", desc: "No preservatives, no MSG. Just pure homemade goodness", color: "#16a34a" },
              ].map((b, i) => (
                <StaggerItem key={i}>
                  <HoverLift>
                    <div style={{ textAlign: "center", background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #f3f4f6", transition: "box-shadow 0.3s" }}>
                      <div style={{ width: 56, height: 56, background: `${b.color}15`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                        <b.icon size={26} color={b.color} />
                      </div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{b.title}</h3>
                      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{b.desc}</p>
                    </div>
                  </HoverLift>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </FadeInUp>

        {/* Plans */}
        <FadeInUp delay={0.1}>
          <StaggerContainer>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 60 }}>
              {plans.map((plan) => (
                <StaggerItem key={plan.name}>
                  <motion.div whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }} style={{
                    position: "relative", background: "#fff", borderRadius: 20,
                    border: plan.popular ? "2px solid #16a34a" : "2px solid #e5e7eb",
                    padding: 32, transition: "all 0.3s",
                    transform: plan.popular ? "scale(1.02)" : "none",
                  }}>
                    {plan.popular && (
                      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{
                        position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                        background: "#16a34a", color: "#fff", padding: "5px 20px",
                        borderRadius: 50, fontSize: 12, fontWeight: 700,
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                        <Crown size={12} /> Most Popular
                      </motion.div>
                    )}
                    <div style={{ width: 48, height: 48, background: plan.popular ? "#f0fdf4" : "#f9fafb", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <plan.icon size={24} color={plan.popular ? "#16a34a" : "#6b7280"} />
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{plan.name}</h3>
                    <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 18 }}>{plan.desc}</p>
                    <div style={{ marginBottom: 24 }}>
                      <span style={{ fontSize: 40, fontWeight: 900 }}>₹{plan.price}</span>
                      <span style={{ fontSize: 14, color: "#6b7280", marginLeft: 4 }}>/{plan.period}</span>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, marginBottom: 28 }}>
                      {plan.features.map((f) => (
                        <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, marginBottom: 12 }}>
                          <Check size={16} color="#16a34a" style={{ marginTop: 2, flexShrink: 0 }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link href="/contact" style={{
                        display: "block", textAlign: "center",
                        padding: "14px 24px", borderRadius: 12,
                        fontSize: 15, fontWeight: 700,
                        background: plan.popular ? "#16a34a" : "transparent",
                        color: plan.popular ? "#fff" : "#16a34a",
                        border: plan.popular ? "none" : "2px solid #16a34a",
                        boxShadow: plan.popular ? "0 4px 15px rgba(22,163,74,0.3)" : "none",
                      }}>
                        Subscribe Now
                      </Link>
                    </motion.div>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </FadeInUp>

        {/* FAQ */}
        <FadeInUp delay={0.2}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, textAlign: "center", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>❓</span> Frequently Asked Questions
            </h2>
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: "#fff", borderRadius: 14, padding: 24, marginBottom: 12, border: "1px solid #f3f4f6" }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{faq.q}</h4>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
