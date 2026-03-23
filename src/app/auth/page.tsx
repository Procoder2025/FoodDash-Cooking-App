"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ChefHat, Bike, ArrowRight, LogIn, UserPlus } from "lucide-react";
import { Suspense } from "react";

const roles = [
  {
    id: "customer", label: "Customer", desc: "Order delicious homemade food from local chefs near you",
    icon: ShoppingBag, color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", emoji: "🛒",
    features: ["Browse 50+ dishes", "Track orders live", "Save favorites"],
  },
  {
    id: "cooker", label: "Home Chef", desc: "Cook & sell your homemade food to hungry customers",
    icon: ChefHat, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", emoji: "👩‍🍳",
    features: ["Post daily menu", "Manage orders", "Track earnings"],
  },
  {
    id: "delivery", label: "Delivery Partner", desc: "Earn money by delivering food with flexible hours",
    icon: Bike, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", emoji: "🚴",
    features: ["Flexible schedule", "Daily payouts", "Be your own boss"],
  },
];

function AuthContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const isSignup = mode === "signup";

  return (
    <div style={{ width: "100%", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#f9fafb" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", maxWidth: 720 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
            style={{ width: 64, height: 64, background: "linear-gradient(135deg, #16a34a, #15803d)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            {isSignup ? <UserPlus size={28} color="#fff" /> : <LogIn size={28} color="#fff" />}
          </motion.div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
            {isSignup ? "Join FoodDash" : "Welcome Back"}
          </h1>
          <p style={{ color: "#6b7280", fontSize: 15 }}>
            {isSignup ? "Choose how you want to use FoodDash" : "Select your role to login"}
          </p>
        </div>

        {/* Role Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          {roles.map((role, i) => (
            <motion.div key={role.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: `0 12px 30px ${role.color}20` }}
              style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #f3f4f6", cursor: "pointer" }}>
              {/* Color Header */}
              <div style={{ background: `linear-gradient(135deg, ${role.color}, ${role.color}dd)`, padding: "24px 20px 20px", textAlign: "center" }}>
                <div style={{ width: 52, height: 52, background: "rgba(255,255,255,0.2)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 26 }}>
                  {role.emoji}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{role.label}</h3>
              </div>

              {/* Content */}
              <div style={{ padding: "16px 20px 20px" }}>
                <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, marginBottom: 14, minHeight: 36 }}>{role.desc}</p>

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  {role.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#4b5563" }}>
                      <span style={{ width: 16, height: 16, borderRadius: "50%", background: role.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: role.color, fontWeight: 900 }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Link href={isSignup ? `/auth/signup?role=${role.id}` : `/auth/login?role=${role.id}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%",
                    padding: "12px", borderRadius: 12, background: role.color, color: "#fff",
                    fontSize: 13, fontWeight: 700, textDecoration: "none",
                    boxShadow: `0 3px 12px ${role.color}30`,
                  }}>
                  {isSignup ? <><UserPlus size={15} /> Sign Up</> : <><LogIn size={15} /> Login</>}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Toggle */}
        <div style={{ textAlign: "center", fontSize: 14, color: "#6b7280" }}>
          {isSignup ? (
            <>Already have an account? <Link href="/auth?mode=login" style={{ color: "#16a34a", fontWeight: 700 }}>Login</Link></>
          ) : (
            <>Don&apos;t have an account? <Link href="/auth?mode=signup" style={{ color: "#16a34a", fontWeight: 700 }}>Sign Up</Link></>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "80px 20px", color: "#6b7280" }}>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
