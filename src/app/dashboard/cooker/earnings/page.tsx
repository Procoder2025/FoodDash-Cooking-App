"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { IndianRupee, TrendingUp, Calendar, ArrowUpRight, Wallet, CreditCard, Clock } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const weekData = [
  { day: "Mon", orders: 8, amount: 1240 },
  { day: "Tue", orders: 12, amount: 1890 },
  { day: "Wed", orders: 6, amount: 980 },
  { day: "Thu", orders: 15, amount: 2340 },
  { day: "Fri", orders: 10, amount: 1650 },
  { day: "Sat", orders: 18, amount: 2890 },
  { day: "Sun", orders: 14, amount: 2200 },
];

const recentPayouts = [
  { id: "P001", date: "Mar 18, 2026", amount: 4580, status: "Paid", method: "Bank Transfer" },
  { id: "P002", date: "Mar 11, 2026", amount: 5230, status: "Paid", method: "Bank Transfer" },
  { id: "P003", date: "Mar 4, 2026", amount: 3890, status: "Paid", method: "UPI" },
];

export default function CookerEarningsPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn || user?.role !== "cooker") {
    if (typeof window !== "undefined") router.push("/auth/login");
    return null;
  }

  const totalWeek = weekData.reduce((s, d) => s + d.amount, 0);
  const totalOrders = weekData.reduce((s, d) => s + d.orders, 0);
  const maxAmount = Math.max(...weekData.map((d) => d.amount));

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", background: "linear-gradient(135deg, #15803d, #16a34a)", padding: "36px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <TrendingUp size={26} color="#fff" />
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>Earnings</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Track your income & payouts</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Stats Cards */}
        <FadeInUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
            {[
              { icon: IndianRupee, label: "This Week", value: `₹${totalWeek.toLocaleString("en-IN")}`, color: "#16a34a", trend: "+18%" },
              { icon: Calendar, label: "This Month", value: "₹48,650", color: "#3b82f6", trend: "+12%" },
              { icon: Wallet, label: "Total Earned", value: "₹1,84,500", color: "#f97316", trend: "" },
              { icon: CreditCard, label: "Next Payout", value: "₹5,120", color: "#8b5cf6", trend: "Mar 25" },
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ y: -3 }} style={{
                background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #f3f4f6",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{ width: 42, height: 42, background: `${s.color}12`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 900 }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
                    {s.label}
                    {s.trend && <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 10 }}>{s.trend}</span>}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeInUp>

        {/* Weekly Chart */}
        <FadeInUp delay={0.1}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #f3f4f6", marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>This Week's Earnings</h3>
              <span style={{ fontSize: 12, color: "#6b7280" }}>{totalOrders} orders • ₹{totalWeek.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
              {weekData.map((d, i) => (
                <motion.div
                  key={d.day}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(d.amount / maxAmount) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  style={{
                    flex: 1, borderRadius: "8px 8px 0 0", cursor: "default",
                    background: d.day === "Sat" ? "#16a34a" : "#e5e7eb",
                    position: "relative", minHeight: 20,
                    display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center",
                  }}
                >
                  <span style={{ position: "absolute", top: -20, fontSize: 10, fontWeight: 700, color: "#374151" }}>₹{d.amount}</span>
                </motion.div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              {weekData.map((d) => (
                <div key={d.day} style={{ flex: 1, textAlign: "center", fontSize: 11, color: "#6b7280", fontWeight: 600 }}>{d.day}</div>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* Recent Payouts */}
        <FadeInUp delay={0.2}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={18} color="#16a34a" /> Recent Payouts
          </h3>
          <StaggerContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentPayouts.map((p) => (
                <StaggerItem key={p.id}>
                  <motion.div whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    style={{ background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>₹{p.amount.toLocaleString("en-IN")}</p>
                      <p style={{ fontSize: 11, color: "#6b7280" }}>{p.date} • {p.method}</p>
                    </div>
                    <span style={{ background: "#f0fdf4", color: "#16a34a", padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 700 }}>
                      {p.status}
                    </span>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </FadeInUp>
      </div>
    </div>
  );
}
