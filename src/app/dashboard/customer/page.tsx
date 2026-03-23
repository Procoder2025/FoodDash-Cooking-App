"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, Clock, Package, Search } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const mockOrders = [
  { id: "FD001", kitchen: "Amma's Kitchen", items: "Sambar Rice Combo x2, Filter Coffee x2", total: 236, status: "Delivered", time: "Yesterday, 7:30 PM", icon: "✅" },
  { id: "FD002", kitchen: "Spice Trail Kitchen", items: "Butter Chicken x1, Garlic Naan x2", total: 287, status: "Delivered", time: "Mar 17, 12:45 PM", icon: "✅" },
  { id: "FD003", kitchen: "Amma's Kitchen", items: "Masala Dosa x2, Filter Coffee x1", total: 187, status: "Preparing", time: "Today, 1:15 PM", icon: "👨‍🍳" },
];

export default function CustomerDashboard() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn || user?.role !== "customer") {
    if (typeof window !== "undefined") router.push("/auth/login");
    return null;
  }

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", background: "linear-gradient(135deg, #1e40af, #3b82f6)", padding: "40px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 56, height: 56, background: "rgba(255,255,255,0.15)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>👤</div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>Hello, {user.name}!</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>What would you like to eat today?</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/browse" style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", color: "#3b82f6", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
              <Search size={18} /> Browse Food
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 20px 60px" }}>
        {/* Quick Stats */}
        <FadeInUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { icon: Package, label: "Total Orders", value: mockOrders.length, color: "#3b82f6" },
              { icon: Clock, label: "Active Orders", value: mockOrders.filter((o) => o.status !== "Delivered").length, color: "#f59e0b" },
              { icon: ShoppingBag, label: "Total Spent", value: `₹${mockOrders.reduce((s, o) => s + o.total, 0)}`, color: "#16a34a" },
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ y: -3 }} style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 46, height: 46, background: `${s.color}12`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={22} color={s.color} />
                </div>
                <div>
                  <p style={{ fontSize: 22, fontWeight: 900 }}>{s.value}</p>
                  <p style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeInUp>

        {/* Orders */}
        <FadeInUp delay={0.1}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <ClipboardList size={20} color="#3b82f6" /> Recent Orders
          </h2>
        </FadeInUp>

        <StaggerContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mockOrders.map((order) => (
              <StaggerItem key={order.id}>
                <motion.div whileHover={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
                  style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700 }}>{order.kitchen}</h3>
                      <p style={{ fontSize: 12, color: "#9ca3af" }}>{order.time}</p>
                    </div>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      background: order.status === "Delivered" ? "#dcfce7" : "#fef3c7",
                      color: order.status === "Delivered" ? "#166534" : "#92400e",
                      padding: "5px 14px", borderRadius: 50, fontSize: 12, fontWeight: 600,
                    }}>{order.icon} {order.status}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 12 }}>{order.items}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>#{order.id}</span>
                    <span style={{ fontSize: 16, fontWeight: 800 }}>₹{order.total}</span>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </div>
  );
}

function ClipboardList(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" />
    </svg>
  );
}
