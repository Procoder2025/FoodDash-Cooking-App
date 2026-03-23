"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Package, Clock, CheckCircle, Truck, Phone, MapPin, ChefHat, IndianRupee, Map, RefreshCw } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import TrackingMap from "@/components/TrackingMap";

interface CookerOrder {
  id: string;
  orderId: string;
  customer: string;
  phone: string;
  address: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: string;
  time: string;
  payMethod: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  placed: { label: "New Order", color: "#dc2626", bg: "#fef2f2", icon: Package },
  confirmed: { label: "Confirmed", color: "#dc2626", bg: "#fef2f2", icon: Package },
  preparing: { label: "Preparing", color: "#f59e0b", bg: "#fffbeb", icon: ChefHat },
  ready: { label: "Ready for Pickup", color: "#3b82f6", bg: "#eff6ff", icon: CheckCircle },
  picked: { label: "Out for Delivery", color: "#8b5cf6", bg: "#f5f3ff", icon: Truck },
  on_way: { label: "On the Way", color: "#8b5cf6", bg: "#f5f3ff", icon: Truck },
  delivered: { label: "Delivered", color: "#16a34a", bg: "#f0fdf4", icon: CheckCircle },
};

const nextStatus: Record<string, string> = {
  placed: "preparing",
  confirmed: "preparing",
  preparing: "ready",
  ready: "picked",
  picked: "delivered",
  on_way: "delivered",
};

const nextLabel: Record<string, string> = {
  placed: "Start Preparing",
  confirmed: "Start Preparing",
  preparing: "Mark Ready",
  ready: "Handed to Rider",
  picked: "Mark Delivered",
  on_way: "Mark Delivered",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  return `${Math.floor(hrs / 24)} day${hrs > 24 ? "s" : ""} ago`;
}

export default function CookerOrdersPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState<CookerOrder[]>([]);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("cooker_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      const mapped: CookerOrder[] = data.map((o: any) => ({
        id: o.order_id,
        orderId: o.order_id,
        customer: o.customer_name,
        phone: o.customer_phone || "",
        address: o.customer_address || "",
        items: o.items || [],
        total: Number(o.total),
        status: o.status,
        time: timeAgo(o.created_at),
        payMethod: o.payment_method || "COD",
      }));
      setOrders(mapped);
    }
    if (error) console.error("Error fetching cooker orders:", error);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchOrders();

    // Real-time: listen for new orders and status updates
    const channel = supabase.channel("cooker-orders-" + user.id)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "orders",
        filter: `cooker_id=eq.${user.id}`,
      }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (!isLoggedIn || user?.role !== "cooker") {
    if (typeof window !== "undefined") router.push("/auth/login");
    return null;
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const activeCount = orders.filter((o) => o.status !== "delivered").length;
  const newCount = orders.filter((o) => o.status === "placed" || o.status === "confirmed").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;
  const outCount = orders.filter((o) => o.status === "picked" || o.status === "on_way").length;
  const doneCount = orders.filter((o) => o.status === "delivered").length;

  const updateStatus = async (id: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
    await supabase.from("orders").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("order_id", id);
  };

  if (loading) {
    return (
      <div style={{ width: "100%", textAlign: "center", padding: "100px 20px" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <RefreshCw size={32} color="#16a34a" />
        </motion.div>
        <p style={{ color: "#6b7280", marginTop: 12 }}>Loading orders...</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", background: "linear-gradient(135deg, #15803d, #16a34a)", padding: "36px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Package size={26} color="#fff" />
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>Orders Received</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{activeCount} active orders — updates in real-time</p>
            </div>
          </div>
          {activeCount > 0 && (
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              style={{ background: "#fff", color: "#16a34a", padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                style={{ width: 8, height: 8, background: "#ef4444", borderRadius: "50%", display: "inline-block" }} />
              {activeCount} Active
            </motion.div>
          )}
        </div>
      </motion.div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Filter Tabs */}
        <FadeInUp>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 24, paddingBottom: 4 }} className="no-scrollbar">
            {[
              { id: "all", label: `All (${orders.length})` },
              { id: "placed", label: `New (${newCount})` },
              { id: "preparing", label: `Preparing (${preparingCount})` },
              { id: "ready", label: `Ready (${readyCount})` },
              { id: "picked", label: `Out (${outCount})` },
              { id: "delivered", label: `Done (${doneCount})` },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
                padding: "9px 18px", borderRadius: 50, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap",
                background: filter === tab.id ? "#16a34a" : "#f3f4f6",
                color: filter === tab.id ? "#fff" : "#4b5563",
              }}>
                {tab.label}
              </button>
            ))}
          </div>
        </FadeInUp>

        {/* No Orders */}
        {orders.length === 0 && (
          <FadeInUp>
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6" }}>
              <Package size={48} color="#d1d5db" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>No orders yet</h3>
              <p style={{ color: "#6b7280" }}>When customers order your food, orders will appear here in real-time!</p>
            </div>
          </FadeInUp>
        )}

        {/* Orders List */}
        <StaggerContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((order) => {
              const st = statusConfig[order.status] || statusConfig.placed;
              const StatusIcon = st.icon;
              return (
                <StaggerItem key={order.id}>
                  <motion.div whileHover={{ boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}
                    style={{ background: "#fff", borderRadius: 16, padding: 20, border: (order.status === "placed" || order.status === "confirmed") ? "2px solid #fca5a5" : "1px solid #f3f4f6" }}>
                    {/* Top Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <h3 style={{ fontSize: 15, fontWeight: 700 }}>#{order.orderId}</h3>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: st.bg, color: st.color, padding: "3px 10px", borderRadius: 50, fontSize: 11, fontWeight: 700 }}>
                            <StatusIcon size={12} /> {st.label}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: "#9ca3af" }}><Clock size={11} style={{ display: "inline", verticalAlign: "middle" }} /> {order.time} • {order.payMethod}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: "#16a34a", display: "flex", alignItems: "center", gap: 2 }}>
                          <IndianRupee size={15} strokeWidth={3} />{order.total}
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, padding: "10px 14px", background: "#f9fafb", borderRadius: 10 }}>
                      <div style={{ width: 36, height: 36, background: "#e5e7eb", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 700 }}>{order.customer}</p>
                        <p style={{ fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={10} /> {order.address}</p>
                      </div>
                      {order.phone && (
                        <a href={`tel:${order.phone.replace(/\s/g, "")}`} style={{
                          width: 34, height: 34, borderRadius: 10, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Phone size={14} color="#fff" />
                        </a>
                      )}
                    </div>

                    {/* Items */}
                    <div style={{ marginBottom: 14 }}>
                      {order.items.map((item: any, j: number) => (
                        <div key={j} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#4b5563" }}>
                          <span>{item.name} x{item.qty}</span>
                          <span style={{ fontWeight: 600 }}>₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: 8 }}>
                      {nextStatus[order.status] && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateStatus(order.id, nextStatus[order.status])}
                          style={{
                            flex: 1, padding: "12px", borderRadius: 10, border: "none", cursor: "pointer",
                            fontSize: 14, fontWeight: 700, color: "#fff",
                            background: (order.status === "placed" || order.status === "confirmed") ? "#ef4444" : "#16a34a",
                            boxShadow: (order.status === "placed" || order.status === "confirmed") ? "0 3px 10px rgba(239,68,68,0.3)" : "0 3px 10px rgba(22,163,74,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                          }}
                        >
                          {(order.status === "placed" || order.status === "confirmed") && <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>🔔</motion.span>}
                          {nextLabel[order.status] || "Update"}
                        </motion.button>
                      )}
                      <button
                        onClick={() => setTrackingId(trackingId === order.id ? null : order.id)}
                        style={{
                          padding: "12px 18px", borderRadius: 10, border: "1px solid #e5e7eb", cursor: "pointer",
                          fontSize: 13, fontWeight: 700,
                          background: trackingId === order.id ? "#eff6ff" : "#fff",
                          color: trackingId === order.id ? "#3b82f6" : "#374151",
                          display: "flex", alignItems: "center", gap: 6,
                        }}
                      >
                        <Map size={15} /> {trackingId === order.id ? "Hide" : "Track"}
                      </button>
                    </div>

                    {/* Live Tracking Map */}
                    {trackingId === order.id && (
                      <div style={{ marginTop: 14 }}>
                        <TrackingMap
                          pickupLabel={user?.kitchenName || "My Kitchen"}
                          pickupAddress={user?.address || "Kitchen Location"}
                          dropLabel={order.customer}
                          dropAddress={order.address}
                          riderName="Delivery Partner"
                          status={order.status === "placed" || order.status === "confirmed" ? "new" : order.status === "preparing" ? "preparing" : order.status === "ready" ? "picked" : order.status === "picked" || order.status === "on_way" ? "on_way" : "delivered"}
                          estimatedTime={order.status === "picked" || order.status === "on_way" ? "12 min" : order.status === "ready" ? "5 min" : order.status === "preparing" ? "20 min" : undefined}
                          variant="customer"
                        />
                      </div>
                    )}
                  </motion.div>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
      </div>
    </div>
  );
}
