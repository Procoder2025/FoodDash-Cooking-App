"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, ChefHat, ShoppingBag, Bike } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>("customer");

  useEffect(() => {
    const r = searchParams.get("role");
    if (r === "cooker" || r === "delivery" || r === "customer") setRole(r);
  }, [searchParams]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password, role);
    setLoading(false);
    if (result === true) {
      router.push(role === "cooker" ? "/dashboard/cooker" : role === "delivery" ? "/dashboard/delivery" : "/browse");
    } else if (result === "wrong-role") {
      const roleLabels: Record<string, string> = { customer: "Customer", cooker: "Home Chef", delivery: "Delivery Partner" };
      setError(`This email is not registered as a ${roleLabels[role]}. Please switch to the correct login tab.`);
    } else {
      setError("Invalid email or password. Try demo accounts below.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 14px 14px 44px", background: "#f9fafb",
    border: "1px solid #e5e7eb", borderRadius: 12, fontSize: 14, outline: "none",
  };

  const demoAccounts = role === "cooker"
    ? [
        { label: "Lakshmi (Amma's Kitchen)", email: "lakshmi@demo.com" },
        { label: "Meera (Spice Trail)", email: "meera@demo.com" },
      ]
    : role === "delivery"
    ? [
        { label: "Suresh (Rider)", email: "suresh@demo.com" },
      ]
    : [
        { label: "Rahul (Customer)", email: "rahul@demo.com" },
      ];

  return (
    <div style={{ width: "100%", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#f9fafb" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
            style={{ width: 64, height: 64, background: "linear-gradient(135deg, #16a34a, #15803d)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <LogIn size={28} color="#fff" />
          </motion.div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ color: "#6b7280", fontSize: 15 }}>Login to your FoodDash account</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: 28, border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>

          {/* Role Tabs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 22 }}>
            {[
              { id: "customer" as UserRole, label: "Customer", icon: ShoppingBag, color: "#3b82f6" },
              { id: "cooker" as UserRole, label: "Chef", icon: ChefHat, color: "#16a34a" },
              { id: "delivery" as UserRole, label: "Rider", icon: Bike, color: "#f59e0b" },
            ].map((r) => (
              <motion.button key={r.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { setRole(r.id); setError(""); setEmail(""); setPassword(""); }}
                type="button"
                style={{
                  padding: "14px 10px", borderRadius: 12, cursor: "pointer",
                  border: role === r.id ? `2px solid ${r.color}` : "2px solid #e5e7eb",
                  background: role === r.id ? `${r.color}0a` : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "all 0.2s",
                }}
              >
                <r.icon size={18} color={role === r.id ? r.color : "#9ca3af"} />
                <span style={{ fontSize: 13, fontWeight: 700, color: role === r.id ? r.color : "#6b7280" }}>{r.label}</span>
              </motion.button>
            ))}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#fef2f2", color: "#dc2626", padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500, marginBottom: 18, lineHeight: 1.5 }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                {role === "cooker" ? "Chef Email" : role === "delivery" ? "Rider Email" : "Customer Email"}
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={role === "cooker" ? "chef@email.com" : role === "delivery" ? "rider@email.com" : "customer@email.com"} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input type={showPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" style={inputStyle} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} style={{
              width: "100%", padding: "14px", borderRadius: 12,
              background: role === "cooker" ? "#16a34a" : role === "delivery" ? "#f59e0b" : "#3b82f6",
              color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer",
              boxShadow: role === "cooker" ? "0 4px 15px rgba(22,163,74,0.3)" : role === "delivery" ? "0 4px 15px rgba(245,158,11,0.3)" : "0 4px 15px rgba(59,130,246,0.3)",
              opacity: loading ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading ? "Logging in..." : (
                <>
                  {role === "cooker" ? <ChefHat size={18} /> : role === "delivery" ? <Bike size={18} /> : <ShoppingBag size={18} />}
                  Login as {role === "cooker" ? "Home Chef" : role === "delivery" ? "Delivery Partner" : "Customer"}
                </>
              )}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "#6b7280" }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" style={{ color: "#16a34a", fontWeight: 700 }}>Sign Up</Link>
          </p>
        </div>

        {/* Demo Accounts */}
        <div style={{
          marginTop: 20, borderRadius: 14, padding: 18,
          background: role === "cooker" ? "#f0fdf4" : role === "delivery" ? "#fffbeb" : "#eff6ff",
          border: role === "cooker" ? "1px solid #dcfce7" : role === "delivery" ? "1px solid #fde68a" : "1px solid #dbeafe",
        }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: role === "cooker" ? "#166534" : role === "delivery" ? "#92400e" : "#1e40af", marginBottom: 10 }}>
            {role === "cooker" ? "👩‍🍳" : role === "delivery" ? "🚴" : "👤"} Demo {role === "cooker" ? "Chef" : role === "delivery" ? "Rider" : "Customer"} Accounts (password: 123456)
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
            {demoAccounts.map((acc) => (
              <div key={acc.email} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span><strong>{acc.label}:</strong> {acc.email}</span>
                <button onClick={() => { setEmail(acc.email); setPassword("123456"); }} style={{
                  background: role === "cooker" ? "#16a34a" : role === "delivery" ? "#f59e0b" : "#3b82f6",
                  color: "#fff", border: "none", padding: "4px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
                }}>Fill</button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "80px 20px", color: "#6b7280" }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
